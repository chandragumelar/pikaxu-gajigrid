# GajiGrid — CI/CD

**Version:** 1.0
**Status:** Active
**Stack:** Next.js 15 + TypeScript · GitHub Actions (CI) · Vercel (deploy)

---

## 0. Konteks

GajiGrid adalah **web client-side** (Next.js) deploy ke **Vercel**. Tidak ada akun, tidak ada database, tidak ada license key, tidak ada native build. Setup ini paling sederhana dibanding produk lain:

- **CD = Vercel otomatis.** Push ke `main` → Vercel build & deploy sendiri. Tidak ada pipeline CD manual.
- **CI = cek kualitas kode** sebelum masuk `main`. Satu-satunya yang perlu disetup.
- **Tidak ada:** license/key generator, secret kripto, EAS, store review, version gating, forced update.

Baca bersama `engineering-guidelines-gajigrid.md` untuk aturan koding/testing/commit. Dokumen ini fokus Git workflow + CI + deploy.

> 📌 Selaras prinsip GajiGrid: less maintenance, 0 cost. CI/CD pakai GitHub Actions free tier + Vercel free tier.

---

## 1. Branch Strategy (Solo Dev)

Sama seperti rekomendasi referensi — dua lapis cukup untuk solo dev:

| Branch               | Fungsi                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `main`               | Production. Vercel auto-deploy dari sini. Tidak push langsung — hanya via PR  |
| `feature/nama-fitur` | Satu fitur. Dibuat dari `main`, merge balik via PR                            |
| `fix/nama-bug`       | Satu bug fix. Dibuat dari `main`, merge balik via PR                          |

**Aturan:**
- Tidak push langsung ke `main`, termasuk fix kecil — selalu via PR.
- Branch `feature/`/`fix/` dihapus setelah merge.
- **Vercel Preview Deployment** = staging otomatis per PR, tidak perlu branch `staging`.

> 📌 Kalau nanti ada kontributor lain, baru pertimbangkan `develop`. Untuk sekarang tidak perlu.

---

## 2. Branch Protection (`main`)

Setup di `GitHub → Settings → Branches → Add rule` untuk `main`:

- Require pull request before merging
- Require status checks to pass (CI harus green)
- Tidak require approval (solo dev — diganti self-review §7)
- Do not allow bypassing

**Merge strategy:** Squash and merge untuk semua PR.

---

## 3. CI — GitHub Actions

### 3.1 Kapan jalan

Push ke branch apapun, dan PR ke `main`.

### 3.2 Apa yang dicek

| Step           | Command              | Fail artinya                                  |
| -------------- | -------------------- | ----------------------------------------------- |
| **Install**    | `npm ci`             | Lockfile rusak / dependency tidak tersedia      |
| **TypeScript** | `tsc --noEmit`       | Type error — fix sebelum merge                  |
| **ESLint**     | `eslint .`           | Langgar coding standards                        |
| **Prettier**   | `prettier --check .` | Format tidak konsisten → `prettier --write .`   |
| **Unit Test**  | `vitest run`         | Logic kalkulasi rusak (§6 engineering guidelines) — fix sebelum merge |
| **Build**      | `next build`         | Build gagal — config/import bermasalah          |

> Tidak ada commitlint sebagai CI job terpisah — cukup di-enforce via pre-commit hook (§5), supaya CI tetap ramping. Tidak ada "version check"/store gating — itu native-only.

### 3.3 Runtime

- Runner: `ubuntu-latest`
- Node: lock di `.nvmrc`, sinkron dengan Vercel project settings
- Package manager: **npm**, jangan campur yarn/pnpm
- Lockfile: `package-lock.json` wajib ter-commit. CI pakai `npm ci`
- Cache: `node_modules`, invalidate by hash `package-lock.json`

### 3.4 Contoh Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI
on:
  push:
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint .
      - run: npx prettier --check .
      - run: npx vitest run
      - run: npm run build
