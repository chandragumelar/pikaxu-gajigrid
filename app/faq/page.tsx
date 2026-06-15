import { Lock, Shield, FileSpreadsheet, Calculator, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — GajiGrid by Pikaxu',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--sp-12)' }}>
      <h2
        className="text-heading"
        style={{
          color: 'var(--text-1)',
          marginBottom: 'var(--sp-6)',
          borderBottom: '1px solid var(--border)',
          paddingBottom: 'var(--sp-3)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--sp-6)' }}>
      <p
        className="text-body"
        style={{ color: 'var(--text-1)', fontWeight: 500, marginBottom: 'var(--sp-2)' }}
      >
        {q}
      </p>
      <div className="text-body" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  )
}

function IconRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-4)',
        background: 'var(--bg-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        marginBottom: 'var(--sp-3)',
      }}
    >
      <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }}>{icon}</div>
      <div className="text-body" style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  )
}

export default function FaqPage() {
  return (
    <main>
      <div
        className="container-form"
        style={{ paddingTop: 'var(--sp-16)', paddingBottom: 'var(--sp-24)' }}
      >
        <div style={{ marginBottom: 'var(--sp-12)' }}>
          <h1
            className="text-display-md"
            style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-3)' }}
          >
            FAQ
          </h1>
          <p className="text-body-lg" style={{ color: 'var(--text-2)' }}>
            Pertanyaan yang sering muncul tentang GajiGrid.
          </p>
        </div>

        <Section title="Privasi & Keamanan Data">
          <IconRow icon={<Shield size={18} />}>
            <strong style={{ color: 'var(--text-1)' }}>Data kamu 100% aman.</strong> Semua kalkulasi
            — gaji, jabatan, poin, data karyawan — diproses sepenuhnya di browser kamu. Tidak ada
            yang dikirim ke server kami atau pihak ketiga manapun. Begitu kamu tutup tab, data
            hilang. Kami tidak menyimpan, mencatat, atau memproses data apapun di server.
          </IconRow>
          <IconRow icon={<Lock size={18} />}>
            GajiGrid tidak menggunakan analytics yang membawa payload form atau file. Tidak ada
            event tracking yang menyertakan nama karyawan, nominal gaji, atau data sensitif
            perusahaan.
          </IconRow>

          <QA q="Apakah ada akun atau login yang diperlukan?">
            Tidak. GajiGrid tidak butuh akun. Buka, isi, hitung, ekspor — selesai.
          </QA>
        </Section>

        <Section title="Metode Kalkulasi">
          <QA q="Apa itu Metode Dua Titik dengan Rentang Persentase?">
            Kamu memasukkan data gaji karyawan yang sedang berjalan. Sistem mengidentifikasi rentang
            gaji (terendah hingga tertinggi), lalu mendistribusikan karyawan ke dalam golongan
            secara proporsional. Tiap golongan mendapat <em>midpoint</em> (gaji tengah) yang
            dihitung secara linear. Dari midpoint itu, kamu menentukan rentang persentase — misalnya
            ±20% — yang membentuk batas minimum dan maksimum gaji per golongan.
          </QA>

          <QA q="Apa itu Metode Dua Titik dengan Poin Jabatan?">
            Setiap jabatan diberi poin berdasarkan faktor-faktor seperti tanggung jawab, keahlian,
            usaha, dan lingkungan kerja. Kamu lalu memilih dua jabatan sebagai titik acuan dan
            memasukkan target gajinya. Sistem menarik garis lurus (regresi linear) dari dua titik
            tersebut — menghasilkan rumus Y = aX + b — dan menghitung gaji semua jabatan lain secara
            otomatis dari poin masing-masing.
          </QA>

          <QA q="Metode mana yang lebih baik?">
            Tergantung kebutuhan. Jika kamu sudah punya data gaji dan hanya ingin merapikan struktur
            golongannya, gunakan metode Rentang Persentase — lebih cepat dan tidak perlu menilai
            bobot jabatan. Jika kamu ingin struktur yang mencerminkan bobot pekerjaan secara
            objektif dan bisa dijelaskan ke karyawan, gunakan metode Poin Jabatan — hasilnya lebih
            bisa dipertanggungjawabkan.
          </QA>

          <QA q="Apakah rumus yang digunakan sesuai regulasi?">
            Metode dua titik adalah pendekatan umum dalam manajemen kompensasi, bukan rumus yang
            diwajibkan regulasi. GajiGrid adalah tool kalkulasi, bukan konsultasi HR atau hukum
            ketenagakerjaan. Untuk kepatuhan regulasi, konsultasikan hasil dengan tim HR atau
            konsultan kompensasi.
          </QA>
        </Section>

        <Section title="Penggunaan & Fitur">
          <QA q="Berapa banyak karyawan yang bisa diinput?">
            Tidak ada batas hard. Karena semua berjalan di browser, performa bergantung pada
            perangkat kamu. Untuk ratusan hingga ribuan karyawan, upload Excel lebih praktis
            daripada input manual.
          </QA>

          <IconRow icon={<FileSpreadsheet size={18} />}>
            <strong style={{ color: 'var(--text-1)' }}>Export ke Excel tersedia</strong> di semua
            metode. Hasilnya mencakup tabel struktur gaji per golongan/jabatan dan tabel detail per
            karyawan lengkap dengan analisis gap (selisih gaji terhadap minimum, midpoint, dan
            maksimum golongannya).
          </IconRow>

          <IconRow icon={<Calculator size={18} />}>
            <strong style={{ color: 'var(--text-1)' }}>Kalkulasi bersifat real-time.</strong> Di
            halaman hasil, kamu bisa mengubah parameter (rentang persentase, titik acuan) dan
            hasilnya langsung terupdate tanpa perlu reload.
          </IconRow>

          <QA q="Bisakah saya menyimpan sesi kerja dan melanjutkan nanti?">
            Belum. Setiap sesi dimulai dari awal. Jika ingin menyimpan progress, ekspor ke Excel
            sebelum menutup tab.
          </QA>
        </Section>

        <Section title="Tentang GajiGrid & Pikaxu">
          <QA q="Siapa yang membuat GajiGrid?">
            GajiGrid dibuat oleh <strong style={{ color: 'var(--text-1)' }}>Pikaxu</strong>, sebuah
            studio kecil yang membangun tools produktivitas untuk tim HR dan operasional. GajiGrid
            lahir dari kebutuhan nyata — banyak perusahaan kecil dan menengah yang tidak punya akses
            ke konsultan kompensasi mahal, tapi butuh cara yang terstruktur untuk menyusun gaji.
          </QA>

          <QA q="Apakah GajiGrid gratis selamanya?">
            Saat ini ya, gratis sepenuhnya. Tidak ada biaya tersembunyi, tidak perlu kartu kredit.
          </QA>

          <div
            style={{
              background: 'var(--bg-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--sp-6)',
              marginTop: 'var(--sp-4)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                marginBottom: 'var(--sp-4)',
              }}
            >
              <MessageCircle size={16} color="var(--accent)" />
              <span
                className="text-label"
                style={{
                  color: 'var(--accent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Hubungi Kami
              </span>
            </div>
            <p
              className="text-body"
              style={{ color: 'var(--text-2)', marginBottom: 'var(--sp-4)' }}
            >
              Ada pertanyaan, saran fitur, laporan bug, atau sekadar ingin berbagi feedback? Kami
              senang mendengarnya.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              <a
                href="mailto:hello.chandragumelar@gmail.com"
                className="text-body"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
              >
                hello.chandragumelar@gmail.com
              </a>
              <a
                href="https://x.com/win32_icang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
              >
                @win32_icang di X (Twitter)
              </a>
            </div>
          </div>
        </Section>
      </div>
    </main>
  )
}
