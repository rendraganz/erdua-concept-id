Bertindaklah sebagai System Analyst dan Software Engineer. Buat dokumen `SPEC.md` lengkap untuk aplikasi web **"R2 Concept ID"**, sebuah platform profil studio kreatif, katalog portofolio/jasa desain (Livery Truk & Kendaraan, Desain Logo, Custom Lettering, dan Decal/Stiker), serta dashboard manajemen order dan rekap bulanan berbasis web statis modern yang siap di-deploy ke **Vercel** untuk pengerjaan 1 hari.

### 1. Pengguna
- **Calon Klien / Pembeli:** Pengunjung yang melihat banner utama, menjelajahi katalog desain, menyimpan desain ke daftar favorit, melihat detail spesifikasi karya, dan melakukan pemesanan langsung ke WhatsApp admin dengan format pesan otomatis.
- **Pengelola Studio / Admin (R2 Concept ID):** Pemilik usaha yang mengelola daftar katalog karya/jasa (CRUD) serta mencatat dan memantau rekap order/pendapatan bulanan pada perangkat yang sama.

### 2. Fitur MVP
- **Homepage dengan Section Banner Khusus:** Area *Hero / Showcase Banner* khusus di bagian atas homepage untuk menampilkan banner promosi/identitas visual utama milik R2 Concept ID (mendukung gambar banner kustom lokal, efek *glassmorphic overlay*, dan tombol *call-to-action* ke katalog & WhatsApp).
- **Katalog Desain (8 Contoh Karya/Jasa Awal):** Menampilkan karya R2 Concept ID dengan placeholder gambar lokal (`assets/img/...`), kode desain (contoh: `R2-LVR-01`), nama desain/jasa, kategori (*Desain Livery*, *Desain Logo*, *Lettering & Stiker*, *Apparel & Decal*), estimasi harga Rupiah (atau label harga kustom), slot/kuota antrean pengerjaan, badge *Unggulan*, serta modal preview detail spesifikasi file (format CDR/AI/PNG & revisi).
- **Pencarian, Filter & Sorting:** Pencarian berdasarkan nama/kode desain, filter berdasarkan kategori dan filter khusus daftar *Favorit*, serta pengurutan (Terbaru, Unggulan, Harga Terendah, Harga Tertinggi).
- **Fitur Favorit (Wishlist Klien):** Tombol simpan/favorit (ikon hati/bookmark) pada setiap kartu katalog yang tersimpan di `localStorage`, dilengkapi penghitung jumlah favorit di navbar dan tampilan khusus daftar desain yang difavoritkan calon klien untuk dikirim sebagai referensi.
- **Tombol Pesan via WhatsApp Dinamis:** Mengarahkan ke `https://wa.me/...` dengan teks otomatis yang menyesuaikan kategori, kode, dan nama produk yang dipilih (format awal: *"Hai R2 Concept, saya minat dengan product [Kategori] ([Kode] - [Nama Produk])..."*), serta opsi mengirim daftar desain favorit sekaligus.
- **Dashboard Kelola Produk (CRUD):** Tambah, edit, hapus, dan tandai *Unggulan* pada item katalog desain, lengkap dengan ringkasan total karya, total kategori, dan status slot antrean.
- **Dashboard Rekap Bulanan Lengkap:** Pencatatan transaksi/order desain bulanan (tambah/edit/hapus catatan order klien, jenis layanan, nominal DP/pelunasan dalam Rupiah, bulan/tahun transaksi, dan status: *Antre*, *Proses*, *Revisi*, *Selesai*), dilengkapi filter per bulan/tahun, ringkasan total order bulanan, total omzet masuk, rata-rata nilai proyek, dan breakdown jumlah order per kategori.
- **Penyimpanan Lokal (`localStorage`):** Seluruh data katalog, daftar favorit, konfigurasi banner/nomor WA admin, dan data rekap bulanan tersimpan persisten di browser dengan tombol *Reset ke Data Default*.

