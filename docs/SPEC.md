# SPEC.md — R2 Concept ID

Platform profil studio kreatif, katalog portofolio/jasa desain, dan dashboard manajemen order + rekap bulanan. Web statis modern (tanpa backend), siap deploy ke **Vercel**, target pengerjaan **1 hari**.

| Item | Nilai |
|---|---|
| Nama aplikasi | R2 Concept ID |
| Jenis | Single Page App statis (client-side only) |
| Bahasa UI | Bahasa Indonesia |
| Penyimpanan | `localStorage` |
| Deployment | Vercel (GitHub → zero-config) |
| Versi dokumen | 1.1 (menambah Keamanan, Hak Akses, Ganti Nomor WhatsApp) |

---

## 1. Ringkasan & Tujuan

R2 Concept ID menjual jasa desain: **Livery Truk & Kendaraan, Desain Logo, Custom Lettering, Decal/Stiker**. Aplikasi memiliki dua area:

1. **Katalog Publik** — etalase karya untuk calon klien, berujung pada pemesanan via WhatsApp.
2. **Dashboard Pengelola** — CRUD katalog dan rekap order bulanan untuk admin pada perangkat yang sama.

**Tujuan utama:** konversi pengunjung ke chat WhatsApp secepat mungkin, dan memberi admin alat pencatatan order yang sederhana tanpa server.

**Di luar cakupan (non-goals):** backend, database eksternal, autentikasi server-side, pembayaran online, upload gambar ke server, multi-device sync, multi-bahasa. Akses dashboard dilindungi **login sisi klien + hak akses berbasis peran** (lihat Bagian 8, termasuk batasan jujurnya).

---

## 2. Pengguna & Skenario

### 2.1 Calon Klien / Pembeli
- Melihat banner utama studio.
- Menjelajah katalog, mencari, memfilter, mengurutkan.
- Menyimpan desain ke Favorit (wishlist).
- Membuka modal detail spesifikasi.
- Memesan ke WhatsApp admin dengan pesan otomatis (satu produk atau seluruh favorit).

### 2.2 Pengelola Studio / Admin
- Mengelola katalog (tambah, edit, hapus, tandai Unggulan).
- Mencatat dan memantau order/pendapatan bulanan.
- Login ke dashboard dan mengelola password.
- Mengubah banner dan **nomor WhatsApp tujuan pesan** (khusus Owner, dengan verifikasi password).
- Mereset data ke default.

> Perpindahan Katalog Publik ↔ Dashboard memakai **tab navigasi eksplisit** di navbar. Katalog bersifat publik; **Dashboard wajib login** dengan peran **Owner** atau **Staf** (matriks hak akses di Bagian 8.2). Karena data hanya di `localStorage`, perubahan admin hanya terlihat di browser/perangkat yang sama (dinyatakan jelas di UI dashboard).

---

## 3. Fitur MVP

### F1. Homepage + Hero/Showcase Banner
- Section hero di bagian atas dengan gambar banner kustom lokal (`/assets/img/banner.jpg`, bisa diganti lewat Pengaturan: path/URL atau file → data URL).
- Efek **glassmorphic overlay** di atas banner berisi headline, subheadline, dan 2 CTA:
  - **"Lihat Katalog"** → scroll ke section katalog.
  - **"Chat WhatsApp"** → `wa.me` dengan pesan sapaan umum.
- Fallback: bila gambar gagal dimuat, tampilkan gradient hitam–hijau.
- Teks hero dapat diubah di Pengaturan (`headline`, `subheadline`).

### F2. Katalog Desain (8 karya awal)
Setiap kartu menampilkan: gambar, kode, nama, kategori, harga (Rupiah atau "Harga Custom / Konsultasi"), indikator slot, badge **Unggulan**, tombol Favorit, tombol Detail, tombol Pesan.

**Modal preview detail:** gambar besar, kode, nama, kategori, harga, slot, deskripsi (format file master **CDR/AI/PNG** dan ketentuan **revisi**), tombol Favorit, tombol Pesan WhatsApp.

**Indikator slot:**
| Slot | Tampilan | Perilaku tombol Pesan |
|---|---|---|
| `> 3` | "Slot tersedia: N" (hijau) | Aktif |
| `1–3` | "Sisa N slot" (kuning/lime) | Aktif |
| `0` | "Antrean penuh" (merah/abu) | Tetap aktif dengan label "Tanya Waitlist" (pesan WA menyesuaikan) |

### F3. Pencarian, Filter & Sorting
- **Pencarian** teks bebas pada `nama` dan `code` (case-insensitive, debounce 200 ms).
- **Filter kategori:** Semua, Desain Livery, Desain Logo, Lettering & Stiker, Decal & Apparel.
- **Filter Favorit:** toggle "Favorit Saya (N)".
- **Sorting:** Terbaru (default), Unggulan, Harga Terendah, Harga Tertinggi.
  - Harga `0` (custom) **selalu diletakkan paling akhir** pada kedua sorting harga.
  - "Terbaru" = urutan `id` / `createdAt` menurun.
  - "Unggulan" = `unggulan: true` dulu, lalu terbaru.
- Empty state ramah ("Belum ada desain yang cocok") dengan tombol reset filter.

### F4. Favorit (Wishlist)
- Ikon hati pada tiap kartu dan modal; toggle simpan/hapus.
- Disimpan di `localStorage` (`r2_favorites`).
- Badge penghitung favorit di navbar.
- Tampilan khusus daftar favorit (lewat filter Favorit) + tombol **"Kirim Favorit via WhatsApp"**.
- Bila produk favorit dihapus admin, ID yatim dibersihkan otomatis saat load dan saat penghapusan.

### F5. Pesan via WhatsApp Dinamis
Basis URL: `https://wa.me/{nomorAdmin}?text={encodeURIComponent(pesan)}`.

**Satu produk:**
```
Hai R2 Concept, saya minat dengan product [Kategori] ([Kode] - [Nama Produk]).
Estimasi harga: [Rp xxx / Harga Custom].
Mohon info ketersediaan slot dan prosesnya. Terima kasih!
```

**Slot habis (waitlist):**
```
Hai R2 Concept, saya minat dengan product [Kategori] ([Kode] - [Nama Produk]).
Saya lihat antrean sedang penuh, bisa masuk waitlist? Terima kasih!
```

**Daftar favorit:**
```
Hai R2 Concept, berikut daftar desain favorit saya:
1. [Kode] - [Nama] ([Kategori]) - [Harga]
2. ...
Mohon info lebih lanjut dan estimasi pengerjaannya. Terima kasih!
```

