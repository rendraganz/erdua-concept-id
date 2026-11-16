# UI-SPEC.md — R2 Concept ID

Spesifikasi antarmuka (UI/UX) turunan dari `SPEC.md` v1.1. Dokumen ini **hanya mendefinisikan desain** (token, layout, komponen, wireframe, perilaku); belum ada implementasi kode.

| Item | Nilai |
|---|---|
| Versi dokumen | 1.0 |
| Acuan | `SPEC.md` v1.1 (fitur, data model, keamanan) |
| Tema | **Terang (latar putih)**, aksen hijau–lime dari palet `@theme` di `SPEC.md` |
| Font | Judul: **Bricolage Grotesque** · Teks: **Plus Jakarta Sans** (keduanya sans-serif) |
| Pendekatan | **Mobile-first** (desain dasar 360 px, lalu diperluas ke atas) |
| Aksesibilitas | Target **WCAG 2.2 AA** (kontras teks ≥ 4,5:1, komponen UI ≥ 3:1) |

---

## 1. Prinsip Desain

1. **Bersih & terang:** latar putih, banyak ruang kosong, aksen lime/hijau dipakai hemat agar tetap terbaca.
2. **Konversi dulu:** tombol WhatsApp selalu terlihat dan konsisten di kartu, modal, hero, dan navbar.
3. **Kontras aman:** warna lime (`#ccff66`) **hanya sebagai isian (fill)** dengan teks gelap; **tidak pernah dipakai sebagai warna teks/ikon di atas putih** (rasio hanya 1,16:1).
4. **Jelas tanpa warna:** status dan slot selalu memakai ikon/label teks, bukan warna saja.
5. **Mobile-first:** satu kolom, target sentuh ≥ 44 px, tanpa hover-only.
6. **Ringan:** ilustrasi emoji (tanpa file gambar), font self-host variabel, efek dekoratif minimal.

---

## 2. Perubahan terhadap SPEC.md

Dokumen ini **menggantikan** bagian visual `SPEC.md` §5 untuk hal-hal berikut. Token warna `@theme` **tidak diubah**.

| Aspek | `SPEC.md` (sebelumnya) | `UI-SPEC.md` (berlaku) |
|---|---|---|
| Latar halaman | Hitam (dark glassmorphism) | **Putih `#ffffff`** |
| Permukaan | Kaca gelap `rgba(26,26,26,.65)` | Kartu **putih solid** + border `color-1-200`; kaca **terang** hanya untuk navbar & overlay |
| Teks | Terang di atas gelap | **Gelap `#1a1a1a`** di atas putih |
| Orbs blur | Seluruh latar | **Hanya di area hero**, opasitas rendah |
| Partikel | Seluruh latar, lime/emerald | **Hanya hero**, warna emerald `#339966` (opasitas ≤ 0,3), 24 partikel desktop / 12 mobile, mati saat *reduced motion* |
| Font | Inter / Space Grotesk (saran) | **Bricolage Grotesque** (judul) + **Plus Jakarta Sans** (teks) |
| Hero | Gambar banner + overlay kaca | **Ilustrasi emoji** (default); banner gambar opsional bila admin mengisi `bannerUrl` |
| Gambar produk | `imageUrl` lokal | `imageUrl` bila ada; bila kosong/gagal → **emoji placeholder per kategori** |
| Footer | — | Gelap `#1a1a1a` (kontras tinggi) |

Font harus **self-host** (mis. paket `@fontsource-variable/bricolage-grotesque` dan `@fontsource-variable/plus-jakarta-sans`) agar sesuai CSP `font-src 'self'` di `SPEC.md` §7.

---

## 3. Design Tokens

### 3.1 Token Semantik Warna (dipetakan ke palet `@theme`)

| Token semantik | Palet / Hex | Pemakaian |
|---|---|---|
| `bg` | `#ffffff` | Latar halaman |
| `bg-subtle` | `color-1-50` `#fafafa` | Band section selang-seling, header tabel |
| `bg-tint` | `color-3-50` `#f5ffe7` | Wash lime lembut (hero, callout) |
| `border` | `color-1-200` `#e1e1e1` | Garis dekoratif kartu/divider (bukan penanda fungsi) |
| `border-strong` | `color-2-500` `#757575` | Border input, chip, tombol outline (≥ 3:1) |
| `text` | `color-2` `#1a1a1a` | Teks utama, judul |
| `text-muted` | `color-1-500` `#5e5e5e` | Teks sekunder, kode desain, caption |
| `brand` | `color-3` `#ccff66` | **Isian** tombol utama, badge, highlight |
| `brand-ink` | `#1a1a1a` | Teks/ikon di atas `brand` |
| `accent` | `color-6-700` `#2b7951` | Ikon aksen, teks tautan, tombol WhatsApp |
| `accent-strong` | `color-6-800` `#246041` | Hover/aktif, tautan di teks kecil |
| `wa` | `color-6-700` `#2b7951` (hover `color-6-800`) | Tombol WhatsApp, teks putih |
| `success-bg / ink` | `color-6-50` `#f0fcf4` / `color-6-900` `#1f4e35` | Badge slot tersedia |
| `warn-bg / ink` | `#fff4cc` / `#5c4300` | Slot menipis, status Revisi |
| `danger / danger-bg / danger-ink` | `#b42318` / `#fef3f2` / `#912018` | Error, hapus, antrean penuh |
| `focus` | `color-2` `#1a1a1a` | Cincin fokus |
| `footer-bg / footer-text / footer-link` | `#1a1a1a` / `color-2-300` `#d5d5d5` / `#ccff66` | Footer gelap |

> Warna `warn` dan `danger` berada di luar palet `@theme`; diizinkan **hanya untuk status** (sesuai `SPEC.md` §5.5).

### 3.2 Tabel Kontras (dihitung, WCAG 2.x)

| Pasangan (teks / latar) | Rasio | Lulus |
|---|---:|---|
| `#1a1a1a` di `#ffffff` (teks utama) | **17,4:1** | AAA |
| `#5e5e5e` di `#ffffff` (teks sekunder) | **6,48:1** | AA / hampir AAA |
| `#5e5e5e` di `#fafafa` | 6,21:1 | AA |
| `#757575` di `#ffffff` (border input) | 4,61:1 | AA (≥ 3:1 untuk komponen) |
| `#1a1a1a` di `#ccff66` (tombol utama) | **14,97:1** | AAA |
| `#ffffff` di `#2b7951` (tombol WhatsApp) | **5,31:1** | AA |
| `#ffffff` di `#246041` (WA hover) | 7,43:1 | AAA |
| `#2b7951` di `#ffffff` (tautan/ikon aksen) | 5,31:1 | AA |
| `#246041` di `#ffffff` (tautan kecil) | 7,43:1 | AAA |
| `#1f4e35` di `#f0fcf4` (badge slot tersedia) | 9,06:1 | AAA |
| `#5c4300` di `#fff4cc` (badge menipis / Revisi) | 8,44:1 | AAA |
| `#912018` di `#fef3f2` (badge penuh / error) | 7,97:1 | AAA |
| `#b42318` di `#ffffff` (teks error) | 6,57:1 | AA |
| `#434343` di `#f5f5f5` (status Antre) | 9,07:1 | AAA |
| `#3c5200` di `#e6ffc0` (status Proses) | 8,10:1 | AAA |
| `#1f4e35` di `#daf9e5` (status Selesai) | 8,49:1 | AAA |
| `#d5d5d5` di `#1a1a1a` (teks footer) | 11,86:1 | AAA |
| `#ccff66` di `#1a1a1a` (tautan footer) | 14,97:1 | AAA |

