import { getCategories, getCurrentUser, listUsers, login, logout, register, createUser, deleteUser, filterProducts, buildWhatsAppUrl, getProductsNotice, clearProductsNotice, exportProductsJSON, importProductsJSON, resetDemoProducts } from './store.js'
import { createProduct, deleteProduct, listProducts, updateProduct, WHATSAPP_NUMBER, generateProductCode } from './products.js'
import { formatRupiah } from './format.js'

const BANNER_URL = 'https://i.imgur.com/FcGHtpi.png'
const LOGIN_BANNER_URL = 'https://i.imgur.com/WoCkdb7.png'

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
function harga(p) { return p.price > 0 ? formatRupiah(p.price) : 'Harga Custom / Konsultasi' }
function slotInfo(p) {
  if (p.slot > 3) return { text: `Slot tersedia: ${p.slot}`, cls: 's-ok' }
  if (p.slot > 0) return { text: `Sisa ${p.slot} slot`, cls: 's-low' }
  return { text: 'Antrean penuh', cls: 's-no' }
}
function hue(p) {
  const i = Math.max(0, getCategories().indexOf(p.category))
  return `h${i}`
}

function waHref(product) {
  try {
    return buildWhatsAppUrl(WHATSAPP_NUMBER, product)
  } catch {
    return '#'
  }
}

function canManageProducts(user) {
  return user && (user.role === 'admin' || user.role === 'superadmin')
}
function canManageUsers(user) {
  return user && user.role === 'superadmin'
}

export function renderApp(root, state = { page: 'katalog', q: '', cat: 'Semua', sort: 'nama-asc', editingId: null }) {
  const user = getCurrentUser()
  let page = state.page || 'katalog'

  if (page === 'admin-user' && !canManageUsers(user)) page = canManageProducts(user) ? 'admin-produk' : 'katalog'
  if (page === 'admin-produk' && !canManageProducts(user)) page = 'katalog'

  const notice = getProductsNotice()
  root.innerHTML = `
    ${nav(user, page)}
    ${notice ? `<div class="notice wrap"><div class="notice-inner glass"><span>${esc(notice)}</span><button class="btn sm" id="dismiss-notice">Tutup</button></div></div>` : ''}
    <main id="view"></main>
    <footer class="foot">© R2 Concept ID — Livery, Logo, Lettering &amp; Decal. Data produk: <code>erdua:products:v1</code> (localStorage).</footer>
  `
  const view = root.querySelector('#view')
  if (!user) {
    renderLogin(view, state.authMode || 'login')
  } else if (page === 'admin-produk' || page === 'admin-user') {
    renderAdmin(view, user, { ...state, page })
  } else {
    renderCatalog(view, user, { ...state, page })
  }
  bindNav(root, user, { ...state, page })
  root.querySelector('#dismiss-notice')?.addEventListener('click', () => { clearProductsNotice(); renderApp(root, { ...state, page }) })
}

