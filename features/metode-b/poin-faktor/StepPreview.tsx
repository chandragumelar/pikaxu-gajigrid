'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { InfoCallout } from '@/features/shared/components/InfoCallout'
import type { FaktorDef } from '@/lib/calc-metode-b'
import type { JabatanFaktorInput } from './StepIsiPoin'

interface StepPreviewProps {
  faktors: FaktorDef[]
  rows: JabatanFaktorInput[]
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
  whiteSpace: 'nowrap',
}
const TD: React.CSSProperties = {
  padding: '12px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--text-1)',
  borderBottom: '1px solid var(--border-subtle)',
}
const TD_NUM: React.CSSProperties = {
  ...TD,
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  textAlign: 'right',
}

export function StepPreview({ faktors, rows, onBack, onNext }: StepPreviewProps) {
  const sorted = [...rows]
    .map((r) => ({
      ...r,
      totalPoin: faktors.reduce((sum, f) => sum + (Number(r.poin[f.id]) || 0), 0),
    }))
    .sort((a, b) => a.totalPoin - b.totalPoin)

  return (
    <div>
      <InfoCallout variant="violet" label="Sanity check">
        Periksa apakah urutan jabatan di bawah sudah mencerminkan hierarki yang kamu harapkan.
        Jabatan dengan poin lebih tinggi = lebih senior = gaji lebih tinggi. Kalau ada yang tidak
        sesuai, kembali dan perbaiki poinnya.
      </InfoCallout>

      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginTop: 'var(--sp-6)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: '48px', textAlign: 'center' }}>Rank</th>
              <th style={TH}>Jabatan</th>
              {faktors.map((f) => (
                <th key={f.id} style={{ ...TH, textAlign: 'right' }}>
                  {f.nama}
                </th>
              ))}
              <th style={{ ...TH, textAlign: 'right', color: 'var(--accent-b)' }}>Total Poin</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.id}>
                <td style={{ ...TD, textAlign: 'center' }}>
                  <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
                    {i + 1}
                  </span>
                </td>
                <td style={TD}>{row.jabatan}</td>
                {faktors.map((f) => (
                  <td key={f.id} style={TD_NUM}>
                    {Number(row.poin[f.id]) || 0}
                  </td>
                ))}
                <td style={{ ...TD_NUM, color: 'var(--accent-b)', fontWeight: 600 }}>
                  {row.totalPoin}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--sp-4)' }}>
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
          <ArrowLeft size={16} /> Kembali Edit
        </button>
        <button
          onClick={onNext}
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
          Ranking Sesuai, Lanjut <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