**Dilarang:** `#ccff66`, `#33cc66` (`color-7`), `#339966` (`color-6`, 3,57:1), `#959595` atau lebih terang sebagai **teks** di atas putih. `#339966` hanya boleh untuk grafik batang (bukan teks, ≥ 3:1) dan dekorasi.

### 3.3 Tipografi

| Peran | Font | Bobot | Mobile | Desktop (≥ 1024) |
|---|---|---|---|---|
| H1 (hero) | Bricolage Grotesque | 700–800 | 36/40 px, ls −2% | 56/60 px |
| H2 (judul section) | Bricolage Grotesque | 700 | 26/32 | 36/44 |
| H3 (nama produk, judul kartu) | Bricolage Grotesque | 600–700 | 18/26 | 20/28 |
| Harga | Bricolage Grotesque | 700 | 20/28 | 22/30 |
| Body | Plus Jakarta Sans | 400 | **16/26** | 16/26 (hero sub 18/28) |
| Label, tombol | Plus Jakarta Sans | 600 | 14–16/20 | 16/24 |
| Caption, kode desain | Plus Jakarta Sans | 600, uppercase, ls +4% | 12/16 (min) | 13/18 |

- Ukuran input & body minimal **16 px** (mencegah auto-zoom iOS).
- Fallback: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`; emoji: `"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"`.
- `font-display: swap`; muat hanya bobot yang dipakai (variabel, subset latin).
- Panjang baris teks bacaan maks ±70 karakter.

### 3.4 Spasi, Radius, Bayangan, Breakpoint

| Kategori | Nilai |
|---|---|
| Skala spasi (basis 4 px) | 4, 8, 12, 16, 24, 32, 48, 64, 96 |
| Container | Maks 1200 px; padding sisi 16 (base) / 24 (md) / 32 (lg) |
| Radius | sm 8 · md 12 (input, tombol) · lg 16 (kartu) · xl 24 (hero, modal) · pill 999 (chip, badge) |
| Bayangan | `sm`: `0 1px 2px rgba(26,26,26,.06)` · `md`: `0 8px 24px rgba(26,26,26,.08)` (hover kartu, modal) |
| Border kartu | 1 px `border`; hover: bayangan `md` + naik 2 px |
| Breakpoint (mobile-first) | base < 640 · `sm` ≥ 640 · `md` ≥ 768 · `lg` ≥ 1024 · `xl` ≥ 1280 |
| Target sentuh | **≥ 44 × 44 px** untuk semua kontrol interaktif |
| Z-index | konten 0 · navbar 40 · FAB 45 · overlay modal 50 · toast 60 |

### 3.5 Efek Dekoratif (versi terang)

- **Navbar kaca terang:** `rgba(255,255,255,.85)` + `backdrop-filter: blur(12px)` + border bawah 1 px `border`; fallback putih solid bila blur tidak didukung.
- **Orbs hero:** dua lingkaran blur di belakang ilustrasi — lime `#ccff66` ±40% opasitas (kanan-atas) dan emerald `#33cc66` ±18% (kiri-bawah); `blur(120px)` desktop / `blur(80px)` mobile; `aria-hidden`, `pointer-events: none`.
- **Partikel (opsional, hero saja):** titik kecil emerald melayang pelan; berhenti saat tab tersembunyi; dimatikan saat `prefers-reduced-motion`.
- Semua efek dekoratif **tidak boleh** menurunkan kontras teks (teks hero selalu di atas permukaan `bg`/`bg-tint` solid).

---

## 4. Layout & Grid

### 4.1 Struktur Halaman Publik (`#/`)

1. **Skip link** "Lompat ke konten" (terlihat saat fokus)
2. **Navbar sticky**
3. **Hero** (ilustrasi emoji)
4. **Katalog:** judul, toolbar (cari/filter/urut), info jumlah hasil, grid produk / empty state
5. **Footer** gelap
6. **FAB WhatsApp** (mobile)

### 4.2 Grid Produk

| Lebar | Kolom | Jarak (gap) |
|---|:-:|---|
| < 640 | **1** | 16 |
| ≥ 640 (`sm`) | **2** | 16 |
| ≥ 1024 (`lg`) | **3** | 24 |
| ≥ 1280 (`xl`) | **4** | 24 |

Seluruh kartu dalam satu baris memiliki tinggi sama; area aksi (tombol) menempel di dasar kartu.

### 4.3 Navbar Sticky

| | Mobile (< 768) | Desktop (≥ 768) |
|---|---|---|
| Tinggi | 56 px | 64 px |
| Isi | Logo, ikon Favorit + badge jumlah, tombol menu ☰ | Logo, tab **Katalog · Dashboard**, tombol Favorit (+ jumlah), tombol **Chat WA** |
| Perilaku | `position: sticky; top: 0`; menu terbuka sebagai panel di bawah navbar (lihat wireframe) | `position: sticky; top: 0` |
| Tab aktif | Garis bawah 3 px `#1a1a1a` (penanda ≥ 3:1; lime tidak dipakai sebagai penanda) + teks tebal + `aria-current="page"` | Sama |
| Anchor | `scroll-padding-top` = tinggi navbar + 8 px agar judul tidak tertutup | Sama |

---

## 5. Komponen

### 5.1 Tombol

| Varian | Tampilan | Pemakaian |
|---|---|---|
| **Primary** | Isian `brand` `#ccff66`, teks `#1a1a1a`, border 1 px `#1a1a1a`, radius 12, tinggi 48 | "Lihat Katalog", "Simpan", "+ Tambah" |
| **WhatsApp** | Isian `wa` `#2b7951`, teks putih, ikon pesan, tinggi 48 (kartu: 44); hover `#246041` | "Pesan via WhatsApp", "Chat WhatsApp", "Kirim Favorit via WhatsApp" |
| **WhatsApp – waitlist** | Outline 2 px `#2b7951`, teks `#246041`, latar putih | Slot 0: label **"Tanya Waitlist"** |
| **Secondary** | Latar putih, border 1 px `border-strong`, teks `#1a1a1a` | "Detail", "Batal", filter |
| **Ghost / ikon** | Tanpa border, area 44 × 44, ikon `#1a1a1a` | Favorit ♡, tutup ✕, edit ✎ |
| **Destructive** | Latar `#b42318`, teks putih (6,57:1); varian outline untuk aksi sekunder | "Hapus", "Reset total" |

