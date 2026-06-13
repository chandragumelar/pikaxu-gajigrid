# Gajigrid — Design System

> Dokumen ini adalah **sumber kebenaran tunggal** untuk semua keputusan visual dan komponen Gajigrid. Claude Code wajib merujuk ke sini sebelum menulis CSS, komponen, atau layout baru. Jangan improvise token — gunakan variabel yang sudah didefinisikan di sini.

---

## 0. Overview

| Atribut | Nilai |
|---|---|
| Nama produk | **Gajigrid** |
| Bahasa UI | Bahasa Indonesia |
| Mode | Dark-first (light mode opsional, tidak diprioritaskan v1) |
| Vibe | Modern SaaS, data-forward, professional tapi tidak kaku |
| Target | HR / Finance di perusahaan Indonesia (SME–Enterprise) |
| Breakpoint utama | Desktop 1280px+, Tablet 768px (responsif tapi tidak dioptimasi mobile v1) |

**Filosofi:** Tool ini menangani data sensitif (gaji karyawan). Tampilannya harus menimbulkan rasa **percaya** — bukan flashy. Bersih, intuitif, tidak ada animasi yang menghalangi kerja. Data adalah bintang utama.

---

## 1. Color Tokens

Definisikan semua token ini di `:root` di file CSS global (atau `globals.css` / `theme.ts`).

### 1.1 Backgrounds

```css
--bg:        #080a0f;   /* Base background — paling gelap */
--bg-1:      #0d1019;   /* Card, panel, sidebar */
--bg-2:      #131724;   /* Elevated card, modal, popover */
--bg-3:      #1a1f2e;   /* Hover state, subtle divider fill */
```

### 1.2 Borders

```css
--border:         #1c2235;              /* Border default */
--border-subtle:  #141826;              /* Separator sangat tipis */
--border-accent:  rgba(0,212,168,0.28); /* Focus ring, active border */
```

### 1.3 Accents

```css
/* Primary — Teal/Cyan */
--accent:           #00d4a8;
--accent-dim:       rgba(0,212,168,0.10);
--accent-glow:      rgba(0,212,168,0.18);
--accent-text:      #00d4a8;

/* Secondary — Violet (dipakai di Metode B) */
--accent-b:         #7c5cfc;
--accent-b-dim:     rgba(124,92,252,0.10);
--accent-b-glow:    rgba(124,92,252,0.18);
```

### 1.4 Text

```css
--text-1: #eef1f8;   /* Heading, primary content */
--text-2: #8892a8;   /* Body, secondary label */
--text-3: #4a5368;   /* Placeholder, disabled, caption */
```

### 1.5 Semantic (Status)

```css
/* Gaji di bawah Min → Underpaid */
--danger:     #ef4444;
--danger-bg:  rgba(239,68,68,0.07);
--danger-border: rgba(239,68,68,0.25);

/* Gaji dalam range Min–Maks → OK */
--success:    #22c55e;
--success-bg: rgba(34,197,94,0.07);
--success-border: rgba(34,197,94,0.25);

/* Gaji di atas Maks → Overpaid */
--warning:    #f59e0b;
--warning-bg: rgba(245,158,11,0.07);
--warning-border: rgba(245,158,11,0.25);
```

### 1.6 Penggunaan Status di Tabel

| Kondisi | Row bg | Left border |
|---|---|---|
| `GajiLama < Min` | `var(--danger-bg)` | `3px solid var(--danger)` |
| `Min ≤ GajiLama ≤ Maks` | `var(--success-bg)` | `3px solid var(--success)` |
| `GajiLama > Maks` | `var(--warning-bg)` | `3px solid var(--warning)` |

---

## 2. Typography

### 2.1 Font Stack

```css
--font-display: 'Space Grotesk', system-ui, sans-serif;
--font-body:    'DM Sans', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;
```