**Sapaan umum (CTA hero):**
```
Hai R2 Concept, saya ingin konsultasi desain. Boleh dibantu?
```

Aturan: nomor dinormalisasi ke format internasional tanpa `+`/spasi (`08xx…` → `628xx…`); dibuka di tab baru dengan `rel="noopener noreferrer"`; daftar favorit dipotong bila pesan melebihi ±1.500 karakter (tampilkan "…dan N desain lainnya").

### F6. Dashboard Kelola Produk (CRUD)
- **Ringkasan** (kartu statistik): total karya, total kategori yang terisi, jumlah Unggulan, total slot tersisa, jumlah produk slot habis.
- **Tabel/daftar produk** dengan aksi: Edit, Hapus (dengan konfirmasi), toggle Unggulan.
- **Form tambah/edit** (modal atau panel): `code`, `nama`, `kategori`, `harga`, `slot`, `deskripsi`, `imageUrl`, `unggulan`.
- Validasi:
  - `code` wajib, unik (case-insensitive), pola disarankan `R2-XXX-NN`.
  - `nama` wajib, maks 80 karakter.
  - `kategori` wajib, salah satu enum.
  - `harga` integer ≥ 0; `0` = Harga Custom.
  - `slot` integer ≥ 0.
  - `imageUrl` opsional; bila kosong → gambar placeholder default.
- Pesan error inline per field, fokus ke field pertama yang salah.

### F7. Dashboard Rekap Bulanan
- **CRUD order**: `tanggal`, `namaKlien`, `produkNama`, `kategori`, `nominal`, `status`, `catatan`.
- `bulan` **diturunkan otomatis** dari `tanggal` (`YYYY-MM`), tidak diisi manual.
- **Filter** bulan/tahun (default: bulan berjalan) + opsi "Semua bulan" pada tahun terpilih; filter status opsional.
- **Ringkasan bulanan:**
  - Total order pada periode.
  - **Total omzet masuk** (rumus di "Aturan perhitungan" di bawah).
  - Rata-rata nilai proyek.
  - Breakdown jumlah order (dan opsional nominal) per kategori — bar horizontal sederhana (CSS/SVG).
  - Jumlah order per status.
- **Aturan perhitungan (ditetapkan agar konsisten):**
  - `nominal` mewakili uang yang sudah diterima (DP/pelunasan) pada order tersebut.
  - **Total omzet masuk** = Σ `nominal` seluruh order pada periode (semua status), karena `nominal` memang uang masuk.
  - **Rata-rata nilai proyek** = total omzet ÷ jumlah order (0 bila tidak ada order; dibulatkan ke Rupiah terdekat).
  - Order berstatus "Selesai" ditampilkan sebagai metrik terpisah: *Order selesai* dan *Omzet dari order selesai*.
- Export opsional (stretch): salin ringkasan bulan sebagai teks / unduh CSV.

### F8. Penyimpanan Lokal & Reset
- Semua data persisten di `localStorage`.
- Tombol **"Reset ke Data Default"** (di Pengaturan) dengan dialog konfirmasi; mereset katalog, favorit, rekap, dan pengaturan.
- Tombol terpisah (stretch): **Ekspor/Impor JSON** sebagai cadangan, mengingat risiko data hilang bila cache dihapus.

### F9. Login & Hak Akses Dashboard
- Halaman login (`#/login`) bergaya glass; tab **Dashboard** mengarah ke sini bila belum login.
- Dua peran: **Owner** (akses penuh) dan **Staf** (akses terbatas). Pengunjung tanpa login hanya melihat katalog.
- Setup pertama kali: Owner membuat password sendiri (tanpa password bawaan).
- Pembatasan percobaan login, timeout sesi, verifikasi ulang password untuk aksi sensitif, dan audit log.
- Detail lengkap: Bagian 8.

### F10. Ganti Nomor WhatsApp (Admin)
- Pengaturan → **Kontak WhatsApp** (khusus Owner): ubah nomor tujuan semua tombol pesan.
- Menerima format `08…`, `628…`, `+62…` (spasi/strip diabaikan), divalidasi, ada pratinjau tautan dan tombol **Tes Buka WhatsApp**.
- Nomor bawaan: **088228549752** (disimpan sebagai `6288228549752`).
- Detail: Bagian 8.4.

---

## 4. Data Model

Semua entitas disimpan sebagai JSON. ID memakai string (`crypto.randomUUID()` dengan fallback `Date.now().toString(36)+random`); data seed memakai ID tetap `p1`…`p8`.

### 4.1 Product — key `r2_products`
```ts
type Kategori = "Desain Livery" | "Desain Logo" | "Lettering & Stiker" | "Decal & Apparel";

interface Product {
  id: string;
  code: string;        // "R2-LVR-01"
  nama: string;
  kategori: Kategori;
  harga: number;       // >= 0 ; 0 => "Harga Custom / Konsultasi"
  slot: number;        // integer >= 0
  deskripsi: string;   // spesifikasi file master & ketentuan revisi
  imageUrl: string;    // path lokal, mis. "/assets/img/livery-01.jpg"
  unggulan: boolean;
  createdAt: number;   // epoch ms, untuk sorting "Terbaru"
}
```

### 4.2 Favorit — key `r2_favorites`
```ts
type Favorites = string[]; // array product.id, tanpa duplikat
```

### 4.3 Rekap Order — key `r2_monthly_recap`
```ts
type StatusOrder = "Antre" | "Proses" | "Revisi" | "Selesai";

interface OrderRecap {
  id: string;
  tanggal: string;     // "YYYY-MM-DD"
  bulan: string;       // "YYYY-MM" (diturunkan dari tanggal)
  namaKlien: string;
  produkNama: string;  // nama/kode desain
  kategori: string;
  nominal: number;     // Rupiah >= 0
  status: StatusOrder;
  catatan?: string;
}
```

### 4.4 Pengaturan — key `r2_settings`
```ts
interface Settings {
  waNumber?: string;       // override lokal, format 62xxxxxxxxxx tanpa "+"; bila kosong → VITE_WA_NUMBER → DEFAULT_WA_NUMBER ("6288228549752")
  bannerUrl: string;       // default "/assets/img/banner.jpg"
  heroHeadline: string;
  heroSubheadline: string;
}
```

### 4.5 Meta — key `r2_meta`
```ts
interface Meta { schemaVersion: number; seeded: boolean; }
```
`schemaVersion` dipakai untuk migrasi data bila struktur berubah di masa depan.