function nav(user, page) {
  let tabs = `<span class="tab muted">Katalog</span>`
  if (user) {
    if (canManageUsers(user)) {
      tabs = `<a href="#" class="tab" data-page="katalog" ${page === 'katalog' ? 'aria-current="page"' : ''}>Katalog</a>
         <a href="#" class="tab" data-page="admin-produk" ${page === 'admin-produk' ? 'aria-current="page"' : ''}>Kelola Produk</a>
         <a href="#" class="tab" data-page="admin-user" ${page === 'admin-user' ? 'aria-current="page"' : ''}>Kelola User</a>`
    } else if (canManageProducts(user)) {
      tabs = `<a href="#" class="tab" data-page="katalog" ${page === 'katalog' ? 'aria-current="page"' : ''}>Katalog</a>
         <a href="#" class="tab" data-page="admin-produk" ${page === 'admin-produk' ? 'aria-current="page"' : ''}>Kelola Produk</a>`
    } else {
      tabs = `<a href="#" class="tab" data-page="katalog" aria-current="page">Katalog</a>`
    }
  }
  const theme = (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const iconSun = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/></svg>`
  const iconMoon = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>`
  const iconMenu = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
  const iconClose = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
  const themeIcon = theme === 'dark' ? iconSun : iconMoon
  const themeTitle = theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'
  const actions = user
    ? `<button class="btn sm icon-btn" id="theme-toggle" aria-label="${themeTitle}" title="${themeTitle}">${themeIcon}</button><span class="user-chip">${esc(user.name)} <b>(${esc(user.role)})</b></span><button class="btn sm" id="logout-btn">Logout</button>`
    : `<button class="btn sm icon-btn" id="theme-toggle" aria-label="${themeTitle}" title="${themeTitle}">${themeIcon}</button><button class="btn sm pri" id="go-login">Login</button>`
  return `<nav class="top">
    <div class="nav-container navin">
      <div class="nav-left"><div class="logo">R2<b>Concept</b>ID</div></div>
      <div class="nav-center">${tabs}</div>
      <div class="nav-right">${actions}</div>
      <button class="btn sm icon-btn nav-burger" id="nav-burger" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-mobile">${iconMenu}</button>
    </div>
    <div class="nav-mobile" id="nav-mobile" data-open="false" data-icon-menu='${iconMenu.replace(/'/g, "&#39;")}' data-icon-close='${iconClose.replace(/'/g, "&#39;")}'>
      <div class="nav-mobile-inner">
        <div class="nav-mobile-center">${tabs}</div>
        <div class="nav-mobile-right">${actions}</div>
      </div>
    </div>
  </nav>`
}

function renderLogin(view, mode = 'login') {
  const eye = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`
  const eyeOff = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.06-5.94"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.8 21.8 0 0 1-3.17 4.13"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>`
  const isLogin = mode === 'login'
  view.innerHTML = `
    <section class="auth">
      <div class="glass auth-split">
        <div class="auth-media" aria-hidden="true">
          <img src="${esc(LOGIN_BANNER_URL)}" alt="Banner R2 Concept ID">
        </div>
        <div class="auth-form panel">
          <h1>${isLogin ? 'Masuk' : 'Daftar'} ke R2 Concept ID</h1>
          <p class="muted">${isLogin ? 'Masuk untuk mengelola atau melakukan pemesanan.' : 'Buat akun pembeli untuk melakukan pemesanan via WhatsApp.'}</p>
          <form id="auth-form" class="stack">
            ${isLogin ? '' : '<label>Nama<input class="field" name="name" type="text" required placeholder="Nama lengkap"></label>'}
            <label>Email<input class="field" id="auth-email" name="email" type="email" required placeholder="nama@email.com"></label>
            <label>Password
              <div class="password-wrap">
                <input class="field" id="auth-password" name="password" type="password" required placeholder="••••••">
                <button type="button" class="pass-toggle" id="toggle-pass" aria-label="Tampilkan password" title="Tampilkan password">${eye}</button>
              </div>
            </label>
            <button class="btn pri" type="submit">${isLogin ? 'Masuk' : 'Daftar'}</button>
            <p id="auth-err" class="err"></p>
          </form>
          <p class="muted small auth-switch">${isLogin ? 'Belum punya akun? <a href="#" id="to-register">Daftar</a>' : 'Sudah punya akun? <a href="#" id="to-login">Login</a>'}</p>
          ${isLogin ? `<div class="hint"><b>Akun dummy:</b><br>Superadmin: superadmin@r2concept.id / super123<br>Admin: admin@r2concept.id / admin123<br>Pembeli: budi@mail.com / budi123</div>` : ''}
        </div>
      </div>
    </section>
  `
  const form = view.querySelector('#auth-form')
  const pass = view.querySelector('#auth-password')
  const email = view.querySelector('#auth-email')
  const err = view.querySelector('#auth-err')
  const toggle = view.querySelector('#toggle-pass')
  if (toggle && pass) {
    toggle.dataset.eye = eye
    toggle.dataset.eyeoff = eyeOff
    toggle.addEventListener('click', () => {
      const show = pass.type === 'password'
      pass.type = show ? 'text' : 'password'
      toggle.innerHTML = show ? toggle.dataset.eyeoff : toggle.dataset.eye
      toggle.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password')
      toggle.setAttribute('title', show ? 'Sembunyikan password' : 'Tampilkan password')
    })
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    pass?.classList.remove('input-error')
    email?.classList.remove('input-error')
    const fd = new FormData(form)
    if (isLogin) {
      const u = login(fd.get('email'), fd.get('password'))
      if (!u) {
        if (err) err.textContent = 'Email atau password salah.'
        pass?.classList.add('input-error')
        email?.classList.add('input-error')
        return
      }
      renderApp(document.querySelector('#app'), { page: (u.role === 'admin' || u.role === 'superadmin') ? 'admin-produk' : 'katalog' })
    } else {
      const res = register({ name: fd.get('name'), email: fd.get('email'), password: fd.get('password') })
      if (res.error) {
        if (err) err.textContent = res.error
        if (/email/i.test(res.error)) email?.classList.add('input-error')
        return
      }
      renderApp(document.querySelector('#app'), { page: 'katalog' })
    }
  })
  view.querySelector('#to-register')?.addEventListener('click', (e) => { e.preventDefault(); renderLogin(view, 'register') })
  view.querySelector('#to-login')?.addEventListener('click', (e) => { e.preventDefault(); renderLogin(view, 'login') })
}