### 3. Data Model
- **Product / Katalog (`r2_products`):**
  - `id` (string/number unik)
  - `code` (string, contoh: `"R2-LVR-01"`)
  - `nama` (string)
  - `kategori` (enum/string: `"Desain Livery"`, `"Desain Logo"`, `"Lettering & Stiker"`, `"Decal & Apparel"`)
  - `harga` (angka >= 0, `0` ditampilkan sebagai *"Harga Custom / Konsultasi"*)
  - `slot` (integer >= 0, sisa kuota pengerjaan)
  - `deskripsi` (string, mencakup spesifikasi format file master & ketentuan revisi)
  - `imageUrl` (string, path aset gambar lokal)
  - `unggulan` (boolean)
- **Favorit (`r2_favorites`):**
  - Array berisi kumpulan `product.id` yang disimpan pengguna.
- **Rekap Order Bulanan (`r2_monthly_recap`):**
  - `id` (string/number unik)
  - `tanggal` (string format `YYYY-MM-DD`)
  - `bulan` (string format `YYYY-MM` untuk pengelompokan rekap bulanan)
  - `namaKlien` (string, nama klien/armada/komunitas)
  - `produkNama` (string, nama/kode desain yang dipesan)
  - `kategori` (string)
  - `nominal` (angka >= 0 dalam Rupiah)
  - `status` (enum: `"Antre"`, `"Proses"`, `"Revisi"`, `"Selesai"`)
  - `catatan` (string opsional)

### 4. Tema Visual (Glassmorphism, Gaussian Blur, Partikel & Sistem Warna)
- **Konsep Visual Glassmorphic & Gaussian Blur:**
  - Gunakan gaya **Dark Glassmorphism** di mana kartu katalog, navbar, modal preview, dan panel dashboard memiliki latar semi-transparan (`rgba(26, 26, 26, 0.65)` / `--color-color-2`), efek `backdrop-filter: blur(16px)`, serta garis tepi tipis bercahaya (`1px solid rgba(204, 255, 102, 0.18)`).
  - Tambahkan **Gaussian Blur Ambient Orbs** (lingkaran cahaya lembut ber-radius besar dengan `filter: blur(120px)`) menggunakan warna `--color-color-3` (`#ccff66`) dan `--color-color-6` (`#339966`) di lapisan latar belakang agar efek kaca (*glassmorphism*) terlihat kontras dan hidup.
- **Efek Partikel Latar Belakang:**
  - Sertakan sistem **Partikel Ringan (HTML5 Canvas / Vanilla JS)** di lapisan latar belakang (`pointer-events: none`, `z-index: 0`) berupa partikel-partikel kecil berwarna hijau neon (`#ccff66`) dan emerald (`#33cc66`) yang melayang halus dengan performa optimal (60fps, otomatis mengurangi jumlah partikel di perangkat mobile agar tidak membebani baterai/GPU).
- **Sistem Warna CSS (`@theme` Hitam–Hijau):**
  Gunakan token warna berikut sebagai fondasi mutlak seluruh antarmuka:

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


### 5. Tech Stack & Arsitektur Deployment (Vercel Ready)
**Core Stack:**

- Vite (Build tool modern untuk bundling aset cepat & optimasi produksi ke folder dist/).

- JavaScript Vanilla (ES Modules) (Modularisasi kode tanpa framework berat untuk logika katalog, state management localStorage, partikel HTML5 Canvas, dan kalkulasi rekap bulanan).

- Tailwind CSS v4 (@tailwindcss/vite) (Mendukung langsung sintaks @theme untuk token warna kustom, utilitas backdrop-blur, dan responsive design).

- Lucide Icons / SVG Inline (Ikon vektor ringan tanpa beban font eksternal berlebih).

**Konfigurasi Deployment Vercel:**

- Struktur folder statis standar (public/assets/img/ untuk aset gambar & banner agar URL tetap valid setelah proses build Vite).

- Menyertakan konfigurasi vercel.json (aturan rewrites dan cache headers aset statis) sehingga siap di-deploy via GitHub ke Vercel secara zero-configuration (Build Command: npm run build, Output Directory: dist).

- Tanpa backend, tanpa database eksternal, dan tanpa login palsu (perpindahan antara tampilan Katalog Publik dan Dashboard Pengelola menggunakan tab/navigasi yang eksplisit).