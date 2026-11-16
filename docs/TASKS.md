# TASKS.md — R2 Concept ID

Rencana kerja turunan dari `SPEC.md` v1.1 dan `UI-SPEC.md` v1.0. **Belum ada kode** — dokumen ini hanya mendefinisikan urutan kerja, kriteria selesai, file yang disentuh, dan cara menguji.

Rujukan ditulis `SPEC §x` dan `UI §x`. Semua perintah dijalankan dari root repo `r2-concept-id/`.

---

## 0. Cara Memakai

- Kerjakan **M1 → M9 berurutan**. Milestone selesai bila semua acceptance criteria (AC) tercentang **dan** perintah ujinya lulus.
- Satu milestone = satu atau beberapa commit dengan awalan `feat(mN):` / `test(mN):` / `chore(mN):`.
- Sebelum lanjut ke milestone berikutnya: `npm run build` harus hijau (dan `npm run test:run` setelah M7).
- Logika murni (normalisasi nomor, filter/sort, kalkulasi rekap, validasi, izin) **ditulis tanpa akses DOM/`window`** supaya mudah diuji di M7.

### Ringkasan Milestone

| # | Milestone | Estimasi | Bergantung pada |
|---|---|---:|---|
| M1 | Scaffold Vite | 0,75 jam | — |
| M2 | Landing & 8 produk | 2 jam | M1 |
| M3 | Pencarian, filter, sorting (+ Favorit) | 1 jam | M2 |
| M4 | Integrasi WhatsApp | 1 jam | M2, M3 |
| M5 | Dashboard CRUD (+ login & hak akses) | 3 jam | M2, M4 |
| M6 | localStorage & import/export JSON | 1 jam | M5 |
| M7 | Vitest | 1,25 jam | M2–M6 |
| M8 | Security review | 0,75 jam | M5–M7 |
| M9 | Deployment | 0,75 jam | M1–M8 |
| | **Total** | **≈ 11,5 jam** | |

> Total sedikit di atas target ±10 jam di `SPEC §10` karena Vitest dan security review dijadikan milestone sendiri. Bila waktu mepet, ikuti prioritas `SPEC §10`: publik (F2–F5) → login & hak akses (F9) → produk (F6) → ganti nomor WA (F10) → rekap (F7) → ekspor/impor (F8).

---

## 1. Keputusan & Asumsi

`SPEC.md` dan `UI-SPEC.md` punya beberapa titik yang tidak sejalan. Keputusan di bawah dipakai di seluruh milestone; ubah di sini bila tidak setuju.

| # | Topik | Keputusan |
|---|---|---|
| D1 | Tema visual | `UI-SPEC` menggantikan `SPEC §5`: **latar putih**, kartu putih solid, blur hanya di navbar & overlay. Token `@theme` (`SPEC §5.4`) disalin **tanpa mengubah hex**. |
| D2 | Gambar & banner | `UI-SPEC` memakai emoji, `SPEC` memakai `banner.jpg` dan `livery-01.jpg` dst. Dipakai versi `UI-SPEC`: seed `imageUrl: ""` (→ emoji placeholder per kategori), `bannerUrl` default `""` (→ ilustrasi emoji). Aset `public/assets/img/*.jpg` dan `placeholder.svg` **tidak dibuat**; folder hanya dipakai bila admin menambah gambar. |
| D3 | Partikel | Opsional (`UI §13.1`). **Tidak masuk MVP**; hanya dikerjakan sebagai stretch di M2 bila waktu sisa. |
| D4 | Font | Bricolage Grotesque (judul) + Plus Jakarta Sans (teks) via `@fontsource-variable/*`, self-host (sesuai CSP `font-src 'self'`). |
| D5 | Login & hak akses | Tidak ada di daftar 9 milestone, tetapi dashboard wajib login (`SPEC §8`). Dikerjakan di **M5.1** karena menjadi prasyarat CRUD dashboard. Pengerasan lanjutan di M6 dan M8. |
| D6 | Ganti nomor WA | Logika `getWaNumber()` + normalisasi di **M4**; layar Pengaturan-nya di **M5.4** (butuh Owner + verifikasi ulang password). |
| D7 | Seed rekap | 6 order **November 2026** dari `UI §7.1` dengan tanggal tetap. Verifikasi angka memakai filter eksplisit *November 2026*; pada bulan lain filter default "bulan berjalan" memang kosong dan harus menampilkan empty state 📒. |
| D8 | Vitest | Tidak ada di `package.json` `SPEC §7`; ditambahkan sebagai devDependency di M7. M1–M6 diuji manual + build. |
| D9 | Ganti password sendiri (Staf) | `SPEC §8.2` mengizinkan Staf, tetapi `UI §7.5` menyembunyikan menu Akun dari Staf. Asumsi: tombol **"Ganti password saya"** di menu pengguna navbar (kedua peran); halaman **Akun** (kelola Staf) tetap Owner-only. |
| D10 | Label slot | Wireframe `UI §6` menulis "Slot: 3" untuk R2-LVR-01, padahal aturan `SPEC F2`/`UI §5.2` menyebut `1–3` = "Sisa N slot". **Aturan tabel yang berlaku** (wireframe hanya sketsa). |
| D11 | Install di Vercel | `SPEC §7` menyebut `npm install`, `SPEC §8.5` meminta `npm ci`. Dipakai **`npm ci`** (lockfile wajib ter-commit). |
| D12 | Format ekspor JSON | Belum didefinisikan di `SPEC`. Usulan: `{ schemaVersion, exportedAt, products, favorites, recap, settings }`. Tanpa `r2_auth`, `r2_session`, `r2_audit`. |
| D13 | CSV export | Tetap **stretch**, di luar M6. |

**Perlu konfirmasi:** D2 (tanpa aset gambar sama sekali), D5 (auth di M5), D9 (ganti password Staf).

---

## 2. Konvensi Global (berlaku di semua milestone)

