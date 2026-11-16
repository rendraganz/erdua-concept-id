import { describe, it, expect } from 'vitest'
import { filterProducts, validateProduct, buildWhatsAppUrl, parseProductsJSON } from './store.js'
import { formatRupiah } from './format.js'

const sample = [
  { name: 'Livery Truk', category: 'Desain Livery', price: 1500000, slot: 3, description: 'Full wrap trailer' },
  { name: 'Logo UMKM', category: 'Desain Logo', price: 350000, slot: 0, description: 'Paket basic' },
  { name: 'Lettering Armada', category: 'Lettering & Stiker', price: 0, slot: 10, description: 'Custom nama' },
  { name: 'Decal Kaos', category: 'Decal & Apparel', price: 200000, slot: 2, description: 'Merchandise decal' },
]

const normRp = (s) => String(s).replace(/\u00A0/g, ' ')

describe('formatRupiah', () => {
  it('formats 0 as IDR currency', () => {
    expect(normRp(formatRupiah(0))).toBe('Rp 0')
  })
  it('formats positive numbers with thousand separators', () => {
    expect(normRp(formatRupiah(1500000))).toBe('Rp 1.500.000')
  })
  it('formats boundary value 1 correctly', () => {
    expect(normRp(formatRupiah(1))).toBe('Rp 1')
  })
})

describe('validateProduct', () => {
  it('accepts a valid product', () => {
    expect(validateProduct({ name: 'A', category: 'Desain Logo', price: 1000, slot: 1 })).toBe(true)
  })
  it('accepts aliases nama/kategori/harga/stok', () => {
    expect(validateProduct({ nama: 'B', kategori: 'Desain Livery', harga: 0, stok: 0 })).toBe(true)
  })
  it('rejects invalid category', () => {
    expect(validateProduct({ name: 'A', category: 'Kategori Asing', price: 1000, slot: 1 })).toBe(false)
  })
  it('rejects negative price (batas harga)', () => {
    expect(validateProduct({ name: 'A', category: 'Desain Logo', price: -1, slot: 1 })).toBe(false)
  })
  it('rejects negative stock and non-integer stock (batas stok)', () => {
    expect(validateProduct({ name: 'A', category: 'Desain Logo', price: 0, slot: -1 })).toBe(false)
    expect(validateProduct({ name: 'A', category: 'Desain Logo', price: 0, slot: 1.5 })).toBe(false)
  })
  it('rejects empty/invalid name or non-object', () => {
    expect(validateProduct({ name: '   ', category: 'Desain Logo', price: 0, slot: 0 })).toBe(false)
    expect(validateProduct(null)).toBe(false)
  })
})

describe('parseProductsJSON', () => {
  it('parses a valid JSON array of products', () => {
    const res = parseProductsJSON(JSON.stringify([{ name: 'X', category: 'Desain Logo', price: 500, slot: 2 }]))
    expect(res.error).toBeUndefined()
    expect(res.data).toHaveLength(1)
    expect(res.data[0].name).toBe('X')
  })
  it('returns error for corrupted/non-JSON payload', () => {
    const res = parseProductsJSON('{not-json')
    expect(res.error).toMatch(/gagal parse/i)
  })
  it('returns error for invalid structure (not array or invalid items)', () => {
    expect(parseProductsJSON(JSON.stringify({ name: 'x' })).error).toBeTruthy()
    expect(parseProductsJSON(JSON.stringify([{ name: 'X', category: 'Invalid', price: 1, slot: 1 }])).error).toBeTruthy()
  })
  it('rejects items with invalid price/stock boundaries in payload', () => {
    expect(parseProductsJSON(JSON.stringify([{ name: 'X', category: 'Desain Logo', price: -10, slot: 1 }])).error).toBeTruthy()
    expect(parseProductsJSON(JSON.stringify([{ name: 'X', category: 'Desain Logo', price: 10, slot: -1 }])).error).toBeTruthy()
  })
  it('accepts alias fields in payload', () => {
    const res = parseProductsJSON(JSON.stringify([{ nama: 'Alias', kategori: 'Decal & Apparel', harga: 0, stok: 5 }]))
    expect(res.error).toBeUndefined()
    expect(res.data[0].name).toBe('Alias')
    expect(res.data[0].slot).toBe(5)
  })
})