```

### 3.5 Aturan CI

- Green = mergeable. Red = tidak boleh merge, kondisi apapun.
- Jangan skip/disable/suppress check untuk lolos.
- Jangan disable test untuk lolos.

---

## 4. CD — Vercel (Otomatis)

| Trigger           | Yang terjadi                                                        |
| ----------------- | --------------------------------------------------------------------- |
| Buka PR ke `main` | Vercel buat **Preview Deployment** — URL unik untuk tes PR (= staging) |
| Merge ke `main`   | Vercel **Production Deployment** otomatis                              |

**Setup sekali (Vercel dashboard):**
- Connect GitHub repo
- Framework preset: **Next.js**
- Build command & output: default Next.js preset (otomatis terdeteksi)
- Node version: samakan dengan `.nvmrc`
- Environment variables: untuk v1 **kemungkinan tidak ada** — tidak ada secret/API key karena semua kalkulasi client-side dan tidak ada integrasi eksternal. Kalau nanti ada (misal analytics key), set di Vercel project settings, jangan hardcode.

**Tidak ada:**
- Pipeline CD manual
- Rollback manual — Vercel "Instant Rollback" 1-klik
- Store review/submit

> 📌 **Rollback:** Vercel → Deployments → pilih deployment lama yang sehat → "Promote to Production".

---

## 5. Pre-commit Hooks

**Tooling:** Husky + lint-staged.

| Hook                  | Yang jalan                                           | Alasan                          |
| --------------------- | ------------------------------------------------------ | --------------------------------- |
| `pre-commit`          | ESLint `--fix` + Prettier pada staged files saja        | Cepat, auto-fix                   |
| `commit-msg`          | commitlint — validasi format commit                     | Enforce conventional commits      |
| `pre-push` (opsional) | `tsc --noEmit` seluruh project                          | Catch type error sebelum push     |

**Tidak di pre-commit:** unit test, build (biar CI).

**Bypass:** `git commit --no-verify` hanya emergency, langsung di-revert.

---

## 6. Commit & PR Format

- Format commit & hard limits koding lihat `engineering-guidelines-gajigrid.md`.
- commitlint di pre-commit hook lokal.
- PR title ikut conventional commits (squash merge → PR title jadi commit message `main`).
- Tipe valid: `feat | fix | refactor | chore | test | docs | perf | ci | build | style`
- Valid: `feat: tambah validasi upload template metode a` · Invalid: `update`, `WIP`, `fix stuff`

---

## 7. Self Code Review (Solo Dev)

1. Buka PR di GitHub web.
2. Cek **Vercel Preview Deployment** — tes flow Metode A, Metode B, Poin Faktor seperti user nyata.
3. **Khusus GajiGrid**: cek tab Network di browser saat tes preview — pastikan tidak ada request yang membawa data form/file Excel (sesuai `engineering-guidelines-gajigrid.md` §9 Privacy). Ini pengecekan privacy, bukan cuma fungsional.
4. Jeda minimal 30 menit dari coding terakhir.
5. Review diff baris per baris.
6. Jalankan self-review checklist (`engineering-guidelines-gajigrid.md` §11).
7. Tulis summary comment: apa yang berubah, kenapa, risiko.

**Aturan:** PR > 200 baris, over-night review sebelum merge.

---

## 8. `.gitignore`

```
# Secrets & environment
.env
.env.local
.env.*.local

# Dependencies & build
node_modules/
.next/
out/

# Test & coverage
coverage/

# Local junk
.DS_Store
*.log
.vscode/
.idea/
```

> Catatan: tidak ada entry khusus license/private key seperti referensi — GajiGrid tidak punya skema lisensi. Kalau ke depan ada kebutuhan secret (misal API key analytics), tambahkan ke `.env*` (sudah tercover) dan jangan pernah hardcode di kode.

---

## 9. Cara Kerja Sehari-hari

```
1. Branch dari main
   git checkout main && git pull
   git checkout -b feature/nama-fitur

2. Kerjakan fitur, commit kecil-kecil (conventional commits)

3. Push
   git push origin feature/nama-fitur

4. CI jalan otomatis — tunggu green
   Vercel buat Preview Deployment — dapat URL tes

5. Buka PR ke main, isi deskripsi + risiko singkat

6. Self code review (§7) — termasuk cek network tab di Vercel preview

7. CI green + self-review beres → squash merge

8. Vercel auto-deploy ke production. Branch feature/ dihapus.
```

---

## 10. Kalau CI Fail

1. Buka GitHub Actions → klik run yang fail → klik step ❌
2. Baca error, fix di local
3. Pastikan pre-commit hook pass sebelum push
4. Push ulang — CI jalan lagi

**Jangan merge PR yang CI-nya merah. Jangan skip CI step untuk lolos.**

---

## 11. Instruksi untuk Claude

1. Pastikan kode tidak bikin TypeScript/ESLint/Prettier error — semua bikin CI fail.
2. Jangan suggest push langsung ke `main` — selalu branch `feature/`/`fix/` + PR.
3. Dependency baru → ingatkan owner konfirmasi dulu (less-maintenance), dan pastikan tidak membawa data form ke server/third-party (privacy, lihat `engineering-guidelines-gajigrid.md` §9).
4. Tidak ada license key, EAS, store, native build — kalau owner menyinggung ini dari referensi produk lain, ingatkan GajiGrid tidak punya skema itu.
5. Deploy = otomatis Vercel saat merge ke `main`. Rollback = Vercel "Promote to Production". Tidak ada pipeline CD manual.
6. Fitur selesai & siap PR → ingatkan isi deskripsi + risiko + self code review, termasuk cek network tab untuk privacy.
7. Pastikan `.gitignore` aman tiap ada tooling baru, terutama kalau ada `.env` untuk secret baru.
8. Owner mau bypass PR "fix kecil" → tetap arahkan ke workflow PR normal.
9. Situasi tidak tercakup dokumen → tanya owner, jangan asumsi.

---

_Dokumen ini ringkas sengaja, mengikuti realita web client-side + Vercel + solo dev. Update kalau ada perubahan workflow/tooling._