**Google Fonts import (wajib di `<head>`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 2.2 Type Scale

| Token | Size | Weight | Font | Line-height | Pakai untuk |
|---|---|---|---|---|---|
| `.text-display-xl` | 56px | 700 | Space Grotesk | 1.1 | Hero heading |
| `.text-display-lg` | 40px | 700 | Space Grotesk | 1.15 | Page title utama |
| `.text-display-md` | 32px | 600 | Space Grotesk | 1.2 | Section title besar |
| `.text-heading` | 24px | 600 | Space Grotesk | 1.25 | Card heading, step title |
| `.text-subheading` | 18px | 500 | Space Grotesk | 1.3 | Sub-section label |
| `.text-body-lg` | 16px | 400 | DM Sans | 1.65 | Intro text, deskripsi panjang |
| `.text-body` | 14px | 400 | DM Sans | 1.6 | Default body, tabel |
| `.text-body-sm` | 13px | 400 | DM Sans | 1.5 | Helper text, disclaimer |
| `.text-label` | 12px | 500 | DM Sans | 1.4 | Input label, badge, table header |
| `.text-data` | 14px | 500 | JetBrains Mono | 1.4 | Nilai Rupiah, angka poin, % |
| `.text-data-sm` | 13px | 400 | JetBrains Mono | 1.4 | Angka sekunder di tabel |

**Aturan:**
- Nilai Rupiah dan Poin **selalu** pakai `--font-mono`
- Heading halaman pakai Space Grotesk
- Body & label pakai DM Sans
- `letter-spacing: -0.02em` untuk display-xl dan display-lg
- `text-wrap: pretty` untuk semua paragraf

---

## 3. Spacing

Base unit: **4px**. Semua spacing adalah kelipatan 4.

```css
--sp-1:  4px;
--sp-2:  8px;
--sp-3:  12px;
--sp-4:  16px;
--sp-5:  20px;
--sp-6:  24px;
--sp-8:  32px;
--sp-10: 40px;
--sp-12: 48px;
--sp-16: 64px;
--sp-20: 80px;
--sp-24: 96px;
```

---

## 4. Border Radius

```css
--radius-xs: 4px;   /* Chip terkecil */
--radius-sm: 6px;   /* Badge, button sm */
--radius:    10px;  /* Input, card kecil */
--radius-lg: 14px;  /* Card default */
--radius-xl: 20px;  /* Method card, modal */
--radius-2xl: 28px; /* Hero card */
--radius-full: 9999px; /* Pill */
```

---

## 5. Shadows & Glow

```css
--shadow-card:        0 1px 3px rgba(0,0,0,0.45), 0 0 0 1px var(--border);
--shadow-card-hover:  0 4px 20px rgba(0,0,0,0.55), 0 0 0 1px var(--border-accent), 0 0 32px var(--accent-glow);
--shadow-modal:       0 24px 80px rgba(0,0,0,0.75), 0 0 0 1px var(--border);
--shadow-dropdown:    0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
--glow-sm:            0 0 16px var(--accent-glow);
--glow-md:            0 0 32px var(--accent-glow);
```

---

## 6. Layout & Grid

### 6.1 Page Containers

```css
/* Form pages (single-column wizard) */
.container-form {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 var(--sp-6);
}

/* Output/hasil pages (wide tables) */
.container-wide {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--sp-6);
}

/* Landing page */
.container-landing {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--sp-6);
}
```

### 6.2 Navbar

```
Height:      64px
Position:    sticky top-0, z-index 100
Background:  var(--bg) + backdrop-filter: blur(20px) saturate(180%)
Border:      border-bottom: 1px solid var(--border)
Layout:      flex, justify-between, align-center
Padding:     0 var(--sp-6)
```

Konten:
- **Kiri:** Logo "gajigrid" (Space Grotesk 600, 20px, `--text-1`) + dot accent (`--accent`)
- **Kanan:** Button ghost kecil "Cara Kerja" + "FAQ" + separator + (reserved: Login)

### 6.3 Page Layout (Form Steps)

```
[Navbar — 64px fixed]
[Stepper — 72px, border-bottom]
[Content area — flex-1]
  [container-form centered]
    [Section heading]
    [Card / form body]
    [Action bar — back + next/generate]
[Spacer bottom — 80px]
```

### 6.4 Responsive Breakpoints

| Breakpoint | Token | Nilai |
|---|---|---|
| Mobile | `--bp-sm` | 640px |
| Tablet | `--bp-md` | 768px |
| Desktop | `--bp-lg` | 1024px |
| Wide | `--bp-xl` | 1280px |

---

## 7. Components

### 7.1 Button

**Variants:**

| Variant | bg | text | border | hover |
|---|---|---|---|---|
| `primary` | `var(--accent)` | `#08090f` | none | `brightness(1.08)` + `var(--glow-sm)` |
| `ghost` | transparent | `var(--text-1)` | `1px solid var(--border)` | `bg: var(--bg-3)` |
| `outline-accent` | `var(--accent-dim)` | `var(--accent)` | `1px solid rgba(0,212,168,0.25)` | `bg: rgba(0,212,168,0.15)` |
| `ghost-accent` | transparent | `var(--accent)` | none | `bg: var(--accent-dim)` |
| `danger` | transparent | `var(--danger)` | `1px solid var(--danger-border)` | `bg: var(--danger-bg)` |

**Sizes:**

| Size | Padding | Font | Radius | Ikon |
|---|---|---|---|---|
| `sm` | `6px 12px` | 13px/500 | `var(--radius-sm)` | 14px |
| `md` (default) | `10px 18px` | 14px/500 | `var(--radius)` | 16px |
| `lg` | `13px 24px` | 15px/500 | `var(--radius-lg)` | 18px |

**Rules:**
- Font: DM Sans 500
- Transition: `all 150ms ease-out`
- Disabled: `opacity: 0.4; cursor: not-allowed;`
- Loading state: spinner icon kiri + teks "Memproses..."
- Icon buttons: padding sama, min-width = height (square)
- Full-width: `width: 100%` hanya di dalam card method selection

---

### 7.2 Input & Form

```css
/* Base input */
.input {
  background: var(--bg-1);
  border: 1px solid var(--border);
  color: var(--text-1);
  border-radius: var(--radius);
  padding: 10px 14px;
  font: 14px var(--font-body);
  transition: border 150ms ease-out, box-shadow 150ms ease-out;
  width: 100%;
}
.input::placeholder { color: var(--text-3); }
.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}
.input.error { border-color: var(--danger); }
.input.error:focus { box-shadow: 0 0 0 3px var(--danger-bg); }
```

**Label:**
```css
.label {
  font: 12px/1.4 var(--font-body);
  font-weight: 500;
  color: var(--text-2);
  margin-bottom: 6px;
  display: block;
}
```

**Helper/Error text:**
```css
.helper { font: 12px var(--font-body); color: var(--text-3); margin-top: 4px; }
.helper.error { color: var(--danger); }
```

**Number input (Rupiah):**
- Font: `var(--font-mono)` 14px/500
- Text-align: right
- Prefix "Rp" sebagai absolute positioned label di kiri

**Form group spacing:** `gap: 20px` antar field, `gap: 6px` antara label dan input

---

### 7.3 Card

```css
.card {
  background: var(--bg-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
}

.card-header {
  padding-bottom: var(--sp-4);
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: var(--sp-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Interactive card (method selection) */
.card-interactive {
  cursor: pointer;
  transition: border 200ms, box-shadow 200ms, transform 150ms;
}
.card-interactive:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
.card-interactive.selected {
  border-color: var(--accent);
  background: var(--bg-2);
}
```

---

### 7.4 Badge / Tag

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font: 11px/1.4 var(--font-body);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}
```

| Variant | bg | text | border |
|---|---|---|---|
| `accent` | `var(--accent-dim)` | `var(--accent)` | `1px solid rgba(0,212,168,0.2)` |
| `violet` | `var(--accent-b-dim)` | `var(--accent-b)` | `1px solid rgba(124,92,252,0.2)` |
| `success` | `var(--success-bg)` | `var(--success)` | `1px solid rgba(34,197,94,0.2)` |
| `warning` | `var(--warning-bg)` | `var(--warning)` | `1px solid rgba(245,158,11,0.2)` |
| `danger` | `var(--danger-bg)` | `var(--danger)` | `1px solid rgba(239,68,68,0.2)` |
| `neutral` | `var(--bg-3)` | `var(--text-2)` | `1px solid var(--border)` |

---

### 7.5 Stepper (Multi-step Form)

Tampil di bawah Navbar, sticky. 3 atau 4 langkah tergantung metode.

```
Container: height 68px, border-bottom: 1px solid var(--border),
           background: var(--bg), flex, align-center, justify-center, gap 0

