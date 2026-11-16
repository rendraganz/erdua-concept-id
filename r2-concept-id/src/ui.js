import { getCategories, getCurrentUser, getSettings, listUsers, login, logout, createUser, deleteUser } from './store.js'
import { createProduct, deleteProduct, listProducts, updateProduct } from './products.js'

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
function rp(n) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)
}
function harga(p) { return p.price > 0 ? rp(p.price) : 'Harga Custom / Konsultasi' }
function slotInfo(p) {
  if (p.slot > 3) return { text: `Slot tersedia: ${p.slot}`, cls: 's-ok' }
  if (p.slot > 0) return { text: `Sisa ${p.slot} slot`, cls: 's-low' }
  return { text: 'Antrean penuh', cls: 's-no' }
}
function hue(p) {
  const i = Math.max(0, getCategories().indexOf(p.category))
  return `h${i}`
}

function waLink(product) {
  const wa = (getSettings().waNumber || '6288228549752').replace(/\D/g, '')
  const msg = product.slot === 0
    ? `Hai R2 Concept, saya minat dengan product ${product.category} (${product.code} - ${product.name}).\nSaya lihat antrean sedang penuh, bisa masuk waitlist? Terima kasih!`
    : `Hai R2 Concept, saya minat dengan product ${product.category} (${product.code} - ${product.name}).\nEstimasi harga: ${product.price > 0 ? rp(product.price) : 'Harga Custom'}.\nMohon info ketersediaan slot dan prosesnya. Terima kasih!`
  return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`
}

function canManageProducts(user) {
  return user && (user.role === 'admin' || user.role === 'superadmin')
}
function canManageUsers(user) {
  return user && user.role === 'superadmin'
}

export function renderApp(root, state = { page: 'katalog', q: '', cat: 'Semua', editingId: null }) {
  const user = getCurrentUser()
  let page = state.page || 'katalog'

  if (page === 'admin-user' && !canManageUsers(user)) page = canManageProducts(user) ? 'admin-produk' : 'katalog'
  if (page === 'admin-produk' && !canManageProducts(user)) page = 'katalog'

  root.innerHTML = `
    ${nav(user, page)}
    <main id="view"></main>
    <footer class="foot">© R2 Concept ID — Livery, Logo, Lettering &amp; Decal. Data tersimpan di perangkat ini (localStorage).</footer>
  `
  const view = root.querySelector('#view')
  if (!user) {
    renderLogin(view)
  } else if (page === 'admin-produk' || page === 'admin-user') {
    renderAdmin(view, user, { ...state, page })
  } else {
    renderCatalog(view, user, { ...state, page })
  }
  bindNav(root, user, { ...state, page })
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
  const right = user
    ? `<span class="user-chip">${esc(user.name)} <b>(${esc(user.role)})</b></span><button class="btn sm" id="logout-btn">Logout</button>`
    : `<button class="btn sm pri" id="go-login">Login</button>`
  return `<nav class="top"><div class="wrap navin"><div class="logo">R2 <b>Concept</b> ID</div><div class="tabs">${tabs}</div><div class="navr">${right}</div></div></nav>`
}

function renderLogin(view) {
  view.innerHTML = `
    <section class="auth">
      <div class="glass panel auth-box">
        <h1>Masuk ke R2 Concept ID</h1>
        <p class="muted">Login untuk mengelola produk/user (admin) atau melakukan pemesanan (pembeli).</p>
        <form id="login-form" class="stack">
          <label>Email<input class="field" name="email" type="email" required placeholder="admin@r2concept.id"></label>
          <label>Password<input class="field" name="password" type="password" required placeholder="••••••"></label>
          <button class="btn pri" type="submit">Masuk</button>
          <p id="login-err" class="err"></p>
        </form>
        <div class="hint glass">
          <b>Akun dummy (3 role):</b><br>
          Superadmin (kelola produk & user): superadmin@r2concept.id / super123<br>
          Admin (kelola produk): admin@r2concept.id / admin123<br>
          Pembeli (beli via WhatsApp): budi@mail.com / budi123
        </div>
      </div>
    </section>
  `
  view.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const u = login(fd.get('email'), fd.get('password'))
    if (!u) { view.querySelector('#login-err').textContent = 'Email atau password salah.'; return }
    renderApp(document.querySelector('#app'), { page: (u.role === 'admin' || u.role === 'superadmin') ? 'admin-produk' : 'katalog' })
  })
}

function renderCatalog(view, user, state) {
  const q = (state.q || '').toLowerCase()
  const cat = state.cat || 'Semua'
  const products = listProducts().filter((p) => (cat === 'Semua' || p.category === cat) && (p.name + ' ' + p.code).toLowerCase().includes(q))
  const cats = ['Semua', ...getCategories()]

  view.innerHTML = `
    <header class="hero">
      <div class="stripe"></div>
      <div class="glass hero-inner">
        <h1>Livery, logo, dan lettering yang bikin armada Anda dikenal.</h1>
        <p>Studio desain R2 Concept ID: livery truk & kendaraan, logo, custom lettering, dan decal. Konsultasi dulu, slot terbatas.</p>
        <div class="cta-row">
          <a class="btn pri" href="#katalog">Lihat Katalog</a>
          ${!user ? '<span class="muted small">Login sebagai pembeli untuk memesan via WhatsApp.</span>' : ''}
        </div>
      </div>
    </header>
    <section id="katalog" class="section"><div class="wrap">
      <div class="sec-h"><h2>Katalog Desain</h2></div>
      <div class="tools">
        <input class="field" id="q" type="search" placeholder="Cari nama atau kode desain" value="${esc(state.q || '')}">
        <div class="chips">${cats.map((c) => `<button class="chip" data-cat="${esc(c)}" ${cat === c ? 'aria-pressed="true"' : ''}>${esc(c)}</button>`).join('')}</div>
      </div>
      <div class="grid">
        ${products.length ? products.map((p) => productCard(p, user)).join('') : `<div class="empty glass"><h3>Belum ada desain yang cocok</h3><p>Coba kata kunci lain atau ubah filter.</p></div>`}
      </div>
    </div></section>
  `

  view.querySelectorAll('[data-cat]').forEach((b) => b.addEventListener('click', () => {
    renderApp(document.querySelector('#app'), { ...state, page: 'katalog', cat: b.dataset.cat })
  }))
  let db
  view.querySelector('#q')?.addEventListener('input', (e) => {
    clearTimeout(db)
    db = setTimeout(() => renderApp(document.querySelector('#app'), { ...state, page: 'katalog', q: e.target.value }), 250)
  })
}

function productCard(p, user) {
  const s = slotInfo(p)
  const action = user && user.role === 'pembeli'
    ? `<a class="btn sm pri" href="${waLink(p)}" target="_blank" rel="noopener">${p.slot ? 'Beli via WhatsApp' : 'Tanya Waitlist'}</a>`
    : (!user ? `<a class="btn sm pri" href="#" data-require-login>Beli via WhatsApp</a>` : '')
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
  const f = editing || { code: '', name: '', category: cats[0], price: 0, slot: 0, description: '', imageUrl: '', featured: false }
  view.innerHTML = `
    <section class="section"><div class="wrap admin-grid">
      <div class="glass panel">
        <h2>${editing ? 'Edit Produk' : 'Tambah Produk'}</h2>
        <form id="pform" class="stack" data-edit-id="${esc(editing?.id || '')}">
          <div class="row2">
            <label>Kode<input class="field" name="code" required value="${esc(f.code)}" placeholder="R2-XXX-01"></label>
            <label>Kategori<select class="field" name="category">${cats.map((c) => `<option ${c === f.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
          </div>
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
  root.querySelector('#logout-btn')?.addEventListener('click', () => { logout(); renderApp(root, { page: 'katalog' }) })
  root.querySelector('#go-login')?.addEventListener('click', () => renderLogin(root.querySelector('#view')))
  root.querySelectorAll('[data-page]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault()
    renderApp(root, { page: el.dataset.page })
  }))
  root.querySelectorAll('[data-require-login]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault()
    renderLogin(root.querySelector('#view'))
  }))
}
