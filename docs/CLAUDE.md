# CLAUDE.md — Index GajiGrid

File ini adalah index. Baca **hanya** file yang relevan dengan topik yang sedang dibahas — jangan baca semua file sekaligus, supaya hemat token.

Semua file referensi ada di `docs/`.

## Daftar File

| Topik dibahas | Baca file |
|---|---|
| Metode dua titik berbasis data gaji existing (urutkan gaji, golongan, midpoint, rumus garis lurus dari upah aktual) | `docs/metode-a.md` |
| Metode dua titik berbasis sistem poin jabatan (Min Point, Max Point, rumus Y = aX + b) | `docs/metode-b.md` |
| Cara menentukan nilai poin per jabatan (faktor: tanggung jawab, keahlian, usaha, lingkungan kerja, dll) | `docs/poin-faktor.md` |
| UX, flow, fitur, input/output, dan keputusan produk untuk web kalkulator (landing page, form, validasi, export, dll) | `docs/ux-fitur.md` |
| Keputusan teknis: arsitektur, folder structure, naming, testing, error handling, privacy | `docs/engineering-guidelines-gajigrid.md` |
| Git workflow, CI, deploy, branch strategy, self-review | `docs/ci-cd-gajigrid.md` |
| Visual: warna, tipografi, spacing, komponen UI | `docs/design-system.md` |
| Referensi visual tiap layar/screen | `docs/Wireframe.html` |

## Hubungan Antar Metode

- **Metode A**: berdiri sendiri, tidak butuh file lain. Input = data gaji existing per karyawan.
- **Metode B**: butuh Nilai Jabatan (Point) sebagai input. Jika user belum punya nilai point per jabatan, rujuk ke `poin-faktor.md` terlebih dahulu.
- **Poin Faktor**: output-nya (Total Poin per jabatan) menjadi input untuk `metode-b.md`.
- **UX & Fitur**: mengatur bagaimana ketiga metode di atas diimplementasikan sebagai produk web (flow, copy, validasi, export). Logika hitung tetap mengacu ke `metode-a.md`/`metode-b.md`/`poin-faktor.md`; `ux-fitur.md` tidak menambah/mengubah rumus.
- **Engineering Guidelines & CI/CD**: aturan teknis & workflow. Kalau ada konflik soal flow/fitur, `ux-fitur.md` menang. Untuk keputusan teknis/kode, `engineering-guidelines-gajigrid.md` menang.
- **Design System & Wireframe**: aturan & referensi visual. Tidak menambah/mengubah flow atau rumus — hanya styling & layout.

## Aturan Baca File (Hemat Token)

Pilih hanya yang relevan, berdasarkan jenis task:

- **Hanya tentang Metode A** → `docs/metode-a.md` saja (+ `docs/ux-fitur.md` §2 kalau soal flow/UI).
- **Metode B tanpa soal poin jabatan** → `docs/metode-b.md` saja (+ `docs/ux-fitur.md` §3 kalau soal flow/UI).
- **Metode B dan user belum punya poin, atau soal cara menentukan poin** → `docs/metode-b.md` + `docs/poin-faktor.md` (+ `docs/ux-fitur.md` §3.5 kalau soal flow/UI).
- **UX, flow, tampilan, fitur web, validasi input, atau export** → `docs/ux-fitur.md` (dan file metode terkait jika perlu cek rumus).
- **Nulis/edit kode (komponen, struktur folder, state, testing, error handling, privacy)** → `docs/engineering-guidelines-gajigrid.md` (+ file metode/ux-fitur terkait fitur yang dikerjakan).
- **Git, branch, PR, CI, deploy** → `docs/ci-cd-gajigrid.md` saja.
- **Styling, warna, komponen UI, layout** → `docs/design-system.md` (+ `docs/Wireframe.html` untuk referensi visual layar terkait).
- **Tidak ada metode yang ditambah, dikurang, atau dikarang** di luar isi file masing-masing.

---

## Rencana Sprint

Development dibagi **6 sprint**. Tiap sprint = 1 PR besar (atau beberapa PR kecil bertahap), ikuti workflow `docs/ci-cd-gajigrid.md`. Sebelum mulai sprint, baca file yang direferensikan di sprint tersebut saja.

### Sprint 0 — Scaffold & Setup Project

**Baca:** `docs/engineering-guidelines-gajigrid.md` §1, §2, §3 · `docs/ci-cd-gajigrid.md` (semua) · `docs/design-system.md` §1–§5

