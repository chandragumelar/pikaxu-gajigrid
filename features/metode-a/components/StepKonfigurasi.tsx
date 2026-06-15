'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { InfoCallout } from '@/features/shared/components/InfoCallout'
import { calcMidpoints } from '@/lib/calc-metode-a'
import { formatRupiah } from '@/lib/format'
import type { Employee } from '@/lib/calc-metode-a'

interface StepKonfigurasiProps {
  employees: Employee[]
  jumlahGolongan: number
  rentangPerGolongan: number[]
  onChangeJumlahGolongan: (n: number) => void
  onChangeRentang: (rentang: number[]) => void
  onBack: () => void
  onNext: () => void
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-2)',
  display: 'block',
  marginBottom: '6px',
}

const INPUT_STYLE: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--border)',
  color: 'var(--text-1)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: '14px',
  outline: 'none',
  transition: 'border 150ms ease-out, box-shadow 150ms ease-out',
}

export function StepKonfigurasi({
  employees,
  jumlahGolongan,
  rentangPerGolongan,
  onChangeJumlahGolongan,
  onChangeRentang,
  onBack,
  onNext,
}: StepKonfigurasiProps) {
  const uniqueJabatan = new Set(employees.map((e) => e.jabatan)).size
  const midpoints = calcMidpoints(employees, jumlahGolongan)

  function updateRentang(i: number, pct: number) {
    const next = [...rentangPerGolongan]
    next[i] = pct / 100
    onChangeRentang(next)
  }

  function calcSimulation(mid: number, rentangDecimal: number) {
    const r = rentangDecimal
    return {
      min: (2 * mid) / (r + 2),
      maks: (2 * mid * (r + 1)) / (r + 2),
    }
  }

  const errors: string[] = []
  if (jumlahGolongan < 2) errors.push('Jumlah golongan minimal 2.')

  return (
    <div>
      {/* Jumlah golongan */}
      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--sp-6)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        <div style={{ maxWidth: '200px' }}>
          <label style={LABEL_STYLE}>Jumlah golongan</label>
          <input
            type="number"
            min={2}
            max={20}
            value={jumlahGolongan}
            onChange={(e) => onChangeJumlahGolongan(Math.max(2, Number(e.target.value)))}
            style={{ ...INPUT_STYLE, width: '100%' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        <InfoCallout label="Saran">
          Data kamu punya{' '}
          <strong style={{ color: 'var(--text-1)' }}>{uniqueJabatan} jabatan unik</strong>. Saran
          default: <strong style={{ color: 'var(--text-1)' }}>{uniqueJabatan} golongan</strong>.
          Kamu bisa ubah sesuai struktur organisasi.{' '}
          <em>Contoh: Staff, Senior, Supervisor, Manager, Director = 5 golongan.</em>
        </InfoCallout>
      </div>

      {/* Rentang per golongan */}
      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--sp-6)',
        }}
      >
        <h3
          className="text-subheading"
          style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-5)' }}
        >
          Rentang per Golongan
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 'var(--sp-5)',
          }}
        >
          {Array.from({ length: jumlahGolongan }, (_, i) => {
            const mid = midpoints[i] ?? 0
            const r = rentangPerGolongan[i] ?? 0.2
            const { min, maks } = calcSimulation(mid, r)
            const pct = +(r * 100).toFixed(1)

            return (
              <div key={i}>
                <label style={LABEL_STYLE}>Golongan {i + 1}</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    value={pct}
                    onChange={(e) => updateRentang(i, Number(e.target.value))}
                    style={{
                      ...INPUT_STYLE,
                      width: '100%',
                      paddingRight: '32px',
                      textAlign: 'right',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'var(--text-3)',
                      pointerEvents: 'none',
                    }}
                  >
                    %
                  </span>
                </div>
                {mid > 0 && (
                  <p className="text-body-sm" style={{ color: 'var(--text-3)', marginTop: '6px' }}>
                    Mid {formatRupiah(mid)} → {formatRupiah(min)} – {formatRupiah(maks)}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <InfoCallout label="Panduan rentang">
          Rentang menentukan jarak gaji terkecil dan terbesar dalam 1 golongan. Semakin besar
          rentang, semakin lebar jaraknya. Rentang{' '}
          <strong style={{ color: 'var(--text-1)' }}>20%–30%</strong> umum dipakai. Golongan yang
          lebih tinggi biasanya punya rentang lebih lebar karena variasi tanggung jawab lebih besar.
        </InfoCallout>
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 'var(--sp-8)',
        }}
      >
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
          <ArrowLeft size={16} />
          Kembali
        </button>

        <button
          onClick={() => errors.length === 0 && onNext()}
          disabled={errors.length > 0}
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
            cursor: errors.length > 0 ? 'not-allowed' : 'pointer',
            opacity: errors.length > 0 ? 0.4 : 1,
            transition: 'all 150ms',
          }}
        >
          Buat Struktur Gaji
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
