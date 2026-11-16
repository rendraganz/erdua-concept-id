const STORAGE_KEY = 'r2_concept_app_v3'
export const PRODUCTS_KEY = 'erdua:products:v1'

const CATEGORIES = ['Desain Livery', 'Desain Logo', 'Lettering & Stiker', 'Decal & Apparel']
const DEFAULT_WA = '6288228549752'

const seedProducts = [
  { id: 'p1', code: 'R2-LVR-01', name: 'Livery Truk Trailer Full Wrap', category: CATEGORIES[0], price: 1500000, slot: 3, featured: true, description: 'File master: CDR (vektor) + AI + PNG preview resolusi tinggi. Termasuk 2x revisi minor.', imageUrl: '' },
  { id: 'p2', code: 'R2-LVR-02', name: 'Livery Pickup & Box Armada', category: CATEGORIES[0], price: 750000, slot: 5, featured: false, description: 'File master: CDR (vektor) + AI + PNG preview resolusi tinggi. Termasuk 2x revisi minor.', imageUrl: '' },
  { id: 'p3', code: 'R2-LVR-03', name: 'Livery Mobil Komunitas', category: CATEGORIES[0], price: 0, slot: 2, featured: false, description: 'Harga custom/konsultasi. File master vektor & preview resolusi tinggi.', imageUrl: '' },
  { id: 'p4', code: 'R2-LGO-01', name: 'Logo Brand UMKM (Paket Basic)', category: CATEGORIES[1], price: 350000, slot: 6, featured: true, description: 'Paket logo UMKM: konsep, file master, dan preview.', imageUrl: '' },
  { id: 'p5', code: 'R2-LGO-02', name: 'Logo Perusahaan Transportasi', category: CATEGORIES[1], price: 800000, slot: 0, featured: false, description: 'Logo profesional untuk perusahaan transportasi/armada.', imageUrl: '' },
  { id: 'p6', code: 'R2-LTR-01', name: 'Custom Lettering Nama & Nomor Armada', category: CATEGORIES[2], price: 150000, slot: 10, featured: false, description: 'Lettering custom siap cetak/cutting.', imageUrl: '' },
  { id: 'p7', code: 'R2-LTR-02', name: 'Paket Stiker Cutting Branding', category: CATEGORIES[2], price: 275000, slot: 4, featured: true, description: 'Paket stiker cutting untuk branding kendaraan/usaha.', imageUrl: '' },
  { id: 'p8', code: 'R2-DCL-01', name: 'Decal Apparel & Merchandise', category: CATEGORIES[3], price: 200000, slot: 7, featured: false, description: 'Desain decal untuk apparel dan merchandise.', imageUrl: '' },
]

const defaultData = {
  users: [
    { id: 'u-super-1', name: 'Super Admin', email: 'superadmin@r2concept.id', password: 'super123', role: 'superadmin' },
    { id: 'u-admin-1', name: 'Admin Produk', email: 'admin@r2concept.id', password: 'admin123', role: 'admin' },
    { id: 'u-buyer-1', name: 'Budi Pembeli', email: 'budi@mail.com', password: 'budi123', role: 'pembeli' },
    { id: 'u-buyer-2', name: 'Sari Pembeli', email: 'sari@mail.com', password: 'sari123', role: 'pembeli' },
  ],
  settings: { waNumber: DEFAULT_WA, bannerUrl: '' },
  session: null,
}

let lastProductsNotice = null
export function getProductsNotice() { return lastProductsNotice }
export function clearProductsNotice() { lastProductsNotice = null }

function clone(v) {
  return JSON.parse(JSON.stringify(v))
}

export function getCategories() {
  return [...CATEGORIES]
}

function isValidProduct(p) {
  if (!p || typeof p !== 'object') return false
  const name = p.name ?? p.nama
  const category = p.category ?? p.kategori
  const price = p.price ?? p.harga
  const stock = p.slot ?? p.stok
  if (typeof name !== 'string' || !name.trim()) return false
  if (!CATEGORIES.includes(category)) return false
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) return false
  if (!Number.isInteger(stock) || stock < 0) return false
  return true
}

export function validateProduct(p) {
  return isValidProduct(p)
}

function normalizeImageUrl(url) {
  const s = typeof url === 'string' ? url.trim() : ''
  if (!s) return ''
  return /^(\/|https:\/\/)/.test(s) ? s : ''
}

function normalizeStoredProduct(p, idx) {
  const name = String(p.name ?? p.nama).trim()
  const category = p.category ?? p.kategori
  const price = Number(p.price ?? p.harga)
  const slot = Number(p.slot ?? p.stok)
  return {
    id: typeof p.id === 'string' && p.id ? p.id : `p-${idx + 1}`,
    code: typeof p.code === 'string' ? p.code : `R2-${String(idx + 1).padStart(3, '0')}`,
    name,
    category,
    price,
    slot,
    featured: !!p.featured,
    description: typeof p.description === 'string' ? p.description : '',
    imageUrl: normalizeImageUrl(p.imageUrl),
  }
}

export function validateProductsArray(arr) {
  if (!Array.isArray(arr)) return null
  if (!arr.every(isValidProduct)) return null
  return arr.map(normalizeStoredProduct)
}

export function loadProducts() {
  const raw = localStorage.getItem(PRODUCTS_KEY)
  if (raw === null) {
    const seeded = clone(seedProducts)
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    const parsed = JSON.parse(raw)
    const valid = validateProductsArray(parsed)
    if (!valid) throw new Error('invalid')
    return valid
  } catch {
    const restored = clone(seedProducts)
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(restored))
    lastProductsNotice = 'Data produk rusak/tidak valid. Data contoh telah dipulihkan.'
    return restored
  }
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function exportProductsJSON() {
  return JSON.stringify(loadProducts(), null, 2)
}