**User Story:**
- Sebagai developer, gue butuh project Next.js yang sudah terkonfigurasi sesuai engineering guidelines, supaya semua sprint berikutnya tinggal nambah fitur tanpa setup ulang.

**Scope:**
- Init Next.js 15 (App Router) + TypeScript + Tailwind.
- Setup folder structure sesuai `engineering-guidelines-gajigrid.md` §2 (`app/`, `features/`, `features/shared/`).
- Setup CSS variables/design tokens dari `design-system.md` §1–§5 di `globals.css`.
- Setup ESLint + Prettier + Husky + lint-staged + commitlint.
- Setup `.nvmrc`, `.gitignore`, `package-lock.json`.
- Setup Vitest.
- Setup GitHub Actions `ci.yml` sesuai `ci-cd-gajigrid.md` §3.4.
- Connect repo ke Vercel, pastikan deploy default page sukses.
- Komponen shared dasar (kosong/skeleton): `Button`, `Card`, `Badge`, `Input`.

**DoD:**
- [ ] `npm run dev` jalan tanpa error.
- [ ] `npm run build` sukses.
- [ ] CI (`tsc`, `eslint`, `prettier`, `vitest`, `build`) semua green di PR pertama.
- [ ] Vercel Preview Deployment muncul di PR dan bisa diakses.
- [ ] Design tokens dari `design-system.md` §1–§5 sudah jadi CSS variables, terverifikasi lewat 1 halaman test sederhana.
- [ ] Struktur folder sesuai `engineering-guidelines-gajigrid.md` §2.
- [ ] Self-review checklist (`engineering-guidelines-gajigrid.md` §11) dijalankan.

---

### Sprint 1 — Landing Page & Shell Navigasi

**Baca:** `docs/ux-fitur.md` §1 · `docs/design-system.md` §6, §10, §11 · `docs/Wireframe.html` (artboard Landing)

**User Story:**
- Sebagai HR, gue mau lihat penjelasan singkat soal Metode A vs Metode B di landing page, supaya gue bisa pilih metode yang sesuai kebutuhan gue tanpa bingung.

**Scope:**
- Halaman `/` (landing): hero, penjelasan Metode A & Metode B (copy dari `ux-fitur.md` §1), 2 card pilihan metode.
- Komponen `Navbar`, `Stepper` (dasar, belum dipakai aktif), `PrivacyNotice`.
- Routing dasar: klik "Mulai dengan Metode A" → `/metode-a` (placeholder page), klik Metode B → `/metode-b` (placeholder page).

**DoD:**
- [ ] Landing page sesuai layout & copy `ux-fitur.md` §1 dan visual `design-system.md`/`Wireframe.html`.
- [ ] Navigasi ke `/metode-a` dan `/metode-b` (boleh placeholder kosong) berfungsi.
- [ ] Privacy notice tampil sesuai `design-system.md` §7.10/§12.
- [ ] Responsive minimal di breakpoint desktop 1280px+ dan tablet 768px (`design-system.md` §6.4).
- [ ] CI green, self-review checklist dijalankan.

---

### Sprint 2 — Metode A (Input Data → Konfigurasi → Hasil)

**Baca:** `docs/metode-a.md` (semua) · `docs/ux-fitur.md` §2 (semua) · `docs/engineering-guidelines-gajigrid.md` §1.2, §4, §5 · `docs/design-system.md` §7, §8.2, §8.3 · `docs/Wireframe.html` (artboard A·1–A·3)

**User Story:**
- Sebagai HR, gue mau input data gaji karyawan (manual atau upload Excel), atur jumlah golongan & rentang %, lalu lihat struktur gaji baru beserta gap tiap karyawan terhadap struktur tersebut — supaya gue tahu siapa yang underpaid/overpaid.

**Scope:**
- `features/metode-a/`: Context + reducer, 3 step (`InputDataStep`, `KonfigurasiStep`, `HasilStep`).
- Input manual: tabel dinamis (tambah/hapus baris), kolom No/Nama/Jabatan/Gaji.
- Upload Excel: template download + parse + validasi (`ux-fitur.md` §2.1b).
- Step konfigurasi: input jumlah golongan (dengan saran otomatis), rentang % per golongan (default 20%) + simulasi real-time (`ux-fitur.md` §2.2–2.3).
- Implementasi rumus `metode-a.md` di `metodeA.utils.ts` (pure functions, full test coverage sesuai `engineering-guidelines-gajigrid.md` §6).
- Fungsi gap & `getGapStatus` di `shared/utils/gap.ts`.
- Output: Tabel 1 (Struktur Golongan) + Tabel 2 (Detail Karyawan dengan semua kolom gap, warna sesuai `ux-fitur.md` §2.6).
- Edit rentang % setelah hasil muncul → re-calculate real-time (debounce 300ms).
- Export Excel (2 sheet, conditional formatting, format Rupiah/persen, freeze header) — `shared/utils/excelExport.ts`.

