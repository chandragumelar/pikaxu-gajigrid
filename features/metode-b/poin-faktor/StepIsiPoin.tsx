'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react'
import type { FaktorDef } from '@/lib/calc-metode-b'

export type JabatanFaktorInput = {
  id: string
  jabatan: string
  poin: Record<string, string>
}

interface StepIsiPoinProps {
  faktors: FaktorDef[]
  rows: JabatanFaktorInput[]
  onChange: (rows: JabatanFaktorInput[]) => void
  onBack: () => void
  onNext: () => void
}

function newRow(faktors: FaktorDef[]): JabatanFaktorInput {
  const poin: Record<string, string> = {}
  faktors.forEach((f) => {
    poin[f.id] = ''
  })
  return { id: crypto.randomUUID(), jabatan: '', poin }
}

const TH: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-3)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  padding: '10px 12px',
  textAlign: 'left',
  background: 'var(--bg-2)',
  borderBottom: '1px solid var(--border)',
  whiteSpace: 'nowrap',
}

const TD: React.CSSProperties = {
  padding: '6px 6px',
  borderBottom: '1px solid var(--border-subtle)',
}

const INPUT: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: 'var(--radius-sm)',
  padding: '5px 6px',
  fontSize: '13px',
  color: 'var(--text-1)',
  width: '100%',
  outline: 'none',
}

export function StepIsiPoin({ faktors, rows, onChange, onBack, onNext }: StepIsiPoinProps) {
  const [errors, setErrors] = useState<string[]>([])

  function updateJabatan(id: string, value: string) {
    onChange(rows.map((r) => (r.id === id ? { ...r, jabatan: value } : r)))
  }

  function updatePoin(id: string, faktorId: string, value: string) {
    onChange(rows.map((r) => (r.id === id ? { ...r, poin: { ...r.poin, [faktorId]: value } } : r)))
  }

  function addRow() {
    onChange([...rows, newRow(faktors)])
  }

  function removeRow(id: string) {
    if (rows.length === 1) return
    onChange(rows.filter((r) => r.id !== id))
  }

  function calcTotal(row: JabatanFaktorInput) {
    return faktors.reduce((sum, f) => sum + (Number(row.poin[f.id]) || 0), 0)
  }

  function handleNext() {
    const errs: string[] = []
    rows.forEach((row, i) => {
      if (!row.jabatan.trim()) errs.push(`Baris ${i + 1} — nama jabatan tidak boleh kosong.`)
      faktors.forEach((f) => {
        const v = Number(row.poin[f.id])
        if (row.poin[f.id] !== '' && v > f.maksimal) {
          errs.push(`Baris ${i + 1}, ${f.nama} — tidak boleh melebihi ${f.maksimal}.`)
        }
      })
    })
    const jabatanList = rows.map((r) => r.jabatan.trim()).filter(Boolean)
    const dups = jabatanList.filter((j, i) => jabatanList.indexOf(j) !== i)
    if (dups.length > 0) errs.push(`Jabatan duplikat: ${[...new Set(dups)].join(', ')}.`)
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    setErrors([])
    onNext()
  }

  return (
    <div>
      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          overflowX: 'auto',
          marginBottom: 'var(--sp-4)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: `${400 + faktors.length * 120}px`,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...TH, width: '48px', textAlign: 'center' }}>No</th>
              <th style={{ ...TH, minWidth: '180px' }}>Jabatan</th>
              {faktors.map((f) => (
                <th key={f.id} style={{ ...TH, textAlign: 'right', minWidth: '110px' }}>
                  {f.nama}
                  <span style={{ display: 'block', color: 'var(--text-3)', fontWeight: 400 }}>
                    maks {f.maksimal}
                  </span>
                </th>
              ))}
              <th style={{ ...TH, textAlign: 'right', minWidth: '90px' }}>Total</th>
              <th style={{ ...TH, width: '40px' }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const total = calcTotal(row)
              return (
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
                      onChange={(e) => updateJabatan(row.id, e.target.value)}
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
                  {faktors.map((f) => {
                    const v = Number(row.poin[f.id])
                    const isExceed = row.poin[f.id] !== '' && v > f.maksimal
                    return (
                      <td key={f.id} style={TD}>
                        <input
                          style={{
                            ...INPUT,
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 500,
                            textAlign: 'right',
                            ...(isExceed ? { color: 'var(--danger)' } : {}),
                          }}
                          type="number"
                          min={0}
                          max={f.maksimal}
                          placeholder="0"
                          value={row.poin[f.id] ?? ''}
                          onChange={(e) => updatePoin(row.id, f.id, e.target.value)}
                          onFocus={(e) => {
                            e.currentTarget.style.border = `1px solid ${isExceed ? 'var(--danger)' : 'var(--border)'}`
                            e.currentTarget.style.background = 'var(--bg-2)'
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.border = '1px solid transparent'
                            e.currentTarget.style.background = 'transparent'
                          }}
                        />
                      </td>
                    )
                  })}
                  <td
                    style={{
                      ...TD,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'right',
                      color: 'var(--accent-b)',
                      padding: '6px 10px',
                    }}
                  >
                    {total}
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
              )
            })}
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
            <Plus size={14} /> Tambah Jabatan
          </button>
        </div>
      </div>

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
          Lihat Preview <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