Per step:
  - Step circle: 28×28px, border-radius 50%
    · done:    bg var(--accent), ikon check ⬜ putih 12px
    · active:  bg var(--accent-dim), border 2px solid var(--accent),
               font 12px/600/Space Grotesk, color var(--accent)
    · pending: bg transparent, border 2px solid var(--border),
               font 12px/500, color var(--text-3)
  - Step label: 12px/500/DM Sans, margin-top 4px
    · done/active: var(--text-1)
    · pending: var(--text-3)
  - Connector: flex 1, height 1px, max-width 80px
    · done→next: bg var(--accent)
    · else: bg var(--border)
```

---

### 7.6 Toggle Tab (Input Mode)

Dipakai untuk switch antara "Input Manual" dan "Upload Excel".

```
Container: display inline-flex, bg var(--bg-2), border 1px solid var(--border),
           border-radius var(--radius), padding 3px, gap 2px

Tab item: padding 7px 16px, border-radius var(--radius-sm),
          font 13px/500/DM Sans, cursor pointer, transition 150ms

  · active:  bg var(--bg-1), border 1px solid var(--border-accent),
             color var(--accent), box-shadow 0 1px 4px rgba(0,0,0,0.3)
  · inactive: bg transparent, border 1px solid transparent,
              color var(--text-3)