**DoD:**
- [ ] Semua rumus `metode-a.md` punya unit test happy/empty/boundary, pass.
- [ ] Validasi upload Excel sesuai `ux-fitur.md` §2.1b (warning untuk duplikat, bukan block).
- [ ] Saran jumlah golongan otomatis dari jabatan unik berfungsi.
- [ ] Simulasi rentang % real-time sesuai contoh di `ux-fitur.md` §2.3.
- [ ] Tabel 1 & 2 sesuai struktur kolom `ux-fitur.md` §2.5, warna sesuai §2.6.
- [ ] Edit rentang % setelah hasil → tabel re-calculate tanpa reload (debounce 300ms).
- [ ] Export Excel sesuai `ux-fitur.md` §2.8 (2 sheet, formatting, freeze header, conditional formatting warna).
- [ ] Tidak ada network call yang membawa data form (cek network tab, `ci-cd-gajigrid.md` §7).
- [ ] CI green, self-review checklist dijalankan.

---

### Sprint 3 — Metode B (Sudah Punya Poin Jabatan)

**Baca:** `docs/metode-b.md` (semua) · `docs/ux-fitur.md` §3.1–3.4, §3.6–3.10 · `docs/engineering-guidelines-gajigrid.md` §1.2, §4, §5 · `docs/design-system.md` §7, §8.2, §8.3 · `docs/Wireframe.html` (artboard B·0, B·2, B·3)

**User Story:**
- Sebagai HR yang sudah punya data poin jabatan, gue mau input poin per jabatan + data karyawan, tentukan titik referensi gaji & persentase Min/Maks, lalu lihat struktur gaji per jabatan beserta gap tiap karyawan.

**Scope:**
- `features/metode-b/`: Context + reducer, step branch (`BBranch`), `PoinJabatanStep`, `TitikDanPersenStep`, `HasilStep`.
- Branch awal: "Sudah Punya Poin" vs "Belum, Bantu Saya" (`ux-fitur.md` §3.1) — jika "Belum" → arahkan ke Sprint 4 flow.
- Input poin jabatan (manual/upload Excel + template) sesuai `ux-fitur.md` §3.2.
- Input data karyawan (reuse pattern dari Metode A) + validasi match jabatan vs data poin (`ux-fitur.md` §3.3).
- Auto-detect titik terendah/tertinggi dari data poin (pure function + test, `engineering-guidelines-gajigrid.md` §4) + override manual.
- Input U₁/U₂ (dengan pre-fill dari data karyawan jika ada) + Min/Mid/Maks % (default 80/100/120).
- Implementasi rumus `metode-b.md` di `metodeB.utils.ts` (a, b, Y=aX+b, Min/Mid/Maks).
- Output Tabel 1 (Struktur Gaji per Jabatan) + Tabel 2 (Detail Karyawan, gap, warna) sesuai `ux-fitur.md` §3.7–3.8.
- Edit titik & persentase setelah hasil → re-calculate real-time.
- Export Excel sesuai `ux-fitur.md` §3.10 (tanpa sheet Poin Faktor — itu Sprint 4).

**DoD:**
- [ ] Semua rumus `metode-b.md` (a, b, Y=aX+b, Min/Mid/Maks) punya unit test happy/empty/boundary (termasuk kasus semua poin sama).
- [ ] Auto-detect titik terendah/tertinggi punya test: 1 jabatan, semua poin sama, poin duplikat di posisi min/max.
- [ ] Validasi jabatan data karyawan vs data poin — mismatch tampil sebagai warning yang jelas.
- [ ] Penjelasan awam titik B & Min/Mid/Maks % tampil sesuai `ux-fitur.md` §3.4.
- [ ] Tabel 1 & 2 sesuai `ux-fitur.md` §3.7, warna §3.8.
- [ ] Edit titik & Min/Maks % setelah hasil → re-calculate real-time.
- [ ] Export Excel sesuai `ux-fitur.md` §3.10 (tanpa sheet Poin Faktor).
- [ ] Tidak ada network call yang membawa data form.
- [ ] CI green, self-review checklist dijalankan.

