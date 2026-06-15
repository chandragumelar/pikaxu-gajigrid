'use client'

import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react'
import { InfoCallout } from '@/features/shared/components/InfoCallout'
import type { FaktorDef } from '@/lib/calc-metode-b'

interface StepFaktorProps {
  faktors: FaktorDef[]
  onChange: (faktors: FaktorDef[]) => void
  onBack: () => void
  onNext: () => void
}

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
}

export function StepFaktor({ faktors, onChange, onBack, onNext }: StepFaktorProps) {
  function updateFaktor(id: string, field: 'nama' | 'maksimal', value: string | number) {
    onChange(
      faktors.map((f) =>
        f.id === id ? { ...f, [field]: field === 'maksimal' ? Number(value) : value } : f
      )
    )
  }

  function addFaktor() {
    onChange([...faktors, { id: crypto.randomUUID(), nama: '', maksimal: 100 }])
  }

  function removeFaktor(id: string) {
    if (faktors.length === 1) return
    onChange(faktors.filter((f) => f.id !== id))
  }

  const total = faktors.reduce((sum, f) => sum + (f.maksimal || 0), 0)

  const errors: string[] = []
  if (faktors.some((f) => !f.nama.trim())) errors.push('Semua faktor harus punya nama.')
  if (faktors.some((f) => f.maksimal <= 0))
    errors.push('Poin maksimal setiap faktor harus lebih dari 0.')

  return (
    <div>
      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 'var(--sp-4)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: '48px', textAlign: 'center' }}>No</th>
              <th style={TH}>Faktor</th>
              <th style={{ ...TH, textAlign: 'right', width: '160px' }}>Poin Maksimal</th>
              <th style={{ ...TH, width: '40px' }} />
            </tr>
          </thead>
          <tbody>
            {faktors.map((f, i) => (
              <tr key={f.id} className="input-row">
                <td style={{ ...TD, textAlign: 'center' }}>
                  <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
                    {i + 1}
                  </span>
                </td>
                <td style={TD}>
                  <input
                    style={INPUT}
                    placeholder="Nama faktor"
                    value={f.nama}
                    onChange={(e) => updateFaktor(f.id, 'nama', e.target.value)}
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
                    min={1}
                    value={f.maksimal}
                    onChange={(e) => updateFaktor(f.id, 'maksimal', e.target.value)}
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
                    onClick={() => removeFaktor(f.id)}
                    disabled={faktors.length === 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr>
              <td
                colSpan={2}
                style={{
                  ...TD,
                  color: 'var(--text-3)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  textAlign: 'right',
                }}
              >
                Total Poin Maksimal
              </td>
              <td
                style={{
                  ...TD,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--accent-b)',
                  textAlign: 'right',
                  padding: '6px 14px',
                }}
              >
                {total}
              </td>
              <td style={TD} />
            </tr>
          </tbody>
        </table>
        <div style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
          <button
            onClick={addFaktor}
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
            <Plus size={14} /> Tambah Faktor
          </button>
        </div>
      </div>

      <InfoCallout variant="violet" label="Apa itu faktor?">
        Faktor adalah dimensi penilaian jabatan — misalnya Tanggung Jawab, Keahlian, atau Usaha.
        Poin maksimal menentukan bobot relatif tiap faktor. Kamu bisa ubah nama, tambah, atau hapus
        faktor sesuai kebutuhan perusahaan. Tidak ada standar wajib.
      </InfoCallout>

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
          onClick={() => errors.length === 0 && onNext()}
          disabled={errors.length > 0}
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
            cursor: errors.length > 0 ? 'not-allowed' : 'pointer',
            opacity: errors.length > 0 ? 0.4 : 1,
          }}
        >
          Lanjut <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
