# GajiGrid — Engineering Guidelines

**Version:** 1.0
**Status:** Active
**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + React Context/useReducer + SheetJS (xlsx) · deploy Vercel

---

## 0. Konteks & Prinsip Pemandu

GajiGrid adalah **web kalkulator struktur & skala upah** (Metode A & Metode B), gratis/tanpa login, **client-side only**. Tidak ada database, tidak ada akun, tidak ada data yang dipersist lintas-session.

Tiga batasan yang nge-drive keputusan teknis:

1. **Privacy-first.** Data gaji karyawan adalah data sensitif. Semua kalkulasi terjadi di browser. Tidak ada payload data karyawan/gaji yang dikirim ke server, di-log, atau disimpan. (Lihat §9.)
2. **Less maintenance.** Tidak ada akun, tidak ada backend stateful, tidak ada job/cron. Static-leaning Next.js app di Vercel — kalau tidak disentuh 6 bulan, tetap jalan.
3. **Single-session, no persistence.** Refresh = mulai dari awal. Tidak butuh IndexedDB/localStorage untuk data form. (Bedanya dengan SISA: SISA local-first dengan data permanen device; GajiGrid sesi sekali pakai.)

> 📌 Dokumen ini melengkapi `claude.md` (index produk) dan `ux-fitur.md` (source of truth flow/fitur). Kalau ada konflik soal flow/fitur, **`ux-fitur.md` menang**. Dokumen ini menang untuk keputusan teknis/kode.

---

## 1. Arsitektur Keputusan

### 1.1 Hosting — Vercel, Next.js App Router

Deploy sebagai Next.js app ke Vercel. Sebagian besar halaman bisa **static/client component** karena kalkulasi murni di browser. Server Component/Server Action hanya dipakai kalau ada keuntungan jelas (misal generate file Excel besar) — bukan default.

**Kenapa Next.js, bukan Vite SPA?** Routing per-flow (`/metode-a`, `/metode-b`, `/metode-b/poin-faktor`) lebih natural dengan file-based routing. Next.js juga jadi pilihan default modern untuk Vercel — less friction kalau nanti perlu fitur tambahan (OG image, API route ringan, dll).

### 1.2 State — React Context + useReducer per Flow

**Keputusan:** Tidak pakai Zustand atau state management library lain. Setiap flow (Metode A, Metode B, Poin Faktor) punya satu Context + reducer sendiri, scoped ke flow tersebut.

**Kenapa?** State form multi-step (input data → konfigurasi → hasil → edit) adalah state **lokal ke satu flow**, tidak ada kebutuhan share state lintas-fitur seperti SISA (wallet/goal/transaction yang saling terkait). Context+reducer = zero dependency tambahan, cukup untuk kompleksitas ini. Tambah Zustand di sini = abstraksi prematur.

```
features/metode-a/
├── MetodeAFlow.tsx          # provider + step orchestration
├── metodeAReducer.ts        # state shape + actions
├── steps/
│   ├── InputDataStep.tsx
│   ├── KonfigurasiStep.tsx
│   └── HasilStep.tsx
├── metodeA.utils.ts          # pure calculation functions (WAJIB ditest)
└── metodeA.types.ts
```

### 1.3 Excel — SheetJS (xlsx)

**Keputusan:** Pakai `xlsx` (SheetJS) untuk dua arah:
- **Parse upload** (template data karyawan, template poin jabatan) → JS object, divalidasi sebelum dipakai.
- **Generate export** (struktur + detail karyawan, dengan conditional formatting & format angka) → trigger download di client.

**Kenapa client-side, bukan server route?** Privacy (§9) — file gaji karyawan tidak boleh transit ke server. SheetJS cukup mature untuk generate file dengan styling dasar di browser.

### 1.4 Tidak Ada Persistence

Tidak ada localStorage/IndexedDB untuk data form. Refresh halaman = reset flow. Ini disclosure yang **eksplisit ditampilkan ke user** (lihat `ux-fitur.md` §4.2) — bukan bug, tapi keputusan privacy.

