# UX & Fitur — Web Struktur dan Skala Upah

Dokumen ini mendefinisikan flow, copy, dan output untuk web kalkulator struktur & skala upah (Metode A & Metode B). Logika hitung tetap mengacu ke `metode-a.md`, `metode-b.md`, dan `poin-faktor.md` — dokumen ini hanya mengatur UX, input/output, dan keputusan produk yang tidak diatur di file metode.

---

## 1. Landing Page — Pilih Metode

User harus memilih salah satu dari dua metode. Tampilkan penjelasan singkat berbahasa awam untuk membantu user memilih.

**Metode A — "Berdasarkan Data Gaji yang Sudah Ada"**
- Penjelasan: "Cocok kalau kamu sudah punya data gaji karyawan saat ini, dan mau menyusun ulang struktur golongan gaji berdasarkan data tersebut."
- Cocok untuk: perusahaan yang ingin merapikan struktur gaji dari data existing tanpa perlu menilai bobot/poin tiap jabatan.

**Metode B — "Berdasarkan Bobot/Poin Jabatan"**
- Penjelasan: "Cocok kalau kamu mau menyusun gaji berdasarkan seberapa besar tanggung jawab, keahlian, dan beban kerja tiap jabatan (bukan dari gaji yang sedang berjalan)."
- Cocok untuk: perusahaan yang ingin struktur gaji yang lebih "adil" berbasis bobot jabatan, atau sedang membangun struktur gaji dari nol.

Tidak ada rekomendasi otomatis — keputusan akhir di tangan user berdasarkan penjelasan di atas.

---

## 2. Flow Metode A

### 2.1 Input Data

User pilih salah satu:

**a) Input Manual**
- Form tabel dengan kolom: No, Nama, Jabatan, Gaji.
- Bisa tambah/hapus baris secara dinamis.
- Cocok untuk jumlah karyawan sedikit atau quick check.

**b) Upload Excel**
- Sediakan template Excel yang bisa didownload, dengan kolom: No, Nama, Jabatan, Gaji.
- User isi template, lalu upload.
- Validasi saat upload:
  - Kolom wajib tidak boleh kosong.
  - Gaji harus berupa angka > 0.
  - Tidak boleh ada baris duplikat (nama + jabatan sama persis) — beri warning, bukan block, karena bisa jadi memang ada 2 orang nama sama.

### 2.2 Tentukan Jumlah Golongan

- User input jumlah golongan jabatan yang diinginkan.
- Bantuan penjelasan awam: "Golongan adalah pengelompokan level jabatan, misalnya: Staff, Senior, Supervisor, Manager, Director = 5 golongan. Biasanya 1 golongan setara 1 level karir."
- Sistem memberi **saran otomatis**: hitung jumlah jabatan unik dari data yang diinput/upload, tampilkan sebagai saran default (user tetap bisa ubah).

### 2.3 Tentukan Rentang (%) per Golongan

- Default: 20% untuk semua golongan.
- User bisa edit rentang per golongan secara individual (boleh beda-beda tiap golongan).
- Penjelasan awam disertai **simulasi langsung**:
  - Tampilkan teks: "Rentang menentukan seberapa lebar jarak gaji terkecil dan terbesar dalam 1 golongan. Semakin besar rentang, semakin lebar jarak gaji dalam golongan yang sama."
  - Tampilkan contoh hitung real-time berdasarkan midpoint golongan tersebut: "Contoh: kalau gaji tengah golongan ini Rp10.000.000 dan rentang 20%, maka gaji terkecil ≈ Rp9.090.909 dan gaji terbesar ≈ Rp10.909.091."
  - Tambahkan catatan benchmark: "Rentang 20%–30% umum dipakai. Golongan yang lebih tinggi/senior biasanya punya rentang lebih lebar karena variasi tanggung jawab lebih besar."

### 2.4 Generate

Tombol "Buat Struktur Gaji Baru" memproses data sesuai `metode-a.md` (urutkan gaji → kelompokkan golongan → hitung midpoint tiap golongan dengan rumus garis lurus → hitung Min/Maks tiap golongan dari rentang).

### 2.5 Output

**Tabel 1 — Struktur Golongan Baru**

| Golongan | Rentang (%) | Min | Mid | Maks |
|---|---|---|---|---|

**Tabel 2 — Detail per Karyawan**

| No | Nama | Jabatan | Golongan | Gaji Lama | Min Golongan | Mid Golongan | Maks Golongan | Gap vs Min (Rp) | Gap vs Min (%) | Gap vs Mid (Rp) | Gap vs Mid (%) | Gap vs Maks (Rp) | Gap vs Maks (%) |

Definisi gap:
- Gap vs Min/Mid/Maks = Gaji Lama − nilai pembanding (Rp), dan (Gaji Lama − nilai pembanding) ÷ nilai pembanding × 100% (%).
- Gap negatif = gaji lama di bawah nilai pembanding. Gap positif = di atas.

