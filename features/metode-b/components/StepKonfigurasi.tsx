'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { InfoCallout } from '@/features/shared/components/InfoCallout'
import { formatRupiah } from '@/lib/format'
import type { JabatanWithPoin } from '@/lib/calc-metode-b'

export type KonfigurasiB = {
  titikTerendahJabatan: string
  titikTertinggiJabatan: string
  u1: string
  u2: string
  minPct: number
  maksPct: number
}

interface StepKonfigurasiProps {
  jabatanPoin: JabatanWithPoin[]
  konfigurasi: KonfigurasiB
  onChange: (k: KonfigurasiB) => void
  onBack: () => void
  onNext: () => void
}

const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-2)',
  display: 'block',
  marginBottom: '6px',
}

const INPUT: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--border)',
  color: 'var(--text-1)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  transition: 'border 150ms ease-out, box-shadow 150ms ease-out',
}

const SELECT: React.CSSProperties = {
  ...INPUT,
  fontFamily: 'var(--font-body)',
  fontWeight: 400,
  cursor: 'pointer',
}

export function StepKonfigurasi({
  jabatanPoin,
  konfigurasi,
  onChange,
  onBack,
  onNext,
}: StepKonfigurasiProps) {
  function set(field: keyof KonfigurasiB, value: string | number) {
    onChange({ ...konfigurasi, [field]: value })
  }

  const p1 = jabatanPoin.find((j) => j.jabatan === konfigurasi.titikTerendahJabatan)?.poin
  const p2 = jabatanPoin.find((j) => j.jabatan === konfigurasi.titikTertinggiJabatan)?.poin

  const errors: string[] = []
  if (!konfigurasi.titikTerendahJabatan) errors.push('Pilih jabatan untuk titik terendah.')
  if (!konfigurasi.titikTertinggiJabatan) errors.push('Pilih jabatan untuk titik tertinggi.')
  if (
    konfigurasi.titikTerendahJabatan === konfigurasi.titikTertinggiJabatan &&
    konfigurasi.titikTerendahJabatan
  )
    errors.push('Titik terendah dan tertinggi tidak boleh jabatan yang sama.')
  if (!konfigurasi.u1 || Number(konfigurasi.u1) <= 0) errors.push('Gaji U₁ harus lebih dari 0.')
  if (!konfigurasi.u2 || Number(konfigurasi.u2) <= 0) errors.push('Gaji U₂ harus lebih dari 0.')
  if (konfigurasi.minPct <= 0 || konfigurasi.minPct >= 100) errors.push('Min % harus antara 1–99.')
  if (konfigurasi.maksPct <= 100) errors.push('Maks % harus lebih dari 100.')

  function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = 'var(--accent-b)'
    e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-b-dim)'
  }
  function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = 'var(--border)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div>
      {/* Titik terendah & tertinggi */}
      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--sp-6)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        <h3
          className="text-subheading"
          style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-5)' }}
        >
          Titik Acuan Gaji
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)' }}>
          {/* Titik Terendah */}
          <div>
            <p
              className="text-label"
              style={{
                color: 'var(--text-3)',
                marginBottom: 'var(--sp-4)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Titik Terendah (P₁, U₁)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div>
                <label style={LABEL}>Jabatan</label>
                <select
                  value={konfigurasi.titikTerendahJabatan}
                  onChange={(e) => set('titikTerendahJabatan', e.target.value)}
                  style={SELECT}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                >
                  <option value="">Pilih jabatan...</option>
                  {jabatanPoin.map((j) => (
                    <option key={j.jabatan} value={j.jabatan}>
                      {j.jabatan} (Poin: {j.poin})
                    </option>
                  ))}
                </select>
                {p1 !== undefined && (
                  <p className="text-body-sm" style={{ color: 'var(--text-3)', marginTop: '4px' }}>
                    Poin: {p1}
                  </p>
                )}
              </div>
              <div>
                <label style={LABEL}>Gaji (U₁)</label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'var(--text-3)',
                      pointerEvents: 'none',
                    }}
                  >
                    Rp
                  </span>
                  <input
                    type="number"
                    value={konfigurasi.u1}
                    onChange={(e) => set('u1', e.target.value)}
                    placeholder="0"
                    style={{ ...INPUT, paddingLeft: '40px', textAlign: 'right' }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
                {konfigurasi.u1 && Number(konfigurasi.u1) > 0 && (
                  <p className="text-body-sm" style={{ color: 'var(--text-3)', marginTop: '4px' }}>
                    {formatRupiah(Number(konfigurasi.u1))}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Titik Tertinggi */}
          <div>
            <p
              className="text-label"
              style={{
                color: 'var(--text-3)',
                marginBottom: 'var(--sp-4)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Titik Tertinggi (P₂, U₂)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div>
                <label style={LABEL}>Jabatan</label>
                <select
                  value={konfigurasi.titikTertinggiJabatan}
                  onChange={(e) => set('titikTertinggiJabatan', e.target.value)}
                  style={SELECT}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                >
                  <option value="">Pilih jabatan...</option>
                  {jabatanPoin.map((j) => (
                    <option key={j.jabatan} value={j.jabatan}>
                      {j.jabatan} (Poin: {j.poin})
                    </option>
                  ))}
                </select>
                {p2 !== undefined && (
                  <p className="text-body-sm" style={{ color: 'var(--text-3)', marginTop: '4px' }}>
                    Poin: {p2}
                  </p>
                )}
              </div>
              <div>
                <label style={LABEL}>Gaji (U₂)</label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'var(--text-3)',
                      pointerEvents: 'none',
                    }}
                  >
                    Rp
                  </span>
                  <input
                    type="number"
                    value={konfigurasi.u2}
                    onChange={(e) => set('u2', e.target.value)}
                    placeholder="0"
                    style={{ ...INPUT, paddingLeft: '40px', textAlign: 'right' }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
                {konfigurasi.u2 && Number(konfigurasi.u2) > 0 && (
                  <p className="text-body-sm" style={{ color: 'var(--text-3)', marginTop: '4px' }}>
                    {formatRupiah(Number(konfigurasi.u2))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <InfoCallout variant="violet" label="Cara kerja titik acuan">
          Titik terendah dan tertinggi adalah dua jabatan yang dipakai sebagai patokan gaji. Sistem
          akan menghitung gaji jabatan lain secara proporsional berdasarkan poinnya — menggunakan
          persamaan garis lurus antara dua titik ini.
        </InfoCallout>
      </div>

      {/* Min/Maks % */}
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
          Rentang Min / Maks
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--sp-5)',
            maxWidth: '480px',
          }}
        >
          <div>
            <label style={LABEL}>Min (%)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                value={konfigurasi.minPct}
                onChange={(e) => set('minPct', Number(e.target.value))}
                style={{ ...INPUT, paddingRight: '28px', textAlign: 'right' }}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-3)',
                  fontSize: '13px',
                  pointerEvents: 'none',
                }}
              >
                %
              </span>
            </div>
          </div>
          <div>
            <label style={LABEL}>Mid (%)</label>
            <div
              style={{
                ...INPUT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                background: 'var(--bg-3)',
                color: 'var(--text-3)',
                cursor: 'default',
              }}
            >
              100
            </div>
          </div>
          <div>
            <label style={LABEL}>Maks (%)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                value={konfigurasi.maksPct}
                onChange={(e) => set('maksPct', Number(e.target.value))}
                style={{ ...INPUT, paddingRight: '28px', textAlign: 'right' }}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-3)',
                  fontSize: '13px',
                  pointerEvents: 'none',
                }}
              >
                %
              </span>
            </div>
          </div>
        </div>

        <InfoCallout variant="violet" label="Arti persentase">
          Mid (100%) adalah gaji standar jabatan tersebut. Min ({konfigurasi.minPct}%) untuk
          karyawan baru/junior di jabatan itu. Maks ({konfigurasi.maksPct}%) untuk yang paling
          senior. Semakin lebar jaraknya, semakin besar perbedaan gaji antara junior dan senior di
          jabatan yang sama.
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
          Buat Struktur Gaji <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