```

---

### 7.7 Data Table

```
Container: background var(--bg-1), border 1px solid var(--border),
           border-radius var(--radius-lg), overflow hidden

Table: width 100%, border-collapse collapse

Header (thead tr):
  background: var(--bg-2)
  border-bottom: 1px solid var(--border)
  th: font 11px/500/DM Sans, color var(--text-3), letter-spacing 0.06em,
      text-transform uppercase, padding 10px 14px, text-align left
  th.numeric: text-align right

Body row (tbody tr):
  border-bottom: 1px solid var(--border-subtle)
  transition: background 150ms
  tr:last-child: no border-bottom
  tr:hover: background var(--bg-3)

Cell (td):
  padding: 12px 14px
  font: 14px var(--font-body)
  color: var(--text-1)

Cell numeric:
  font: 14px/500 var(--font-mono)
  text-align: right

Cell muted: color var(--text-3), font-size 13px
```

**Row coloring (output):**
```css
tr.row-danger  { background: var(--danger-bg); }
tr.row-success { background: var(--success-bg); }
tr.row-warning { background: var(--warning-bg); }

/* Left border indicator */
tr.row-danger  td:first-child { border-left: 3px solid var(--danger); }
tr.row-success td:first-child { border-left: 3px solid var(--success); }
tr.row-warning td:first-child { border-left: 3px solid var(--warning); }
```

**Editable cell (Metode A: edit rentang):**
```css
td.editable input {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  font: 13px/500 var(--font-mono);
  color: var(--text-1);
  width: 70px;
  text-align: right;
}
td.editable input:focus {
  border-color: var(--accent);
  outline: none;
}
```

---

### 7.8 Info Callout

Untuk penjelasan awam di samping atau di bawah input kritis.

```
bg: var(--bg-2)
border: 1px solid var(--border)
border-left: 3px solid var(--accent)
border-radius: var(--radius)
padding: 12px 16px
font: 13px/1.6 var(--font-body)
color: var(--text-2)
margin-top: var(--sp-3)

