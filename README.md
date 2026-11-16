# R2 Concept ID

Aplikasi web statis (Vite + Vanilla JavaScript) untuk katalog dan pemesanan layanan desain **R2 Concept ID** (livery, logo, lettering & decal). Mendukung autentikasi demo berbasis peran, pengelolaan produk & user, filter/sort katalog, dan pemesanan via WhatsApp.

> **Status:** prototipe/demo client-side. Data disimpan di `localStorage` browser (bukan backend produksi).

## Fitur utama
- **Katalog produk**: pencarian (nama & deskripsi, case-insensitive), filter kategori, urutkan (nama A–Z, harga termurah/termahal), status slot/stok, dan tombol **Pesan via WhatsApp** (nonaktif saat slot 0).
- **Pemesanan WhatsApp**: pesan dibuat otomatis berisi nama, kode, dan harga/estimasi produk.
- **Manajemen produk** (admin/superadmin): tambah, edit, hapus produk; kode produk otomatis; ekspor/impor JSON; reset data demo.
- **Manajemen user** (superadmin): tambah dan hapus user.
- **Autentikasi demo**: login & daftar (akun baru sebagai pembeli), pembatasan akses berbasis peran.
- **UI responsif**: mobile-first, mode terang/gelap, glassmorphism.

## Peran & akses
| Peran | Akses |
|---|---|
| `pembeli` | Lihat katalog dan pesan via WhatsApp |
| `admin` | Kelola produk |
| `superadmin` | Kelola produk & kelola user |

### Akun demo (dummy) untuk login
Data akun berikut disediakan untuk keperluan demo/pengujian login:

- **Superadmin** (kelola produk & user): `superadmin@r2concept.id` / `super123`
- **Admin** (kelola produk): `admin@r2concept.id` / `admin123`
- **Pembeli** (beli via WhatsApp): `budi@mail.com` / `budi123`, `sari@mail.com` / `sari123`

> Kredensial di atas hanya untuk demo lokal/prototipe. Form login pada aplikasi mengarahkan ke README ini untuk informasi akun demo.

## Tech stack
- [Vite](https://vite.dev/) (vanilla JS, build statis)
- JavaScript (ES modules), HTML, CSS
- [Vitest](https://vitest.dev/) untuk unit test

## Struktur proyek
```text
.
├─ docs/
│  └─ erdua-products.json      # Contoh/data ekspor produk (JSON)
├─ r2-concept-id/              # Aplikasi Vite
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  └─ src/
│     ├─ main.js               # Bootstrap app & tema
│     ├─ ui.js                 # Rendering UI & interaksi
│     ├─ store.js               # State, localStorage, auth, filter, util WA
│     ├─ products.js           # CRUD produk & konstanta nomor WA
│     ├─ format.js             # Util format (Rupiah)
│     ├─ style.css             # Styling
│     └─ core.test.js          # Unit test (Vitest)
└─ README.md
```

## Prasyarat
- Node.js (disarankan LTS) dan npm

## Menjalankan secara lokal
Masuk ke folder aplikasi, instal dependensi, lalu jalankan dev server:

```bash
cd r2-concept-id
npm install
npm run dev
```

## Skrip (di `r2-concept-id/`)
```bash
npm run dev      # Jalankan development server
npm run build    # Build produksi ke dist/
npm run preview  # Preview hasil build
npm test         # Jalankan unit test (Vitest)
```

## Build & deploy (statis)
1. `cd r2-concept-id && npm run build`
2. Deploy folder `r2-concept-id/dist`
3. Vercel: **Root Directory** `r2-concept-id`, **Build Command** `npm run build`, **Output Directory** `dist` (`vite.config.js` menggunakan `base: './'`).

## Penyimpanan data
- Produk: `localStorage` key `erdua:products:v1` (dengan validasi/normalisasi; data rusak dipulihkan ke seed demo).
- App/session/user/settings: `localStorage` key `r2_concept_app_v3`.
- Data contoh/ekspor: `docs/erdua-products.json`.

## Konfigurasi nomor WhatsApp (dummy)
Nomor WhatsApp saat ini diset sebagai **dummy** dan perlu diganti oleh admin:
- `r2-concept-id/src/products.js` → `WHATSAPP_NUMBER`
- `r2-concept-id/src/store.js` → `DEFAULT_WA` (dan pengaturan default terkait)

Gunakan format internasional digit, contoh: `6281234567890`.

## Catatan
- Autentikasi & otorisasi berjalan di sisi klien (localStorage) untuk keperluan demo; **bukan** mekanisme aman untuk produksi.
- Tidak ada payment gateway.
- Validasi & unit test mencakup utilitas inti seperti filter produk, validasi/parse data produk, pembuatan URL WhatsApp, dan format Rupiah (`npm test`).