### 4.6 Auth — key `r2_auth` (localStorage)
```ts
interface Credential {
  algo: "PBKDF2-SHA256";
  iter: number;        // 310000
  salt: string;        // base64, 16 byte acak per akun
  hash: string;        // base64, 32 byte
  updatedAt: number;
}
interface AuthStore {
  owner?: Credential;  // dibuat saat setup pertama
  staf?: Credential;   // opsional, dibuat Owner
  failedCount: number; // percobaan gagal beruntun
  lockUntil: number;   // epoch ms, 0 = tidak terkunci
  lockLevel: number;   // tingkat eskalasi kunci
}
```
Password **tidak pernah** disimpan mentah dan **tidak** ikut diekspor.

### 4.7 Sesi & Audit
```ts
// sessionStorage — key "r2_session" (hilang saat tab ditutup)
interface Session {
  token: string;        // 32 byte acak (base64)
  role: "owner" | "staf";
  issuedAt: number;
  lastActive: number;
  reauthUntil: number;  // 0 bila belum verifikasi ulang
}

// localStorage — key "r2_audit" (maks 100 entri, terbaru di depan)
interface AuditEntry {
  ts: number;
  role: "owner" | "staf" | "sistem";
  action: string;       // LOGIN_OK, LOGIN_FAIL, LOCKOUT, LOGOUT, WA_CHANGE, PWD_CHANGE,
                        // RESET, IMPORT, EXPORT, PRODUCT_DELETE, ORDER_DELETE, ACCOUNT_CHANGE
  detail?: string;      // tanpa data sensitif (tidak pernah memuat password)
}
```

### 4.8 Data Seed Katalog (8 karya)

| ID | Kode | Nama | Kategori | Harga | Slot | Unggulan |
|---|---|---|---|---|---|---|
| p1 | R2-LVR-01 | Livery Truk Trailer Full Wrap | Desain Livery | 1.500.000 | 3 | ✔ |
| p2 | R2-LVR-02 | Livery Pickup & Box Armada | Desain Livery | 750.000 | 5 | |
| p3 | R2-LVR-03 | Livery Mobil Komunitas | Desain Livery | 0 (Custom) | 2 | |
| p4 | R2-LGO-01 | Logo Brand UMKM (Paket Basic) | Desain Logo | 350.000 | 6 | ✔ |
| p5 | R2-LGO-02 | Logo Perusahaan Transportasi | Desain Logo | 800.000 | 0 | |
| p6 | R2-LTR-01 | Custom Lettering Nama & Nomor Armada | Lettering & Stiker | 150.000 | 10 | |
| p7 | R2-LTR-02 | Paket Stiker Cutting Branding | Lettering & Stiker | 275.000 | 4 | ✔ |
| p8 | R2-DCL-01 | Decal Apparel & Merchandise | Decal & Apparel | 200.000 | 7 | |

Contoh `deskripsi` (p1): *"File master: CDR (vektor) + AI + PNG preview resolusi tinggi. Termasuk 2x revisi minor; revisi tambahan dikenakan biaya. Template body kendaraan disesuaikan ukuran armada."*

Seed rekap awal (opsional, 4–6 baris pada bulan berjalan) agar dashboard tidak kosong saat demo; ditandai jelas sebagai contoh dan ikut terhapus saat dikosongkan.

### 4.9 Aturan Integritas Data
- Parsing `localStorage` dibungkus `try/catch`; bila JSON rusak → fallback ke default dan tampilkan toast peringatan.
- Bila `localStorage` tidak tersedia (mode privat/penuh): aplikasi tetap jalan dengan state in-memory + banner peringatan "Data tidak akan tersimpan".
- Sinkronisasi antar-tab memakai event `storage`.
- Hapus produk **tidak** menghapus order rekap (rekap menyimpan snapshot nama/kategori sebagai teks).
- `r2_auth`, `r2_session`, dan `r2_audit` **tidak pernah** masuk berkas ekspor; impor menolak kunci tersebut.

---

## 5. Tema Visual

### 5.1 Dark Glassmorphism
Berlaku untuk navbar, kartu katalog, modal, dan panel dashboard:
- Latar: `rgba(26, 26, 26, 0.65)` (`--color-color-2`).
- `backdrop-filter: blur(16px)` (sertakan `-webkit-backdrop-filter`).
- Border: `1px solid rgba(204, 255, 102, 0.18)`.
- Radius 16–24px, bayangan lembut; hover: border naik ke `0.35` + `translateY(-2px)`.
- **Fallback** untuk browser tanpa `backdrop-filter`: latar solid `#1a1a1a` opasitas 0.92.

### 5.2 Gaussian Blur Ambient Orbs
- 2–3 elemen `position: fixed`, `border-radius: 9999px`, `filter: blur(120px)`, `pointer-events: none`, `z-index: -1`.
- Warna: `--color-color-3` (`#ccff66`, opasitas ±0.25) dan `--color-color-6` (`#339966`, opasitas ±0.35).
- Animasi drift sangat lambat (CSS keyframes, 30–40 s) hanya memakai `transform`.
- Di mobile: ukuran dikecilkan dan blur diturunkan (`blur(80px)`).

### 5.3 Partikel Latar Belakang (Canvas)
- Satu `<canvas id="particles">` `position: fixed; inset: 0; pointer-events: none; z-index: 0`; konten aplikasi di atasnya (`z-index: 1+`).
- Warna partikel: `#ccff66` dan `#33cc66`, radius 1–2.5px, opasitas 0.2–0.7, kecepatan rendah, wrap di tepi layar.
- Jumlah partikel: **desktop ≈ 70**, **mobile (lebar < 768px atau `pointer: coarse`) ≈ 28**; skala mengikuti luas viewport.
- Performa: `requestAnimationFrame`, `devicePixelRatio` dibatasi maks 2, **pause saat tab tidak terlihat** (`visibilitychange`), resize di-debounce.
- **`prefers-reduced-motion: reduce`** → partikel statis/dimatikan dan animasi orb dihentikan.
- Tanpa garis penghubung antar partikel (hemat CPU).

### 5.4 Sistem Warna — `@theme` Tailwind v4 (wajib)
Letakkan di `src/styles/main.css` setelah `@import "tailwindcss";`. Token berikut adalah fondasi mutlak seluruh UI.

