'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { formatRupiah, formatPersen, formatGapRp, formatGapPct } from '@/lib/format'
import { downloadMetodeAResult } from '@/lib/excel-export'
import type { MetodeAResult } from '@/lib/calc-metode-a'

interface StepHasilProps {
  result: MetodeAResult
  rentangPerGolongan: number[]
  onChangeRentang: (rentang: number[]) => void
  onBack: () => void
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

const TD_MUTED: React.CSSProperties = {
  ...TD,
  color: 'var(--text-3)',
  fontSize: '13px',
}

export function StepHasil({ result, rentangPerGolongan, onChangeRentang, onBack }: StepHasilProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [localRentang, setLocalRentang] = useState<number[]>(rentangPerGolongan)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalRentang(rentangPerGolongan)
  }, [rentangPerGolongan])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChangeRentang(localRentang)
    }, 300)
    return () => clearTimeout(timer)
  }, [localRentang]) // eslint-disable-line react-hooks/exhaustive-deps

  function updateLocalRentang(i: number, pct: number) {
    const next = [...localRentang]
    next[i] = pct / 100
    setLocalRentang(next)
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
          <ArrowLeft size={16} />
          Kembali
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
            Edit Rentang
            {showEdit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            onClick={() => downloadMetodeAResult(result)}
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
            }}
          >
            <Download size={16} />
            Download Excel
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
          <p className="text-label" style={{ color: 'var(--text-3)', marginBottom: 'var(--sp-4)' }}>
            EDIT RENTANG PER GOLONGAN (re-kalkulasi otomatis)
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 'var(--sp-4)',
            }}
          >
            {struktur.map((g, i) => (
              <div key={g.golongan}>
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
                  Golongan {g.golongan}
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    value={+((localRentang[i] ?? 0.2) * 100).toFixed(1)}
                    onChange={(e) => updateLocalRentang(i, Number(e.target.value))}
                    style={{
                      background: 'var(--bg-1)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-1)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 28px 6px 10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 500,
                      width: '100%',
                      textAlign: 'right',
                      outline: 'none',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--text-3)',
                      pointerEvents: 'none',
                    }}
                  >
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabel 1: Struktur Golongan */}
      <h3
        className="text-subheading"
        style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-4)' }}
      >
        Struktur Golongan
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
              <th style={TH}>Golongan</th>
              <th style={TH_NUM}>Rentang</th>
              <th style={TH_NUM}>Min</th>
              <th style={TH_NUM}>Mid</th>
              <th style={TH_NUM}>Maks</th>
            </tr>
          </thead>
          <tbody>
            {struktur.map((g) => (
              <tr key={g.golongan}>
                <td style={TD}>
                  <span
                    style={{
                      background: 'var(--accent-dim)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(0,212,168,0.2)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    Golongan {g.golongan}
                  </span>
                </td>
                <td style={TD_NUM}>{formatPersen(g.rentang * 100)}</td>
                <td style={TD_NUM}>{formatRupiah(g.min)}</td>
                <td style={{ ...TD_NUM, color: 'var(--accent)' }}>{formatRupiah(g.mid)}</td>
                <td style={TD_NUM}>{formatRupiah(g.maks)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel 2: Detail Karyawan */}
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
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
          <thead>
            <tr>
              <th style={TH}>No</th>
              <th style={TH}>Nama</th>
              <th style={TH}>Jabatan</th>
              <th style={TH}>Golongan</th>
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
                <td style={TD}>
                  <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
                    Gol. {d.golongan}
                  </span>
                </td>
                <td style={TD_NUM}>{formatRupiah(d.gajiLama)}</td>
                <td style={TD_NUM}>{formatRupiah(d.minGolongan)}</td>
                <td style={TD_NUM}>{formatRupiah(d.midGolongan)}</td>
                <td style={TD_NUM}>{formatRupiah(d.maksGolongan)}</td>
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
                  style={{
                    ...TD_NUM,
                    color: d.gapVsMidRp < 0 ? 'var(--danger)' : 'var(--text-2)',
                  }}
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

      {/* Legend */}
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
    </div>
  )
}