Status: **hover** (gelapkan/naik 1 px), **active** (turun 1 px), **focus-visible** (cincin 3 px `#1a1a1a` + jarak 2 px putih), **disabled** (latar `#e1e1e1`, teks `#5e5e5e`, kursor `not-allowed`, `aria-disabled`), **loading** (spinner + teks tetap, tombol dinonaktifkan).

### 5.2 Kartu Produk

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────┐                                                   │
│ │ ★ Unggulan              [ ♡ ]│  ← badge kiri-atas, favorit kanan-atas (44×44)    │
│ │                              │                                                   │
│ │            🚚                │  ← thumbnail 4:3 (gambar / emoji placeholder)     │
│ │                              │                                                   │
│ └──────────────────────────────┘                                                   │
│ R2-LVR-01 · Desain Livery        ← kode (caption) + kategori                       │
│ Livery Truk Trailer Full Wrap    ← nama (H3, maks 2 baris)                         │
│ Rp 1.500.000                     ← harga (Bricolage 700)                           │
│ ● Slot tersedia: 3               ← badge slot (ikon + teks)                        │
│ [ Detail ]  [ 💬 Pesan via WA ]  ← aksi (tinggi 44px)                              │
└────────────────────────────────────────────────────────────────────────────────────┘
```

- **Thumbnail 4:3.** Bila `imageUrl` valid → gambar (`alt` = nama desain, `loading="lazy"`). Bila kosong/gagal → **emoji placeholder** di atas latar tint per kategori:

| Kategori | Emoji | Latar tint |
|---|:-:|---|
| Desain Livery | 🚚 | `color-3-100` `#e6ffc0` |
| Desain Logo | 🎯 | `color-6-100` `#daf9e5` |
| Lettering & Stiker | 🔤 | `color-8-100` `#ecfbd7` |
| Decal & Apparel | 👕 | `color-7-100` `#e0fce4` |

- **Badge Unggulan:** pil `brand` + teks `#1a1a1a` + ikon ★ (kiri-atas).
- **Tombol Favorit:** area 44 × 44 kanan-atas, `aria-pressed`, label "Simpan R2-LVR-01 ke favorit"; aktif = hati terisi `#2b7951` (bukan hanya perubahan warna: bentuk berubah dari garis ke isi).
- **Badge slot (ikon + teks):**

| Slot | Tampilan | Warna |
|---|---|---|
| > 3 | "● Slot tersedia: N" | `success-bg` / `success-ink` |
| 1–3 | "▲ Sisa N slot" | `warn-bg` / `warn-ink` |
| 0 | "✕ Antrean penuh" | `danger-bg` / `danger-ink`; tombol WA berubah **"Tanya Waitlist"** |

- **Harga:** `Rp 1.500.000`; bila `harga = 0` → teks **"Harga Custom / Konsultasi"** (gaya sama, bobot 600).
- Nama produk adalah tombol yang membuka modal; tombol **Detail** adalah jalur eksplisit. Kartu **tidak** seluruhnya klik (hindari target ganda).
- Hover (perangkat pointer): bayangan `md`, naik 2 px. Fokus: cincin pada tombol/elemen yang difokus.

### 5.3 Toolbar Katalog (Cari, Filter, Urut)

| Kontrol | Spesifikasi |
|---|---|
| **Cari** | Input teks dengan ikon 🔍, label terlihat atau `aria-label="Cari nama atau kode desain"`, placeholder "Cari nama atau kode…", tinggi 48, tombol hapus (✕) saat ada isi, debounce 200 ms, `type="search"` |
| **Filter kategori** | Baris chip: **Semua, Desain Livery, Desain Logo, Lettering & Stiker, Decal & Apparel**. Mobile: satu baris dapat digeser horizontal (`overflow-x: auto`, tanpa scrollbar mencolok, gradien tepi sebagai petunjuk). Chip aktif: latar `#1a1a1a`, teks putih (17,4:1); tidak aktif: putih + border `border-strong`. `aria-pressed` |
| **Urutkan** | `<select>` native berlabel "Urutkan": Terbaru, Unggulan, Harga Terendah, Harga Tertinggi (tinggi 48) |
| **Favorit** | Tombol toggle "♡ Favorit (N)" `aria-pressed` |
| **Jumlah hasil** | Teks "Menampilkan X dari Y desain" di region `aria-live="polite"` |
| **Reset** | Tombol "Reset filter" muncul bila ada filter aktif |

Tata letak: **mobile** — cari penuh lebar → chip geser → baris [Urut ▾] [Favorit]; **desktop** — baris 1: cari (fleksibel) + urut + favorit; baris 2: chip.

### 5.4 Modal Detail

- **Mobile:** *bottom sheet* hampir layar penuh (tinggi maks 92 vh), sudut atas radius 24, handle visual, tombol ✕ 44 px; area aksi **sticky** di dasar.
- **Desktop:** dialog tengah, lebar maks 720 px, radius 24, bayangan `md`, overlay `rgba(26,26,26,.5)` + `blur(4px)`.
- Isi: gambar/emoji besar, kode, nama, badge Unggulan, kategori, harga, badge slot, format file (CDR/AI/PNG), ketentuan revisi, deskripsi, **[♡ Simpan Favorit]** dan **[💬 Pesan via WhatsApp]**.
- Perilaku: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; fokus masuk ke judul, **focus trap**, tutup via ESC / klik overlay / ✕, fokus kembali ke pemicu; kunci scroll body.

### 5.5 Tombol WhatsApp & Favorit-Bar

- WhatsApp muncul di: navbar (desktop), hero, setiap kartu, modal, bar favorit, footer, dan **FAB** (mobile).
- **FAB (mobile):** lingkaran 56 px, isian `wa`, ikon putih, kanan-bawah (16 px dari tepi, memperhitungkan `safe-area`), `aria-label="Chat WhatsApp"`; **disembunyikan** di dashboard dan saat modal terbuka. Konten diberi `padding-bottom` ±80 px agar tidak tertutup.
- **Bar Favorit:** bila filter Favorit aktif dan jumlah > 0, tampil bar "N desain favorit" + tombol **"Kirim Favorit via WhatsApp"** (mobile: sticky di dasar; desktop: inline di atas grid).

### 5.6 Hero dengan Ilustrasi Emoji

- **Teks:** label kecil "● Studio desain kreatif" (pil `bg-tint`), H1 "Desain yang bikin armada & brand kamu dikenal.", sub "Livery truk & kendaraan, logo, custom lettering, dan stiker — dikerjakan rapi, siap produksi.", CTA **[Lihat Katalog]** (Primary) + **[Chat WhatsApp]** (WhatsApp), baris keunggulan: "✓ Format CDR/AI/PNG · ✓ Revisi sesuai paket · ✓ Slot terbatas".
- **Ilustrasi emoji (dekoratif, tanpa file gambar):** panel membulat (radius 32) berlatar gradien `color-3-50 → color-6-50`, berisi:
  - **🚚** besar di tengah (≈ 96 px mobile / 160 px desktop),
  - empat "stiker" melayang berbentuk pil putih ber-border: **🎨 Livery**, **🎯 Logo**, **🔤 Lettering**, **👕 Decal**, plus **✨** kecil sebagai percikan,
  - bayangan lembut dan animasi mengambang 6 dtk (translateY ±6 px, bergantian); **statis** pada *reduced motion*.