Pengecualian: boleh pakai localStorage untuk hal **non-sensitif** murni preferensi UI (misal: tema, bahasa) — tidak untuk data gaji/karyawan/poin.

---

## 2. Folder Structure (Feature-Based)

```
app/
├── (landing)/page.tsx          # pilih Metode A/B
├── metode-a/page.tsx
├── metode-b/page.tsx
├── metode-b/poin-faktor/page.tsx
└── layout.tsx

features/
├── metode-a/                    # lihat §1.2
├── metode-b/
│   ├── steps/
│   │   ├── PoinJabatanStep.tsx
│   │   ├── TitikDanPersenStep.tsx
│   │   └── HasilStep.tsx
│   ├── metodeBReducer.ts
│   ├── metodeB.utils.ts
│   └── metodeB.types.ts
├── poin-faktor/
│   ├── steps/
│   │   ├── SetupFaktorStep.tsx
│   │   ├── InputJabatanStep.tsx
│   │   ├── IsiPoinStep.tsx
│   │   └── PreviewRankingStep.tsx
│   ├── poinFaktorReducer.ts
│   ├── poinFaktor.utils.ts
│   └── poinFaktor.types.ts
└── shared/
    ├── components/              # Button, Table, FileUpload, GapBadge, dll
    ├── utils/                    # formatCurrency, formatPercent, gap calc, excel helpers
    └── types/
```

**Aturan penempatan:**
- Default ke `features/<flow>/`. Promosikan ke `shared/` hanya setelah dipakai ≥2 flow.
- Pure functions (rumus Metode A/B, hitung gap, hitung poin faktor, format angka) selalu di `*.utils.ts`. **Ini wajib ditest** (§6).
- Komponen PascalCase, file lain camelCase. Satu file = satu tanggung jawab.

---

## 3. Naming, Code Quality, TypeScript

### 3.1 Naming
- Komponen `PascalCase` (`HasilStep.tsx`), utility/hook `camelCase` (`calculateGap.ts`, `useMetodeAState.ts`).
- Boolean diawali `is`/`has`/`should` (`isValid`, `hasUploadedFile`).
- Handler diawali `handle` (`handleGenerate`, `handleExport`).
- Constant runtime-tetap `UPPER_SNAKE_CASE` (`DEFAULT_RENTANG_PERSEN`, `DEFAULT_MIN_MID_MAKS`).
- Props suffix `Props`, type union `PascalCase`.

### 3.2 Code Quality (hard limits)
- File maks **200 baris** (test maks 400). Function maks **20 baris**.
- Satu function = satu hal. Kalau deskripsinya butuh "dan", pecah.
- **Return early**, bukan nested if. Maks nesting sehat = 1-2 level.
- **Tidak ada magic number/string.** Nilai bermakna bisnis (default 20%, default 80/100/120%, default poin faktor) → `constants/`.
- **Tidak ada nested ternary.**
- **Tidak ada silent error.** `catch {}` kosong dilarang.

### 3.3 TypeScript
- **Tidak ada `any`.** Belum jelas → type paling masuk akal + `// TODO: confirm type`.
- `interface` untuk object shape (row data, payload), `type` untuk union/computed.
- Union type untuk nilai terbatas (`'metode-a' | 'metode-b'`, `'underpaid' | 'wajar' | 'overpaid'`), **bukan `enum`**.
- Type dipakai ≥2 tempat → `shared/types/` atau `<feature>.types.ts`.

### 3.4 Komentar
Hanya jelaskan **kenapa**, bukan **apa**. Contoh yang benar: kenapa pembulatan tertentu dipakai di rumus, kenapa auto-detect titik B bisa di-override.

---

## 4. Kalkulasi (Inti Produk)

Semua rumus mengacu **persis** ke `metode-a.md`, `metode-b.md`, `poin-faktor.md`. Tidak ada penyesuaian/penambahan rumus di kode tanpa update dokumen tersebut dulu.

