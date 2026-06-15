'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react'
import { ToggleTab } from '@/features/shared/components/ToggleTab'
import { FileUploadZone } from '@/features/shared/components/FileUploadZone'
import { PrivacyNotice } from '@/features/shared/components/PrivacyNotice'
import { parseEmployeeExcel } from '@/lib/parse-excel'
import { downloadTemplateMetodeA } from '@/lib/excel-export'
import { validateEmployeeRows } from '@/lib/validate'

export type EmployeeInputB = { id: string; nama: string; jabatan: string; gaji: string }

function newRow(): EmployeeInputB {
  return { id: crypto.randomUUID(), nama: '', jabatan: '', gaji: '' }
}

interface StepInputKaryawanProps {
  employees: EmployeeInputB[]
  validJabatan: Set<string>
  onChange: (employees: EmployeeInputB[]) => void
  onBack: () => void
  onNext: () => void
}

const TABS = [
  { value: 'manual', label: 'Input Manual' },
  { value: 'upload', label: 'Upload Excel' },
]

const TH: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-3)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  padding: '10px 14px',
  textAlign: 'left',
  background: 'var(--bg-2)',
  borderBottom: '1px solid var(--border)',
}

const TD: React.CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid var(--border-subtle)',
}

const INPUT: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: 'var(--radius-sm)',
  padding: '6px 8px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--text-1)',
  width: '100%',
  outline: 'none',
  transition: 'border var(--t-fast)',
}

export function StepInputKaryawan({
  employees,
  validJabatan,
  onChange,
  onBack,
  onNext,
}: StepInputKaryawanProps) {
  const [mode, setMode] = useState<'manual' | 'upload'>('manual')
  const [errors, setErrors] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | undefined>()

  function updateRow(id: string, field: keyof EmployeeInputB, value: string) {
    onChange(employees.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  function addRow() {
    onChange([...employees, newRow()])
  }

  function removeRow(id: string) {
    if (employees.length === 1) return
    onChange(employees.filter((e) => e.id !== id))
  }

  async function handleFile(file: File) {
    setUploadError(undefined)
    try {
      const parsed = await parseEmployeeExcel(file)
      if (parsed.length === 0) {
        setUploadError('File kosong atau tidak ada data yang bisa dibaca.')
        return
      }
      onChange(parsed.map((p) => ({ id: crypto.randomUUID(), ...p })))
      setMode('manual')
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Terjadi kesalahan.')
    }
  }

  function handleNext() {
    const filled = employees.filter((e) => e.nama.trim() || e.jabatan.trim() || e.gaji.trim())
    if (filled.length === 0) {
      setErrors(['Tambahkan minimal satu data karyawan.'])
      return
    }
    const errs = validateEmployeeRows(filled).map(
      (e) => `Baris ${e.row}, kolom ${e.col} — ${e.message}`
    )
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    setErrors([])
    onChange(filled)
    onNext()
  }

  const unmatchedJabatan = employees
    .filter((e) => e.jabatan.trim() && !validJabatan.has(e.jabatan.trim()))
    .map((e) => e.jabatan.trim())
  const uniqueUnmatched = [...new Set(unmatchedJabatan)]

  return (
    <div>
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <ToggleTab
          options={TABS}
          value={mode}
          onChange={(v) => setMode(v as 'manual' | 'upload')}
        />
      </div>

      {mode === 'manual' ? (
        <div
          style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: '48px', textAlign: 'center' }}>No</th>
                <th style={TH}>Nama</th>
                <th style={TH}>Jabatan</th>
                <th style={{ ...TH, textAlign: 'right' }}>Gaji (Rp)</th>
                <th style={{ ...TH, width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => {
                const isUnmatched = emp.jabatan.trim() && !validJabatan.has(emp.jabatan.trim())
                return (
                  <tr key={emp.id} className="input-row">
                    <td style={{ ...TD, textAlign: 'center' }}>
                      <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
                        {i + 1}
                      </span>
                    </td>
                    <td style={TD}>
                      <input
                        style={INPUT}
                        placeholder="Nama karyawan"
                        value={emp.nama}
                        onChange={(e) => updateRow(emp.id, 'nama', e.target.value)}
                        onFocus={(e) => {
                          e.currentTarget.style.border = '1px solid var(--border)'
                          e.currentTarget.style.background = 'var(--bg-2)'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.border = '1px solid transparent'
                          e.currentTarget.style.background = 'transparent'
                        }}
                      />
                    </td>
                    <td style={TD}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          style={{
                            ...INPUT,
                            ...(isUnmatched ? { color: 'var(--warning)' } : {}),
                          }}
                          placeholder="Jabatan"
                          value={emp.jabatan}
                          onChange={(e) => updateRow(emp.id, 'jabatan', e.target.value)}
                          list="jabatan-list"
                          onFocus={(e) => {
                            e.currentTarget.style.border = '1px solid var(--border)'
                            e.currentTarget.style.background = 'var(--bg-2)'
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.border = '1px solid transparent'
                            e.currentTarget.style.background = 'transparent'
                          }}
                        />
                        {isUnmatched && (
                          <AlertTriangle
                            size={14}
                            color="var(--warning)"
                            style={{ flexShrink: 0 }}
                          />
                        )}
                      </div>
                    </td>
                    <td style={TD}>
                      <input
                        style={{
                          ...INPUT,
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 500,
                          textAlign: 'right',
                        }}
                        type="number"
                        placeholder="0"
                        value={emp.gaji}
                        onChange={(e) => updateRow(emp.id, 'gaji', e.target.value)}
                        onFocus={(e) => {
                          e.currentTarget.style.border = '1px solid var(--border)'
                          e.currentTarget.style.background = 'var(--bg-2)'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.border = '1px solid transparent'
                          e.currentTarget.style.background = 'transparent'
                        }}
                      />
                    </td>
                    <td style={{ ...TD, textAlign: 'center' }}>
                      <button
                        className="row-action-btn"
                        onClick={() => removeRow(emp.id)}
                        disabled={employees.length === 1}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <datalist id="jabatan-list">
            {[...validJabatan].map((j) => (
              <option key={j} value={j} />
            ))}
          </datalist>

          <div style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
            <button
              onClick={addRow}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-b)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <Plus size={14} />
              Tambah Baris
            </button>
          </div>
        </div>
      ) : (
        <FileUploadZone
          onFile={handleFile}
          onDownloadTemplate={downloadTemplateMetodeA}
          error={uploadError}
        />
      )}

      {uniqueUnmatched.length > 0 && (
        <div
          style={{
            marginTop: 'var(--sp-4)',
            background: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--sp-4)',
          }}
        >
          <p
            className="text-body-sm"
            style={{ color: 'var(--warning)', marginBottom: 'var(--sp-1)' }}
          >
            Jabatan berikut tidak ditemukan di data poin. Pastikan penulisan sama persis:
          </p>
          {uniqueUnmatched.map((j) => (
            <p key={j} className="text-body-sm" style={{ color: 'var(--warning)' }}>
              • {j}
            </p>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <div
          style={{
            marginTop: 'var(--sp-4)',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--sp-4)',
          }}
        >
          {errors.map((err) => (
            <p key={err} className="text-body-sm" style={{ color: 'var(--danger)' }}>
              {err}
            </p>
          ))}
        </div>
      )}

      <PrivacyNotice />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--sp-8)' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-1)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 500,
            padding: '10px 18px',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Kembali
        </button>
        <button
          onClick={handleNext}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            background: 'var(--accent-b)',
            color: '#fff',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 500,
            padding: '10px 18px',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
          }}
        >
          Lanjut <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
