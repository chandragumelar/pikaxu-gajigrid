'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { ToggleTab } from '@/features/shared/components/ToggleTab'
import { FileUploadZone } from '@/features/shared/components/FileUploadZone'
import { parsePoinJabatanExcel } from '@/lib/parse-excel'
import { downloadTemplatePoinJabatan } from '@/lib/excel-export'

export type PoinJabatanInput = { id: string; jabatan: string; poin: string }

function newRow(): PoinJabatanInput {
  return { id: crypto.randomUUID(), jabatan: '', poin: '' }
}

interface StepInputPoinProps {
  rows: PoinJabatanInput[]
  onChange: (rows: PoinJabatanInput[]) => void
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

export function StepInputPoin({ rows, onChange, onBack, onNext }: StepInputPoinProps) {
  const [mode, setMode] = useState<'manual' | 'upload'>('manual')
  const [errors, setErrors] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | undefined>()

  function updateRow(id: string, field: 'jabatan' | 'poin', value: string) {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    onChange([...rows, newRow()])
  }

  function removeRow(id: string) {
    if (rows.length === 1) return
    onChange(rows.filter((r) => r.id !== id))
  }

  async function handleFile(file: File) {
    setUploadError(undefined)
    try {
      const parsed = await parsePoinJabatanExcel(file)
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
    const filled = rows.filter((r) => r.jabatan.trim() || r.poin)
    if (filled.length === 0) {
      setErrors(['Tambahkan minimal satu jabatan.'])
      return
    }
    const errs: string[] = []
    filled.forEach((r, i) => {
      if (!r.jabatan.trim()) errs.push(`Baris ${i + 1}, kolom Jabatan — tidak boleh kosong.`)
      if (!r.poin || isNaN(Number(r.poin)) || Number(r.poin) <= 0)
        errs.push(`Baris ${i + 1}, kolom Poin — harus berupa angka lebih dari 0.`)
    })
    if (errs.length > 0) {
      setErrors(errs)
      return
    }

    const jabatanList = filled.map((r) => r.jabatan.trim())
    const dupJabatan = jabatanList.filter((j, i) => jabatanList.indexOf(j) !== i)
    if (dupJabatan.length > 0) {
      setErrors([`Jabatan duplikat: ${[...new Set(dupJabatan)].join(', ')}.`])
      return
    }

    setErrors([])
    onChange(filled)
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
                <th style={{ ...TH, width: '48px', textAlign: 'center' }}>No</th>
                <th style={TH}>Jabatan</th>
                <th style={{ ...TH, textAlign: 'right' }}>Poin</th>
                <th style={{ ...TH, width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className="input-row">
                  <td style={{ ...TD, textAlign: 'center' }}>
                    <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
                      {i + 1}
                    </span>
                  </td>
                  <td style={TD}>
                    <input
                      style={INPUT}
                      placeholder="Nama jabatan"
                      value={row.jabatan}
                      onChange={(e) => updateRow(row.id, 'jabatan', e.target.value)}
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
                    <input
                      style={{
                        ...INPUT,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 500,
                        textAlign: 'right',
                      }}
                      type="number"
                      placeholder="0"
                      value={row.poin}
                      onChange={(e) => updateRow(row.id, 'poin', e.target.value)}
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
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
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
          onDownloadTemplate={downloadTemplatePoinJabatan}
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
            <p key={err} className="text-body-sm" style={{ color: 'var(--danger)' }}>
              {err}
            </p>
          ))}
        </div>
      )}

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