- Setiap rumus = pure function di `*.utils.ts`, input/output explicit, tidak menyentuh state/DOM.
- Fungsi gap (vs Min/Mid/Maks, Rp & %) ada di `shared/utils/gap.ts` — dipakai Metode A & B, jadi sejak awal di `shared/`.
- Fungsi kategori warna (`getGapStatus`: `'underpaid' | 'wajar' | 'overpaid'`) juga di `shared/utils/`, dipakai untuk UI badge dan conditional formatting Excel — **satu sumber kebenaran**, jangan duplikasi logic warna di tempat lain.
- Auto-detect titik terendah/tertinggi (Metode B, `ux-fitur.md` §3.4) = pure function: input array `{jabatan, poin}`, output `{min: {...}, max: {...}}`. Ditest dengan kasus: 1 jabatan saja, semua poin sama, poin duplikat di posisi min/max.

---

## 5. Excel — Parse & Generate

### 5.1 Parse (Upload)
- Validasi terjadi **sebelum** data masuk ke state flow: cek kolom wajib, tipe data (angka > 0), duplikat.
- Hasil validasi = `{ valid: T[], errors: ValidationError[] }`. Tampilkan error per-baris ke user, jangan block seluruh upload kalau error cuma di beberapa baris (sesuai `ux-fitur.md` — warning, bukan block, untuk duplikat).
- Parser per template (data karyawan, poin jabatan, poin faktor) = function terpisah di `poinFaktor.utils.ts` / `metodeA.utils.ts` masing-masing, **tidak ada parser generik "tebak kolom"** — kolom template sudah fixed.

### 5.2 Generate (Export)
- Satu helper `shared/utils/excelExport.ts` untuk hal generik (format Rupiah, format persen, freeze header, apply conditional formatting warna berdasarkan `getGapStatus`).
- Tiap flow punya function sendiri yang menyusun sheet-sheet sesuai `ux-fitur.md` (§2.8 untuk Metode A, §3.10 untuk Metode B + Poin Faktor opsional).
- Trigger download via blob di client — tidak lewat server route.

---

## 6. Testing

Mengikuti prinsip happy/empty/boundary.

**WAJIB ditest** (semua di `*.utils.ts`):
- Rumus Metode A (urutan, pengelompokan golongan, midpoint garis lurus, min/maks dari rentang).
- Rumus Metode B (a, b, Y=aX+b, min/mid/maks dari persen).
- Rumus Poin Faktor (total poin, validasi poin ≤ maks faktor).
- Fungsi gap & `getGapStatus`.
- Auto-detect titik terendah/tertinggi.
- Parser & validator Excel (fixture file valid, kosong, kolom hilang, data invalid).

**Tiap fungsi minimal 3 kasus:**
- **Happy:** input normal, beberapa golongan/jabatan.
- **Empty:** 0 karyawan, 1 karyawan, 1 golongan/jabatan saja.
- **Boundary:** semua poin sama (Metode B — gradien jadi 0/undefined, handle eksplisit), gaji lama tepat = Min/Mid/Maks (gap = 0), rentang 0%.

**Tidak perlu ditest:** komponen presentational murni, styling/layout.

**Tooling:** Vitest. Test file di sebelah file yang dites, suffix `.test.ts`.

---

## 7. Async, Linting, Performance, Git

- **Async:** `async/await` only, tidak ada `.then()` chaining. Selalu try/catch — terutama untuk parse file upload (bisa gagal: format salah, corrupt).
- **Linting:** ESLint + Prettier (Next.js default config sebagai basis). Nol warning sebelum commit.
- **Performance:** jangan optimasi prematur. Untuk tabel hasil dengan banyak karyawan, virtualisasi hanya kalau terbukti lag (>500 baris) — di bawah itu render biasa cukup.
- **Git:** commit format `type: deskripsi` (`feat:`, `fix:`, `refactor:`, `chore:`, `test:`). Satu commit = satu perubahan logical. Branch `feature/` & `fix/`. `.gitignore`: `node_modules/`, `.env*`, `.next/`.

---

## 8. Error Handling