- **Aksesibilitas:** wadah ilustrasi `role="img"` dengan `aria-label="Ilustrasi truk bergaya livery dengan palet warna, logo, huruf, dan pakaian bercetak"`; emoji di dalamnya `aria-hidden="true"`.
- **Tata letak:** mobile — teks di atas, ilustrasi di bawah (tinggi ±220 px); desktop — dua kolom (teks 55% / ilustrasi 45%), hero tinggi minimal 520 px.
- **Mode banner gambar (opsional):** bila `bannerUrl` kustom diisi admin, ilustrasi diganti gambar (`object-fit: cover`) dengan lapisan putih 80% di belakang teks agar kontras tetap terjaga.

### 5.7 Form, Badge, Toast, Tabel

- **Input/Select/Textarea:** tinggi 48, radius 12, border 1 px `border-strong`, label **di atas** field (bukan hanya placeholder), teks bantu `text-muted` 14 px; fokus: cincin 3 px `#1a1a1a`; error: border `#b42318` + ikon ⚠ + pesan "Kode sudah dipakai" (`aria-describedby`, `aria-invalid`).
- **Badge status order** (ikon + teks, pil):

| Status | Ikon | Latar | Teks |
|---|:-:|---|---|
| Antre | ○ | `#f5f5f5` | `#434343` |
| Proses | ◔ | `#e6ffc0` | `#3c5200` |
| Revisi | ↻ | `#fff4cc` | `#5c4300` |
| Selesai | ✓ | `#daf9e5` | `#1f4e35` |

- **Toast:** kanan-bawah desktop / atas-tengah mobile, latar `#1a1a1a` teks putih, `role="status"`, hilang 4 dtk (aksi error 6 dtk, dapat dijeda saat hover/fokus).
- **Dialog konfirmasi:** judul jelas, tombol destruktif di kanan, fokus awal pada **Batal**.
- **Tabel (≥ 768):** header `bg-subtle`, baris 56 px, garis `border`; **< 768** berubah menjadi daftar kartu.
- **Footer (gelap):** latar `#1a1a1a`, teks `#d5d5d5`, tautan `#ccff66` bergaris bawah saat hover/fokus.

---

## 6. Wireframe — Halaman Publik

> Catatan: wireframe adalah sketsa struktur, bukan pixel-perfect. Emoji dan simbol mewakili ikon (Lucide/SVG) di implementasi. Chip kategori disingkat di mobile pada wireframe saja.

### 6.1 Beranda — Desktop (≥ 1280 px)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [R2] R2 Concept ID     Katalog   Dashboard           ♡ Favorit (2)  [ Chat WA ]  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ● STUDIO DESAIN KREATIF                       ┌───────────────────────────────┐  │
│                                               │    🎨 Livery            ✨    │  │
│ Desain yang bikin armada                      │                               │  │
│ & brand kamu dikenal.                         │            🚚                 │  │
│                                               │      (ilustrasi emoji)        │  │
│ Livery truk, logo, custom lettering           │                               │  │
│ & stiker siap produksi.                       │    🎯 Logo    🔤 Lettering    │  │
│                                               │          👕 Decal             │  │
│ [ Lihat Katalog ]  [ 💬 Chat WhatsApp ]       └───────────────────────────────┘  │
│                                                                                  │
│ ✓ CDR/AI/PNG   ✓ Revisi   ✓ Slot terbatas                                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Katalog Desain                                                                   │
│ Temukan karya & jasa untuk kebutuhanmu.                                          │
│                                                                                  │
│ [🔍 Cari nama atau kode desain...        ] [Urutkan: Terbaru ▾] [♡ Favorit]      │
│                                                                                  │
│ (Semua) (Desain Livery) (Desain Logo) (Lettering & Stiker) (Decal & Apparel)     │
│                                                                                  │
│ Menampilkan 8 dari 8 desain                                                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│ │ 🚚  ★ Unggulan│  │ 🚚            │  │ 🚚            │  │ 🎯  ★ Unggulan│       │
│ │ R2-LVR-01     │  │ R2-LVR-02     │  │ R2-LVR-03     │  │ R2-LGO-01     │       │
│ │ Livery Truk   │  │ Livery Pickup │  │ Livery Mobil  │  │ Logo Brand    │       │
│ │ Trailer Wrap  │  │ & Box Armada  │  │ Komunitas     │  │ UMKM Basic    │       │
│ │ Rp 1.500.000  │  │ Rp 750.000    │  │ Harga Custom  │  │ Rp 350.000    │       │
│ │ ● Slot: 3     │  │ ● Slot: 5     │  │ ● Sisa 2 slot │  │ ● Slot: 6     │       │
│ │ [♡] [Detail]  │  │ [♡] [Detail]  │  │ [♡] [Detail]  │  │ [♡] [Detail]  │       │
│ │ [💬 Pesan WA] │  │ [💬 Pesan WA] │  │ [💬 Pesan WA] │  │ [💬 Pesan WA] │       │
│ └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                                  │
│ … baris ke-2: 4 kartu lagi (R2-LGO-02, LTR-01, LTR-02, DCL-01)                   │
├──────────────────────────────────────────────────────────────────────────────────┤
│ R2 Concept ID · © 2026     Katalog · Dashboard · WhatsApp    [footer gelap]      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Catatan layout desktop:** navbar sticky 64 px · hero 2 kolom · toolbar dalam dua baris · grid 4 kolom (1280) / 3 kolom (1024) · footer gelap penuh lebar.

### 6.2 Beranda — Mobile (360 px)

