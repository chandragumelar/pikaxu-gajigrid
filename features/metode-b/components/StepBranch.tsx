'use client'

import { ArrowRight } from 'lucide-react'
import { Badge } from '@/features/shared/components/Badge'
import { InfoCallout } from '@/features/shared/components/InfoCallout'

interface StepBranchProps {
  onChoose: (path: 'A' | 'B') => void
}

export function StepBranch({ onChoose }: StepBranchProps) {
  return (
    <div>
      <InfoCallout variant="violet" label="Apa itu poin jabatan?">
        Poin jabatan adalah angka yang menggambarkan &apos;bobot&apos; suatu jabatan — berdasarkan
        tanggung jawab, keahlian, dan faktor lain. Semakin besar bobot jabatannya, semakin besar
        poinnya. Kalau perusahaan kamu sudah pernah menghitung ini, pilih{' '}
        <strong style={{ color: 'var(--text-1)' }}>Sudah Punya</strong>. Kalau belum, pilih{' '}
        <strong style={{ color: 'var(--text-1)' }}>Belum, Bantu Saya</strong>.
      </InfoCallout>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--sp-5)',
          marginTop: 'var(--sp-8)',
        }}
      >
        {/* Path A */}
        <button
          onClick={() => onChoose('A')}
          style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--sp-8)',
            cursor: 'pointer',
            textAlign: 'left',
            transition:
              'border-color var(--t-base), box-shadow var(--t-base), transform var(--t-base)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(124,92,252,0.28)'
            e.currentTarget.style.boxShadow =
              '0 4px 20px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,92,252,0.28), 0 0 32px var(--accent-b-glow)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'none'
          }}
        >
          <Badge variant="violet">Sudah Punya</Badge>
          <div>
            <p
              className="text-subheading"
              style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-2)' }}
            >
              Ya, Saya Sudah Punya Poin
            </p>
            <p className="text-body-sm" style={{ color: 'var(--text-2)' }}>
              Kamu sudah punya nilai poin untuk setiap jabatan di perusahaan. Langsung masukkan
              daftarnya.
            </p>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              color: 'var(--accent-b)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              marginTop: 'auto',
            }}
          >
            Ya, Saya Sudah Punya Poin <ArrowRight size={14} />
          </div>
        </button>

        {/* Path B */}
        <button
          onClick={() => onChoose('B')}
          style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--sp-8)',
            cursor: 'pointer',
            textAlign: 'left',
            transition:
              'border-color var(--t-base), box-shadow var(--t-base), transform var(--t-base)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(124,92,252,0.28)'
            e.currentTarget.style.boxShadow =
              '0 4px 20px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,92,252,0.28), 0 0 32px var(--accent-b-glow)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'none'
          }}
        >
          <Badge variant="neutral">Belum Punya</Badge>
          <div>
            <p
              className="text-subheading"
              style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-2)' }}
            >
              Belum, Bantu Saya Menghitung
            </p>
            <p className="text-body-sm" style={{ color: 'var(--text-2)' }}>
              Tool ini akan membantu kamu menghitung poin jabatan menggunakan metode poin faktor —
              menilai bobot tiap jabatan berdasarkan beberapa faktor.
            </p>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              color: 'var(--text-2)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              marginTop: 'auto',
            }}
          >
            Bantu Saya Menghitung <ArrowRight size={14} />
          </div>
        </button>
      </div>
    </div>
  )
}
