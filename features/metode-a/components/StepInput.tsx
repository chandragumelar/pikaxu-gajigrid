'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowRight } from 'lucide-react'
import { ToggleTab } from '@/features/shared/components/ToggleTab'
import { FileUploadZone } from '@/features/shared/components/FileUploadZone'
import { PrivacyNotice } from '@/features/shared/components/PrivacyNotice'
import { validateEmployeeRows } from '@/lib/validate'
import { parseEmployeeExcel } from '@/lib/parse-excel'
import { downloadTemplateMetodeA } from '@/lib/excel-export'

export type EmployeeInput = {
  id: string
  nama: string
  jabatan: string
  gaji: string
}

function newRow(): EmployeeInput {
  return { id: crypto.randomUUID(), nama: '', jabatan: '', gaji: '' }
}

interface StepInputProps {
  employees: EmployeeInput[]
  onChange: (employees: EmployeeInput[]) => void
  onNext: () => void
}

const TABS = [
  { value: 'manual', label: 'Input Manual' },
  { value: 'upload', label: 'Upload Excel' },
]

const TH_STYLE: React.CSSProperties = {
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
  whiteSpace: 'nowrap',
}

const TD_STYLE: React.CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid var(--border-subtle)',
}

const INPUT_STYLE: React.CSSProperties = {
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

export function StepInput({ employees, onChange, onNext }: StepInputProps) {
  const [mode, setMode] = useState<'manual' | 'upload'>('manual')
  const [errors, setErrors] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | undefined>()

  function updateRow(id: string, field: keyof EmployeeInput, value: string) {
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
      setUploadError(e instanceof Error ? e.message : 'Terjadi kesalahan saat membaca file.')
    }
  }

  function handleNext() {
    const filledRows = employees.filter((e) => e.nama.trim() || e.jabatan.trim() || e.gaji.trim())
    if (filledRows.length === 0) {
      setErrors(['Tambahkan minimal satu data karyawan.'])
      return
    }
    const validationErrors = validateEmployeeRows(filledRows)
    if (validationErrors.length > 0) {
      setErrors(
        validationErrors.map((err) => `Baris ${err.row}, kolom ${err.col} — ${err.message}`)
      )
      return
    }
    setErrors([])
    onChange(filledRows)
    onNext()
  }

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
                <th style={{ ...TH_STYLE, width: '48px', textAlign: 'center' }}>No</th>
                <th style={TH_STYLE}>Nama</th>
                <th style={TH_STYLE}>Jabatan</th>
                <th style={{ ...TH_STYLE, textAlign: 'right' }}>Gaji (Rp)</th>
                <th style={{ ...TH_STYLE, width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={emp.id} className="input-row">
                  <td style={{ ...TD_STYLE, textAlign: 'center' }}>
                    <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
                      {i + 1}
                    </span>
                  </td>
                  <td style={TD_STYLE}>
                    <input
                      style={INPUT_STYLE}
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
                  <td style={TD_STYLE}>
                    <input
                      style={INPUT_STYLE}
                      placeholder="Jabatan"
                      value={emp.jabatan}
                      onChange={(e) => updateRow(emp.id, 'jabatan', e.target.value)}
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
                  <td style={TD_STYLE}>
                    <input
                      style={{
                        ...INPUT_STYLE,
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
                  <td style={{ ...TD_STYLE, textAlign: 'center' }}>
                    <button
                      className="row-action-btn"
                      onClick={() => removeRow(emp.id)}
                      disabled={employees.length === 1}
                      title="Hapus baris"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
            <button
              onClick={addRow}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
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
            <p
              key={err}
              className="text-body-sm"
              style={{ color: 'var(--danger)', marginBottom: 'var(--sp-1)' }}
            >
              {err}
            </p>
          ))}
        </div>
      )}

      <PrivacyNotice />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 'var(--sp-8)',
        }}
      >
        <button
          onClick={handleNext}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            background: 'var(--accent)',
            color: '#08090f',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 500,
            padding: '10px 18px',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'all 150ms',
          }}
        >
          Lanjut
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