function renderCatalog(view, user, state) {
  const q = state.q || ''
  const cat = state.cat || 'Semua'
  const sort = state.sort || 'nama-asc'
  const products = filterProducts(listProducts(), { query: q, kategori: cat, sort })
  const cats = ['Semua', ...getCategories()]
  view.innerHTML = `
    <section class="banner-hero">
      <div class="banner-full banner-fixed"><img src="${esc(BANNER_URL)}" alt="Banner R2 Concept ID"></div>
      <header class="hero hero-below">
        <div class="wrap hero-below-inner">
          <h1>Livery, logo, dan lettering yang bikin armada Anda dikenal.</h1>
          <p>Studio desain R2 Concept ID: livery truk & kendaraan, logo, custom lettering, dan decal. Konsultasi dulu, slot terbatas.</p>
          <div class="cta-row">
            <a class="btn pri" href="#katalog">Lihat Katalog</a>
          </div>
        </div>
      </header>
    </section>
    <section id="katalog" class="section"><div class="wrap">
      <div class="sec-h"><h2>Katalog Desain</h2></div>
      <div class="tools">
        <input class="field" id="q" type="search" placeholder="Cari nama atau deskripsi" value="${esc(q)}">
        <select class="field" id="sort" aria-label="Urutkan">
          <option value="nama-asc" ${sort === 'nama-asc' ? 'selected' : ''}>Nama A–Z</option>
          <option value="harga-asc" ${sort === 'harga-asc' ? 'selected' : ''}>Harga termurah</option>
          <option value="harga-desc" ${sort === 'harga-desc' ? 'selected' : ''}>Harga termahal</option>
        </select>
        <div class="chips">${cats.map((c) => `<button class="chip" data-cat="${esc(c)}" ${cat === c ? 'aria-pressed="true"' : ''}>${esc(c)}</button>`).join('')}</div>
      </div>
      <div class="grid">
        ${products.length
          ? products.map((p) => productCard(p)).join('')
          : `<div class="empty glass"><h3>Hasil tidak ditemukan</h3><p>Tidak ada produk yang cocok dengan pencarian/filter Anda. Coba ubah kata kunci, kategori, atau urutan.</p></div>`}
      </div>
    </div></section>
  `

  view.querySelectorAll('[data-cat]').forEach((b) => b.addEventListener('click', () => {
    renderApp(document.querySelector('#app'), { ...state, page: 'katalog', cat: b.dataset.cat, sort, q })
  }))
  view.querySelector('#sort')?.addEventListener('change', (e) => {
    renderApp(document.querySelector('#app'), { ...state, page: 'katalog', sort: e.target.value, cat, q })
  })
  let db
  view.querySelector('#q')?.addEventListener('input', (e) => {
    clearTimeout(db)
    db = setTimeout(() => renderApp(document.querySelector('#app'), { ...state, page: 'katalog', q: e.target.value, cat, sort }), 250)
  })
}

function productCard(p) {
  const s = slotInfo(p)
  const outOfStock = Number(p.slot) === 0
  const wa = waHref(p)
  const action = outOfStock
    ? `<button class="btn sm pri" disabled title="Stok habis">Pesan via WhatsApp</button>`
    : `<a class="btn sm pri" href="${wa}" target="_blank" rel="noopener noreferrer">Pesan via WhatsApp</a>`
  return `
    <article class="card glass">
      <div class="thumb ${hue(p)}">
        ${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ''}
        <span class="code">${esc(p.code)}</span>
        ${p.featured ? '<span class="star">Unggulan</span>' : ''}
      </div>
      <div class="body">
        <h3>${esc(p.name)}</h3>
        <span class="cat">${esc(p.category)}</span>
        <span class="price">${harga(p)}</span>
        <span class="slot ${s.cls}">${s.text}</span>
        <p class="desc">${esc(p.description)}</p>
        <div class="acts">${action}</div>
      </div>
    </article>`
}

function renderAdmin(view, user, state) {
  if (state.page === 'admin-user' && canManageUsers(user)) return renderAdminUsers(view)
  return renderAdminProducts(view, state)
}

