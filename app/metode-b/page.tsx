'use client'

import { useState, useMemo } from 'react'
import { Stepper } from '@/features/shared/components/Stepper'
import { StepBranch } from '@/features/metode-b/components/StepBranch'
import { StepInputPoin, type PoinJabatanInput } from '@/features/metode-b/components/StepInputPoin'
import {
  StepInputKaryawan,
  type EmployeeInputB,
} from '@/features/metode-b/components/StepInputKaryawan'
import { StepKonfigurasi, type KonfigurasiB } from '@/features/metode-b/components/StepKonfigurasi'
import { StepHasil } from '@/features/metode-b/components/StepHasil'
import { StepFaktor } from '@/features/metode-b/poin-faktor/StepFaktor'
import { StepIsiPoin, type JabatanFaktorInput } from '@/features/metode-b/poin-faktor/StepIsiPoin'
import { StepPreview } from '@/features/metode-b/poin-faktor/StepPreview'
import {
  calcMetodeB,
  calcPoinDariFaktor,
  autoDetectTitik,
  avgGajiForJabatan,
  DEFAULT_FAKTORS,
  type FaktorDef,
  type JabatanWithPoin,
} from '@/lib/calc-metode-b'
import type { Employee } from '@/lib/calc-metode-a'

type Path = 'A' | 'B' | null

type StepId =
  | 'branch'
  | 'input-poin'
  | 'pf-faktor'
  | 'pf-isi-poin'
  | 'pf-preview'
  | 'input-karyawan'
  | 'konfigurasi'
  | 'hasil'

const PATH_A_STEPS = [
  { id: 'branch', label: 'Awal' },
  { id: 'input-poin', label: 'Poin Jabatan' },
  { id: 'input-karyawan', label: 'Data Karyawan' },
  { id: 'konfigurasi', label: 'Konfigurasi' },
  { id: 'hasil', label: 'Hasil' },
]

const PATH_B_STEPS = [
  { id: 'branch', label: 'Awal' },
  { id: 'pf-faktor', label: 'Setup Faktor' },
  { id: 'pf-isi-poin', label: 'Isi Poin' },
  { id: 'pf-preview', label: 'Preview' },
  { id: 'input-karyawan', label: 'Data Karyawan' },
  { id: 'konfigurasi', label: 'Konfigurasi' },
  { id: 'hasil', label: 'Hasil' },
]

function getStepNum(steps: { id: string }[], current: StepId): number {
  const idx = steps.findIndex((s) => s.id === current)
  return idx === -1 ? 1 : idx + 1
}

function newEmpRow(): EmployeeInputB {
  return { id: crypto.randomUUID(), nama: '', jabatan: '', gaji: '' }
}

function newPoinRow(): PoinJabatanInput {
  return { id: crypto.randomUUID(), jabatan: '', poin: '' }
}

function newJabatanFaktorRow(faktors: FaktorDef[]): JabatanFaktorInput {
  const poin: Record<string, string> = {}
  faktors.forEach((f) => {
    poin[f.id] = ''
  })
  return { id: crypto.randomUUID(), jabatan: '', poin }
}