**Tidak ada kolom "Gaji Baru" tunggal.** Tool tidak menentukan ulang gaji individu — hanya menunjukkan posisi gaji lama relatif terhadap struktur baru. Keputusan penyesuaian gaji ada di HR.

**Tidak ada bagian summary/total.**

### 2.6 Indikator Visual (Web & Excel)

Warna pada kolom Gap vs Min dan Gap vs Maks:
- Gap vs Min < 0 → **merah** (gaji di bawah minimum standar baru / underpaid).
- Gap vs Min ≥ 0 dan Gap vs Maks ≤ 0 → **hijau** (gaji dalam rentang wajar).
- Gap vs Maks > 0 → **kuning** (gaji di atas maksimum standar baru / perlu direview).

### 2.7 Edit Setelah Hasil Muncul

- User bisa mengubah rentang (%) per golongan, dan tabel hasil (1 & 2) re-calculate secara real-time.

### 2.8 Export

- Tombol "Download Excel" — satu file dengan 2 sheet:
  - Sheet "Struktur Golongan" (Tabel 1)
  - Sheet "Detail Karyawan" (Tabel 2, lengkap semua kolom termasuk gap nominal & %, dengan conditional formatting warna sesuai 2.6)
- Format angka: Rupiah dengan thousand separator, persen dengan 1 desimal.
- Header row di-freeze.
- Tidak ada export PDF.

---

## 3. Flow Metode B

### 3.1 Pertanyaan Awal: Sudah Punya Poin Jabatan?

Tampilkan penjelasan awam sebelum bertanya:
> "Poin jabatan adalah angka yang menggambarkan 'bobot' atau 'berat' suatu jabatan, berdasarkan tanggung jawab, keahlian, dan faktor lain. Semakin besar bobot jabatannya, semakin besar poinnya. Kalau perusahaan kamu sudah pernah menghitung ini, pilih 'Sudah Punya'. Kalau belum, pilih 'Belum, Bantu Saya', dan tool ini akan membantu menghitungnya."

Pilihan:
- **Sudah Punya Poin Jabatan** → lanjut ke 3.2
- **Belum, Bantu Saya** → lanjut ke 3.5 (Poin Faktor)

### 3.2 Input Poin Jabatan (Sudah Punya)

User pilih:

**a) Input Manual**
- Form tabel: Jabatan, Poin.
- Bisa tambah/hapus baris.

**b) Upload Excel**
- Template downloadable dengan kolom: Jabatan, Poin.
- Validasi: Poin harus angka > 0, tidak ada jabatan duplikat.

Setelah data poin masuk, lanjut ke input data karyawan (lihat 3.3).

### 3.3 Input Data Karyawan

- Sama seperti Metode A: input manual atau upload Excel, kolom: No, Nama, Jabatan, Gaji.
- Setiap "Jabatan" pada data karyawan harus match dengan "Jabatan" pada data poin (3.2). Jika tidak match, tampilkan warning dan minta user mencocokkan/memperbaiki.

### 3.4 Tentukan Titik Terendah & Tertinggi, serta Min/Mid/Maks %

**Titik Terendah & Tertinggi (otomatis):**
- Sistem **auto-detect** dari data poin (3.2): jabatan dengan poin terkecil = Titik Terendah (P₁), jabatan dengan poin terbesar = Titik Tertinggi (P₂).
- Tampilkan ke user: "Titik terendah: [Nama Jabatan] (Poin: X). Titik tertinggi: [Nama Jabatan] (Poin: Y)."
- Penjelasan awam: "Titik terendah dan tertinggi diambil dari jabatan dengan poin paling kecil dan paling besar di perusahaan kamu — bukan dari gaji tertinggi/terendah."
- User **wajib mengisi gaji (U₁ dan U₂)** untuk kedua jabatan tersebut — ini adalah acuan/patokan gaji yang akan dipakai sistem untuk menghitung gaji jabatan lain.
  - Jika jabatan tersebut ada di data karyawan (3.3) dan punya gaji, sistem bisa pre-fill nilai ini dari rata-rata/nilai gaji di data — tapi user tetap bisa override manual.
- User bisa override pilihan titik terendah/tertinggi secara manual jika diperlukan (dropdown pilih jabatan lain), namun default mengikuti hasil auto-detect.

**Min/Mid/Maks (%):**
- Default: Min 80%, Mid 100%, Maks 120%.
- Penjelasan awam:
  > "Mid (100%) adalah gaji standar untuk jabatan tersebut. Min (80%) adalah gaji untuk karyawan yang baru/junior di jabatan itu. Maks (120%) adalah gaji untuk karyawan paling senior/berpengalaman di jabatan yang sama. Persentase ini bisa diubah sesuai kebijakan perusahaan — semakin lebar jaraknya, semakin besar perbedaan gaji antara karyawan baru dan senior di jabatan yang sama."
