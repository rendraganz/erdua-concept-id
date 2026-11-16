import { createId, loadDB, saveDB } from './store.js'

export function listProducts() {
  return [...loadDB().products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
}

export function getProduct(id) {
  return loadDB().products.find((p) => p.id === id) || null
}

export function createProduct(data) {
  const db = loadDB()
  const product = normalize(data, createId('p'))
  const err = validate(product, db.products)
  if (err) return { error: err }
  db.products.unshift(product)
  saveDB(db)
  return { product }
}

export function updateProduct(id, data) {
  const db = loadDB()
  const idx = db.products.findIndex((p) => p.id === id)
  if (idx === -1) return { error: 'Produk tidak ditemukan.' }
  const product = normalize({ ...db.products[idx], ...data, id }, id)
  const err = validate(product, db.products, id)
  if (err) return { error: err }
  db.products[idx] = product
  saveDB(db)
  return { product }
}

export function deleteProduct(id) {
  const db = loadDB()
  const before = db.products.length
  db.products = db.products.filter((p) => p.id !== id)
  if (db.products.length === before) return false
  saveDB(db)
  return true
}

function normalize(data, id) {
  return {
    id,
    code: String(data.code || '').trim(),
    name: String(data.name || '').trim(),
    category: String(data.category || '').trim(),
    price: Math.max(0, Math.trunc(Number(data.price) || 0)),
    slot: Math.max(0, Math.trunc(Number(data.slot) || 0)),
    featured: !!data.featured,
    description: String(data.description || '').trim(),
    imageUrl: String(data.imageUrl || '').trim(),
  }
}

function validate(p, products, editingId = null) {
  if (!p.code) return 'Kode produk wajib diisi.'
  if (products.some((x) => x.id !== editingId && x.code.toLowerCase() === p.code.toLowerCase())) return 'Kode produk sudah digunakan.'
  if (!p.name) return 'Nama produk wajib diisi.'
  if (!p.category) return 'Kategori wajib dipilih.'
  if (p.imageUrl && !/^(\/|https:\/\/)/.test(p.imageUrl)) return 'URL gambar harus diawali / atau https://'
  return null
}