- JavaScript vanilla ES Modules, tanpa framework. Struktur folder mengikuti `SPEC §6.2`.
- Data pengguna masuk ke DOM hanya lewat `textContent` / pembuat elemen / `escapeHtml()` (`SPEC §8.5`).
- Semua teks UI Bahasa Indonesia; microcopy mengikuti `UI §10`.
- Kontras, target sentuh ≥ 44 px, `aria-*`, fokus terlihat, dan `prefers-reduced-motion` mengikuti `UI §9`.
- Lime `#ccff66` hanya sebagai **isian**, tidak pernah sebagai teks/ikon di atas putih (`UI §3.2`).
- Perintah dasar (ditambah bertahap): `npm run dev`, `npm run build`, `npm run preview`, lalu `npm test` / `npm run test:run` / `npm run test:coverage` (M7).

---

## M1 — Scaffold Vite

**Tujuan:** proyek Vite + Tailwind v4 berjalan, token warna & font terpasang, kerangka folder dan modul inti siap.

### Tugas
- [ ] Inisialisasi proyek Vite template vanilla, rapikan file contoh bawaan.
- [ ] Pasang Tailwind v4 lewat `@tailwindcss/vite`; `src/styles/main.css` berisi `@import "tailwindcss";` lalu blok `@theme` dari `SPEC §5.4`.
- [ ] Pasang font self-host (D4) dan `lucide` (impor per-ikon).
- [ ] Buat kerangka folder `src/core`, `src/modules`, `src/ui`, `src/utils` (file boleh masih stub).
- [ ] `index.html`: `lang="id"`, `<title>`, meta description, Open Graph (placeholder), skip link, landmark `header/nav/main/footer`.
- [ ] `config.js`: `DEFAULT_WA_NUMBER = "6288228549752"` dan konstanta batas keamanan (iterasi 310000, idle 15 mnt, batas 8 jam, dll.).
- [ ] Util awal: `format.js` (Rupiah, tanggal, bulan Indonesia), `dom.js` (`el`, `escapeHtml`, debounce), `id.js`.
- [ ] `storage.js` + `store.js` versi dasar (get/set aman + pub/sub); `router.js` hash minimal (`#/`, `#/login`, `#/dashboard/*` placeholder).
- [ ] `vite.config.js` dengan `build.sourcemap: false`; `.gitignore` (`node_modules`, `dist`, `.env*`).

### Acceptance Criteria
- [ ] `npm install` sukses dan `package-lock.json` terbentuk.
- [ ] `npm run dev` menyajikan halaman di `localhost:5173` tanpa error/warning konsol.
- [ ] `npm run build` menghasilkan `dist/` (index.html + aset ber-hash) dan **tidak** ada berkas `.map`.
- [ ] Blok `@theme` memuat tepat **96 token** warna (8 keluarga × 12) dengan nilai identik `SPEC §5.4`; utilitas seperti `bg-color-3` dan `text-color-2` bekerja.
- [ ] Heading memakai Bricolage Grotesque, teks memakai Plus Jakarta Sans, dengan fallback `system-ui`; **tidak ada** request ke domain eksternal (fonts.googleapis.com, CDN).
- [ ] `index.html` tidak mengandung inline `<script>` (siap CSP `script-src 'self'`).
- [ ] Hash `#/`, `#/login`, `#/dashboard/produk` berpindah tanpa reload (isi masih placeholder).