- Setiap operasi gagal-able (parse Excel, generate Excel, validasi input) **wajib** ditangani. Tidak ada `catch {}` kosong.
- Pesan ke user dalam bahasa awam, sesuai tone `ux-fitur.md` — contoh: "File Excel tidak sesuai template, cek kembali kolomnya" bukan "TypeError: cannot read property...".
- Log error ke console untuk debug, **tanpa data sensitif** (jangan log isi baris gaji/karyawan — log struktur error & nama kolom yang bermasalah saja).

```typescript
catch (err) {
  console.error('[parseEmployeeExcel] gagal parse file', {
    fileName: file.name,
    error: err instanceof Error ? err.message : err,
    // JANGAN log isi rows
  })
  setError('File Excel tidak sesuai template...')
}
```

---

## 9. Privacy (Wajib Dibaca)

- **Tidak ada network call** yang membawa data karyawan/gaji/poin/jabatan — baik ke API internal maupun third-party (termasuk analytics).
- Kalau ditambah analytics (misal Vercel Analytics untuk page view), pastikan **tidak** ada event yang membawa payload form/file.
- Disclaimer privacy ditampilkan di setiap halaman input data (sesuai `ux-fitur.md` §4.2): "Data tidak dikirim ke server, semua proses di browser kamu."
- Sebelum nambah dependency baru yang butuh kirim data ke luar (CDN font, font analytics, dll) — cek dulu apakah benar-benar perlu.

---

## 10. Dead Code & Refactor

- Hapus dead code, import nganggur, `console.log` debug segera.
- **Refactor mikro** (tiap selesai nulis kode): rename tak deskriptif, pecah function >20 baris.
- **Refactor meso** (tiap selesai 1 step/flow, sebelum commit): review end-to-end, abstrak pola yang muncul ≥3x (misal: ketiga flow punya pattern "step navigation" yang sama → ekstrak ke `shared/components/StepWizard.tsx`), pecah file >200 baris.

---

## 11. Self-Review Checklist (sebelum submit)

- [ ] Tidak ada `any`, magic number/string, nested ternary?
- [ ] Semua operasi gagal-able (parse/generate Excel) punya error handling?
- [ ] Pure function kalkulasi punya test happy/empty/boundary?
- [ ] File ≤200 baris, function ≤20 baris, satu function satu hal?
- [ ] Rumus sesuai persis `metode-a.md`/`metode-b.md`/`poin-faktor.md` — tidak ada penyesuaian liar?
- [ ] Flow/copy/output sesuai `ux-fitur.md` — tidak ada field/kolom yang ditambah/dikurang sendiri?
- [ ] Tidak ada network call yang bawa data karyawan/gaji (§9)?
- [ ] Tidak ada data form yang ke-log?
- [ ] Tidak ada dependency baru yang bisa dihindari?

---

## 12. Instruksi untuk Claude (saat ngoding GajiGrid)

1. Baca dokumen ini bersama `claude.md` dan `ux-fitur.md` sebelum nulis kode. `ux-fitur.md` = source of truth flow & fitur; `metode-a.md`/`metode-b.md`/`poin-faktor.md` = source of truth rumus.
2. Default ke **inline & sederhana**. Tidak ada Zustand, Dexie, PWA, atau library state lain — Context+reducer per flow sudah final.
3. Privacy menang di atas convenience. Kalau ragu apakah sesuatu boleh dikirim ke server/analytics → **jangan**.
4. Rumus tidak boleh "dirapikan" atau "disempurnakan" di luar file metode. Kalau ada ambiguitas rumus, tanya owner — jangan asumsi/improvisasi.
5. Selesai nulis → refactor mikro. Selesai 1 step/flow → refactor meso + self-review checklist.
6. Kalau nemu pelanggaran (file >200 baris, magic number, `any`, dead code) → perbaiki saat itu juga.
7. Kalau ada situasi tidak tercakup dokumen ini → tanya owner, jangan asumsi.

---

_Dokumen ini hidup. Setiap keputusan teknis baru yang tidak terangkut di sini = kandidat update._