Header row: ikon ⓘ (14px, var(--accent)) + teks label (12px/500/DM Sans, var(--accent))
Body: teks penjelasan
```

**Variant violet** (Metode B): ganti `--accent` → `--accent-b` di semua properti di atas.

---

### 7.9 File Upload Zone

```
bg: var(--bg-1)
border: 2px dashed var(--border)
border-radius: var(--radius-lg)
padding: 48px 32px
text-align: center
cursor: pointer
transition: all 200ms

hover / dragover:
  border-color: var(--accent)
  background: var(--accent-dim)

Icon upload: 32px, color var(--text-3) → var(--accent) on hover
Title: 16px/600/Space Grotesk, var(--text-1)
Sub: 13px/DM Sans, var(--text-3)
Template link: "Download template Excel" — text-link, var(--accent), underline
```

---

### 7.10 Privacy Notice

```
display: flex
align-items: center
gap: 6px
font: 12px var(--font-body)
color: var(--text-3)
margin-top: var(--sp-4)

Icon lock: 12px, color var(--accent)
```

Teks baku: *"Semua kalkulasi berjalan di browser kamu. Tidak ada data yang dikirim ke server."*

---

### 7.11 Inline Row Actions (Tabel Edit)

Untuk tombol Hapus di baris tabel input.

```
.row-action-btn: display none, padding 4px 6px, border-radius var(--radius-xs),
                  color var(--text-3), bg transparent, border none, cursor pointer
tr:hover .row-action-btn: display inline-flex, color var(--danger)
```

---

### 7.12 Divider

```css
.divider {
  height: 1px;
  background: var(--border-subtle);
  margin: var(--sp-6) 0;
}
```

---

## 8. Screen Patterns

### 8.1 Landing — Method Selection

```
Background: var(--bg)

[Navbar]

[Hero — padding-top 72px, padding-bottom 48px, text-align center]
  Badge "Gratis · Kalkulasi di Browser" (variant: accent)
  H1 (display-xl): "Susun Struktur Gaji\nyang Adil & Terukur"
    color: var(--text-1), letter-spacing -0.02em
  p (body-lg): subtitle, color var(--text-2), max-width 560px, margin auto

[Method cards — grid 2-col, gap 24px, margin-top 48px]
  Setiap card: card-interactive, border-radius var(--radius-xl), min-height 380px,
               padding 32px, display flex flex-col
  Layout per card:
    [top] Badge (Metode A: accent / Metode B: violet) + ikon metode (24px)
    [H2 16px/600/Space Grotesk] Nama metode
    [p 14px/DM Sans, text-2] Deskripsi
    [list] "Cocok untuk:" + 2 bullets (check icon, 13px, text-2)
    [flex-1 spacer]
    [Button primary/outline-accent, full-width] CTA

[Privacy note — text-center, margin-top 32px]
```

---

### 8.2 Multi-Step Form Pages

```
[Navbar sticky]
[Stepper sticky — z-index 90]
[Content — padding-top 48px, padding-bottom 96px]
  [container-form]
    [Section label — badge di atas heading, optional]
    [H2 text-display-md] Judul langkah
    [p text-body, text-2] Deskripsi singkat (1–2 kalimat)
    [gap 24px]
    [Card utama — padding 28px]
      [form content]
    [Info callout — jika ada penjelasan tambahan]
    [Action bar — margin-top 32px, flex, justify-between]
      [Kembali — ghost button, icon panah kiri]
      [Lanjut / Generate — primary button, icon panah kanan / play]
```

---

### 8.3 Output / Hasil Pages

```
[Navbar]
[Output header bar — padding 16px 0, border-bottom, sticky]
  [container-wide, flex, justify-between, align-center]
    [H3 + badge metode]
    [Edit controls — collapsed by default, expand icon]
    [Button "Download Excel" — primary + ikon download]