function renderAdminProducts(view, state) {
  const products = listProducts()
  const editing = state.editingId ? products.find((p) => p.id === state.editingId) : null
  const cats = getCategories()
  const defaultCat = cats[0]
  const f = editing || { code: generateProductCode(defaultCat, products), name: '', category: defaultCat, price: 0, slot: 0, description: '', imageUrl: '', featured: false }
  view.innerHTML = `
    <section class="section"><div class="wrap">
      <div class="glass panel" style="margin-bottom:14px">
        <h2>Data Produk (Demo)</h2>
        <p class="muted small" style="margin-bottom:10px">Simpan/muat array produk di localStorage key <code>erdua:products:v1</code>. Validasi: nama string, kategori valid, harga &ge; 0, stok (slot) integer &ge; 0. Impor gagal tidak menghapus data lama.</p>
        <div class="row" style="margin-bottom:8px">
          <button class="btn sm" id="export-json">Export JSON</button>
          <label class="btn sm" style="cursor:pointer">Import JSON<input id="import-json" type="file" accept="application/json,.json" hidden></label>
          <button class="btn sm dng" id="reset-demo">Reset Demo</button>
        </div>
        <p id="data-msg" class="muted small"></p>
      </div>
    </div>
    <div class="wrap admin-grid">
      <div class="glass panel">
        <h2>${editing ? 'Edit Produk' : 'Tambah Produk'}</h2>
        <form id="pform" class="stack" data-edit-id="${esc(editing?.id || '')}">
          <div class="row2">
            <label>Kode<input class="field" name="code" id="pcode" required value="${esc(f.code)}" ${editing ? '' : 'readonly'} placeholder="Otomatis"></label>
            <label>Kategori<select class="field" name="category" id="pcategory">${cats.map((c) => `<option ${c === f.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
          </div>
          ${editing ? '' : '<p class="muted small">Kode produk dibuat otomatis berdasarkan kategori (dapat diubah saat edit).</p>'}
          <label>Nama<input class="field" name="name" required maxlength="80" value="${esc(f.name)}"></label>
          <div class="row2">
            <label>Harga (0 = custom)<input class="field" name="price" type="number" min="0" value="${f.price}"></label>
            <label>Slot<input class="field" name="slot" type="number" min="0" value="${f.slot}"></label>
          </div>
          <label>Deskripsi<textarea class="field" name="description" rows="3">${esc(f.description)}</textarea></label>
          <label>URL Gambar (opsional, / atau https://)<input class="field" name="imageUrl" value="${esc(f.imageUrl)}"></label>
          <label class="check"><input type="checkbox" name="featured" ${f.featured ? 'checked' : ''}> Tandai unggulan</label>
          <p id="perr" class="err"></p>
          <div class="row"><button class="btn pri" type="submit">${editing ? 'Simpan Perubahan' : 'Tambah Produk'}</button>${editing ? '<button class="btn" type="button" id="cancel-edit">Batal</button>' : ''}</div>
        </form>
      </div>
      <div class="glass panel">
        <h2>Daftar Produk</h2>
        <div class="list">${products.map((p) => `
          <div class="item">
            <div class="top"><div><b>${esc(p.name)}</b><br><small>${esc(p.code)} · ${esc(p.category)} · ${harga(p)} · slot ${p.slot}</small></div>${p.featured ? '<span class="badge-g">Unggulan</span>' : ''}</div>
            <div class="row"><button class="btn sm" data-edit="${p.id}">Edit</button><button class="btn sm dng" data-del-prod="${p.id}">Hapus</button></div>
          </div>`).join('') || '<p class="muted">Belum ada produk.</p>'}</div>
      </div>
    </div></section>
  `

  view.querySelector('#export-json')?.addEventListener('click', () => {
    const blob = new Blob([exportProductsJSON()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'erdua-products.json'
    a.click()
    URL.revokeObjectURL(a.href)
    const msg = view.querySelector('#data-msg'); if (msg) msg.textContent = 'Produk diekspor ke JSON.'
  })
  view.querySelector('#import-json')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const res = importProductsJSON(text)
    const msg = view.querySelector('#data-msg')
    if (res.error) { if (msg) { msg.textContent = res.error; msg.className = 'err small' } }
    else { if (msg) { msg.textContent = `Impor berhasil (${res.count} produk).`; msg.className = 'muted small' } renderApp(document.querySelector('#app'), { page: 'admin-produk' }) }
    e.target.value = ''
  })
  view.querySelector('#reset-demo')?.addEventListener('click', () => {
    if (!confirm('Reset data produk ke contoh demo?')) return
    resetDemoProducts()
    renderApp(document.querySelector('#app'), { page: 'admin-produk' })
  })

  const catSel = view.querySelector('#pcategory')
  const codeInp = view.querySelector('#pcode')
  if (catSel && codeInp && !state.editingId) {
    catSel.addEventListener('change', () => { codeInp.value = generateProductCode(catSel.value, listProducts()) })
  }

  view.querySelector('#pform').addEventListener('submit', (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = Object.fromEntries(fd.entries())
    payload.featured = form.querySelector('[name=featured]').checked
    const editId = form.dataset.editId
    const res = editId ? updateProduct(editId, payload) : createProduct(payload)
    if (res.error) { view.querySelector('#perr').textContent = res.error; return }
    renderApp(document.querySelector('#app'), { page: 'admin-produk' })
  })
  view.querySelector('#cancel-edit')?.addEventListener('click', () => renderApp(document.querySelector('#app'), { page: 'admin-produk' }))
  view.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => renderApp(document.querySelector('#app'), { page: 'admin-produk', editingId: b.dataset.edit })))
  view.querySelectorAll('[data-del-prod]').forEach((b) => b.addEventListener('click', () => {
    if (!confirm('Hapus produk ini?')) return
    deleteProduct(b.dataset.delProd)
    renderApp(document.querySelector('#app'), { page: 'admin-produk' })
  }))
}

function renderAdminUsers(view) {
  const users = listUsers()
  view.innerHTML = `
    <section class="section"><div class="wrap admin-grid">
      <div class="glass panel">
        <h2>Tambah User</h2>
        <form id="uform" class="stack">
          <label>Nama<input class="field" name="name" required></label>
          <label>Email<input class="field" name="email" type="email" required></label>
          <label>Password<input class="field" name="password" type="text" required></label>
          <label>Role<select class="field" name="role"><option value="pembeli">pembeli (beli via WhatsApp)</option><option value="admin">admin (kelola produk)</option><option value="superadmin">superadmin (kelola produk & user)</option></select></label>
          <p id="uerr" class="err"></p>
          <button class="btn pri" type="submit">Tambah User</button>
        </form>
      </div>
      <div class="glass panel">
        <h2>Daftar User</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Aksi</th></tr></thead>
          <tbody>${users.map((u) => `<tr>
            <td>${esc(u.name)}</td><td>${esc(u.email)}</td><td><span class="badge-g">${esc(u.role)}</span></td>
            <td>${u.role === 'superadmin' ? '<span class="muted">-</span>' : `<button class="btn sm dng" data-del-user="${u.id}">Hapus</button>`}</td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>
    </div></section>
  `
  view.querySelector('#uform').addEventListener('submit', (e) => {
    e.preventDefault()
    const res = createUser(Object.fromEntries(new FormData(e.currentTarget).entries()))
    if (res.error) { view.querySelector('#uerr').textContent = res.error; return }
    renderApp(document.querySelector('#app'), { page: 'admin-user' })
  })
  view.querySelectorAll('[data-del-user]').forEach((b) => b.addEventListener('click', () => {
    if (!confirm('Hapus user ini?')) return
    const res = deleteUser(b.dataset.delUser)
    if (res.error) alert(res.error)
    renderApp(document.querySelector('#app'), { page: 'admin-user' })
  }))
}

function bindNav(root, user, state) {
  root.querySelectorAll('#logout-btn').forEach((el) => el.addEventListener('click', () => { logout(); renderApp(root, { page: 'katalog' }) }))
  root.querySelectorAll('#go-login').forEach((el) => el.addEventListener('click', () => renderLogin(root.querySelector('#view'), 'login')))
  root.querySelectorAll('[data-page]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault()
    renderApp(root, { page: el.dataset.page })
  }))
  root.querySelectorAll('#theme-toggle').forEach((el) => el.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch {}
    renderApp(root, state)
  }))
  const burger = root.querySelector('#nav-burger')
  const mobile = root.querySelector('#nav-mobile')
  if (burger && mobile) {
    const sync = (open) => {
      mobile.setAttribute('data-open', open ? 'true' : 'false')
      burger.setAttribute('aria-expanded', open ? 'true' : 'false')
      burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu')
      burger.innerHTML = open ? mobile.dataset.iconClose : mobile.dataset.iconMenu
    }
    burger.addEventListener('click', () => sync(mobile.getAttribute('data-open') !== 'true'))
    mobile.querySelectorAll('[data-page]').forEach((el) => el.addEventListener('click', () => sync(false)))
  }
}
