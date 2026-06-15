'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { formatRupiah, formatGapRp, formatGapPct } from '@/lib/format'
import { downloadMetodeBResult } from '@/lib/excel-export'
import type { MetodeBResult, FaktorDef } from '@/lib/calc-metode-b'
import type { KonfigurasiB } from './StepKonfigurasi'
import type { JabatanWithPoin } from '@/lib/calc-metode-b'

interface StepHasilProps {
  result: MetodeBResult
  jabatanPoin: JabatanWithPoin[]
  konfigurasi: KonfigurasiB
  onChange: (k: KonfigurasiB) => void
  onBack: () => void
  viaFaktor: boolean
  poinFaktorData?: {
    jabatanList: string[]
    faktors: FaktorDef[]
    matrix: Record<string, Record<string, number>>
  }
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
const TH_NUM: React.CSSProperties = { ...TH, textAlign: 'right' }
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
const TD_MUTED: React.CSSProperties = { ...TD, color: 'var(--text-3)', fontSize: '13px' }

const INPUT: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--border)',
  color: 'var(--text-1)',
  borderRadius: 'var(--radius-sm)',
  padding: '6px 10px',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  fontWeight: 500,
  width: '100%',
  outline: 'none',
}

export function StepHasil({
  result,
  jabatanPoin,
  konfigurasi,
  onChange,
  onBack,
  viaFaktor,
  poinFaktorData,
}: StepHasilProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [local, setLocal] = useState<KonfigurasiB>(konfigurasi)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocal(konfigurasi)
  }, [konfigurasi])

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(timer)
  }, [local]) // eslint-disable-line react-hooks/exhaustive-deps

  function set(field: keyof KonfigurasiB, value: string | number) {
    setLocal((prev) => ({ ...prev, [field]: value }))
  }

  const { struktur, detail } = result

  return (
    <div style={{ paddingBottom: 'var(--sp-24)' }}>
      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--sp-6)',
          flexWrap: 'wrap',
          gap: 'var(--sp-3)',
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
          <ArrowLeft size={16} /> Kembali
        </button>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
          <button
            onClick={() => setShowEdit((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '8px 14px',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
            }}
          >
            Edit Parameter {showEdit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => downloadMetodeBResult(result, viaFaktor ? poinFaktorData : undefined)}
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
            <Download size={16} /> Download Excel
          </button>
        </div>
      </div>

      {/* Edit panel */}
      {showEdit && (
        <div
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--sp-5)',
            marginBottom: 'var(--sp-6)',
          }}
        >
          <p
            className="text-label"
            style={{ color: 'var(--text-3)', marginBottom: 'var(--sp-4)', letterSpacing: '0.06em' }}
          >
            EDIT PARAMETER (re-kalkulasi otomatis)
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 'var(--sp-4)',
            }}
          >
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-2)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Jabatan Titik Terendah
              </label>
              <select
                value={local.titikTerendahJabatan}
                onChange={(e) => set('titikTerendahJabatan', e.target.value)}
                style={{ ...INPUT, fontFamily: 'var(--font-body)', cursor: 'pointer' }}
              >
                {jabatanPoin.map((j) => (
                  <option key={j.jabatan} value={j.jabatan}>
                    {j.jabatan} ({j.poin})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-2)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Gaji U₁ (Rp)
              </label>
              <input
                type="number"
                value={local.u1}
                onChange={(e) => set('u1', e.target.value)}
                style={INPUT}
              />
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-2)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Jabatan Titik Tertinggi
              </label>
              <select
                value={local.titikTertinggiJabatan}
                onChange={(e) => set('titikTertinggiJabatan', e.target.value)}
                style={{ ...INPUT, fontFamily: 'var(--font-body)', cursor: 'pointer' }}
              >
                {jabatanPoin.map((j) => (
                  <option key={j.jabatan} value={j.jabatan}>
                    {j.jabatan} ({j.poin})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-2)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Gaji U₂ (Rp)
              </label>
              <input
                type="number"
                value={local.u2}
                onChange={(e) => set('u2', e.target.value)}
                style={INPUT}
              />
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-2)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Min (%)
              </label>
              <input
                type="number"
                value={local.minPct}
                onChange={(e) => set('minPct', Number(e.target.value))}
                style={INPUT}
              />
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-2)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Maks (%)
              </label>
              <input
                type="number"
                value={local.maksPct}
                onChange={(e) => set('maksPct', Number(e.target.value))}
                style={INPUT}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabel 1: Struktur Gaji per Jabatan */}
      <h3
        className="text-subheading"
        style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-4)' }}
      >
        Struktur Gaji per Jabatan
      </h3>
      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 'var(--sp-8)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH}>Jabatan</th>
              <th style={TH_NUM}>Poin</th>
              <th style={TH_NUM}>Min ({konfigurasi.minPct}%)</th>
              <th style={TH_NUM}>Mid / Y (100%)</th>
              <th style={TH_NUM}>Maks ({konfigurasi.maksPct}%)</th>
            </tr>
          </thead>
          <tbody>
            {struktur.map((s) => (
              <tr key={s.jabatan}>
                <td style={TD}>{s.jabatan}</td>
                <td style={{ ...TD_NUM, color: 'var(--accent-b)' }}>{s.poin}</td>
                <td style={TD_NUM}>{formatRupiah(s.min)}</td>
                <td style={{ ...TD_NUM, color: 'var(--accent-b)' }}>{formatRupiah(s.mid)}</td>
                <td style={TD_NUM}>{formatRupiah(s.maks)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel 2: Detail per Karyawan */}
      <h3
        className="text-subheading"
        style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-4)' }}
      >
        Detail per Karyawan
      </h3>
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
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1140px' }}>
          <thead>
            <tr>
              <th style={TH}>No</th>
              <th style={TH}>Nama</th>
              <th style={TH}>Jabatan</th>
              <th style={TH_NUM}>Poin</th>
              <th style={TH_NUM}>Gaji Lama</th>
              <th style={TH_NUM}>Min</th>
              <th style={TH_NUM}>Mid</th>
              <th style={TH_NUM}>Maks</th>
              <th style={TH_NUM}>Gap vs Min (Rp)</th>
              <th style={TH_NUM}>Gap vs Min (%)</th>
              <th style={TH_NUM}>Gap vs Mid (Rp)</th>
              <th style={TH_NUM}>Gap vs Mid (%)</th>
              <th style={TH_NUM}>Gap vs Maks (Rp)</th>
              <th style={TH_NUM}>Gap vs Maks (%)</th>
            </tr>
          </thead>
          <tbody>
            {detail.map((d) => (
              <tr key={d.no} className={d.rowClass}>
                <td style={TD_MUTED}>{d.no}</td>
                <td style={TD}>{d.nama}</td>
                <td style={TD}>{d.jabatan}</td>
                <td style={{ ...TD_NUM, color: 'var(--accent-b)' }}>{d.poinJabatan}</td>
                <td style={TD_NUM}>{formatRupiah(d.gajiLama)}</td>
                <td style={TD_NUM}>{formatRupiah(d.minJabatan)}</td>
                <td style={TD_NUM}>{formatRupiah(d.midJabatan)}</td>
                <td style={TD_NUM}>{formatRupiah(d.maksJabatan)}</td>
                <td
                  style={{
                    ...TD_NUM,
                    color: d.gapVsMinRp < 0 ? 'var(--danger)' : 'var(--success)',
                  }}
                >
                  {formatGapRp(d.gapVsMinRp)}
                </td>
                <td
                  style={{
                    ...TD_NUM,
                    color: d.gapVsMinPct < 0 ? 'var(--danger)' : 'var(--success)',
                  }}
                >
                  {formatGapPct(d.gapVsMinPct)}
                </td>
                <td
                  style={{ ...TD_NUM, color: d.gapVsMidRp < 0 ? 'var(--danger)' : 'var(--text-2)' }}
                >
                  {formatGapRp(d.gapVsMidRp)}
                </td>
                <td
                  style={{
                    ...TD_NUM,
                    color: d.gapVsMidPct < 0 ? 'var(--danger)' : 'var(--text-2)',
                  }}
                >
                  {formatGapPct(d.gapVsMidPct)}
                </td>
                <td
                  style={{
                    ...TD_NUM,
                    color: d.gapVsMaksRp > 0 ? 'var(--warning)' : 'var(--text-2)',
                  }}
                >
                  {formatGapRp(d.gapVsMaksRp)}
                </td>
                <td
                  style={{
                    ...TD_NUM,
                    color: d.gapVsMaksPct > 0 ? 'var(--warning)' : 'var(--text-2)',
                  }}
                >
                  {formatGapPct(d.gapVsMaksPct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-5)', flexWrap: 'wrap' }}>
        {[
          { color: 'var(--danger)', label: 'Di bawah minimum' },
          { color: 'var(--success)', label: 'Dalam rentang' },
          { color: 'var(--warning)', label: 'Di atas maksimum' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: color,
                flexShrink: 0,
              }}
            />
            <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {viaFaktor && (
        <p className="text-body-sm" style={{ color: 'var(--text-3)', marginTop: 'var(--sp-4)' }}>
          File Excel mencakup sheet tambahan &ldquo;Detail Poin Faktor&rdquo; untuk dokumentasi
          perhitungan poin jabatan.
        </p>
      )}
    </div>
  )
}