```
┌─────────────────────────────────────┐
│ [R2] R2 Concept ID       ♡ 2   [☰]  │
├─────────────────────────────────────┤
│ ● STUDIO DESAIN KREATIF             │
│ Desain yang bikin armada            │
│ & brand kamu dikenal.               │
│ Livery truk, logo, lettering &      │
│ stiker siap produksi.               │
│                                     │
│ [       Lihat Katalog        ]      │
│ [   💬 Chat WhatsApp         ]      │
│                                     │
│ ┌───────────────────────────────┐   │
│ │   🎨        ✨        🎯      │   │
│ │                               │   │
│ │            🚚                 │   │
│ │                               │   │
│ │   🔤                 👕       │   │
│ └───────────────────────────────┘   │
├─────────────────────────────────────┤
│ Katalog Desain                      │
│ [🔍 Cari nama atau kode...    ]     │
│ (Semua) (Livery) (Logo) (Letter→    │
│       ← geser horizontal →          │
│ [Terbaru ▾]        [♡ Favorit]      │
│ Menampilkan 8 dari 8 desain         │
├─────────────────────────────────────┤
│ ┌───────────────────────────────┐   │
│ │ 🚚 ★ Unggulan             [♡] │   │
│ │                               │   │
│ │ R2-LVR-01                     │   │
│ │ Livery Truk Trailer Wrap      │   │
│ │ Desain Livery                 │   │
│ │ Rp 1.500.000                  │   │
│ │ ● Slot tersedia: 3            │   │
│ │ [   Detail   ]                │   │
│ │ [ 💬 Pesan via WhatsApp ]     │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 🚚                        [♡] │   │
│ │                               │   │
│ │ R2-LVR-02                     │   │
│ │ Livery Pickup & Box Armada    │   │
│ │ Desain Livery                 │   │
│ │ Rp 750.000                    │   │
│ │ ● Slot tersedia: 5            │   │
│ │ [   Detail   ]                │   │
│ │ [ 💬 Pesan via WhatsApp ]     │   │
│ └───────────────────────────────┘   │
│                                     │
│ … + 6 kartu lagi (1 kolom)          │
├─────────────────────────────────────┤
│ © 2026 R2 Concept ID                │
│ Katalog · Dashboard · WhatsApp      │
├─────────────────────────────────────┤
│                     (💬) ← FAB WA   │
└─────────────────────────────────────┘
```

### 6.3 Menu Mobile (☰ dibuka)

```
┌────────────────────────────────────┐
│ [R2] R2 Concept ID       ♡ 2   [✕] │
├────────────────────────────────────┤
│ Katalog                            │
│                                    │
│ Favorit Saya (2)                   │
│                                    │
│ Dashboard                          │
│                                    │
│ [ 💬 Chat WhatsApp ]               │
└────────────────────────────────────┘
```

Panel turun di bawah navbar (fokus dipindah ke item pertama, ESC menutup, klik di luar menutup). Item **Dashboard** mengarah ke `#/login` bila belum masuk.

### 6.4 Modal Detail — Desktop & Mobile

```
┌─ Modal detail · desktop (dialog tengah, maks 720px) ───────────────────┐
│ R2-LVR-01                                                         [ ✕ ]│
│ Livery Truk Trailer Full Wrap     ★ Unggulan                           │
│                                                                        │
│ ┌──────────────────────────┐  Kategori : Desain Livery                 │
│ │                          │  Harga    : Rp 1.500.000                  │
│ │        🚚                │  Slot     : ● Tersedia: 3                 │
│ │                          │                                           │
│ │   (gambar karya / emoji) │  Format file : CDR · AI · PNG             │
│ │                          │  Revisi      : 2x revisi minor            │
│ └──────────────────────────┘                                           │
│                                                                        │
│ Deskripsi: File master CDR (vektor) + AI + PNG preview resolusi tinggi.│
│ Termasuk 2x revisi minor; revisi tambahan dikenakan biaya.             │
│                                                                        │
│ [♡ Simpan Favorit]                    [ 💬 Pesan via WhatsApp ]        │
└────────────────────────────────────────────────────────────────────────┘
```

```
┌─ Bottom sheet · mobile ────────┐
│ ━━━ (handle)              [ ✕ ]│
│                                │
│       🚚                       │
│ R2-LVR-01 · ★ Unggulan         │
│ Livery Truk Trailer            │
│ Full Wrap                      │
│ Desain Livery                  │
│ Rp 1.500.000 · ● Slot: 3       │
│                                │
│ Format file: CDR · AI · PNG    │
│ Revisi: 2x revisi minor        │
│ Deskripsi … (scroll)           │
│                                │
│ [♡ Simpan Favorit]             │
│ [💬 Pesan via WA] ← sticky     │
└────────────────────────────────┘
```

### 6.5 Empty State

```
┌─ A. Hasil pencarian/filter kosong ───────────┐
│                                              │
│              🔍                              │
│      Belum ada desain yang cocok             │
│   Coba kata kunci lain atau ubah filter.     │
│                                              │
│         [ Reset pencarian & filter ]         │
│                                              │
└──────────────────────────────────────────────┘

┌─ B. Favorit kosong ──────────────────────────┐
│                                              │
│              🤍                              │
│       Belum ada desain favorit               │
│   Ketuk ♡ pada kartu untuk menyimpan         │
│   desain yang kamu suka.                     │
│                                              │
│         [ Jelajahi Katalog ]                 │
│                                              │
└──────────────────────────────────────────────┘
```

| Empty state | Ikon | Judul | Pesan | Aksi |
|---|:-:|---|---|---|
| Hasil kosong | 🔍 | Belum ada desain yang cocok | Coba kata kunci lain atau ubah filter. | **Reset pencarian & filter** |
| Favorit kosong | 🤍 | Belum ada desain favorit | Ketuk ♡ pada kartu untuk menyimpan desain yang kamu suka. | **Jelajahi Katalog** |
| Katalog kosong (admin menghapus semua) | 📦 | Katalog masih kosong | Desain akan tampil di sini setelah ditambahkan. | **Hubungi via WhatsApp** (publik) |
| Dashboard – produk kosong | 📦 | Belum ada produk | Tambahkan karya pertama untuk ditampilkan di katalog. | **+ Tambah Produk** |
| Dashboard – rekap kosong | 📒 | Belum ada order di November 2026 | Catat order pertama bulan ini atau pilih bulan lain. | **+ Tambah Order** |

Emoji pada empty state berukuran 56 px, `aria-hidden`; judul H3; semua teks di tengah, lebar maks 420 px, jarak vertikal 48 px.

---

## 7. Dashboard Demo

Dashboard memakai gaya terang yang sama. Data demo di bawah memakai **seed katalog `SPEC.md` §4.8** dan contoh order **November 2026** (konsisten dengan aturan hitung `SPEC.md` §3-F7).

### 7.1 Data Demo & Perhitungan

**Ringkasan Produk:** Total karya **8** · Kategori terisi **4** · Unggulan **3** · Total slot tersisa **37** (3+5+2+6+0+10+4+7) · Slot habis **1** (R2-LGO-02).

**Order November 2026 (6 order):**

| Tanggal | Klien | Produk | Kategori | Nominal (uang masuk) | Status |
|---|---|---|---|---:|---|
| 2026-11-03 | PT Sinar Logistik | R2-LVR-01 | Desain Livery | 1.500.000 | Selesai |
| 2026-11-05 | Budi Santoso | R2-LGO-01 | Desain Logo | 350.000 | Selesai |
| 2026-11-08 | CV Mitra Armada | R2-LVR-02 | Desain Livery | 400.000 (DP) | Proses |
| 2026-11-10 | Komunitas Pickup Banyuwangi | R2-LVR-03 | Desain Livery | 1.000.000 (DP) | Revisi |
| 2026-11-12 | Toko Kopi Senja | R2-LTR-02 | Lettering & Stiker | 275.000 | Selesai |
| 2026-11-14 | Andi Wijaya | R2-LTR-01 | Lettering & Stiker | 150.000 | Antre |