---

### Sprint 4 — Poin Faktor (Belum Punya Poin Jabatan)

**Baca:** `docs/poin-faktor.md` (semua) · `docs/ux-fitur.md` §3.5 · `docs/engineering-guidelines-gajigrid.md` §1.2, §4, §5 · `docs/design-system.md` §7, §8.2 · `docs/Wireframe.html` (artboard B·1)

**User Story:**
- Sebagai HR yang belum punya poin jabatan, gue mau setup faktor penilaian, isi poin per jabatan per faktor, lihat preview ranking, lalu lanjut ke Metode B menggunakan total poin yang dihasilkan.

**Scope:**
- `features/poin-faktor/`: Context + reducer, step `SetupFaktorStep`, `InputJabatanStep`, `IsiPoinStep`, `PreviewRankingStep`.
- Setup faktor: daftar default (`ux-fitur.md` §3.5a) yang bisa diedit/tambah/hapus.
- Input daftar jabatan (manual/upload Excel) sesuai struktur faktor yang disetup.
- Isi poin per jabatan per faktor + validasi poin ≤ poin maksimal faktor (`poin-faktor.md`).
- Hitung Total Poin otomatis (`poinFaktor.utils.ts` + test).
- Preview ranking jabatan (urut Total Poin terkecil-terbesar), bisa kembali edit.
- Handoff: Total Poin → masuk sebagai data poin jabatan ke flow Metode B (Sprint 3), lanjut ke `PoinJabatanStep`/`TitikDanPersenStep`.
- Tambahan sheet "Detail Poin Faktor" di export Excel Metode B (`ux-fitur.md` §3.10) — update `excelExport`/Metode B export function.

**DoD:**
- [ ] Rumus total poin & validasi poin ≤ maks faktor punya unit test happy/empty/boundary.
- [ ] Setup faktor default sesuai `ux-fitur.md` §3.5a, bisa diedit/tambah/hapus.
- [ ] Validasi poin per jabatan per faktor (tidak boleh > maks faktor) tampil sebagai error jelas.
- [ ] Preview ranking tampil terurut, user bisa kembali edit poin.
- [ ] Handoff total poin ke flow Metode B berjalan tanpa input ulang data poin.
- [ ] Sheet "Detail Poin Faktor" muncul di export Excel ketika user melalui jalur ini.
- [ ] Tidak ada network call yang membawa data form.
- [ ] CI green, self-review checklist dijalankan.

---

### Sprint 5 — Polish, Validasi Lintas-Flow, Privacy Audit

**Baca:** `docs/engineering-guidelines-gajigrid.md` (semua) · `docs/ci-cd-gajigrid.md` §7 · `docs/ux-fitur.md` §4 · `docs/design-system.md` §9, §13

**User Story:**
- Sebagai HR, gue mau seluruh flow (A, B, Poin Faktor) terasa konsisten, error message-nya jelas, dan gue yakin data gaji gue aman — supaya gue percaya pakai tool ini.

**Scope:**
- Refactor meso lintas-flow: ekstrak pattern berulang ≥3x ke `shared/` (misal step navigation/wizard, `engineering-guidelines-gajigrid.md` §10).
- Review semua error message → bahasa awam sesuai `design-system.md` §11.2.
- Motion/transition sesuai `design-system.md` §9 (step transition, recalculate, reduced-motion).
- Privacy audit penuh: pastikan tidak ada satu pun network call yang membawa data form di seluruh flow (`engineering-guidelines-gajigrid.md` §9) — cek network tab di semua step.
- Cross-browser/responsive check (desktop 1280px+, tablet 768px).
- Full self-review checklist (`engineering-guidelines-gajigrid.md` §11) untuk seluruh codebase.
- Cleanup dead code, file >200 baris, function >20 baris (refactor meso final).

**DoD:**
- [ ] Privacy audit: 0 network call membawa data karyawan/gaji/poin di semua flow.
- [ ] Semua error message sesuai tone `design-system.md` §11.2 (format `[Lokasi] — [Masalah]. [Solusi opsional]`).
- [ ] Tidak ada file >200 baris, function >20 baris, `any`, magic number tersisa.
- [ ] Motion/transition & `prefers-reduced-motion` berfungsi sesuai `design-system.md` §9.
- [ ] Responsive check pass di desktop & tablet untuk semua halaman.
- [ ] Full self-review checklist `engineering-guidelines-gajigrid.md` §11 — semua tercentang.
- [ ] CI green untuk PR final sprint ini.