- User bisa edit ketiga persentase ini (Min, Mid selalu 100% fixed sebagai acuan, Maks bisa diedit; Min juga bisa diedit).

### 3.5 Poin Faktor (Belum Punya Poin Jabatan)

Jika user pilih "Belum, Bantu Saya":

**a) Setup Faktor**
- Tampilkan daftar faktor default yang bisa diedit (nama faktor & poin maksimal), contoh default:

| Faktor | Poin Maksimal |
|---|---|
| Tanggung Jawab | 300 |
| Keahlian | 250 |
| Usaha | 200 |
| Lingkungan Kerja | 150 |

(Total contoh: 900 — ditampilkan sebagai referensi, bukan aturan baku. User bebas ubah nama faktor, jumlah faktor, dan poin maksimal masing-masing.)

- User bisa tambah/hapus faktor, ubah nama, ubah poin maksimal.

**b) Input Daftar Jabatan**
- User input daftar jabatan (manual atau upload Excel template dengan kolom: Jabatan, lalu kolom per faktor sesuai setup di 3.5a).

**c) Isi Poin per Jabatan per Faktor**
- Untuk tiap jabatan, user isi poin di setiap faktor (validasi: poin ≤ poin maksimal faktor tersebut).
- Sistem otomatis menjumlahkan Total Poin per jabatan.

**d) Preview Ranking**
- Tampilkan tabel jabatan terurut dari Total Poin terkecil ke terbesar, untuk sanity-check user sebelum lanjut.
- User bisa kembali edit poin jika hasil ranking tidak sesuai ekspektasi.

**e) Lanjut**
- Total Poin per jabatan dari step ini menjadi input poin jabatan (sama seperti 3.2), lanjut ke 3.3 dan 3.4.

### 3.6 Generate

Tombol "Buat Struktur Gaji Baru" memproses sesuai `metode-b.md`:
- Hitung a (gradien) dan b (konstanta) dari titik terendah & tertinggi (P₁,U₁) dan (P₂,U₂).
- Hitung Y = aX + b untuk setiap jabatan (X = poin jabatan).
- Hitung Min = Y × Min%, Mid = Y, Maks = Y × Maks%.

### 3.7 Output

**Tabel 1 — Struktur Gaji per Jabatan**

| Jabatan | Poin | Min | Mid (Y) | Maks |
|---|---|---|---|---|

**Tabel 2 — Detail per Karyawan**

| No | Nama | Jabatan | Poin Jabatan | Gaji Lama | Min Jabatan | Mid Jabatan | Maks Jabatan | Gap vs Min (Rp) | Gap vs Min (%) | Gap vs Mid (Rp) | Gap vs Mid (%) | Gap vs Maks (Rp) | Gap vs Maks (%) |

Definisi gap sama seperti Metode A (lihat 2.5).

**Tidak ada kolom "Gaji Baru" tunggal. Tidak ada summary/total.**

### 3.8 Indikator Visual

Sama seperti Metode A (2.6): merah/hijau/kuning berdasarkan Gap vs Min dan Gap vs Maks.

### 3.9 Edit Setelah Hasil Muncul

User bisa mengubah:
- Titik terendah & tertinggi (pilihan jabatan, dan nilai U₁/U₂)
- Min % dan Maks %

Tabel hasil (1 & 2) re-calculate secara real-time setiap ada perubahan.

### 3.10 Export

- Tombol "Download Excel" — file dengan sheet:
  - Sheet "Struktur Gaji per Jabatan" (Tabel 1)
  - Sheet "Detail Karyawan" (Tabel 2, dengan conditional formatting warna)
  - Jika user melalui jalur Poin Faktor (3.5): tambahan sheet "Detail Poin Faktor" (tabel jabatan x faktor x total poin, untuk dokumentasi/transparansi).
- Format angka & header row sama seperti Metode A (2.8).
- Tidak ada export PDF.

---

## 4. Prinsip Umum (Berlaku untuk A & B)

1. **Tidak ada penentuan "gaji baru" tunggal per karyawan.** Output selalu berupa struktur (Min/Mid/Maks per golongan atau per jabatan) + gap gaji lama terhadap ketiganya. Keputusan penyesuaian gaji individu sepenuhnya di tangan HR.
2. **Privacy:** semua kalkulasi dilakukan di sisi client (browser). Tidak ada data gaji/karyawan yang dikirim atau disimpan di server. Tampilkan disclaimer ini di halaman input data.
3. **Validasi data** dilakukan saat upload Excel maupun input manual, dengan warning yang jelas (bukan silent error).
4. **Semua perubahan input setelah hasil muncul** (rentang %, titik B, Min/Maks %) memicu re-calculate real-time tanpa perlu klik ulang tombol generate.
5. **Export hanya Excel**, tidak ada PDF. File Excel sudah diformat (angka, warna, freeze header) agar siap pakai tanpa edit tambahan.
