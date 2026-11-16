const STORAGE_KEY = 'r2_concept_app_v2'

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
  products: seedProducts,
  settings: { waNumber: DEFAULT_WA },
  session: null,
}

function clone(v) {
  return JSON.parse(JSON.stringify(v))
}

export function getCategories() {
  return [...CATEGORIES]
}

export function loadDB() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seeded = clone(defaultData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    const p = JSON.parse(raw)
    return {
      users: Array.isArray(p.users) ? p.users : clone(defaultData.users),
      products: Array.isArray(p.products) ? p.products : clone(defaultData.products),
      settings: { waNumber: DEFAULT_WA, ...(p.settings || {}) },
      session: p.session ?? null,
    }
  } catch {
    const seeded = clone(defaultData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }
}

export function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
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
  return seeded
}