**Hasil perhitungan:** Total order **6** · Total omzet masuk **Rp 3.675.000** · Rata-rata nilai proyek **Rp 612.500** · Order selesai **3** (omzet selesai Rp 2.125.000) · Per kategori: Livery **3** (Rp 2.900.000), Lettering & Stiker **2** (Rp 425.000), Logo **1** (Rp 350.000), Decal & Apparel **0** · Per status: Selesai 3, Proses 1, Revisi 1, Antre 1.

Tampilan angka ringkas (kartu statistik): "Rp 3,67 jt" dengan nilai penuh pada `title`/teks tersembunyi untuk pembaca layar ("Rp 3.675.000").

### 7.2 Login

```
┌─ Login · mobile ───────────────────┐
│ [R2] R2 Concept ID            [☰]  │
├────────────────────────────────────┤
│                                    │
│          🔐                        │
│    Masuk ke Dashboard              │
│                                    │
│    Peran     (•) Owner  ( ) Staf   │
│                                    │
│    Password                        │
│    [•••••••••••••••     👁]         │
│                                    │
│    [        Masuk         ]        │
│                                    │
│    Lupa password? Reset total      │
│                                    │
│    ⓘ Data tersimpan di perangkat   │
│      ini saja.                     │
│                                    │
└────────────────────────────────────┘
```

- Pilih peran (Owner/Staf) lalu password; tombol tampil/sembunyi password; pesan error generik "Password salah"; saat terkunci tampil hitung mundur ("Coba lagi dalam 0:30").
- Setup pertama (belum ada password Owner): layar "Buat Password Owner" dengan konfirmasi dan indikator kekuatan (teks + bar, bukan warna saja).
- Kartu login: lebar maks 420 px di tengah halaman pada desktop.

### 7.3 Kelola Produk

**Desktop (sidebar + tabel):**