export function parseProductsJSON(jsonText) {
  let parsed
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    return { error: 'File JSON tidak valid (gagal parse).' }
  }
  const valid = validateProductsArray(parsed)
  if (!valid) {
    return { error: 'Struktur/tipe data produk tidak valid.' }
  }
  return { data: valid }
}

export function importProductsJSON(jsonText) {
  const res = parseProductsJSON(jsonText)
  if (res.error) {
    if (res.error === 'Struktur/tipe data produk tidak valid.') {
      return { error: 'Struktur/tipe data produk tidak valid. Impor dibatalkan, data lama tidak diubah.' }
    }
    return res
  }
  saveProducts(res.data)
  return { ok: true, count: res.data.length }
}

export function resetDemoProducts() {
  const restored = clone(seedProducts)
  saveProducts(restored)
  return restored
}

export function loadDB() {
  const raw = localStorage.getItem(STORAGE_KEY)
  let base
  if (!raw) {
    base = clone(defaultData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base))
  } else {
    try {
      const p = JSON.parse(raw)
      base = {
        users: Array.isArray(p.users) ? p.users : clone(defaultData.users),
        settings: { waNumber: DEFAULT_WA, bannerUrl: '', ...(p.settings || {}) },
        session: p.session ?? null,
      }
    } catch {
      base = clone(defaultData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(base))
    }
  }
  return { ...base, products: loadProducts() }
}

export function saveDB(db) {
  const { products, ...rest } = db
  if (Array.isArray(products)) saveProducts(products)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...clone(defaultData), ...rest, users: db.users || clone(defaultData.users), settings: { waNumber: DEFAULT_WA, bannerUrl: '', ...(db.settings || {}) }, session: db.session ?? null }))
}

export function getSettings() {
  return loadDB().settings
}

export function updateSettings(patch) {
  const db = loadDB()
  db.settings = { ...db.settings, ...patch }
  saveDB(db)
  return db.settings
}

export function login(email, password) {
  const db = loadDB()
  const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase().trim() && u.password === String(password))
  if (!user) return null
  db.session = { userId: user.id }
  saveDB(db)
  return sanitizeUser(user)
}

export function register(data) {
  const res = createUser({ ...data, role: 'pembeli' })
  if (res.error) return res
  const db = loadDB()
  db.session = { userId: res.user.id }
  saveDB(db)
  return { user: res.user }
}

export function logout() {
  const db = loadDB()
  db.session = null
  saveDB(db)
}

export function getCurrentUser() {
  const db = loadDB()
  if (!db.session?.userId) return null
  const user = db.users.find((u) => u.id === db.session.userId)
  return user ? sanitizeUser(user) : null
}

export function listUsers() {
  return loadDB().users.map(sanitizeUser)
}

export function createUser(data) {
  const db = loadDB()
  const email = String(data.email || '').toLowerCase().trim()
  if (!email || db.users.some((u) => u.email.toLowerCase() === email)) return { error: 'Email sudah digunakan.' }
  const allowed = ['pembeli', 'admin', 'superadmin']
  const role = allowed.includes(data.role) ? data.role : 'pembeli'
  const user = {
    id: createId('u'),
    name: String(data.name || '').trim(),
    email,
    password: String(data.password || ''),
    role,
  }
  if (!user.name || !user.password) return { error: 'Nama dan password wajib diisi.' }
  db.users.push(user)
  saveDB(db)
  return { user: sanitizeUser(user) }
}

export function deleteUser(id) {
  const db = loadDB()
  const target = db.users.find((u) => u.id === id)
  if (!target) return { error: 'User tidak ditemukan.' }
  if (target.role === 'superadmin') return { error: 'User superadmin tidak dapat dihapus.' }
  const current = db.session?.userId
  db.users = db.users.filter((u) => u.id !== id)
  if (current === id) db.session = null
  saveDB(db)
  return { ok: true }
}

function sanitizeUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role }
}

export function createId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function resetDB() {
  const seeded = clone(defaultData)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  saveProducts(clone(seedProducts))
  return { ...seeded, products: clone(seedProducts) }
}

export function filterProducts(products, { query = '', kategori = 'Semua', sort = 'nama-asc' } = {}) {
  const q = String(query || '').trim().toLowerCase()
  const kat = kategori || 'Semua'
  let list = (Array.isArray(products) ? products : []).filter((p) => {
    const matchCat = kat === 'Semua' || p.category === kat
    const name = String(p.name || '').toLowerCase()
    const desc = String(p.description || '').toLowerCase()
    const matchQuery = !q || name.includes(q) || desc.includes(q)
    return matchCat && matchQuery
  })

  if (sort === 'harga-asc') {
    list = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
  } else if (sort === 'harga-desc') {
    list = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
  } else if (sort === 'nama-asc') {
    list = [...list].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'id', { sensitivity: 'base' }))
  }
  return list
}

export function buildWhatsAppUrl(nomor, produk) {
  const raw = String(nomor || '').trim().replace(/[\s\-()]/g, '')
  const normalized = raw.startsWith('+') ? raw.slice(1) : raw
  if (!/^\d{8,15}$/.test(normalized) || normalized.startsWith('0')) {
    throw new Error('Nomor WhatsApp tujuan harus dalam format internasional (contoh: 6281234567890).')
  }
  const name = produk?.name ?? ''
  const code = produk?.code ?? ''
  const price = Number(produk?.price) || 0
  const priceText = price > 0 ? `Rp ${price.toLocaleString('id-ID')}` : 'Harga Custom'
  const message = `Halo R2 Concept ID, saya ingin memesan produk:\n- ${name} (${code})\n- Harga: ${priceText}\nMohon info ketersediaan dan prosesnya. Terima kasih.`
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