describe('buildWhatsAppUrl', () => {
  it('builds correct wa.me URL and encoded message for available stock', () => {
    const url = buildWhatsAppUrl('6281234567890', { name: 'Livery Truk', code: 'R2-LVR-01', price: 1500000 })
    expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true)
    const text = decodeURIComponent(url.split('text=')[1])
    expect(text).toContain('Livery Truk')
    expect(text).toContain('R2-LVR-01')
    expect(text).toContain('Rp 1.500.000')
  })
  it('normalizes phone number with +, spaces, dashes, parentheses', () => {
    const url = buildWhatsAppUrl('+62 812-3456 (7890)', { name: 'X', code: 'C', price: 0 })
    expect(url).toContain('https://wa.me/6281234567890?text=')
  })
  it('shows Harga Custom when price is 0', () => {
    const url = buildWhatsAppUrl('6281234567890', { name: 'X', code: 'C', price: 0 })
    const text = decodeURIComponent(url.split('text=')[1])
    expect(text).toContain('Harga Custom')
  })
  it('throws for invalid phone numbers', () => {
    expect(() => buildWhatsAppUrl('081234567890', { name: 'X', code: 'C', price: 0 })).toThrow()
    expect(() => buildWhatsAppUrl('12345', { name: 'X', code: 'C', price: 0 })).toThrow()
    expect(() => buildWhatsAppUrl('abc12345678', { name: 'X', code: 'C', price: 0 })).toThrow()
    expect(() => buildWhatsAppUrl('', { name: 'X', code: 'C', price: 0 })).toThrow()
  })
})

describe('filterProducts', () => {
  it('returns empty array for non-array input', () => {
    expect(filterProducts(null)).toEqual([])
  })
  it('filters by case-insensitive query on name and description', () => {
    expect(filterProducts(sample, { query: 'livery' })).toHaveLength(1)
    expect(filterProducts(sample, { query: 'MERCHANDISE' })).toHaveLength(1)
    expect(filterProducts(sample, { query: 'custom' })).toHaveLength(1)
  })
  it('filters by kategori', () => {
    const res = filterProducts(sample, { kategori: 'Desain Logo' })
    expect(res).toHaveLength(1)
    expect(res[0].name).toBe('Logo UMKM')
  })
  it('sorts by harga termurah and termahal', () => {
    const asc = filterProducts(sample, { sort: 'harga-asc' }).map((p) => p.price)
    const desc = filterProducts(sample, { sort: 'harga-desc' }).map((p) => p.price)
    expect(asc).toEqual([0, 200000, 350000, 1500000])
    expect(desc).toEqual([1500000, 350000, 200000, 0])
  })
  it('sorts by nama A–Z', () => {
    const names = filterProducts(sample, { sort: 'nama-asc' }).map((p) => p.name)
    expect(names).toEqual(['Decal Kaos', 'Lettering Armada', 'Livery Truk', 'Logo UMKM'])
  })
  it('combines query + kategori + sorting', () => {
    const data = [
      { name: 'Livery A', category: 'Desain Livery', price: 500, slot: 1, description: 'armada' },
      { name: 'Livery B', category: 'Desain Livery', price: 100, slot: 1, description: 'armada' },
      { name: 'Logo A', category: 'Desain Logo', price: 50, slot: 1, description: 'armada' },
    ]
    const res = filterProducts(data, { query: 'armada', kategori: 'Desain Livery', sort: 'harga-asc' })
    expect(res.map((p) => p.name)).toEqual(['Livery B', 'Livery A'])
  })
  it('returns all when query empty and kategori Semua', () => {
    expect(filterProducts(sample, { query: '', kategori: 'Semua', sort: 'nama-asc' })).toHaveLength(4)
  })
})