[Content — padding-top 32px]
  [container-wide]
    [H4 text-subheading] "Struktur Golongan" / "Struktur Gaji per Jabatan"
    [Table 1 — full width]

    [divider — margin 32px 0]

    [H4 text-subheading] "Detail per Karyawan"
    [Table 2 — full width, scrollable horizontal on tablet]
    [Color legend — flex row, gap 16px, margin-top 12px]
      · Merah = di bawah minimum
      · Hijau = dalam rentang
      · Kuning = di atas maksimum
```

**Edit controls (expanded):**
```
Panel: card, bg var(--bg-2), padding 20px, border-radius var(--radius-lg)
Metode A: grid 4-col input "Rentang Golongan X" per golongan
Metode B: 2-col "Titik Terendah U₁" + "Titik Tertinggi U₂" + 2 input "Min %" + "Maks %"
Re-calculate otomatis (debounce 300ms) — tidak ada tombol "Hitung Ulang"
```

---

## 9. Motion & Transition

```css
/* Token */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* Springy, modern */
--ease-in:  cubic-bezier(0.4, 0, 1, 1);
--ease:     cubic-bezier(0.4, 0, 0.2, 1);

/* Standard */
--t-fast:   100ms var(--ease-out);   /* Hover color, border */
--t-base:   200ms var(--ease-out);   /* Card hover, button press */
--t-slow:   300ms var(--ease-out);   /* Panel, dropdown, recalculate */
--t-page:   400ms var(--ease-out);   /* Slide transition antar step */
```

**Aturan:**
- Row recalculate: `transition: background var(--t-slow), color var(--t-slow)`
- Step transition: slide + fade (step baru dari kanan masuk, lama ke kiri keluar)
- Modal: fade-in + scale dari 0.97 ke 1.0
- Tidak ada animasi loop dekoratif di halaman form
- Selalu hormat `@media (prefers-reduced-motion: reduce)` → matikan semua animasi

---

## 10. Iconography

Gunakan **Lucide Icons** (`lucide-react` atau CDN `https://unpkg.com/lucide@latest`). Konsisten, lightweight, 24×24 default.

| Konteks | Icon | Ukuran |
|---|---|---|
| Upload | `Upload` | 24px |
| Download | `Download` | 16px |
| Tambah baris | `Plus` | 14px |
| Hapus baris | `Trash2` | 14px |
| Lanjut/Next | `ArrowRight` | 16px |
| Kembali | `ArrowLeft` | 16px |
| Generate | `Sparkles` | 16px |
| Step done | `Check` | 12px |
| Info callout | `Info` | 14px |
| Privacy | `Lock` | 12px |
| Expand/collapse | `ChevronDown` | 16px |
| Edit | `Pencil` | 14px |
| Warning | `AlertTriangle` | 14px |
| Excel export | `FileSpreadsheet` | 16px |

Warna ikon: inherit dari parent element (jangan hardcode).

---

## 11. Copywriting

### 11.1 Tone

- **Bahasa:** Indonesia penuh. Bukan Inggris, bukan campuran.
- **Gaya:** Santai tapi profesional. Seperti kolega HR yang berpengalaman.
- **Hindari:** "Data berhasil diproses!", tanda seru berlebihan, kata "silakan", kata "mohon".
- **Pakai:** Kalimat pendek dan aktif. "Tambah baris" bukan "Klik untuk menambahkan baris baru".

### 11.2 Error Messages

**Format:** `[Lokasi] — [Masalah]. [Solusi opsional]`

| Kondisi | Teks error |
|---|---|
| Gaji kosong | "Baris 3, kolom Gaji — tidak boleh kosong." |
| Gaji bukan angka | "Baris 5, kolom Gaji — harus berupa angka." |
| Jabatan tidak cocok | "Jabatan 'Marketing Lead' tidak ditemukan di data poin. Tambahkan jabatan ini ke daftar poin terlebih dahulu." |
| Poin > maks faktor | "Poin untuk faktor Keahlian tidak boleh melebihi 250." |
| Jumlah golongan < 2 | "Jumlah golongan minimal 2." |
| File bukan .xlsx/.csv | "Format file tidak didukung. Gunakan template Excel yang disediakan." |

