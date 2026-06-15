'use client'

import { useState, useMemo } from 'react'
import { Stepper } from '@/features/shared/components/Stepper'
import { StepInput, type EmployeeInput } from '@/features/metode-a/components/StepInput'
import { StepKonfigurasi } from '@/features/metode-a/components/StepKonfigurasi'
import { StepHasil } from '@/features/metode-a/components/StepHasil'
import { calcMetodeA } from '@/lib/calc-metode-a'
import type { Employee } from '@/lib/calc-metode-a'

const STEPS = [{ label: 'Input Data' }, { label: 'Konfigurasi' }, { label: 'Hasil' }]

function newRow(): EmployeeInput {
  return { id: crypto.randomUUID(), nama: '', jabatan: '', gaji: '' }
}

export default function MetodeAPage() {
  const [step, setStep] = useState(1)
  const [employees, setEmployees] = useState<EmployeeInput[]>([newRow()])
  const [jumlahGolongan, setJumlahGolongan] = useState(5)
  const [rentangPerGolongan, setRentangPerGolongan] = useState<number[]>(Array(5).fill(0.2))

  const validEmployees = useMemo<Employee[]>(
    () =>
      employees
        .filter((e) => e.nama.trim() && e.jabatan.trim() && e.gaji && Number(e.gaji) > 0)
        .map((e) => ({ id: e.id, nama: e.nama, jabatan: e.jabatan, gaji: Number(e.gaji) })),
    [employees]
  )

  function handleChangeJumlahGolongan(n: number) {
    setJumlahGolongan(n)
    setRentangPerGolongan((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? 0.2))
  }

  const result = useMemo(
    () =>
      validEmployees.length > 0
        ? calcMetodeA(validEmployees, jumlahGolongan, rentangPerGolongan)
        : null,
    [validEmployees, jumlahGolongan, rentangPerGolongan]
  )

  return (
    <main>
      <Stepper steps={STEPS} current={step} />

      <div
        style={{
          paddingTop: 'var(--sp-12)',
          paddingBottom: 'var(--sp-24)',
        }}
      >
        <div className={step === 3 ? 'container-wide' : 'container-form'}>
          {step === 1 && (
            <>
              <p
                className="text-label"
                style={{
                  color: 'var(--accent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--sp-3)',
                }}
              >
                Langkah 1 dari 3
              </p>
              <h2
                className="text-display-md"
                style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-3)' }}
              >
                Input Data Karyawan
              </h2>
              <p
                className="text-body"
                style={{ color: 'var(--text-2)', marginBottom: 'var(--sp-8)' }}
              >
                Masukkan data karyawan yang ada. Minimal kolom Nama, Jabatan, dan Gaji.
              </p>
              <StepInput
                employees={employees}
                onChange={setEmployees}
                onNext={() => {
                  const uniqueJabatan = new Set(
                    employees.filter((e) => e.jabatan.trim()).map((e) => e.jabatan.trim())
                  ).size
                  const suggested = Math.max(2, uniqueJabatan)
                  handleChangeJumlahGolongan(suggested)
                  setStep(2)
                }}
              />
            </>
          )}

          {step === 2 && (
            <>
              <p
                className="text-label"
                style={{
                  color: 'var(--accent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--sp-3)',
                }}
              >
                Langkah 2 dari 3
              </p>
              <h2
                className="text-display-md"
                style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-3)' }}
              >
                Konfigurasi Golongan
              </h2>
              <p
                className="text-body"
                style={{ color: 'var(--text-2)', marginBottom: 'var(--sp-8)' }}
              >
                Tentukan jumlah golongan dan rentang gaji untuk setiap golongan.
              </p>
              <StepKonfigurasi
                employees={validEmployees}
                jumlahGolongan={jumlahGolongan}
                rentangPerGolongan={rentangPerGolongan}
                onChangeJumlahGolongan={handleChangeJumlahGolongan}
                onChangeRentang={setRentangPerGolongan}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            </>
          )}

          {step === 3 && result && (
            <>
              <p
                className="text-label"
                style={{
                  color: 'var(--accent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--sp-3)',
                }}
              >
                Hasil
              </p>
              <h2
                className="text-display-md"
                style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-8)' }}
              >
                Struktur Gaji Baru
              </h2>
              <StepHasil
                result={result}
                rentangPerGolongan={rentangPerGolongan}
                onChangeRentang={setRentangPerGolongan}
                onBack={() => setStep(2)}
              />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