```css
@theme {
  --color-color-1: #000000;
  --color-color-1-50: #fafafa;
  --color-color-1-100: #f4f4f4;
  --color-color-1-200: #e1e1e1;
  --color-color-1-300: #cecece;
  --color-color-1-400: #959595;
  --color-color-1-500: #5e5e5e;
  --color-color-1-600: #393939;
  --color-color-1-700: #252525;
  --color-color-1-800: #0a0a0a;
  --color-color-1-900: #010101;
  --color-color-1-950: #000000;
  --color-color-2: #1a1a1a;
  --color-color-2-50: #fafafa;
  --color-color-2-100: #f5f5f5;
  --color-color-2-200: #e5e5e5;
  --color-color-2-300: #d5d5d5;
  --color-color-2-400: #a4a4a4;
  --color-color-2-500: #757575;
  --color-color-2-600: #555555;
  --color-color-2-700: #434343;
  --color-color-2-800: #292929;
  --color-color-2-900: #1a1a1a;
  --color-color-2-950: #0a0a0a;
  --color-color-3: #ccff66;
  --color-color-3-50: #f5ffe7;
  --color-color-3-100: #e6ffc0;
  --color-color-3-200: #ccff66;
  --color-color-3-300: #b9f400;
  --color-color-3-400: #ace400;
  --color-color-3-500: #97c800;
  --color-color-3-600: #779f00;
  --color-color-3-700: #5a7900;
  --color-color-3-800: #476100;
  --color-color-3-900: #3c5200;
  --color-color-3-950: #202d00;
  --color-color-4: #111111;
  --color-color-4-50: #fafafa;
  --color-color-4-100: #f5f5f5;
  --color-color-4-200: #e4e4e4;
  --color-color-4-300: #d3d3d3;
  --color-color-4-400: #a0a0a0;
  --color-color-4-500: #6f6f6f;
  --color-color-4-600: #4d4d4d;
  --color-color-4-700: #3a3a3a;
  --color-color-4-800: #202020;
  --color-color-4-900: #111111;
  --color-color-4-950: #0a0a0a;
  --color-color-5: #fefefe;
  --color-color-5-50: #fefefe;
  --color-color-5-100: #f9f9f9;
  --color-color-5-200: #e9e9e9;
  --color-color-5-300: #d7d7d7;
  --color-color-5-400: #a5a5a5;
  --color-color-5-500: #757575;
  --color-color-5-600: #535353;
  --color-color-5-700: #414141;
  --color-color-5-800: #272727;
  --color-color-5-900: #171717;
  --color-color-5-950: #0a0a0a;
  --color-color-6: #339966;
  --color-color-6-50: #f0fcf4;
  --color-color-6-100: #daf9e5;
  --color-color-6-200: #b9f2cf;
  --color-color-6-300: #8ce7b3;
  --color-color-6-400: #5ed495;
  --color-color-6-500: #41bb7e;
  --color-color-6-600: #339966;
  --color-color-6-700: #2b7951;
  --color-color-6-800: #246041;
  --color-color-6-900: #1f4e35;
  --color-color-6-950: #0e2c1c;
  --color-color-7: #33cc66;
  --color-color-7-50: #f1fdf3;
  --color-color-7-100: #e0fce4;
  --color-color-7-200: #c3f7cc;
  --color-color-7-300: #94f1a7;
  --color-color-7-400: #5ce280;
  --color-color-7-500: #33cc66;
  --color-color-7-600: #22a851;
  --color-color-7-700: #208340;
  --color-color-7-800: #206735;
  --color-color-7-900: #1d542c;
  --color-color-7-950: #0a2e14;
  --color-color-8: #475923;
  --color-color-8-50: #f7fded;
  --color-color-8-100: #ecfbd7;
  --color-color-8-200: #dcf5b4;
  --color-color-8-300: #c9eb8a;
  --color-color-8-400: #b6dd6b;
  --color-color-8-500: #9dc253;
  --color-color-8-600: #7b993d;
  --color-color-8-700: #5b722c;
  --color-color-8-800: #475923;
  --color-color-8-900: #3d4c20;
  --color-color-8-950: #222c0f;
}
```

Token ini menghasilkan utilitas Tailwind seperti `bg-color-1`, `text-color-3`, `border-color-3/20`, `from-color-6`, dst.

### 5.5 Pemetaan Peran Warna