### File yang disentuh
`package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `.gitignore`, `public/favicon.svg`, `src/main.js`, `src/styles/main.css`, `src/core/{config,storage,store,router,seed}.js`, `src/utils/{format,dom,id}.js`, stub `src/modules/*.js` dan `src/ui/*.js`.

### Perintah uji
```bash
npm create vite@latest r2-concept-id -- --template vanilla   # sekali, lalu masuk ke foldernya
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install lucide @fontsource-variable/bricolage-grotesque @fontsource-variable/plus-jakarta-sans

npm run build
find dist -name "*.map" | wc -l                                  # harus 0
grep -cE '^\s*--color-color-[0-9]+(-[0-9]+)?:' src/styles/main.css   # harus 96
grep -rnE "googleapis|gstatic|cdn\." index.html dist || echo "OK: tanpa CDN"
npm run dev    # cek manual: konsol bersih, font tampil, hash route berpindah
```

---

## M2 — Landing & 8 Produk

**Tujuan:** halaman publik lengkap secara visual: navbar, hero, katalog 8 produk, modal detail, footer. Logika cari/filter/favorit menyusul di M3, WhatsApp di M4.

### Tugas
- [ ] `seed.js`: 8 produk `p1…p8` sesuai `SPEC §4.8` (`imageUrl: ""`, `createdAt` **naik** dari p1 ke p8 agar urutan "Terbaru" deterministik), 6 order November 2026 (`UI §7.1`), settings default (D2).
- [ ] Navbar sticky 56/64 px (`UI §4.3`): logo, tab **Katalog · Dashboard**, tombol Favorit + badge, tombol Chat WA (desktop), menu ☰ mobile (`UI §6.3`).
- [ ] Hero (`UI §5.6`): label, H1, sub, 2 CTA, baris keunggulan, ilustrasi emoji dengan stiker mengambang, orbs hanya di hero; mode banner gambar bila `bannerUrl` terisi.
- [ ] Kartu produk (`UI §5.2`), grid 1/2/3/4 kolom, kartu sama tinggi.
- [ ] Modal detail (`UI §5.4`): bottom sheet mobile, dialog desktop.
- [ ] `ui/modal.js` (focus trap, ESC, overlay, kembalikan fokus, kunci scroll) dan `ui/toast.js`.
- [ ] Footer gelap; kerangka FAB WhatsApp (perilakunya di M4).
- [ ] Tombol Favorit, Pesan, dan CTA hero **dirender** tetapi belum berfungsi (M3/M4).
- [ ] *(Stretch)* partikel canvas hero (D3).

### Acceptance Criteria
- [ ] Latar halaman putih, teks utama `#1a1a1a`; tidak ada lime/`#33cc66`/`#339966` sebagai teks di atas putih.
- [ ] Hero menampilkan H1 "Desain yang bikin armada & brand kamu dikenal.", 2 CTA, baris keunggulan; ilustrasi punya `role="img"` + `aria-label`, emoji `aria-hidden`; animasi mengambang 6 dtk dan **statis** saat reduced motion; rapi pada 320–1440 px.
- [ ] Bila `settings.bannerUrl` diisi (uji lewat console/`localStorage`) hero beralih ke gambar `object-fit: cover` dengan lapisan putih 80%; bila gagal dimuat kembali ke ilustrasi.
- [ ] 8 kartu tampil dengan kode, nama (maks 2 baris), kategori, harga atau "Harga Custom / Konsultasi", badge Unggulan (p1, p4, p7), tombol Detail dan Pesan.
- [ ] Badge slot memakai ikon + teks sesuai aturan: `>3` "Slot tersedia: N"; `1–3` "Sisa N slot"; `0` "✕ Antrean penuh" dengan tombol berlabel **Tanya Waitlist** (D10).
- [ ] Emoji + tint per kategori (🚚 / 🎯 / 🔤 / 👕) muncul karena `imageUrl` kosong; gambar yang gagal dimuat otomatis berganti emoji.
- [ ] Grid 1 / 2 / 3 / 4 kolom pada < 640 / ≥ 640 / ≥ 1024 / ≥ 1280 px.
- [ ] Navbar sticky tidak menutup judul saat anchor (`scroll-padding-top`); menu mobile: fokus ke item pertama, ESC dan klik luar menutup.
- [ ] Modal: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, tutup via ESC / klik latar / ✕, fokus kembali ke pemicu; menampilkan format file (CDR · AI · PNG), ketentuan revisi, dan deskripsi.
- [ ] Tidak ada scroll horizontal pada 320 px maupun zoom 200%.
- [ ] Tidak ada `innerHTML` dengan data pengguna (data seed pun lewat helper aman).

### File yang disentuh
`index.html`, `src/main.js`, `src/styles/main.css`, `src/core/{seed,store,router}.js`, `src/modules/{hero,catalog}.js`, `src/ui/{modal,toast,icons}.js`, `src/utils/{dom,format}.js`, komponen navbar & footer (di `main.js` atau modul baru `src/ui/{navbar,footer}.js`).

### Perintah uji
```bash
npm run build && npm run preview     # buka http://localhost:4173
# Manual: viewport 320, 360, 768, 1024, 1280, 1440 → tanpa scroll horizontal
# Manual: Tab melewati skip link → navbar → kartu (Detail, Favorit, Pesan); ESC menutup modal
# Manual: DevTools → Rendering → emulate prefers-reduced-motion: reduce
npx lighthouse http://localhost:4173 --only-categories=accessibility --quiet --chrome-flags="--headless"   # target ≥ 90
```

---

## M3 — Pencarian, Filter, Sorting (+ Favorit)

**Tujuan:** katalog interaktif penuh (`SPEC F3`, `F4`; `UI §5.3`). Favorit dikerjakan di sini karena filter "Favorit Saya" bergantung padanya.

### Tugas
- [ ] State UI katalog: `query`, `kategori`, `sort`, `favoritOnly`.
- [ ] Toolbar (`UI §5.3`): input cari (`type="search"`, debounce 200 ms, tombol hapus), chip kategori `aria-pressed`, `<select>` Urutkan, toggle "♡ Favorit (N)", teks jumlah hasil `aria-live="polite"`, tombol Reset filter.
- [ ] Fungsi murni: `filterProducts`, `sortProducts`, `countByKategori`.
- [ ] `favorites.js`: toggle, tanpa duplikat, simpan ke `r2_favorites`, badge navbar (animasi 200 ms), toast, bersihkan ID yatim saat load.
- [ ] Empty state: hasil kosong, favorit kosong, katalog kosong (`UI §6.5`).

### Acceptance Criteria
- [ ] Pencarian pada `nama` dan `code`, case-insensitive, spasi pinggir diabaikan; render tertahan 200 ms setelah ketikan terakhir. Contoh: `lvr` → 3 hasil, `LGO` → 2 hasil, `xyz` → empty state "Belum ada desain yang cocok".
- [ ] Chip: Semua, Desain Livery (3), Desain Logo (2), Lettering & Stiker (2), Decal & Apparel (1); aktif = latar `#1a1a1a` teks putih; baris chip dapat digeser di mobile; dapat dioperasikan dengan Tab + Space.
- [ ] Pencarian, kategori, dan Favorit digabung dengan logika **AND**.
- [ ] Sorting: **Terbaru** (`createdAt` menurun), **Unggulan** (p1, p4, p7 dahulu, lalu terbaru), **Harga Terendah** naik, **Harga Tertinggi** turun — harga `0` **selalu paling akhir** pada kedua mode harga; urutan stabil untuk nilai sama.
- [ ] Teks "Menampilkan X dari Y desain" benar (Y = seluruh produk) dan diumumkan lewat `aria-live`; posisi scroll tidak melompat saat filter berubah.
- [ ] "Reset filter" hanya muncul saat ada filter aktif dan mengembalikan: query kosong, Semua, Terbaru, Favorit mati.
- [ ] Favorit: tombol di kartu dan modal sinkron; `aria-pressed` + label "Simpan R2-LVR-01 ke favorit" / "Hapus … dari favorit"; ikon berubah dari garis ke isi; toast "Ditambahkan ke favorit" / "Dihapus dari favorit".
- [ ] Badge favorit di navbar (desktop dan mobile) selalu sama dengan jumlah favorit sebenarnya.
- [ ] Favorit persisten setelah reload; ID favorit yang tidak ada di katalog dibuang saat load.
- [ ] Filter Favorit dengan 0 favorit → empty state "Belum ada desain favorit" dengan tombol **Jelajahi Katalog** (mematikan filter Favorit dan menggulir ke katalog).

### File yang disentuh
`src/modules/{catalog,favorites}.js`, `src/core/{store,storage}.js`, `src/ui/toast.js`, `src/utils/dom.js`, `src/styles/main.css`, navbar.

### Perintah uji
```bash
npm run build && npm run preview
# Console browser:
#   JSON.parse(localStorage.r2_favorites)                       → array id tanpa duplikat
#   localStorage.r2_favorites = '["p1","p999"]'; location.reload() → "p999" hilang, badge = 1
# Manual: ketik cepat "livery" → render sekali; kombinasi kategori + cari + favorit
```
**Cakupan Vitest (M7):** `tests/catalog.test.js`, `tests/favorites.test.js`.

---

## M4 — Integrasi WhatsApp

**Tujuan:** semua tombol pesan membuka `wa.me` dengan teks yang tepat dan nomor dari satu sumber kebenaran (`SPEC F5`, `§8.4` bagian resolusi nomor).

### Tugas
- [ ] `whatsapp.js`: `normalizeWaNumber`, `isValidWaNumber`, `getWaNumber`, `buildSingleMessage`, `buildWaitlistMessage`, `buildFavoritesMessage`, `buildGreetingMessage`, `buildWaUrl`.
- [ ] Hubungkan ke: CTA hero, kartu, modal, bar favorit, navbar (desktop), footer, FAB.
- [ ] FAB mobile (`UI §5.5`): 56 px, `aria-label="Chat WhatsApp"`, safe-area, disembunyikan di dashboard dan saat modal terbuka; konten diberi `padding-bottom` ±80 px.
- [ ] Bar favorit: muncul saat filter Favorit aktif dan N > 0 (sticky di dasar pada mobile).

### Acceptance Criteria
- [ ] `getWaNumber()` memakai urutan `settings.waNumber` → `VITE_WA_NUMBER` → `DEFAULT_WA_NUMBER`; nilai `VITE_WA_NUMBER` yang tidak valid diabaikan (fallback ke bawaan).
- [ ] **Tidak ada nomor hardcoded** di luar `config.js`; semua tautan WA memakai `getWaNumber()`.
- [ ] Normalisasi memberi `6288228549752` untuk: `088228549752`, `88228549752`, `+62 882-2854-9752`, `(0882) 2854 9752`, `6288228549752`.
- [ ] Validasi `^628[0-9]{8,12}$` menolak: `0812`, `abc`, `628`, nomor non-Indonesia.
- [ ] Pesan **satu produk**, **waitlist** (slot 0), **favorit**, dan **sapaan umum** persis sesuai templat `SPEC F5`; harga `0` ditulis "Harga Custom"; seluruh teks lewat `encodeURIComponent` (baris baru → `%0A`).
- [ ] Pesan favorit memuat daftar bernomor `N. [Kode] - [Nama] ([Kategori]) - [Harga]`; bila melebihi ±1.500 karakter dipotong pada item utuh dan ditutup "…dan N desain lainnya".
- [ ] Tombol berlabel **Pesan via WhatsApp** (isian `#2b7951`, teks putih) atau **Tanya Waitlist** (outline) menyesuaikan slot secara langsung.
- [ ] Tautan berupa `<a target="_blank" rel="noopener noreferrer">` dan href diperbarui saat nomor/produk berubah.
- [ ] Dengan nomor bawaan, tautan berbentuk `https://wa.me/6288228549752?text=…`.
- [ ] FAB hanya tampil di halaman publik mobile; tidak menutup konten terakhir.
- [ ] Domain yang dibangun aplikasi hanya `wa.me`.

### File yang disentuh
`src/modules/{whatsapp,hero,catalog,favorites}.js`, `src/core/config.js`, navbar/footer, `src/styles/main.css`.

### Perintah uji
```bash
npm run build && npm run preview
# Manual: klik tiap tombol → tab baru wa.me; untuk membaca pesan:
#   node -e "console.log(decodeURIComponent(process.argv[1]))" "<tempel URL>"

grep -rnE "6288228549752|088228549752" src | grep -v "src/core/config.js"   # harus kosong

VITE_WA_NUMBER=6281234567890 npm run build && grep -l 6281234567890 dist/assets/*.js   # env ikut ter-bundle
VITE_WA_NUMBER=abc npm run build && grep -l 6288228549752 dist/assets/*.js             # fallback ke bawaan
```
**Cakupan Vitest (M7):** `tests/whatsapp.test.js`.

---

## M5 — Dashboard CRUD

**Tujuan:** dashboard terlindungi login dengan CRUD produk dan order, rekap bulanan, serta pengaturan Owner. Dibagi empat bagian; urutan pengerjaan 5.1 → 5.4.

### 5.1 Login, Peran & Hak Akses (D5)

**Tugas**
- [ ] `permissions.js` (`PERMISSIONS`, `can`, `assertCan`) sesuai matriks `SPEC §8.2`.
- [ ] `auth.js`: setup Owner, login, logout, PBKDF2-SHA256, sesi, lockout, re-auth.
- [ ] `audit.js`: catat dan tampilkan log (maks 100 entri).
- [ ] Route guard di `router.js` dengan whitelist parameter `next`; halaman "Akses ditolak".
- [ ] Layar login/setup (`UI §7.2`), dialog verifikasi ulang, dialog "Tetap masuk" 60 dtk sebelum sesi habis, "Reset total" (ketik `RESET`).

**Acceptance Criteria**
- [ ] `#/dashboard/*` tanpa sesi → `#/login`; setelah login kembali ke rute tujuan. `next` berisi `https://…`, `//…`, atau `javascript:` diabaikan.
- [ ] Belum ada password Owner → wizard "Buat Password Owner": ≥ 10 karakter, bukan `password`/`12345678`/nama studio, ada konfirmasi dan indikator kekuatan (teks + bar). Tidak ada password bawaan di kode.
- [ ] `r2_auth` berisi hash PBKDF2-SHA256 (310.000 iterasi, salt acak 16 B per akun, hash 32 B); tidak ada teks mentah di `localStorage`, `sessionStorage`, audit, atau ekspor; perbandingan hash constant-time.
- [ ] 5 kali salah → kunci 30 dtk, lalu 1 → 5 → 15 menit; kunci bertahan setelah reload; hitung mundur tampil; pesan selalu generik "Password salah."; ada jeda ±400 ms per percobaan.
- [ ] Sesi: token 32 B di `sessionStorage`; idle 15 menit, batas mutlak 8 jam; peringatan 60 dtk dengan tombol "Tetap masuk"; logout menghapus sesi.
- [ ] **Staf** tidak melihat/mengakses Hapus (produk/order), Pengaturan, Akun, Audit; rute terlarang menampilkan "Akses ditolak" + tombol "Kembali ke Produk"; pemanggilan fungsi terlarang ditolak oleh `assertCan` **dan** dicatat.
- [ ] Aksi sensitif (ganti nomor WA, reset, impor, ganti password, kelola akun) meminta password lagi; berlaku 2 menit.
- [ ] Navbar dashboard menampilkan peran aktif dan tombol **Keluar**; banner tetap "Data tersimpan di perangkat ini saja…".
- [ ] Tidak ada objek global (`window.store`, dll.) yang mengekspos fungsi mutasi.

### 5.2 Kelola Produk

**Tugas**
- [ ] `productAdmin.js`: ringkasan, validasi, tambah/edit/hapus/toggle Unggulan.
- [ ] Tabel desktop dan kartu mobile (`UI §7.3`); modal form; `ui/confirm.js` (fokus awal pada **Batal**).
- [ ] Layout dashboard: tab geser < 768, tab 768–1023, sidebar 240 px ≥ 1024 (`UI §7.6`).

**Acceptance Criteria**
- [ ] Ringkasan dengan data seed: **8** karya · **4** kategori terisi · **3** Unggulan · **37** slot tersisa · **1** produk slot habis.
- [ ] Validasi: `code` wajib dan unik (case-insensitive); `nama` wajib ≤ 80; `kategori` salah satu enum; `harga` integer ≥ 0 (`0` = Custom); `slot` integer ≥ 0; `deskripsi` ≤ 1.000; semua angka lolos `Number.isSafeInteger`.
- [ ] `imageUrl` opsional; hanya menerima `/assets/…`, `https://…`, atau `data:image/(png|jpeg|webp);base64,…` ≤ 500 KB; `javascript:` dan `data:image/svg+xml` ditolak.
- [ ] Error inline per field (`aria-invalid`, `aria-describedby`, ikon ⚠), fokus ke field salah pertama, ringkasan `role="alert"`.
- [ ] Tambah/edit/hapus/toggle Unggulan langsung tampil di katalog publik **tanpa reload** (dan tersinkron antar-tab).
- [ ] Produk baru berada paling atas pada sort "Terbaru".
- [ ] Hapus produk meminta konfirmasi `Hapus "{nama}"? Tindakan ini tidak bisa dibatalkan.`, membersihkan favorit yatim, **tidak** menghapus order rekap; hanya Owner; tercatat `PRODUCT_DELETE`.
- [ ] Daftar kosong → empty state 📦 dengan **+ Tambah Produk**.

### 5.3 Rekap Bulanan

**Tugas**
- [ ] `recap.js`: CRUD order, `bulan` diturunkan dari `tanggal`, filter periode/status, kalkulasi, breakdown.
- [ ] Tabel desktop / kartu mobile, kartu statistik, bar breakdown (`UI §7.4`).

**Acceptance Criteria**
- [ ] Field order: `tanggal`, `namaKlien` (wajib ≤ 80), `produkNama`, `kategori` (enum), `nominal` (integer ≥ 0), `status` (Antre/Proses/Revisi/Selesai), `catatan` (≤ 300). `bulan` terisi otomatis `YYYY-MM`.
- [ ] Filter Bulan (default bulan berjalan), Tahun, Status, dan opsi "Semua bulan"; semua angka ringkasan ikut berubah.
- [ ] Dengan seed dan filter **November 2026**: Order **6** · Omzet **Rp 3.675.000** · Rata-rata **Rp 612.500** · Selesai **3** (omzet selesai Rp 2.125.000) · Kategori Livery **3** (Rp 2.900.000), Lettering & Stiker **2** (Rp 425.000), Logo **1** (Rp 350.000), Decal **0** · Status Selesai 3, Proses 1, Revisi 1, Antre 1.
- [ ] Periode kosong: omzet 0, rata-rata 0 (tanpa `NaN`); rata-rata dibulatkan ke Rupiah terdekat.
- [ ] Kartu statistik menampilkan ringkas ("Rp 3,67 jt") dengan nilai penuh ("Rp 3.675.000") tersedia untuk pembaca layar.
- [ ] Bar breakdown berisi `#339966`, nama dan angka kategori selalu tertulis; badge status ikon + teks (○ ◔ ↻ ✓) sesuai warna `UI §5.7`.
- [ ] Hapus order hanya Owner, tercatat `ORDER_DELETE`; empty state 📒 "Belum ada order di {bulan} {tahun}".

### 5.4 Pengaturan, Akun & Audit (Owner)

**Tugas**
- [ ] `settings.js`: Kontak WhatsApp, Banner & teks hero.
- [ ] Halaman Akun (ganti password Owner, buat/ganti/hapus Staf) dan Audit Log; menu "Ganti password saya" untuk kedua peran (D9).

**Acceptance Criteria**
- [ ] Kontak WhatsApp (`UI §7.5`): menerima `08…`, `8…`, `62…`, `+62…`; menampilkan *Tersimpan sebagai* `6288228549752`, *Tampilan* `+62 882-2854-9752`, *Pratinjau tautan* `wa.me/6288228549752`; error "Nomor tidak valid. Contoh: 0882xxxxxxxx".
- [ ] Tombol **Tes Buka WhatsApp** memakai pesan "Tes nomor dari dashboard R2 Concept ID".
- [ ] **Simpan** → verifikasi password → `r2_settings.waNumber` → toast "Nomor WhatsApp diperbarui"; seluruh tombol WA langsung memakai nomor baru tanpa reload; audit `WA_CHANGE` hanya berisi empat digit terakhir nomor lama/baru.
- [ ] **Kembalikan ke nomor bawaan** menghapus override.
- [ ] Kotak info wajib tampil: perubahan hanya berlaku di perangkat ini, jalur global lewat `VITE_WA_NUMBER` di Vercel (+ nilai siap salin).
- [ ] Banner & teks hero (`bannerUrl`, `heroHeadline`, `heroSubheadline`) dapat diubah Owner dan langsung tampil di beranda; `bannerUrl` memakai validasi `imageUrl` yang sama.
- [ ] Akun: ganti password Owner dan kelola Staf (satu akun per peran) meminta verifikasi ulang; Staf dapat mengganti password sendiri.
- [ ] Audit Log: terbaru di atas, maks 100 entri, tidak pernah memuat password; hanya Owner.

### File yang disentuh (M5)
`src/core/router.js`, `src/core/store.js`, `src/core/config.js`, `src/modules/{auth,permissions,audit,productAdmin,recap,settings,security}.js`, `src/ui/{confirm,modal,toast}.js`, `src/utils/{format,dom,id}.js`, `src/styles/main.css`, `src/main.js`, komponen layout dashboard.

### Perintah uji
```bash
npm run build && npm run preview
# Skenario manual:
#  1) Buka #/dashboard/produk tanpa login → diarahkan ke #/login; buat password → masuk
#  2) Salah password 5× → terkunci; reload → hitung mundur berlanjut
#  3) Login sebagai Staf → tidak ada tombol Hapus/Pengaturan/Akun/Audit; buka #/dashboard/pengaturan → "Akses ditolak"
#  4) Tambah produk dengan code duplikat "r2-lvr-01" → ditolak; imageUrl "javascript:alert(1)" → ditolak
#  5) Rekap: filter November 2026 → cocok dengan angka AC 5.3
#  6) Ganti nomor ke 0812-3456-7890 → semua tombol WA berubah; "Kembalikan bawaan" → pulih
# Console:
#   localStorage.r2_auth                      → hanya algo/iter/salt/hash, tanpa teks password
#   JSON.parse(localStorage.r2_auth).lockUntil → epoch ms saat terkunci
grep -rniE "admin123|password123|defaultPassword" src || echo "OK: tanpa password bawaan"
```
**Cakupan Vitest (M7):** `permissions`, `auth`, `audit`, `productValidation`, `recap`.

---

## M6 — localStorage & Import/Export JSON

**Tujuan:** penyimpanan lokal yang tahan rusak dan cadangan data yang aman (`SPEC F8`, `§4.9`, `§8.5`).

### Tugas
- [ ] Perkuat `storage.js`: parsing `try/catch` → fallback default + toast; fallback **in-memory** bila `localStorage` tidak tersedia + banner "Data tidak akan tersimpan".
- [ ] `r2_meta` (`schemaVersion`, `seeded`) dan kerangka migrasi.
- [ ] Sinkron antar-tab lewat event `storage`.
- [ ] Reset ke Data Default di Pengaturan (katalog, favorit, rekap, pengaturan).
- [ ] Ekspor JSON (Owner) dan impor JSON (Owner) dengan validator di `security.js` (D12).
- [ ] Pengingat ekspor berkala di UI dashboard.

### Acceptance Criteria
- [ ] `localStorage.r2_products = '{rusak'` lalu reload → aplikasi **tidak crash**, katalog kembali ke seed, toast peringatan tampil; berlaku untuk setiap kunci `r2_*`.
- [ ] Saat `localStorage` melempar error (mode privat/penuh) aplikasi tetap berjalan dengan state in-memory dan banner peringatan.
- [ ] Mengubah data di tab A tampil di tab B tanpa reload.
- [ ] `r2_meta.schemaVersion` tersimpan; data tanpa/lebih lama dari versi sekarang dimigrasi tanpa kehilangan isi.
- [ ] **Reset ke Data Default**: hanya Owner, verifikasi password + dialog konfirmasi; memulihkan 8 produk seed, favorit kosong, rekap seed, pengaturan default; `r2_auth` tidak ikut terhapus; tercatat `RESET`.
- [ ] **Ekspor**: berkas `r2-concept-id-backup-YYYY-MM-DD.json` berisi `schemaVersion`, `exportedAt`, `products`, `favorites`, `recap`, `settings`; **tidak** memuat `r2_auth`, `r2_session`, `r2_audit`, atau password; tercatat `EXPORT`.
- [ ] **Impor**: hanya Owner, verifikasi password + konfirmasi; ukuran ≤ 2 MB; skema divalidasi ketat per koleksi (tipe, enum, panjang, `Number.isSafeInteger`, `imageUrl` aman); kunci tak dikenal dibuang; `__proto__`/`constructor`/`prototype` ditolak; kunci `r2_auth`/`r2_session`/`r2_audit` ditolak/diabaikan; **atomik** (gagal sebagian = tidak ada yang berubah); tercatat `IMPORT`.
- [ ] Round-trip: ekspor → reset → impor menghasilkan data identik.
- [ ] Setelah impor, favorit yatim dibersihkan dan semua tampilan (katalog, dashboard) ter-render ulang.

### File yang disentuh
`src/core/{storage,store,seed,config}.js`, `src/modules/{settings,security,audit,favorites}.js`, `src/ui/{toast,confirm}.js`, `src/main.js`.

### Perintah uji
```bash
npm run build && npm run preview
# Console (satu per satu, lalu reload):
#   localStorage.setItem('r2_products','{rusak')
#   localStorage.setItem('r2_recap','null')
# Berkas impor berbahaya untuk uji manual:
echo '{"__proto__":{"polluted":true},"products":[]}' > /tmp/evil-proto.json
echo '{"r2_auth":{"owner":{}},"products":[]}'        > /tmp/evil-auth.json
node -e "require('fs').writeFileSync('/tmp/big.json','{\"a\":\"'+'x'.repeat(2.1e6)+'\"}')"
# Setelah mengimpor tiap berkas: semuanya ditolak/diabaikan dan  ({}).polluted === undefined
```
**Cakupan Vitest (M7):** `tests/storage.test.js`, `tests/security.test.js`.

---

## M7 — Vitest

**Tujuan:** uji otomatis untuk seluruh logika murni dan aturan keamanan yang dibangun di M2–M6.

### Tugas
- [ ] Pasang `vitest`, `jsdom` (atau `happy-dom`), `@vitest/coverage-v8`; konfigurasi lewat kunci `test` di `vite.config.js` atau `vitest.config.js`.
- [ ] Tambah skrip: `test` (watch), `test:run` (sekali jalan), `test:coverage`.
- [ ] Tulis uji per modul (tabel di bawah). Uji DOM memakai `// @vitest-environment jsdom`; uji `auth` memakai environment `node` (WebCrypto asli).
- [ ] Uji `auth` mengganti jumlah iterasi PBKDF2 menjadi kecil agar cepat; **satu uji** memastikan nilai produksi di `config.js` tetap 310.000.
- [ ] Lockout dan timeout sesi diuji dengan *fake timers*.

| Berkas uji | Yang diverifikasi |
|---|---|
| `format.test.js` | Rupiah, tanggal, nama bulan, `escapeHtml` |
| `whatsapp.test.js` | Tabel kasus normalisasi/validasi (M4), 4 templat pesan, pemotongan ±1.500 karakter, encoding, resolusi 3 tingkat `getWaNumber` |
| `catalog.test.js` | Cari nama/kode, filter AND, 4 sorting (harga 0 di akhir, urutan stabil), hitung per kategori |
| `favorites.test.js` | Toggle, tanpa duplikat, pembersihan ID yatim |
| `productValidation.test.js` | Semua aturan `SPEC F6` termasuk kode duplikat case-insensitive |
| `recap.test.js` | Angka demo `UI §7.1`, periode kosong = 0, `bulan` turunan, filter periode/status |
| `permissions.test.js` | Matriks `SPEC §8.2` lengkap (table-driven), `assertCan` menolak dan mencatat |
| `auth.test.js` | Hash/verify, salt unik, kebijakan password, eskalasi lockout 30 dtk/1/5/15 mnt, idle 15 mnt, batas 8 jam, re-auth 2 mnt, tanpa teks mentah di storage |
| `audit.test.js` | Maks 100 entri, terbaru di depan, tanpa password, `WA_CHANGE` hanya 4 digit |
| `storage.test.js` | JSON rusak, storage melempar error, migrasi `schemaVersion`, event antar-tab |
| `security.test.js` | Whitelist/blacklist `imageUrl`, validator impor (proto pollution, kunci terlarang, ukuran, tipe salah, batas panjang), whitelist `next`, (stretch) awalan formula CSV |
| `vercel-config.test.js` | `vercel.json` memuat CSP (`script-src 'self'`, tanpa `unsafe-eval`, `frame-ancestors 'none'`), HSTS, `X-Frame-Options`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP/CORP; `/assets/img/*` tidak `immutable` |

### Acceptance Criteria
- [ ] `npm run test:run` hijau, tanpa uji flaky, selesai < 30 dtk.
- [ ] Setiap baris AC logika murni di M3–M6 punya setidaknya satu uji yang gagal bila perilakunya dihapus.
- [ ] Cakupan baris ≥ **80%** untuk modul logika murni (`whatsapp`, logika `catalog`, `recap`, validasi produk, `security`, `permissions`, `auth`, `storage`, `audit`); tidak mengejar angka untuk kode UI.
- [ ] Setiap bug yang ditemukan selama M7 mendapat uji regresi.
- [ ] Berkas uji tidak ikut ke bundle: `npm run build` tetap hijau dan ukuran `dist/` tidak bertambah.

### File yang disentuh
`package.json`, `package-lock.json`, `vite.config.js` (atau `vitest.config.js`), `tests/*.test.js`, `tests/fixtures/*` (data impor berbahaya), perbaikan kecil pada modul sumber bila uji menemukan bug.

### Perintah uji
```bash
npm install -D vitest jsdom @vitest/coverage-v8   # gunakan versi Vitest yang kompatibel dengan mayor Vite yang terpasang
npm run test:run
npx vitest run tests/whatsapp.test.js              # satu berkas
npm run test:coverage
npm run build                                      # pastikan build tidak terpengaruh
```

---

## M8 — Security Review

**Tujuan:** menelaah seluruh kontrol `SPEC §8` terhadap kode yang sudah jadi, memperbaiki temuan, dan mendokumentasikan risiko yang diterima. Pengecekan header di lingkungan produksi diselesaikan di M9 (preview deployment).

### Tugas
- [ ] Telaah statis kode (XSS, injeksi, penyimpanan rahasia, tautan eksternal).
- [ ] Uji payload manual dan otomatis pada semua field teks dan jalur impor.
- [ ] Audit dependensi dan konfigurasi CSP.
- [ ] Tulis `docs/SECURITY-REVIEW.md`: daftar pemeriksaan, hasil, perbaikan, dan risiko yang diterima.
- [ ] Tambahkan bagian "Batasan keamanan" (UI gate, bukan keamanan server) ke `README.md`.

### Acceptance Criteria
- [ ] Pencarian statis tidak menemukan `eval`, `new Function`, `document.write`; setiap `innerHTML`/`outerHTML`/`insertAdjacentHTML` yang tersisa hanya berisi konstanta dan didaftarkan di review.
- [ ] Payload `<script>alert(1)</script>` dan `<img src=x onerror=alert(1)>` pada nama produk, deskripsi, nama klien, dan catatan tampil sebagai **teks biasa** di katalog, modal, tabel, dialog konfirmasi, toast, audit, dan pesan WhatsApp (ter-encode); tidak ada eksekusi.
- [ ] `imageUrl`/`bannerUrl` `javascript:…` dan `data:image/svg+xml,…` ditolak di form, di pengaturan, **dan** di jalur impor.
- [ ] Impor dengan `__proto__`, kunci `r2_auth`, berkas > 2 MB, atau tipe salah ditolak/diabaikan; `Object.prototype` tidak tercemar.
- [ ] Tidak ada password/hash di ekspor, log konsol, atau audit; hash tidak dapat dipakai langsung untuk login.
- [ ] Pemanggilan fungsi mutasi sebagai Staf (di luar UI) ditolak dan tercatat; tidak ada objek global yang mengekspos store.
- [ ] `dist/index.html` tanpa inline script; tidak ada kebutuhan `unsafe-eval`; `style-src 'unsafe-inline'` dan `img-src https:` dicatat sebagai **risiko diterima** beserta alasannya.
- [ ] Semua `target="_blank"` memakai `rel="noopener noreferrer"`; satu-satunya domain eksternal yang dibangun aplikasi adalah `wa.me`.
- [ ] `npm audit` tanpa temuan **high/critical**; `npm ci` bersih; dependensi minimal; tanpa skrip/CDN pihak ketiga.
- [ ] Tidak ada rahasia di repo; `.env*` di-ignore; dicatat bahwa `VITE_*` bersifat publik.
- [ ] Pesan login generik (termasuk bila akun Staf belum dibuat); lockout tidak dapat dilewati dengan reload.
- [ ] Setiap temuan berstatus *diperbaiki* (dengan uji regresi di M7) atau *diterima* (dengan alasan tertulis).

### File yang disentuh
`docs/SECURITY-REVIEW.md` (baru), `README.md`, `vercel.json`, `src/modules/{security,auth,permissions,settings}.js`, `tests/*` (regresi), `package.json`.

### Perintah uji
```bash
grep -rnE "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function" src
grep -rn  'target="_blank"' src | grep -v noopener || echo "OK: semua _blank ber-rel aman"
grep -rnE "window\.(store|auth|permissions)\s*=" src || echo "OK: tidak ada global mutasi"

npm run build
grep -c "<script" dist/index.html                      # hanya <script type="module" src="…"> (tanpa isi inline)
npm audit
npm audit --omit=dev
npm ci

npm run test:run
git grep -nIiE "(secret|api[_-]?key|token)\s*[:=]" -- . ':!package-lock.json' ':!tests' || echo "OK"
```

---

## M9 — Deployment

**Tujuan:** aplikasi live di Vercel dengan header keamanan aktif dan performa sesuai target (`SPEC §7`, `§9`, `§14`).

### Tugas
- [ ] Finalisasi `vercel.json` sesuai `SPEC §7` (header keamanan, cache, rewrite).
- [ ] Lengkapi `README.md` (setup, skrip, variabel lingkungan, batasan keamanan, cara ganti nomor WA global).
- [ ] Lengkapi meta SEO + Open Graph; favicon.
- [ ] Push ke GitHub; import ke Vercel: Framework Preset **Vite**, Build `npm run build`, Output `dist`, Install `npm ci` (D11).
- [ ] Opsional: set `VITE_WA_NUMBER` di Vercel (Settings → Environment Variables).
- [ ] Deploy **Preview** → verifikasi → promosikan ke **Production**.

### Acceptance Criteria
- [ ] `npm ci && npm run build` bersih di lokal; `package-lock.json` ter-commit.
- [ ] Deploy Vercel berhasil tanpa konfigurasi tambahan di luar preset; beranda, 8 produk, dan font termuat di URL produksi tanpa request ke domain eksternal.
- [ ] Header produksi hadir: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`; target skor A di securityheaders.com.
- [ ] Konsol: **0 pelanggaran CSP** dan 0 error pada beranda, login, dan dashboard.
- [ ] Cache: `/assets/*.js|css|woff2` ber-`immutable`; `/` `must-revalidate`; `/assets/img/*` 1 hari + SWR (bukan `immutable`).
- [ ] Muat ulang pada `#/dashboard/produk` tidak menghasilkan 404.
- [ ] Lighthouse mobile: Performance ≥ **90**, LCP < **2,5 s**, CLS < **0,05**, Accessibility ≥ 90; bundle JS gzip < **80 KB** (di luar gambar).
- [ ] Tautan WA di produksi `https://wa.me/6288228549752?text=…` (atau nomor dari `VITE_WA_NUMBER` bila diset).
- [ ] Skenario lolos di produksi: localStorage kosong, JSON rusak, produk dihapus saat jadi favorit, slot 0, viewport 360 dan 1280 px.
- [ ] Password Owner dibuat saat pertama kali membuka dashboard produksi (disimpan di password manager) dan ekspor JSON pertama dilakukan.
- [ ] Tidak ada rahasia di repo; `SPEC §14` (checklist pra-deploy) seluruhnya tercentang.

### File yang disentuh
`vercel.json`, `README.md`, `index.html`, `package.json`, `package-lock.json`, `.gitignore`, `public/favicon.svg`.

### Perintah uji
```bash
npm ci && npm run build
for f in dist/assets/*.js; do printf "%s " "$f"; gzip -c "$f" | wc -c; done   # total < 81920 byte

git push -u origin main                 # lalu import repo di Vercel
# atau via CLI:  npx vercel   (preview)   →   npx vercel --prod

curl -sI https://<domain-preview-atau-produksi> | grep -iE "content-security-policy|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy|cross-origin"
curl -sI https://<domain>/assets/<file-hash>.js | grep -i cache-control
curl -s -o /dev/null -w "%{http_code}\n" https://<domain>/dashboard/produk      # 200 (rewrite)

npx lighthouse https://<domain> --only-categories=performance,accessibility,seo --quiet --chrome-flags="--headless"
npm audit
```

---

## Lampiran A — Keterlacakan Fitur → Milestone

| Sumber | Fitur | Milestone |
|---|---|---|
| SPEC F1 + UI §5.6 | Hero & banner | M2 (pengaturan banner: M5.4) |
| SPEC F2 | Katalog 8 karya, modal detail, slot | M2 |
| SPEC F3 | Cari, filter, sorting | M3 |
| SPEC F4 | Favorit | M3 (kirim via WA: M4) |
| SPEC F5 | Pesan via WhatsApp | M4 |
| SPEC F6 | CRUD produk | M5.2 |
| SPEC F7 | Rekap bulanan | M5.3 |
| SPEC F8 | Penyimpanan lokal, reset, ekspor/impor | M6 |
| SPEC F9 / §8.2–8.3 | Login, peran, sesi, lockout | M5.1 |
| SPEC F10 / §8.4 | Ganti nomor WhatsApp | M4 (logika) + M5.4 (UI) |
| SPEC §8.5 | Hardening, audit log | M5.1, M6, M8 |
| SPEC §7 | Vercel & header keamanan | M1 (config dasar), M8, M9 |
| UI §3, §9 | Token, kontras, aksesibilitas | M1–M2 (dasar), diverifikasi tiap milestone |
| UI §12 | Kriteria penerimaan UI | M2–M5 |
