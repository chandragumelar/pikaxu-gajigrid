# Metode B (Metode Dua Titik - Sistem Poin)

Hitung struktur dan skala upah menggunakan langkah-langkah berikut secara berurutan:

1. Tentukan nilai jabatan (point) untuk semua jabatan.
2. Pilih dua titik upah:
   - Titik Rendah (Min Point): jabatan terendah, ditetapkan sebagai Titik 1 — terdiri dari pasangan nilai (P₁, U₁), di mana P₁ = nilai point jabatan terendah dan U₁ = upah pada jabatan tersebut.
   - Titik Tinggi (Max Point): jabatan tertinggi, ditetapkan sebagai Titik 2 — terdiri dari pasangan nilai (P₂, U₂), di mana P₂ = nilai point jabatan tertinggi dan U₂ = upah pada jabatan tersebut.
3. Hitung nilai a (gradien) dan b (konstanta) dari persamaan garis menggunakan rumus:
   - a (gradien) = (U₂ − U₁) ÷ (P₂ − P₁)
   - b (konstanta) = U₁ − (a × P₁)
4. Hitung upah untuk setiap jabatan menggunakan rumus:
   - Upah (Y) = aX + b
   di mana X = nilai jabatan (point) dari jabatan yang dihitung, dan Y = upah (midpoint/100%) untuk jabatan tersebut.
5. Bentuk struktur skala upah dengan menentukan persentase Minimum dan Maksimum terhadap Midpoint (di gambar: Minimum = 80%, Midpoint = 100%, Maksimum = 120%), lalu hitung:
   - Upah Minimum = Y × persentase Minimum
   - Upah Midpoint = Y
   - Upah Maksimum = Y × persentase Maksimum

Keterangan:
- P = Nilai Jabatan (Point)
- U = Upah
- a = Gradien
- b = Konstanta
- X = Nilai Jabatan (Point) yang dihitung
- Y = Upah hasil hitung (Midpoint/100%)

Hasil akhir: tabel struktur skala upah yang memuat, untuk setiap jabatan/golongan: Nilai Jabatan (Point), Upah (Y/Midpoint), Minimum, Midpoint, dan Maksimum.

## Catatan

Metode ini membutuhkan Nilai Jabatan (Point) untuk setiap jabatan sebagai input awal. Jika nilai point belum ditentukan, lihat **poin-faktor.md** untuk metode penentuan poin per jabatan.
