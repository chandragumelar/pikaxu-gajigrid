import Link from 'next/link'
import { Check, Lock, TrendingUp, Target } from 'lucide-react'
import { Badge } from '@/features/shared/components/Badge'

export default function LandingPage() {
  return (
    <main>
      <div className="container-landing">
        {/* Hero */}
        <section
          style={{
            paddingTop: 'var(--sp-20)',
            paddingBottom: 'var(--sp-12)',
            textAlign: 'center',
          }}
        >
          <Badge variant="accent" style={{ marginBottom: 'var(--sp-6)' }}>
            Gratis · Kalkulasi di Browser
          </Badge>

          <h1
            className="text-display-xl"
            style={{
              color: 'var(--text-1)',
              marginBottom: 'var(--sp-5)',
              marginTop: 'var(--sp-4)',
            }}
          >
            Susun Struktur Gaji
            <br />
            yang Adil &amp; Terukur
          </h1>

          <p
            className="text-body-lg"
            style={{
              color: 'var(--text-2)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Dua pendekatan berbasis metode dua titik — pilih sesuai data yang kamu punya. Hasilnya:
            struktur golongan gaji yang bisa dipertanggungjawabkan, bukan sekadar perkiraan.
          </p>
        </section>

        {/* Method cards */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--sp-6)',
            marginBottom: 'var(--sp-8)',
          }}
        >
          {/* Metode Rentang Persentase */}
          <Link href="/metode-a" className="card-method">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--sp-5)',
              }}
            >
              <Badge variant="accent">Rentang Persentase</Badge>
              <TrendingUp size={24} color="var(--accent)" />
            </div>

            <h2
              className="text-subheading"
              style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-3)' }}
            >
              Dua Titik dengan Rentang Persentase
            </h2>

            <p
              className="text-body"
              style={{ color: 'var(--text-2)', marginBottom: 'var(--sp-4)' }}
            >
              Input data gaji karyawan yang ada. Sistem mencari titik terendah dan tertinggi, lalu
              membagi karyawan ke dalam golongan secara proporsional. Tiap golongan punya{' '}
              <em>midpoint</em> — gaji tengah — yang kamu bungkus dengan rentang persentase (misal
              ±20%) untuk menentukan batas minimum dan maksimumnya.
            </p>

            <p
              className="text-label"
              style={{
                color: 'var(--text-3)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 'var(--sp-3)',
              }}
            >
              Cocok untuk
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 'var(--sp-5)' }}>
              {[
                'Merapikan & menformalisasi struktur gaji yang sudah berjalan',
                'Tim HR yang punya data gaji tapi belum pernah memetakan golongannya',
                'Tidak perlu menilai bobot atau poin tiap jabatan',
              ].map((item) => (
                <li
                  key={item}
                  className="text-body-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--sp-2)',
                    color: 'var(--text-2)',
                    marginBottom: 'var(--sp-2)',
                  }}
                >
                  <Check
                    size={14}
                    color="var(--accent)"
                    style={{ marginTop: '2px', flexShrink: 0 }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ flex: 1 }} />

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--sp-2)',
                background: 'var(--accent)',
                color: '#08090f',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                padding: '10px 18px',
                borderRadius: 'var(--radius)',
                width: '100%',
                marginTop: 'var(--sp-4)',
              }}
            >
              Mulai dengan Metode Ini →
            </div>
          </Link>

          {/* Metode Poin Jabatan */}
          <Link href="/metode-b" className="card-method card-method-b">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--sp-5)',
              }}
            >
              <Badge variant="violet">Poin Jabatan</Badge>
              <Target size={24} color="var(--accent-b)" />
            </div>

            <h2
              className="text-subheading"
              style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-3)' }}
            >
              Dua Titik dengan Poin Jabatan
            </h2>

            <p
              className="text-body"
              style={{ color: 'var(--text-2)', marginBottom: 'var(--sp-4)' }}
            >
              Setiap jabatan diberi poin berdasarkan bobot — tanggung jawab, keahlian, usaha,
              lingkungan kerja. Pilih dua jabatan acuan dan masukkan target gajinya. Sistem menarik
              garis lurus (regresi linear) dari dua titik itu, lalu menghitung gaji semua jabatan
              lain secara otomatis dari poinnya.
            </p>

            <p
              className="text-label"
              style={{
                color: 'var(--text-3)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 'var(--sp-3)',
              }}
            >
              Cocok untuk
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 'var(--sp-5)' }}>
              {[
                'Membangun struktur gaji dari nol berbasis evaluasi jabatan',
                'Perusahaan yang ingin gaji mencerminkan bobot pekerjaan, bukan senioritas semata',
                'Hasilnya lebih defensible — ada logika poin yang bisa dijelaskan ke karyawan',
              ].map((item) => (
                <li
                  key={item}
                  className="text-body-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--sp-2)',
                    color: 'var(--text-2)',
                    marginBottom: 'var(--sp-2)',
                  }}
                >
                  <Check
                    size={14}
                    color="var(--accent-b)"
                    style={{ marginTop: '2px', flexShrink: 0 }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ flex: 1 }} />

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--sp-2)',
                background: 'var(--accent-b-dim)',
                color: 'var(--accent-b)',
                border: '1px solid rgba(124,92,252,0.25)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                padding: '10px 18px',
                borderRadius: 'var(--radius)',
                width: '100%',
                marginTop: 'var(--sp-4)',
              }}
            >
              Mulai dengan Metode Ini →
            </div>
          </Link>
        </section>

        {/* Privacy notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--sp-2)',
            paddingBottom: 'var(--sp-16)',
          }}
        >
          <Lock size={12} color="var(--accent)" />
          <span className="text-body-sm" style={{ color: 'var(--text-3)' }}>
            Semua kalkulasi berjalan di browser kamu. Tidak ada data yang dikirim ke server.
          </span>
        </div>
      </div>
    </main>
  )
}
