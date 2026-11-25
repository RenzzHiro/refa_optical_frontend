import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminApi, type ProductInput } from '../api/admin'
import { ApiError } from '../api/client'
import type { CustomerOrder, FaceType, Gender, Product } from '../types'
import AdminProductModal from '../components/AdminProductModal'
import AdminLensManager from '../components/AdminLensManager'
import { formatCurrency, formatDate } from '../utils/format'

const paymentLabels: Record<string, string> = { pending: 'Menunggu bayar', paid: 'Dibayar', failed: 'Gagal', expired: 'Kedaluwarsa', cancelled: 'Dibatalkan' }
const orderLabels: Record<string, string> = { awaiting_payment: 'Menunggu pembayaran', processing: 'Diproses', completed: 'Selesai', cancelled: 'Dibatalkan' }
export type ProductForm = { name: string; category: 'minus' | 'fashion'; price: string; frame: Product['frame']; stock: string; image: string; description: string; gender: Gender[]; faceTypes: FaceType[]; colors: string }
const emptyProductForm: ProductForm = { name: '', category: 'fashion', price: '', frame: 'Bulat', stock: '0', image: '', description: '', gender: ['Unisex'], faceTypes: [], colors: 'Onyx:#171717' }

function makeProductPayload(form: ProductForm, existing?: Product): ProductInput {
  const generatedSlug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const slug = existing?.name === form.name.trim() ? existing.slug : generatedSlug
  return {
    slug, name: form.name.trim(), category: form.category, description: form.description.trim(),
    price: Number(form.price), compareAtPrice: existing?.compareAtPrice, image: form.image.trim(), images: existing && existing.image === form.image.trim() ? existing.images : form.image.trim() ? [form.image.trim()] : [],
    colors: form.colors.split(',').map(value => value.trim()).filter(Boolean).map(value => { const [name, hex] = value.split(':'); return { name: name.trim(), hex: /^#[0-9a-f]{6}$/i.test(hex?.trim() || '') ? hex.trim() : '#171717' } }), gender: form.gender, faceTypes: form.faceTypes, frame: form.frame,
    stock: Number(form.stock), isNew: existing?.isNew || false, isActive: existing?.isActive ?? true,
  }
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyId, setBusyId] = useState('')
  const [modal, setModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyProductForm)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [orderFilter, setOrderFilter] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [productRows, orderRows] = await Promise.all([adminApi.listProducts(), adminApi.listOrders()])
      setProducts(productRows)
      setOrders(orderRows)
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Data dashboard belum dapat dimuat.')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void loadDashboard() }, [loadDashboard])

  const today = new Date().toDateString()
  const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today).length
  const unpaidOrders = orders.filter(order => order.paymentStatus === 'pending').length
  const paidRevenue = orders.filter(order => order.paymentStatus === 'paid').reduce((sum, order) => sum + order.total, 0)
  const lowStock = products.filter(product => product.stock <= 5 && product.isActive !== false).length
  const visibleProducts = useMemo(() => products.filter(product => `${product.name} ${product.slug}`.toLowerCase().includes(query.toLowerCase())), [products, query])
  const visibleOrders = useMemo(() => orderFilter ? orders.filter(order => order.status === orderFilter) : orders, [orders, orderFilter])

  async function changeStock(product: Product, delta: number) {
    setBusyId(product.id); setNotice('')
    try {
      const result = await adminApi.adjustStock(product.id, delta)
      setProducts(rows => rows.map(row => row.id === product.id ? { ...row, stock: result.stock } : row))
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Stok belum dapat diperbarui.') }
    finally { setBusyId('') }
  }

  async function deactivate(product: Product) {
    if (!window.confirm(`Nonaktifkan produk ${product.name}?`)) return
    setBusyId(product.id); setNotice('')
    try {
      await adminApi.deactivateProduct(product.id)
      setProducts(rows => rows.map(row => row.id === product.id ? { ...row, isActive: false } : row))
      setNotice(`${product.name} dinonaktifkan.`)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Produk belum dapat dinonaktifkan.') }
    finally { setBusyId('') }
  }

  function editProduct(product: Product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      category: product.category === 'minus' ? 'minus' : 'fashion',
      price: String(product.price),
      frame: product.frame || 'Bulat',
      stock: String(product.stock),
      image: product.image || '',
      description: product.description || '',
      gender: Array.isArray(product.gender) && product.gender.length ? product.gender : ['Unisex'],
      faceTypes: Array.isArray(product.faceTypes) ? product.faceTypes : [],
      colors: Array.isArray(product.colors) && product.colors.length ? product.colors.map(color => `${color.name}:${color.hex}`).join(', ') : 'Onyx:#171717',
    })
    setNotice('')
    setModal(true)
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Hapus permanen ${product.name}? Produk yang pernah dipesan tidak dapat dihapus.`)) return
    setBusyId(product.id); setNotice('')
    try {
      await adminApi.deleteProductPermanently(product.id)
      setProducts(rows => rows.filter(row => row.id !== product.id))
      setNotice(`${product.name} dihapus permanen.`)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Produk belum dapat dihapus.') }
    finally { setBusyId('') }
  }

  async function reactivate(product: Product) {
    setBusyId(product.id); setNotice('')
    try {
      await adminApi.setProductActive(product.id, true)
      setProducts(rows => rows.map(row => row.id === product.id ? { ...row, isActive: true } : row))
      setNotice(`${product.name} diaktifkan kembali.`)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Produk belum dapat diaktifkan kembali.') }
    finally { setBusyId('') }
  }

  async function updateOrder(order: CustomerOrder, status: 'processing' | 'completed' | 'cancelled') {
    setBusyId(order.id); setNotice('')
    try {
      const updated = await adminApi.updateOrderStatus(order.id, status)
      setOrders(rows => rows.map(row => row.id === order.id ? { ...row, ...updated } : row))
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Status pesanan belum dapat diperbarui.') }
    finally { setBusyId('') }
  }

  async function downloadPrescription(order: CustomerOrder) {
    setBusyId(order.id); setNotice('')
    try {
      const blob = await adminApi.getPrescription(order.id)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url; anchor.download = `${order.number}-resep`; anchor.click()
      URL.revokeObjectURL(url)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Lampiran resep tidak dapat diunduh.') }
    finally { setBusyId('') }
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setNotice('')
    try {
      const payload = makeProductPayload(form, editingProduct || undefined)
      if (editingProduct) {
        const updated = await adminApi.updateProduct(editingProduct.id, payload)
        setProducts(rows => rows.map(row => row.id === updated.id ? updated : row))
        setNotice(`${updated.name} berhasil diperbarui.`)
      } else {
        const created = await adminApi.createProduct(payload)
        setProducts(rows => [created, ...rows])
        setNotice(`${created.name} berhasil ditambahkan.`)
      }
      setEditingProduct(null); setForm(emptyProductForm); setModal(false)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Produk belum dapat disimpan.') }
    finally { setSaving(false) }
  }

  return <div className="admin-dashboard">
    <div className="admin-page-heading"><div><span className="admin-kicker">TOKO ONLINE</span><h1>Ringkasan toko</h1><p>Pantau pesanan, ketersediaan produk, dan stok Refa Optical.</p></div><button className="admin-button admin-button-dark" onClick={() => { setEditingProduct(null); setForm(emptyProductForm); setModal(true) }}>＋ Tambah produk</button></div>
    {error && <div className="admin-alert admin-alert-error" role="alert">{error}<button onClick={() => void loadDashboard()}>Coba lagi</button></div>}
    {notice && <div className="admin-alert" role="status">{notice}<button aria-label="Tutup pemberitahuan" onClick={() => setNotice('')}>×</button></div>}
    <section className="admin-metrics" aria-label="Ringkasan toko">
      <article className="admin-metric"><span>Pesanan hari ini</span><strong>{loading ? '—' : todayOrders}</strong><small>Order masuk hari ini</small><i>↗</i></article>
      <article className="admin-metric"><span>Menunggu pembayaran</span><strong>{loading ? '—' : unpaidOrders}</strong><small>Perlu dipantau</small><i>◷</i></article>
      <article className="admin-metric"><span>Total pembayaran</span><strong>{loading ? '—' : formatCurrency(paidRevenue)}</strong><small>Pesanan berstatus dibayar</small><i>Rp</i></article>
      <article className="admin-metric"><span>Stok menipis</span><strong>{loading ? '—' : lowStock}</strong><small>Produk dengan stok ≤ 5</small><i>!</i></article>
    </section>

    <section className="admin-panel" id="orders">
      <div className="admin-panel-heading"><div><span className="admin-kicker">AKTIVITAS TOKO</span><h2>Pesanan terbaru</h2></div><label className="admin-select-label"><span className="sr-only">Filter status pesanan</span><select value={orderFilter} onChange={event => setOrderFilter(event.target.value)}><option value="">Semua status</option><option value="awaiting_payment">Menunggu pembayaran</option><option value="processing">Diproses</option><option value="completed">Selesai</option><option value="cancelled">Dibatalkan</option></select></label></div>
      {loading ? <div className="admin-loading">Memuat pesanan…</div> : visibleOrders.length === 0 ? <div className="admin-empty">Belum ada pesanan untuk ditampilkan.</div> : <div className="admin-table-wrap"><table className="admin-table admin-order-table"><thead><tr><th>Nomor pesanan</th><th>Pelanggan</th><th>Tanggal</th><th>Pembayaran</th><th>Total</th><th>Status pesanan</th><th>Resep</th></tr></thead><tbody>{visibleOrders.slice(0, 8).map(order => <tr key={order.id}><td><strong>{order.number}</strong></td><td>{order.address?.name || 'Pelanggan'}<small>{order.address?.city || '—'}</small></td><td>{formatDate(order.createdAt)}</td><td><span className={`admin-status admin-status-${order.paymentStatus}`}>{paymentLabels[order.paymentStatus] || order.paymentStatus}</span></td><td>{formatCurrency(order.total)}</td><td><select className="admin-status-select" aria-label={`Status pesanan ${order.number}`} value={order.status} disabled={busyId === order.id || order.status === 'cancelled' || order.status === 'completed'} onChange={event => void updateOrder(order, event.target.value as 'processing' | 'completed' | 'cancelled')}><option value="awaiting_payment" disabled>Menunggu pembayaran</option><option value="processing" disabled={order.status !== 'awaiting_payment' || order.paymentStatus !== 'paid'}>Diproses</option><option value="completed" disabled={order.status !== 'processing' || order.paymentStatus !== 'paid'}>Selesai</option><option value="cancelled" disabled={order.paymentStatus === 'paid' || order.status !== 'awaiting_payment'}>Dibatalkan</option></select><small>{orderLabels[order.status]}</small></td><td>{order.requiresPrescription ? <button className="admin-link-button" disabled={busyId === order.id} onClick={() => void downloadPrescription(order)}>Unduh</button> : <span className="admin-muted">—</span>}</td></tr>)}</tbody></table></div>}
    </section>

    <section className="admin-panel" id="products">
      <div className="admin-panel-heading admin-products-heading"><div><span className="admin-kicker">KATALOG</span><h2>Produk & stok</h2></div><div className="admin-products-tools"><label className="admin-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari produk" aria-label="Cari produk" /></label><button className="admin-button admin-button-outline" onClick={() => void loadDashboard()}>↻ Perbarui</button></div></div>
      {loading ? <div className="admin-loading">Memuat produk…</div> : visibleProducts.length === 0 ? <div className="admin-empty">Produk tidak ditemukan.</div> : <div className="admin-table-wrap"><table className="admin-table admin-product-table"><thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Ketersediaan</th><th>Aksi</th></tr></thead><tbody>{visibleProducts.map(product => <tr key={product.id}><td><div className="admin-product-cell"><img src={product.image} alt=""/><div><strong>{product.name}</strong><small>{product.frame} · {product.slug}</small></div></div></td><td>{product.category === 'minus' ? 'Kacamata minus' : 'Fashion'}</td><td>{formatCurrency(product.price)}</td><td><div className="admin-stock-control"><button aria-label={`Kurangi stok ${product.name}`} disabled={busyId === product.id || product.isActive === false || product.stock <= 0} onClick={() => void changeStock(product, -1)}>−</button><strong>{product.stock}</strong><button aria-label={`Tambah stok ${product.name}`} disabled={busyId === product.id || product.isActive === false} onClick={() => void changeStock(product, 1)}>＋</button></div></td><td><span className={`admin-stock-label ${product.isActive === false || product.stock <= 5 ? 'admin-stock-low' : ''}`}>{product.isActive === false ? 'Nonaktif' : product.stock <= 5 ? 'Stok menipis' : 'Tersedia'}</span></td><td><div className="admin-product-actions"><button className="admin-link-button" disabled={busyId === product.id} onClick={() => editProduct(product)}>Edit</button><button className="admin-link-button admin-danger-link" disabled={busyId === product.id} onClick={() => void deleteProduct(product)}>Hapus</button>{product.isActive === false ? <button className="admin-link-button" disabled={busyId === product.id} onClick={() => void reactivate(product)}>{busyId === product.id ? 'Mengaktifkan…' : 'Aktifkan'}</button> : <button className="admin-link-button admin-danger-link" disabled={busyId === product.id} onClick={() => void deactivate(product)}>{busyId === product.id ? 'Menonaktifkan…' : 'Nonaktifkan'}</button>}</div></td></tr>)}</tbody></table></div>}
    </section>

    <AdminLensManager />

    {modal && <AdminProductModal form={form} setForm={setForm} saving={saving} notice={notice} editing={Boolean(editingProduct)} onClose={() => { setModal(false); setEditingProduct(null) }} onSubmit={saveProduct} />}
  </div>
}