export default function MetodeBPage() {
  const [path, setPath] = useState<Path>(null)
  const [step, setStep] = useState<StepId>('branch')

  // Path A
  const [poinRows, setPoinRows] = useState<PoinJabatanInput[]>([newPoinRow()])

  // Path B
  const [faktors, setFaktors] = useState<FaktorDef[]>(DEFAULT_FAKTORS)
  const [jabatanFaktorRows, setJabatanFaktorRows] = useState<JabatanFaktorInput[]>([
    newJabatanFaktorRow(DEFAULT_FAKTORS),
  ])

  // Shared
  const [employees, setEmployees] = useState<EmployeeInputB[]>([newEmpRow()])
  const [konfigurasi, setKonfigurasi] = useState<KonfigurasiB>({
    titikTerendahJabatan: '',
    titikTertinggiJabatan: '',
    u1: '',
    u2: '',
    minPct: 80,
    maksPct: 120,
  })

  const steps = path === 'B' ? PATH_B_STEPS : PATH_A_STEPS

  // Compute valid jabatan poin (from Path A input or Path B poin faktor)
  const jabatanPoin = useMemo<JabatanWithPoin[]>(() => {
    if (path === 'A') {
      return poinRows
        .filter((r) => r.jabatan.trim() && Number(r.poin) > 0)
        .map((r) => ({ jabatan: r.jabatan.trim(), poin: Number(r.poin) }))
    } else if (path === 'B') {
      const matrix: Record<string, Record<string, number>> = {}
      jabatanFaktorRows.forEach((r) => {
        matrix[r.jabatan] = {}
        faktors.forEach((f) => {
          matrix[r.jabatan][f.id] = Number(r.poin[f.id]) || 0
        })
      })
      return calcPoinDariFaktor(
        jabatanFaktorRows.filter((r) => r.jabatan.trim()).map((r) => r.jabatan),
        faktors,
        matrix
      )
    }
    return []
  }, [path, poinRows, jabatanFaktorRows, faktors])

  const validJabatan = useMemo(() => new Set(jabatanPoin.map((j) => j.jabatan)), [jabatanPoin])

  const validEmployees = useMemo<Employee[]>(
    () =>
      employees
        .filter((e) => e.nama.trim() && e.jabatan.trim() && e.gaji && Number(e.gaji) > 0)
        .map((e) => ({ id: e.id, nama: e.nama, jabatan: e.jabatan, gaji: Number(e.gaji) })),
    [employees]
  )

  function handleChoosePath(chosen: 'A' | 'B') {
    setPath(chosen)
    setStep(chosen === 'A' ? 'input-poin' : 'pf-faktor')
  }

  function handleAfterPoinInput() {
    setEmployees([newEmpRow()])
    setStep('input-karyawan')
  }

  function handleAfterKaryawan() {
    // Auto-detect titik terendah/tertinggi and pre-fill U values
    const { terendah, tertinggi } = autoDetectTitik(jabatanPoin)
    const u1Raw = avgGajiForJabatan(validEmployees, terendah)
    const u2Raw = avgGajiForJabatan(validEmployees, tertinggi)
    setKonfigurasi((prev) => ({
      ...prev,
      titikTerendahJabatan: terendah,
      titikTertinggiJabatan: tertinggi,
      u1: u1Raw !== null ? String(Math.round(u1Raw)) : prev.u1,
      u2: u2Raw !== null ? String(Math.round(u2Raw)) : prev.u2,
    }))
    setStep('konfigurasi')
  }

  const result = useMemo(() => {
    if (
      jabatanPoin.length === 0 ||
      validEmployees.length === 0 ||
      !konfigurasi.titikTerendahJabatan ||
      !konfigurasi.titikTertinggiJabatan ||
      Number(konfigurasi.u1) <= 0 ||
      Number(konfigurasi.u2) <= 0
    )
      return null
    return calcMetodeB(
      jabatanPoin,
      validEmployees,
      konfigurasi.titikTerendahJabatan,
      Number(konfigurasi.u1),
      konfigurasi.titikTertinggiJabatan,
      Number(konfigurasi.u2),
      konfigurasi.minPct,
      konfigurasi.maksPct
    )
  }, [jabatanPoin, validEmployees, konfigurasi])

  const poinFaktorData = useMemo(() => {
    if (path !== 'B') return undefined
    const matrix: Record<string, Record<string, number>> = {}
    jabatanFaktorRows.forEach((r) => {
      matrix[r.jabatan] = {}
      faktors.forEach((f) => {
        matrix[r.jabatan][f.id] = Number(r.poin[f.id]) || 0
      })
    })
    return {
      jabatanList: jabatanFaktorRows.map((r) => r.jabatan),
      faktors,
      matrix,
    }
  }, [path, jabatanFaktorRows, faktors])

  const stepNum = getStepNum(steps, step)

  const stepLabel: Record<StepId, { langkah: string; judul: string; deskripsi: string }> = {
    branch: {
      langkah: 'Langkah 1',
      judul: 'Poin Jabatan',
      deskripsi: 'Pilih apakah kamu sudah punya poin jabatan atau perlu dihitung dulu.',
    },
    'input-poin': {
      langkah: `Langkah ${stepNum} dari ${steps.length}`,
      judul: 'Input Poin Jabatan',
      deskripsi: 'Masukkan daftar jabatan dan nilai poin masing-masing.',
    },
    'pf-faktor': {
      langkah: `Langkah ${stepNum} dari ${steps.length}`,
      judul: 'Setup Faktor Penilaian',
      deskripsi: 'Tentukan faktor-faktor yang akan digunakan untuk menilai bobot jabatan.',
    },
    'pf-isi-poin': {
      langkah: `Langkah ${stepNum} dari ${steps.length}`,
      judul: 'Isi Poin per Jabatan',
      deskripsi: 'Isi nilai poin tiap jabatan untuk setiap faktor.',
    },
    'pf-preview': {
      langkah: `Langkah ${stepNum} dari ${steps.length}`,
      judul: 'Preview Ranking Jabatan',
      deskripsi: 'Pastikan urutan jabatan sudah sesuai sebelum melanjutkan.',
    },
    'input-karyawan': {
      langkah: `Langkah ${stepNum} dari ${steps.length}`,
      judul: 'Input Data Karyawan',
      deskripsi: 'Masukkan data karyawan. Jabatan harus sesuai dengan daftar poin.',
    },
    konfigurasi: {
      langkah: `Langkah ${stepNum} dari ${steps.length}`,
      judul: 'Konfigurasi',
      deskripsi: 'Tentukan titik acuan gaji dan rentang Min/Maks.',
    },
    hasil: { langkah: 'Hasil', judul: 'Struktur Gaji Baru', deskripsi: '' },
  }

  const current = stepLabel[step]

  return (
    <main>
      <Stepper steps={steps} current={stepNum} />

      <div style={{ paddingTop: 'var(--sp-12)', paddingBottom: 'var(--sp-24)' }}>
        <div className={step === 'hasil' ? 'container-wide' : 'container-form'}>
          <p
            className="text-label"
            style={{
              color: 'var(--accent-b)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 'var(--sp-3)',
            }}
          >
            {current.langkah}
          </p>
          <h2
            className="text-display-md"
            style={{
              color: 'var(--text-1)',
              marginBottom: current.deskripsi ? 'var(--sp-3)' : 'var(--sp-8)',
            }}
          >
            {current.judul}
          </h2>
          {current.deskripsi && (
            <p
              className="text-body"
              style={{ color: 'var(--text-2)', marginBottom: 'var(--sp-8)' }}
            >
              {current.deskripsi}
            </p>
          )}

          {step === 'branch' && <StepBranch onChoose={handleChoosePath} />}

          {step === 'input-poin' && (
            <StepInputPoin
              rows={poinRows}
              onChange={setPoinRows}
              onBack={() => setStep('branch')}
              onNext={handleAfterPoinInput}
            />
          )}

          {step === 'pf-faktor' && (
            <StepFaktor
              faktors={faktors}
              onChange={(f) => {
                setFaktors(f)
                setJabatanFaktorRows((prev) =>
                  prev.map((r) => {
                    const poin: Record<string, string> = {}
                    f.forEach((fk) => {
                      poin[fk.id] = r.poin[fk.id] ?? ''
                    })
                    return { ...r, poin }
                  })
                )
              }}
              onBack={() => setStep('branch')}
              onNext={() => setStep('pf-isi-poin')}
            />
          )}

          {step === 'pf-isi-poin' && (
            <StepIsiPoin
              faktors={faktors}
              rows={jabatanFaktorRows}
              onChange={setJabatanFaktorRows}
              onBack={() => setStep('pf-faktor')}
              onNext={() => setStep('pf-preview')}
            />
          )}

          {step === 'pf-preview' && (
            <StepPreview
              faktors={faktors}
              rows={jabatanFaktorRows}
              onBack={() => setStep('pf-isi-poin')}
              onNext={handleAfterPoinInput}
            />
          )}

          {step === 'input-karyawan' && (
            <StepInputKaryawan
              employees={employees}
              validJabatan={validJabatan}
              onChange={setEmployees}
              onBack={() => setStep(path === 'A' ? 'input-poin' : 'pf-preview')}
              onNext={handleAfterKaryawan}
            />
          )}

          {step === 'konfigurasi' && (
            <StepKonfigurasi
              jabatanPoin={jabatanPoin}
              konfigurasi={konfigurasi}
              onChange={setKonfigurasi}
              onBack={() => setStep('input-karyawan')}
              onNext={() => setStep('hasil')}
            />
          )}

          {step === 'hasil' && result && (
            <StepHasil
              result={result}
              jabatanPoin={jabatanPoin}
              konfigurasi={konfigurasi}
              onChange={setKonfigurasi}
              onBack={() => setStep('konfigurasi')}
              viaFaktor={path === 'B'}
              poinFaktorData={poinFaktorData}
            />
          )}
        </div>
      </div>
    </main>
  )
}
