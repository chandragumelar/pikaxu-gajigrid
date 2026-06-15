import { Lock } from 'lucide-react'

export function PrivacyNotice() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: 'var(--sp-4)',
      }}
    >
      <Lock size={12} color="var(--accent)" />
      <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
        Semua kalkulasi berjalan sepenuhnya di browser kamu. Tidak ada nama, jabatan, atau data gaji
        yang pernah dikirim ke server manapun.
      </span>
    </div>
  )
}