```
┌─ Dashboard · Produk · desktop ───────────────────────────────────────────────────┐
│ [R2] R2 Concept ID     Katalog  [Dashboard]          Owner ▾   [ Keluar ]        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────┐  [ + Tambah Produk ]          [🔍 Cari produk...      ]       │
│ │ ▸ Produk       │                                                               │
│ │   Rekap Bulanan│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│ │   Pengaturan   │  │ Karya     │  │ Kategori  │  │ Unggulan  │  │ Slot sisa │   │
│ │   Akun         │  │ 8         │  │ 4         │  │ 3         │  │ 37        │   │
│ │   Audit Log    │  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
│ │                │                                                               │
│ │ ⓘ Data hanya   │  ┌─ Daftar Produk ──────────────────────────────────────────┐ │
│ │   di perangkat │  │ Kode      Nama                     Harga Slot ★ Aksi     │ │
│ │   ini. Ekspor  │  │ R2-LVR-01 Livery Truk Trailer  1.500.000    3 ★ ✎ 🗑      │ │
│ │   berkala.     │  │ R2-LVR-02 Livery Pickup & Box    750.000    5 ☆ ✎ 🗑      │ │
│ └────────────────┘  │ R2-LVR-03 Livery Mobil Komun.     Custom    2 ☆ ✎ 🗑      │ │
│                     │ R2-LGO-01 Logo Brand UMKM        350.000    6 ★ ✎ 🗑      │ │
│                     │ R2-LGO-02 Logo Perush. Transp.   800.000  0 ● ☆ ✎ 🗑      │ │
│                     │ … 3 baris lagi                                           │ │
│                     └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Mobile (tab geser + kartu):**

```
┌─ Dashboard · Produk · mobile ──────┐
│ [R2] R2 Concept ID       ♡  [☰]    │
├────────────────────────────────────┤
│ (Produk) (Rekap) (Pengaturan) (Aku→│
├────────────────────────────────────┤
│ Kelola Produk        [+ Tambah]    │
│                                    │
│ ┌───────────┐  ┌───────────┐       │
│ │ Karya     │  │ Kategori  │       │
│ │ 8         │  │ 4         │       │
│ └───────────┘  └───────────┘       │
│ ┌───────────┐  ┌───────────┐       │
│ │ Unggulan  │  │ Slot sisa │       │
│ │ 3         │  │ 37        │       │
│ └───────────┘  └───────────┘       │
│                                    │
│ ┌───────────────────────────────┐  │
│ │ R2-LVR-01          ★ Unggulan │  │
│ │ Livery Truk Trailer Full Wrap │  │
│ │ Rp 1.500.000 · ● Slot: 3      │  │
│ │ [✎ Edit] [☆ Unggulan] [🗑]     │  │
│ └───────────────────────────────┘  │
│ ┌───────────────────────────────┐  │
│ │ R2-LGO-02            ☆        │  │
│ │ Logo Perusahaan Transportasi  │  │
│ │ Rp 800.000 · ● Antrean penuh  │  │
│ │ [✎ Edit] [☆ Unggulan] [🗑]     │  │
│ └───────────────────────────────┘  │
│ … kartu lainnya                    │
└────────────────────────────────────┘
```

- Aksi per baris: **Edit** (modal form), **Unggulan** (toggle ★/☆ dengan `aria-pressed`), **Hapus** (khusus Owner, dialog konfirmasi). Staf **tidak melihat** tombol Hapus.
- Form tambah/edit: kode, nama, kategori, harga (0 = Harga Custom), slot, deskripsi, URL gambar, centang Unggulan. Validasi inline sesuai `SPEC.md` §3-F6; saat gagal, fokus ke field error pertama dan ringkasan error dibacakan (`role="alert"`).
- Baris dengan slot 0 menampilkan badge "✕ Antrean penuh".

### 7.4 Rekap Bulanan

**Desktop:**

```
┌─ Dashboard · Rekap Bulanan · desktop ────────────────────────────────────────────┐
│ [R2] R2 Concept ID     Katalog  [Dashboard]          Owner ▾   [ Keluar ]        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────┐  Bulan [November ▾] Tahun [2026 ▾] Status [Semua ▾]           │
│ │ ▸ Produk       │  [ + Tambah Order ]                                           │
│ │   Rekap Bulanan│                                                               │
│ │   Pengaturan   │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│ │   Akun         │  │ Order     │  │ Omzet     │  │ Rata-rata │  │ Selesai   │   │
│ │   Audit Log    │  │ 6         │  │ 3,67 jt   │  │ 612 rb    │  │ 3         │   │
│ │                │  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
│ │ ⓘ Data hanya   │                                                               │
│ │   di perangkat │  ┌──────────────────────────────────────────────────────────┐ │
│ │   ini. Ekspor  │  │ Order per kategori                                       │ │
│ │   berkala.     │  │ Desain Livery      ███████████████ 3                     │ │
│ └────────────────┘  │ Lettering & Stiker ██████████      2                     │ │
│                     │ Desain Logo        █████           1                     │ │
│                     │ Decal & Apparel                     0                    │ │
│                     └──────────────────────────────────────────────────────────┘ │
│                                                                                  │
│                     ┌─ Daftar Order · November 2026 ───────────────────────────┐ │
│                     │ Tgl    Klien              Produk      Nominal Status     │ │
│                     │ 03 Nov PT Sinar Logistik  R2-LVR-01 1.500.000 ✓ Selesai  │ │
│                     │ 05 Nov Budi Santoso       R2-LGO-01   350.000 ✓ Selesai  │ │
│                     │ 08 Nov CV Mitra Armada    R2-LVR-02   400.000 ◔ Proses   │ │
│                     │ 10 Nov Komunitas Pickup   R2-LVR-03 1.000.000 ↻ Revisi   │ │
│                     │ 12 Nov Toko Kopi Senja    R2-LTR-02   275.000 ✓ Selesai  │ │
│                     │ 14 Nov Andi Wijaya        R2-LTR-01   150.000 ○ Antre    │ │
│                     └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Mobile:**

```
┌─ Dashboard · Rekap · mobile ───────┐
│ [R2] R2 Concept ID       ♡  [☰]    │
├────────────────────────────────────┤
│ (Produk) (Rekap) (Pengaturan) (Aku→│
├────────────────────────────────────┤
│ Rekap Bulanan        [+ Tambah]    │
│ [November ▾]  [2026 ▾]  [Status ▾] │
│                                    │
│ ┌───────────┐  ┌───────────┐       │
│ │ Order     │  │ Omzet     │       │
│ │ 6         │  │ 3,67 jt   │       │
│ └───────────┘  └───────────┘       │
│ ┌───────────┐  ┌───────────┐       │
│ │ Rata-rata │  │ Selesai   │       │
│ │ 612 rb    │  │ 3         │       │
│ └───────────┘  └───────────┘       │
│                                    │
│ Order per kategori                 │
│ Livery   ███████████ 3             │
│ Lettering ████████   2             │
│ Logo     ████        1             │
│ Decal                0             │
│                                    │
│ ┌───────────────────────────────┐  │
│ │ 03 Nov · PT Sinar Logistik    │  │
│ │ R2-LVR-01 · Rp 1.500.000      │  │
│ │ ✓ Selesai          [✎] [🗑]    │  │
│ └───────────────────────────────┘  │
│ ┌───────────────────────────────┐  │
│ │ 14 Nov · Andi Wijaya          │  │
│ │ R2-LTR-01 · Rp 150.000        │  │
│ │ ○ Antre            [✎] [🗑]    │  │
│ └───────────────────────────────┘  │
│ … kartu order lainnya              │
└────────────────────────────────────┘
```

- **Filter:** Bulan (default bulan berjalan), Tahun, Status; opsi "Semua bulan".
- **Kartu statistik:** Order · Omzet · Rata-rata · Selesai.
- **Breakdown kategori:** bar horizontal, isian `#339966` (kontras grafik ≥ 3:1 terhadap trek `#f4f4f4`), **angka dan nama kategori selalu tertulis** (bar tidak membawa makna sendiri).
- **Order:** desktop tabel; mobile kartu (tanggal · klien, produk · nominal, badge status, aksi ✎ 🗑). **Hapus hanya Owner.**
- Rekap kosong → empty state 📒 (§6.5).

### 7.5 Pengaturan — Kontak WhatsApp (khusus Owner)

```
┌─ Dashboard · Pengaturan WhatsApp · desktop ──────────────────────────────────────┐
│ [R2] R2 Concept ID     Katalog  [Dashboard]          Owner ▾   [ Keluar ]        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────┐  Pengaturan › Kontak WhatsApp  (khusus Owner)                 │
│ │ ▸ Produk       │                                                               │
│ │   Rekap Bulanan│  Nomor WhatsApp admin                                         │
│ │   Pengaturan   │  [ 088228549752                      ]                        │
│ │   Akun         │  Format diterima: 08…, 628…, +62…                             │
│ │   Audit Log    │                                                               │
│ │                │  Tersimpan sebagai : 6288228549752                            │
│ │ ⓘ Data hanya   │  Tampilan          : +62 882-2854-9752                        │
│ │   di perangkat │  Pratinjau tautan  : wa.me/6288228549752                      │
│ │   ini. Ekspor  │                                                               │
│ │   berkala.     │  [ Tes Buka WhatsApp ]  [ Simpan ]  [ Kembalikan bawaan ]     │
│ └────────────────┘                                                               │
│                     ⓘ Perubahan hanya berlaku di perangkat                       │
│                       ini. Agar berlaku untuk semua pengunjung,                  │
│                       atur VITE_WA_NUMBER di Vercel & redeploy.                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

- Nomor bawaan **088228549752** → tersimpan `6288228549752`, tampil `+62 882-2854-9752`.
- Validasi inline: pola `^628[0-9]{8,12}$` setelah normalisasi; pesan error "Nomor tidak valid. Contoh: 0882xxxxxxxx".
- **Simpan** membuka dialog verifikasi password (re-auth), lalu toast "Nomor WhatsApp diperbarui".
- Kotak info (`bg-tint`, ikon ⓘ, teks `#1a1a1a`) wajib tampil: perubahan hanya berlaku di perangkat ini; jalur global lewat `VITE_WA_NUMBER` di Vercel.
- Menu **Pengaturan, Akun, Audit Log** hanya tampil untuk Owner; Staf yang membuka rute tersebut melihat halaman "Akses ditolak" (ikon 🚫, tombol "Kembali ke Produk").

### 7.6 Layout Dashboard (ringkas)

| Lebar | Navigasi dashboard | Konten |
|---|---|---|
| < 768 | Tab geser horizontal di bawah navbar (Produk · Rekap · Pengaturan · Akun · Audit) | Kartu 1 kolom, statistik 2 × 2 |
| 768–1023 | Tab horizontal | Tabel penuh lebar, statistik 4 kolom |
| ≥ 1024 | **Sidebar kiri** 240 px (sticky di bawah navbar) | Konten maks 960 px |

Banner info tetap (ikon ⓘ): *"Data tersimpan di perangkat ini saja. Lakukan ekspor berkala sebagai cadangan."* Navbar dashboard menampilkan peran aktif (Owner/Staf) dan tombol **Keluar**; peringatan idle 60 dtk sebelum sesi habis (dialog dengan tombol "Tetap masuk").

---

## 8. Interaksi, State & Motion

| Elemen | Perilaku |
|---|---|
| Navigasi hash | Perpindahan rute memindahkan fokus ke `<h1>` halaman dan memperbarui `document.title` |
| Cari/Filter/Urut | Hasil diperbarui langsung; jumlah hasil diumumkan lewat `aria-live`; posisi scroll tidak melompat |
| Favorit | Ikon berubah + `aria-pressed`, badge navbar beranimasi singkat (scale 1 → 1,15 → 1, 200 ms), toast "Ditambahkan ke favorit" |
| Skeleton | Kartu skeleton (abu `#f4f4f4`, shimmer pelan) saat data awal dimuat (< 300 ms biasanya tidak tampak) |
| Gambar gagal | Otomatis berganti emoji placeholder kategori |
| Modal / sheet | Masuk 250 ms (fade + naik 16 px), keluar 150 ms |
| Tombol | Transisi 150 ms (warna, bayangan, translateY 1 px) |
| Hero | Stiker emoji mengambang 6 dtk, bergantian fase |
| **Reduced motion** | `prefers-reduced-motion: reduce` → matikan float, partikel, shimmer, transisi geser; pakai fade ≤ 100 ms |
| Keyboard | Tab melewati: skip link → navbar → toolbar → kartu (Detail, Favorit, Pesan) → footer; ESC menutup modal/menu; Enter/Space mengaktifkan tombol; chip dapat dioperasikan dengan Tab + Space |

---

## 9. Aksesibilitas (Checklist Desain)

- [ ] `<html lang="id">`; satu `<h1>` per halaman; urutan judul tidak melompat.
- [ ] Landmark: `header` (navbar), `nav`, `main`, `footer`; skip link pertama.
- [ ] Semua teks memenuhi kontras pada Tabel 3.2; lime tidak dipakai sebagai teks di atas putih.
- [ ] Cincin fokus terlihat (3 px `#1a1a1a`, offset 2 px) pada **semua** kontrol, termasuk di atas lime dan hijau.
- [ ] Target sentuh ≥ 44 × 44 px; jarak antar target ≥ 8 px.
- [ ] Informasi tidak hanya lewat warna: slot, status order, favorit, error memakai ikon + teks.
- [ ] Emoji dekoratif `aria-hidden="true"`; ilustrasi hero punya `role="img"` + `aria-label`.
- [ ] Gambar produk memiliki `alt` bermakna (nama + kategori).
- [ ] Form: label terlihat, `aria-invalid`, `aria-describedby`, ringkasan error, `autocomplete` benar (password).
- [ ] Modal/sheet/dialog: `role="dialog"`, `aria-modal`, focus trap, ESC, fokus kembali ke pemicu.
- [ ] Region `aria-live` untuk jumlah hasil, toast, dan error login/lockout.
- [ ] Reflow: tidak ada scroll horizontal pada lebar 320 px dan zoom 200% (kecuali baris chip yang memang dapat digeser).
- [ ] Mendukung perbesaran teks hingga 200% tanpa kehilangan konten/fungsi.
- [ ] Tabel memakai `<th scope>`; tabel mobile menjadi daftar kartu yang tetap berurutan logis.
- [ ] `prefers-reduced-motion` dan `prefers-contrast` dihormati.

---

## 10. Microcopy (Bahasa Indonesia)

| Konteks | Teks |
|---|---|
| Hero H1 | Desain yang bikin armada & brand kamu dikenal. |
| CTA hero | Lihat Katalog · Chat WhatsApp |
| Judul katalog | Katalog Desain — "Temukan karya & jasa untuk kebutuhanmu." |
| Placeholder cari | Cari nama atau kode… |
| Jumlah hasil | Menampilkan {x} dari {y} desain |
| Slot | Slot tersedia: {n} · Sisa {n} slot · Antrean penuh |
| Harga 0 | Harga Custom / Konsultasi |
| Tombol pesan | Pesan via WhatsApp · Tanya Waitlist |
| Favorit | Simpan ke favorit · Hapus dari favorit · Kirim Favorit via WhatsApp |
| Toast favorit | Ditambahkan ke favorit · Dihapus dari favorit |
| Login gagal | Password salah. · Terlalu banyak percobaan. Coba lagi dalam {mm:ss}. |
| Hapus | Hapus "{nama}"? Tindakan ini tidak bisa dibatalkan. |
| Akses ditolak | Kamu tidak punya izin untuk membuka halaman ini. |
| Info data lokal | Data tersimpan di perangkat ini saja. Lakukan ekspor berkala sebagai cadangan. |

---

## 11. Performa & Aset UI

- Font variabel self-host (subset latin): Bricolage Grotesque (wght 500–800) dan Plus Jakarta Sans (wght 400–700); preload hanya font judul hero.
- Ikon Lucide diimpor per-ikon (atau SVG inline); tidak ada font ikon.
- Ilustrasi hero dan placeholder produk berbasis **emoji teks** (nol aset gambar); gambar produk asli `loading="lazy"`, rasio 4:3 dengan `width/height` tetap agar tidak terjadi layout shift (CLS < 0,05).
- Efek `backdrop-filter` hanya pada navbar & overlay; kartu tanpa blur demi performa mobile.
- Target: LCP < 2,5 dtk (mobile), CLS < 0,05, INP < 200 ms.

---

## 12. Kriteria Penerimaan UI

- [ ] Latar halaman putih; token warna mengikuti `@theme` `SPEC.md` tanpa mengubah nilai hex.
- [ ] Heading memakai Bricolage Grotesque, teks memakai Plus Jakarta Sans; fallback sans-serif berfungsi.
- [ ] Semua pasangan teks/latar memenuhi Tabel 3.2 (diverifikasi alat kontras).
- [ ] Navbar sticky di mobile (56 px) dan desktop (64 px), tidak menutup judul saat anchor/scroll.
- [ ] Hero menampilkan ilustrasi emoji, 2 CTA, dan tetap rapi pada 320–1440 px.
- [ ] Grid produk: 1 / 2 / 3 / 4 kolom pada < 640 / ≥ 640 / ≥ 1024 / ≥ 1280.
- [ ] Pencarian, chip kategori, urutan, dan toggle Favorit berfungsi dan terumumkan ke pembaca layar.
- [ ] Kartu menampilkan kode, nama, kategori, harga/Harga Custom, badge slot (ikon + teks), badge Unggulan, Favorit, Detail, dan Pesan WhatsApp.
- [ ] Empty state tampil untuk hasil kosong dan favorit kosong dengan aksi yang jelas.
- [ ] Modal: bottom sheet di mobile, dialog di desktop; focus trap dan ESC berfungsi.
- [ ] Tombol WhatsApp konsisten (warna `wa`, teks putih) dan FAB tampil hanya di mobile publik.
- [ ] Dashboard demo menampilkan statistik (8 · 4 · 3 · 37), tabel produk, rekap November 2026 (6 order · Rp 3.675.000 · Rp 612.500), dan pengaturan nomor WhatsApp.
- [ ] Peran Staf tidak melihat tombol Hapus, Pengaturan, Akun, dan Audit.
- [ ] Tidak ada scroll horizontal pada 320 px; zoom 200% tetap terpakai.
- [ ] `prefers-reduced-motion` mematikan animasi dekoratif.

---

## 13. Keputusan Terbuka (opsional untuk ditentukan)

1. Menampilkan partikel hero atau cukup orbs + animasi emoji (lebih ringan)? **Rekomendasi:** mulai tanpa partikel, tambahkan bila ada waktu.
2. Mode gelap (toggle) di masa depan? Tidak termasuk MVP; token semantik dirancang agar dapat diganti.
3. Mengganti emoji hero dengan ilustrasi vektor/foto karya asli setelah aset tersedia.