### 11.3 Tombol CTA

| Aksi | Label |
|---|---|
| Lanjut ke step berikutnya | "Lanjut →" |
| Mulai kalkulasi | "Buat Struktur Gaji" |
| Download hasil | "Download Excel" |
| Kembali ke step sebelumnya | "← Kembali" |
| Tambah baris tabel | "+ Tambah Baris" |
| Tambah faktor | "+ Tambah Faktor" |
| Pilih Metode A dari landing | "Mulai dengan Metode A →" |
| Pilih Metode B dari landing | "Mulai dengan Metode B →" |
| Sudah punya poin | "Ya, Saya Sudah Punya Poin →" |
| Belum punya poin | "Belum, Bantu Saya Menghitung →" |

---

## 12. Privacy & Keamanan UI

Tampilkan disclaimer ini **setiap kali user akan input/upload data karyawan** (Metode A step 1, Metode B step input karyawan):

```
🔒  Semua kalkulasi berjalan sepenuhnya di browser kamu. Tidak ada nama,
    jabatan, atau data gaji yang pernah dikirim ke server manapun.
```

Style: `text-body-sm`, `text-3`, icon lock `accent`. Letakkan di bawah form, di atas tombol Lanjut.

---

## 13. Do's & Don'ts

### ✅ Do
- Gunakan CSS variables yang sudah didefinisikan di atas, jangan hardcode hex
- Nilai Rupiah selalu format: `Rp X.XXX.XXX` (thousand separator titik, tidak pakai desimal)
- Persentase selalu format: `XX,X%` (satu desimal, koma sebagai separator)
- Tabel output selalu ada `overflow-x: auto` untuk support layar tablet
- Recalculate tabel hasil otomatis saat input berubah (debounce 300ms)
- Stepper selalu visible saat scroll (sticky)

### ❌ Don't
- Jangan buat "Gaji Baru" atau "Rekomendasi Gaji" — ini keputusan HR, bukan tool
- Jangan tambah summary/total di bawah tabel
- Jangan kirim data ke server, bahkan untuk logging
- Jangan pakai gradient background kecuali untuk accent glow yang sangat subtle
- Jangan pakai emoji di UI kecuali icon lock di privacy notice
- Jangan buat loading state yang lama — semua kalkulasi harusnya < 100ms di client
- Jangan gunakan font selain yang sudah didefinisikan di §2

---

## 14. File & Folder Structure (Referensi)

```
/src
  /components
    Navbar.tsx
    Stepper.tsx
    Badge.tsx
    Button.tsx
    Input.tsx
    Card.tsx
    DataTable.tsx
    InfoCallout.tsx
    PrivacyNotice.tsx
    ToggleTab.tsx
    FileUploadZone.tsx
  /screens
    Landing.tsx
    /metode-a
      StepInput.tsx        ← Metode A Step 1
      StepKonfigurasi.tsx  ← Metode A Step 2
      StepHasil.tsx        ← Metode A Step 3
    /metode-b
      StepBranch.tsx       ← Metode B: sudah punya poin?
      StepInputPoin.tsx    ← Metode B: input poin (sudah punya)
      StepPoinFaktor.tsx   ← Metode B: hitung poin (belum punya)
      StepKonfigurasi.tsx  ← Metode B: titik + min/maks %
      StepHasil.tsx        ← Metode B: hasil
  /lib
    calc-metode-a.ts       ← Logika hitung Metode A (pure functions)
    calc-metode-b.ts       ← Logika hitung Metode B (pure functions)
    calc-poin-faktor.ts    ← Logika poin faktor
    format.ts              ← Format Rupiah, %, number
    excel-export.ts        ← SheetJS export logic
    validate.ts            ← Validasi input manual & upload
  /styles
    globals.css            ← CSS variables (semua token di §1–5)
    typography.css         ← Type scale classes
```

---

*Last updated: Juni 2026 — v1.0*