| Peran | Token |
|---|---|
| Latar halaman | `color-1` (#000) / `color-4` (#111) |
| Permukaan kaca | `color-2` @ 65% |
| Aksen utama / CTA / heading highlight | `color-3` (#ccff66) |
| Aksen sekunder, badge sukses, hover | `color-7` (#33cc66) |
| Orb ambient, tombol sekunder | `color-6` (#339966) |
| Teks utama | `color-5` (#fefefe) |
| Teks sekunder | `color-2-400` / `color-5-400` |
| Badge Unggulan (latar gelap) | `color-8` + teks `color-3` |
| Error / destruktif | `#ff5c5c` (di luar palet, diizinkan hanya untuk status error/hapus) |

Status order: **Antre** → abu (`color-2-400`), **Proses** → `color-3`, **Revisi** → kuning (`#ffd166`, khusus status), **Selesai** → `color-7`.

### 5.6 Tipografi & Ikon
- Font: **Inter** (body) dan **Space Grotesk** atau **Sora** (heading) via `@fontsource` (self-host, `font-display: swap`) atau fallback system-ui bila ingin nol request eksternal.
- Ikon: **Lucide** (import ikon individual agar tree-shaking) atau SVG inline.
- Kontras: teks utama minimal rasio 4.5:1 di atas permukaan kaca.

---

## 6. Tech Stack & Arsitektur

### 6.1 Core Stack
- **Vite** — dev server dan build produksi ke `dist/`.
- **JavaScript Vanilla (ES Modules)** — tanpa framework.
- **Tailwind CSS v4** via `@tailwindcss/vite` (sintaks `@theme`, utilitas `backdrop-blur-*`).
- **Lucide Icons / SVG Inline** (`lucide` paket vanilla, impor per-ikon).

### 6.2 Struktur Folder
```
r2-concept-id/
├─ index.html
├─ package.json
├─ vite.config.js
├─ vercel.json
├─ SPEC.md
├─ public/
│  ├─ favicon.svg
│  └─ assets/
│     └─ img/
│        ├─ banner.jpg
│        ├─ placeholder.svg
│        ├─ livery-01.jpg … livery-03.jpg
│        ├─ logo-01.jpg, logo-02.jpg
│        ├─ lettering-01.jpg, lettering-02.jpg
│        └─ decal-01.jpg
└─ src/
   ├─ main.js                 # bootstrap, router, init modul
   ├─ styles/
   │  └─ main.css             # @import tailwindcss, @theme, komponen glass, animasi
   ├─ core/
   │  ├─ storage.js           # get/set aman, schemaVersion, event storage
   │  ├─ store.js             # state terpusat + pub/sub sederhana
   │  ├─ router.js            # navigasi hash + route guard (login & izin per rute)
   │  ├─ config.js            # DEFAULT_WA_NUMBER, batas keamanan (iterasi, timeout, dll.)
   │  └─ seed.js              # data default produk, rekap contoh, settings
   ├─ modules/
   │  ├─ catalog.js           # render kartu, search/filter/sort, state UI katalog
   │  ├─ favorites.js         # toggle, counter, bersihkan ID yatim
   │  ├─ whatsapp.js          # normalisasi nomor + builder pesan + open
   │  ├─ productAdmin.js      # CRUD produk + validasi + ringkasan
   │  ├─ recap.js             # CRUD rekap + kalkulasi bulanan + breakdown
   │  ├─ settings.js          # banner, nomor WA, reset, ekspor/impor
   │  ├─ auth.js              # setup/login/logout, PBKDF2, sesi, lockout, re-auth
   │  ├─ permissions.js       # peta peran → izin, can(role, izin)
   │  ├─ security.js          # sanitasi, validasi URL gambar, validasi impor JSON
   │  ├─ audit.js             # catat & tampilkan audit log
   │  ├─ hero.js              # render hero + fallback gambar
   │  └─ particles.js         # sistem partikel canvas
   ├─ ui/
   │  ├─ modal.js             # modal aksesibel (focus trap, ESC)
   │  ├─ toast.js
   │  ├─ confirm.js           # dialog konfirmasi
   │  └─ icons.js
   └─ utils/
      ├─ format.js            # formatRupiah, formatTanggal, bulan Indonesia
      ├─ dom.js               # helper el(), escapeHtml()
      └─ id.js
```

### 6.3 Arsitektur Aplikasi
- **State terpusat** (`store.js`): `{ products, favorites, recap, settings, ui }`. Setiap mutasi → simpan ke `localStorage` → emit event → modul terkait re-render.
- **Routing hash** (tanpa library): publik `#/` (beranda + katalog), `#/login`; terlindungi `#/dashboard/produk`, `#/dashboard/rekap`, `#/dashboard/pengaturan`, `#/dashboard/akun`, `#/dashboard/audit`. Navigasi tab di navbar: **Katalog | Dashboard**. Hash dipilih agar tidak butuh rewrite server dan aman di hosting statis.
- **Route guard:** setiap perubahan hash memeriksa sesi dan izin rute; tanpa sesi → `#/login`, tanpa izin → tampilan "Akses ditolak". Parameter `next` hanya menerima rute internal dari daftar putih.
- **Keamanan render:** semua data pengguna disisipkan lewat `textContent`/`escapeHtml` (cegah XSS dari catatan/nama klien); `imageUrl` hanya menerima path relatif `/…` atau `https://…`/`data:image/…`.
- **Format Rupiah:** `Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0})`.
- **Gambar:** `loading="lazy"`, `decoding="async"`, atribut `width/height` untuk cegah layout shift, `onerror` → `placeholder.svg`.

### 6.4 Komponen UI Utama
Navbar (logo, tab, badge favorit, tombol WA) · Hero · Toolbar katalog (search, chip kategori, sort, toggle favorit) · Grid kartu · Modal detail · Dashboard layout (sidebar/tab) · Tabel produk · Form modal · Panel statistik · Tabel rekap + filter · Bar breakdown kategori · Toast · Dialog konfirmasi · Footer.

---

## 7. Konfigurasi Deployment Vercel

**Pengaturan proyek (zero-config):** Framework Preset *Vite* · Build Command `npm run build` · Output Directory `dist` · Install Command `npm install`.

**`package.json` (inti):**
```json
{
  "name": "r2-concept-id",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  },
  "dependencies": {
    "lucide": "^0.460.0"
  }
}
```
> Versi dipin ke rilis stabil terbaru saat inisialisasi proyek (`npm install` lalu commit `package-lock.json`).

**`vite.config.js`:**
```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: { outDir: "dist", sourcemap: false }
});
```

**`vercel.json`** (termasuk header keamanan):
```json
{
  "cleanUrls": true,
  "rewrites": [{ "source": "/((?!assets/|favicon).*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)\\.(js|css|woff2)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/assets/img/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }]
    },
    {
      "source": "/",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Resource-Policy", "value": "same-origin" }
      ]
    }
  ]
}
```

Catatan penting:
- Aset di `public/assets/img/` **tidak di-hash** oleh Vite sehingga tidak boleh `immutable`; cache dibuat 1 hari + SWR agar penggantian gambar tetap terlihat. Aset JS/CSS hasil build (ber-hash) di `dist/assets/` aman `immutable`.
- Rewrite ke `index.html` hanya sebagai jaring pengaman; navigasi utama memakai hash sehingga tidak bergantung padanya.
- Tanpa backend dan tanpa database. Satu environment variable **opsional**: `VITE_WA_NUMBER` (nomor WA publik untuk semua pengunjung; ikut ter-bundle sehingga bersifat publik, bukan rahasia). Bila tidak diset, dipakai `DEFAULT_WA_NUMBER = "6288228549752"`.
- CSP memakai `script-src 'self'` (tanpa inline script/eval); `'unsafe-inline'` hanya untuk style. `img-src https:` dipertahankan agar admin bisa memakai URL gambar eksternal; persempit bila hanya memakai aset lokal.

---

## 8. Keamanan & Hak Akses

### 8.1 Model Ancaman & Batasan Jujur
Aplikasi tanpa backend: seluruh kode dan data berada di browser. Konsekuensinya:

- **Login ini adalah gerbang antarmuka (UI gate), bukan keamanan server.** Siapa pun yang membuka DevTools di *browsernya sendiri* dapat mengubah `localStorage`/kode di browser itu. Ini hanya berdampak pada browser tersebut, karena tidak ada data bersama di server.
- Yang **dilindungi secara efektif:** admin tidak sengaja/iseng diubah oleh orang lain yang memakai perangkat bersama, pengunjung biasa tidak melihat dashboard, kebocoran lewat XSS/clickjacking/injeksi diminimalkan, dan password tidak tersimpan mentah.
- **Tidak terlindungi:** pihak yang punya akses fisik ke perangkat/profil browser admin dapat membaca data lokalnya (hash password dapat diserang offline; dimitigasi dengan PBKDF2 berat + password panjang).
- **Jalur peningkatan (di luar MVP):** bila nanti butuh keamanan sungguhan dan data bersama lintas perangkat, pindahkan auth + data ke Vercel Functions + penyimpanan (KV/Postgres) dengan cookie `httpOnly`. Struktur modul `auth.js`/`permissions.js` dibuat agar mudah diganti.

### 8.2 Peran & Matriks Hak Akses

| Kemampuan | Pengunjung | Staf | Owner |
|---|:-:|:-:|:-:|
| Lihat katalog, favorit, pesan via WhatsApp | ✔ | ✔ | ✔ |
| Masuk ke Dashboard | ✘ | ✔ | ✔ |
| Produk: lihat, tambah, edit, toggle Unggulan | ✘ | ✔ | ✔ |
| Produk: hapus | ✘ | ✘ | ✔ |
| Rekap order: lihat, tambah, edit | ✘ | ✔ | ✔ |
| Rekap order: hapus | ✘ | ✘ | ✔ |
| Ganti nomor WhatsApp | ✘ | ✘ | ✔ (+ verifikasi password) |
| Ubah banner & teks hero | ✘ | ✘ | ✔ |
| Reset ke data default | ✘ | ✘ | ✔ (+ verifikasi password) |
| Ekspor / Impor JSON | ✘ | ✘ | ✔ (impor + verifikasi password) |
| Kelola akun (ganti password, buat/hapus akun Staf) | ✘ | ✘ | ✔ (+ verifikasi password) |
| Lihat audit log | ✘ | ✘ | ✔ |
| Ganti password sendiri | ✘ | ✔ | ✔ |

Implementasi: `permissions.js` mendefinisikan `PERMISSIONS = { owner: [...], staf: [...] }` dan `can(role, izin)`. **Penegakan di dua lapis:** (1) UI menyembunyikan/menonaktifkan kontrol, (2) setiap fungsi mutasi di `store`/modul memanggil `assertCan(izin)` sehingga pemanggilan tanpa izin ditolak dan dicatat.

### 8.3 Autentikasi & Sesi
- **Setup pertama:** bila `r2_auth.owner` belum ada, tampilkan wizard "Buat Password Owner" (minimal 10 karakter, tidak boleh sama dengan "password"/"12345678"/nama studio, indikator kekuatan, konfirmasi). **Tidak ada password bawaan.**
- **Hashing:** WebCrypto `PBKDF2-SHA256`, 310.000 iterasi, salt acak 16 byte per akun, keluaran 32 byte. Perbandingan hash dilakukan constant-time.
- **Sesi:** token acak 32 byte (`crypto.getRandomValues`) di `sessionStorage` (hilang saat tab ditutup). **Idle timeout 15 menit**, **batas mutlak 8 jam**, logout manual. Sesi diperiksa pada setiap perpindahan rute dan sebelum setiap aksi mutasi.
- **Anti brute-force:** 5 kegagalan beruntun → kunci 30 dtk, lalu eskalasi 1 mnt → 5 mnt → 15 mnt (disimpan di `r2_auth.lockUntil` sehingga bertahan setelah reload). Jeda buatan ±400 ms pada tiap percobaan. Pesan error **generik** ("Password salah") dan hitung mundur saat terkunci.
- **Verifikasi ulang (step-up):** aksi sensitif (ganti nomor WA, reset, impor, ganti password, kelola akun) meminta password lagi; berlaku 2 menit (`reauthUntil`).
- **Akun Staf:** opsional; Owner membuat/mengganti/menghapus password Staf di Dashboard → Akun. Satu akun per peran.
- **Lupa password:** tidak ada pemulihan server. Layar login menyediakan **"Reset total"** (hapus seluruh data lokal, wajib mengetik `RESET`) lalu setup ulang; data dapat dipulihkan dari berkas **ekspor JSON** (yang tidak memuat hash password). Ini dinyatakan jelas di UI.
- Atribut form: `autocomplete="current-password"` / `"new-password"`, field dikosongkan setelah submit, tombol tampilkan/sembunyikan password.

### 8.4 Fitur Ganti Nomor WhatsApp
**Lokasi:** Dashboard → Pengaturan → **Kontak WhatsApp** (khusus Owner).

**Nomor bawaan:** `088228549752` → dinormalisasi menjadi **`6288228549752`** (tampilan: `+62 882-2854-9752`).

**Alur:**
1. Owner mengisi nomor baru (menerima `08…`, `8…`, `62…`, `+62…`; spasi, strip, kurung diabaikan).
2. **Normalisasi:** hapus karakter non-digit → awalan `0` diganti `62` → awalan `8` diberi `62` di depan.
3. **Validasi:** hasil harus cocok `^628[0-9]{8,12}$` (total 11–15 digit, tanpa `+`). Error inline bila tidak valid.
4. **Pratinjau:** tampilkan nomor terformat dan tautan `wa.me` hasilnya, plus tombol **"Tes Buka WhatsApp"** (pesan tes: "Tes nomor dari dashboard R2 Concept ID").
5. **Simpan:** minta verifikasi password → simpan ke `r2_settings.waNumber` → toast sukses → catat audit `WA_CHANGE` (hanya empat digit terakhir nomor lama/baru, bukan nomor lengkap).
6. Tombol **"Kembalikan ke nomor bawaan"** menghapus override lokal.

**Resolusi nomor (satu sumber kebenaran):** fungsi `getWaNumber()` memakai urutan `r2_settings.waNumber` (override lokal) → `import.meta.env.VITE_WA_NUMBER` → `DEFAULT_WA_NUMBER` (`"6288228549752"`). Seluruh tautan WhatsApp (hero, kartu, modal, favorit, footer) wajib memakai fungsi ini.

> **Catatan penting yang harus tampil di UI:** perubahan nomor lewat dashboard hanya berlaku di **browser/perangkat ini**. Pengunjung lain tetap melihat nomor bawaan. Agar nomor baru berlaku untuk **semua pengunjung**, atur environment variable `VITE_WA_NUMBER` di Vercel (Settings → Environment Variables) atau ubah `DEFAULT_WA_NUMBER` di `src/core/config.js`, lalu redeploy. Panel menampilkan nilai yang siap disalin untuk keperluan ini.

### 8.5 Hardening Aplikasi
**Header & CSP** — lihat `vercel.json` di Bagian 7 (CSP ketat, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP).

**Pencegahan XSS & injeksi**
- Dilarang menyisipkan data pengguna lewat `innerHTML`; gunakan `textContent`/pembuat elemen. Bila template string tak terhindarkan, lewati `escapeHtml()`.
- Tanpa `eval`, `new Function`, atau skrip pihak ketiga; semua JS dari origin sendiri.
- `imageUrl` hanya menerima: path relatif `/assets/…`, `https://…`, atau `data:image/(png|jpeg|webp);base64,…` (maks 500 KB). Skema `javascript:`, `data:image/svg+xml`, dan lainnya ditolak.
- Batas panjang semua field teks (nama ≤ 80, deskripsi ≤ 1.000, catatan ≤ 300, nama klien ≤ 80); nominal/slot/harga hanya integer aman (`Number.isSafeInteger`) dalam rentang wajar.
- Tautan eksternal memakai `rel="noopener noreferrer"`; hanya domain `wa.me` yang dibangun aplikasi.

**Impor/Ekspor JSON**
- Ukuran berkas maks 2 MB; validasi skema ketat per koleksi; kunci tak dikenal dibuang.
- Tolak/abaikan kunci `__proto__`, `constructor`, `prototype` (anti prototype pollution).
- Impor tidak boleh menimpa `r2_auth`, `r2_session`, `r2_audit`; wajib verifikasi password dan konfirmasi.
- Ekspor CSV: sel berawalan `=`, `+`, `-`, `@` diberi awalan `'` (anti CSV/formula injection).

**Rantai pasok**
- Dependensi seminimal mungkin; `package-lock.json` di-commit; build memakai `npm ci`; jalankan `npm audit` sebelum deploy.
- Font self-host (tanpa CDN); `sourcemap: false` di produksi.
- Tidak ada rahasia di repo. Ingat: variabel `VITE_*` ikut ter-bundle ke klien (publik).

**Audit log** (Owner): mencatat LOGIN_OK/LOGIN_FAIL/LOCKOUT/LOGOUT, WA_CHANGE, PWD_CHANGE, RESET, IMPORT/EXPORT, hapus produk/order, perubahan akun. Maks 100 entri; tidak pernah memuat password.

### 8.6 UI Keamanan
- Layar login & setup memakai gaya glass yang sama; indikator sisa percobaan/waktu kunci.
- Navbar menampilkan peran aktif, sisa waktu sesi (opsional), dan tombol **Keluar**.
- Peringatan idle 60 detik sebelum sesi berakhir dengan tombol "Tetap masuk".
- Kontrol tanpa izin disembunyikan; rute tanpa izin menampilkan "Akses ditolak" (bukan error kosong).
- Dashboard menampilkan banner info tetap: *"Data tersimpan di perangkat ini saja. Lakukan ekspor berkala sebagai cadangan."*

---

## 9. Persyaratan Non-Fungsional

| Area | Target |
|---|---|
| Performa | Lighthouse Performance ≥ 90 mobile; LCP < 2,5 s; bundle JS gzip < 80 KB (di luar gambar) |
| Responsif | 360px → 1440px+; grid 1/2/3–4 kolom; navbar collapse di mobile |
| Aksesibilitas | Semantic HTML, label form, fokus terlihat, modal dengan focus trap + ESC, `aria-pressed` pada tombol favorit, `alt` gambar, `prefers-reduced-motion` dihormati |
| Kompatibilitas | Evergreen: Chrome, Edge, Firefox, Safari 15+ (termasuk iOS Safari) |
| SEO dasar | `<title>`, meta description, Open Graph (judul, deskripsi, gambar banner), `lang="id"` |
| Keamanan | Login berbasis peran, PBKDF2, lockout, timeout sesi, CSP ketat + header keamanan, escape output, validasi input & impor, audit log (Bagian 8) |
| Privasi | Tidak ada tracking/analytics pihak ketiga; data hanya di perangkat pengguna |

---

## 10. Rencana Pengerjaan 1 Hari (±10 jam efektif)

| Fase | Durasi | Output |
|---|---|---|
| 1. Setup | 0,5 jam | Vite + Tailwind v4, `@theme`, struktur folder, font |
| 2. Core | 1 jam | `storage`, `store`, `seed`, `router`, utils format |
| 3. Visual dasar | 1 jam | Glass komponen, orbs, partikel, navbar, hero |
| 4. Katalog | 1,5 jam | Kartu, search/filter/sort, modal detail, favorit |
| 5. WhatsApp | 0,5 jam | Builder pesan (single, waitlist, favorit, umum) |
| 6. Dashboard produk | 1 jam | CRUD + validasi + ringkasan |
| 7. Dashboard rekap | 1,5 jam | CRUD order, filter periode, kalkulasi, breakdown |
| 8. Pengaturan, ganti nomor WA & reset | 1 jam | Banner, nomor WA (validasi, tes, pratinjau), reset, (stretch) ekspor/impor |
| 9. Auth & hak akses | 1,5 jam | Setup password, login, sesi, lockout, route guard, `permissions.js`, re-auth, audit |
| 10. Hardening | 0,5 jam | `security.js`, CSP/header di `vercel.json`, validasi impor, sanitasi |
| 11. QA & deploy | 1 jam | Checklist, aset gambar, uji keamanan, push GitHub, deploy Vercel |

**Prioritas jika waktu mepet:** F2–F5 (publik) → F9 (login & hak akses) → F6 → F10 (ganti nomor WA) → F7 → F8. Ekspor/impor JSON dan CSV adalah stretch.

---

## 11. Kriteria Penerimaan (Acceptance Criteria)

**Katalog & Hero**
- [ ] Hero menampilkan banner lokal dengan overlay kaca, 2 CTA berfungsi; fallback gradient bila gambar gagal.
- [ ] 8 karya seed tampil dengan kode, harga/label custom, slot, badge Unggulan.
- [ ] Pencarian nama/kode, filter kategori, filter Favorit, dan 4 mode sorting bekerja; harga 0 selalu di akhir saat sort harga.
- [ ] Modal detail menampilkan spesifikasi file dan ketentuan revisi; bisa ditutup via ESC/klik latar/tombol.

**Favorit & WhatsApp**
- [ ] Favorit persisten setelah reload; badge navbar akurat; favorit yatim dibersihkan.
- [ ] Tombol pesan membuka `wa.me` dengan teks sesuai format (single, waitlist, favorit) dan terenkode benar.
- [ ] Nomor `08…` dinormalisasi menjadi `628…`.

**Dashboard Produk**
- [ ] Tambah/edit/hapus/toggle Unggulan tampil langsung di katalog publik tanpa reload.
- [ ] Validasi menolak kode duplikat, harga/slot negatif atau non-integer, nama kosong.
- [ ] Ringkasan: total karya, total kategori, status slot akurat.

**Dashboard Rekap**
- [ ] CRUD order; `bulan` terisi otomatis dari tanggal.
- [ ] Filter bulan/tahun mengubah semua angka ringkasan; total order, omzet, rata-rata, breakdown kategori, dan jumlah per status akurat (rata-rata = 0 bila kosong).
- [ ] Nominal tampil format Rupiah; status berwarna sesuai peta.

**Keamanan, Hak Akses & Nomor WhatsApp**
- [ ] Mengakses `#/dashboard/*` tanpa sesi selalu diarahkan ke `#/login`; setelah login kembali ke rute tujuan (hanya rute internal).
- [ ] Setup pertama memaksa pembuatan password Owner (≥ 10 karakter); tidak ada password bawaan di kode.
- [ ] Password tersimpan sebagai hash PBKDF2 (tidak ada teks mentah di `localStorage`/log).
- [ ] 5 kali salah → akun terkunci dengan hitung mundur; kunci bertahan setelah reload.
- [ ] Sesi berakhir otomatis setelah 15 menit tidak aktif dan setelah 8 jam; logout menghapus sesi.
- [ ] Staf tidak melihat/mengakses: hapus produk/order, Pengaturan, Akun, Audit; pemanggilan fungsi terlarang ditolak dan dicatat.
- [ ] Ganti nomor WA: validasi menolak format tidak sah; menerima `08…`, `+62…`, `628…`; meminta password; semua tombol WhatsApp langsung memakai nomor baru.
- [ ] Nomor bawaan menghasilkan tautan `https://wa.me/6288228549752?...`.
- [ ] UI menampilkan catatan bahwa perubahan nomor hanya berlaku di perangkat ini + petunjuk `VITE_WA_NUMBER`.
- [ ] Input berisi `<script>`/`<img onerror>` pada nama, catatan, deskripsi tampil sebagai teks biasa (tidak dieksekusi).
- [ ] `imageUrl` dengan `javascript:` atau `data:image/svg+xml` ditolak.
- [ ] Impor JSON dengan `__proto__` atau kunci `r2_auth` ditolak/diabaikan.
- [ ] Header keamanan (CSP, HSTS, X-Frame-Options, dll.) hadir di produksi; tidak ada pelanggaran CSP di konsol.
- [ ] Audit log mencatat login, kegagalan, ganti nomor WA, reset, dan penghapusan.

**Umum**
- [ ] Reset ke default (dengan konfirmasi) memulihkan seluruh data.
- [ ] Data JSON rusak di `localStorage` tidak membuat aplikasi crash.
- [ ] Partikel berjalan halus, berkurang di mobile, berhenti saat tab tersembunyi, dan mati saat reduced-motion.
- [ ] `npm run build` sukses; deploy Vercel berhasil tanpa konfigurasi tambahan; semua gambar `public/assets/img/*` termuat di produksi.

---

## 12. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Data hilang saat cache/storage dibersihkan | Kehilangan rekap order | Ekspor/impor JSON; peringatan jelas di dashboard |
| Perubahan admin tidak terlihat di perangkat lain | Kebingungan pengguna | Catatan eksplisit di dashboard; dokumentasikan keterbatasan |
| `backdrop-filter` berat di perangkat low-end | Jank | Blur diturunkan di mobile, fallback solid, orbs dikecilkan |
| Login hanya sisi klien (bisa dilewati lewat DevTools di browser sendiri) | Gerbang UI, bukan keamanan server | Dinyatakan jelas (Bagian 8.1); data tidak dibagi lintas pengguna; jalur upgrade ke Vercel Functions bila perlu |
| Lupa password Owner | Terkunci dari dashboard | "Reset total" + pulihkan dari ekspor JSON; ekspor berkala diingatkan di UI |
| Perangkat admin dipakai bersama / hilang | Data lokal terbaca | Password kuat, idle timeout, logout, PBKDF2 berat; anjurkan kunci layar perangkat |
| Nomor WA yang diubah di dashboard tidak terlihat pengunjung lain | Pesan tetap ke nomor lama | Catatan jelas di UI; gunakan `VITE_WA_NUMBER`/`config.js` + redeploy agar berlaku global |
| Pesan WA terlalu panjang | Teks terpotong | Batasi daftar favorit ±1.500 karakter |

---

## 13. Keputusan Desain & Asumsi

1. Dashboard dilindungi login sisi klien dengan dua peran (Owner, Staf); katalog tetap publik. Ini gerbang UI, bukan keamanan server (Bagian 8.1).
2. Routing berbasis hash agar nol konfigurasi server.
3. `nominal` rekap = uang masuk (DP/pelunasan); omzet = penjumlahan seluruh `nominal` periode.
4. Rekap menyimpan snapshot teks produk sehingga tidak bergantung pada katalog.
5. Warna di luar palet hanya untuk status error dan status "Revisi".
6. Gambar seed berupa placeholder lokal; admin mengganti file di `public/assets/img/` atau mengisi path/URL baru via form.
7. Nomor WA bawaan `088228549752` (→ `6288228549752`); override lokal hanya berlaku per perangkat, nomor global lewat `VITE_WA_NUMBER`/`config.js`.
8. Tidak ada password bawaan; Owner membuat password saat pertama kali membuka dashboard.

---

## 14. Lampiran: Checklist Pra-Deploy

- [ ] Verifikasi nomor WA bawaan (`6288228549752`) di `src/core/config.js`, atau set `VITE_WA_NUMBER` di Vercel.
- [ ] Buat password Owner yang kuat saat pertama kali membuka dashboard di produksi; simpan di password manager.
- [ ] Cek header keamanan di produksi (mis. securityheaders.com) dan pastikan tidak ada pelanggaran CSP di konsol.
- [ ] Jalankan `npm audit` dan `npm ci` bersih; pastikan `package-lock.json` ter-commit.
- [ ] Lakukan ekspor JSON pertama sebagai cadangan.
- [ ] Ganti `banner.jpg` dan gambar karya dengan aset asli (kompres < 200 KB per gambar, WebP/JPG).
- [ ] Isi meta SEO + Open Graph.
- [ ] Jalankan `npm run build && npm run preview`, uji di viewport 360px dan 1280px.
- [ ] Uji skenario: localStorage kosong, JSON rusak, produk dihapus saat jadi favorit, slot 0.
- [ ] Push ke GitHub → import ke Vercel (Preset Vite) → verifikasi URL produksi.
