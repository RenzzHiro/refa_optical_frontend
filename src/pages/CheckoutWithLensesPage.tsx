import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLenses } from '../api/lenses'
import { createOrder } from '../api/orders'
import { ApiError } from '../api/client'
import { useCartProducts } from '../hooks/useCartProducts'
import { useCart } from '../stores/cart'
import { useSession } from '../stores/session'
import type { LensOption } from '../types'
import { formatCurrency } from '../utils/format'

const lensTypeNames: Record<string, string> = { minus: 'Minus', anti_radiation: 'Anti radiasi', photochromic: 'Photochromic' }
const cartKey = (productId: string, colorName: string) => `${productId}:${colorName}`

export default function CheckoutWithLensesPage() {
  const items = useCart(state => state.items)
  const clear = useCart(state => state.clear)
  const customer = useSession(state => state.name)
  const { products, loading: productsLoading } = useCartProducts({})
  const navigate = useNavigate()
  const [lenses, setLenses] = useState<LensOption[]>([])
  const [lensesLoading, setLensesLoading] = useState(true)
  const [lensError, setLensError] = useState('')
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState(() => sessionStorage.getItem('refa-checkout-order') || '')
  const rows = useMemo(() => items.map(item => ({ item, product: products.find(product => product.id === item.productId) })).filter(row => row.product), [items, products])

  useEffect(() => {
    let active = true
    getLenses().then(data => { if (active) { setLenses(data); setLensError('') } })
      .catch(cause => { if (active) setLensError(cause instanceof ApiError ? cause.message : 'Pilihan lensa tidak dapat dimuat.') })
      .finally(() => { if (active) setLensesLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!lenses.length) return
    setSelections(current => {
      const next = { ...current }
      for (const { item } of rows) {
        const key = cartKey(item.productId, item.colorName)
        if (!next[key] || !lenses.some(lens => lens.id === next[key])) next[key] = lenses[0].id
      }
      return next
    })
  }, [lenses, rows])

  const subtotal = rows.reduce((sum, row) => {
    const lens = lenses.find(option => option.id === selections[cartKey(row.item.productId, row.item.colorName)])
    return sum + ((row.product?.price || 0) + (lens?.price || 0)) * row.item.quantity
  }, 0)
  const lensesReady = !lensesLoading && !lensError && lenses.length > 0

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!rows.length) { navigate('/collections'); return }
    if (!lensesReady) { setError('Pilihan lensa belum tersedia. Hubungi admin toko.'); return }
    if (rows.some(row => !selections[cartKey(row.item.productId, row.item.colorName)])) { setError('Pilih lensa untuk setiap produk.'); return }
    setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    try {
      let orderId = pendingOrderId
      if (!orderId) {
        const order = await createOrder({
          items: rows.map(({ item }) => ({ productId: item.productId, lensId: selections[cartKey(item.productId, item.colorName)], quantity: item.quantity, colorName: item.colorName })),
          address: { name: String(form.get('name')), phone: String(form.get('phone')), address: String(form.get('address')), city: String(form.get('city')), postalCode: String(form.get('postal')) },
        })
        orderId = order.id; sessionStorage.setItem('refa-checkout-order', orderId); setPendingOrderId(orderId)
      }
      clear(); sessionStorage.removeItem('refa-checkout-order'); navigate(`/payment/${orderId}`)
    } catch (cause) { setError(cause instanceof ApiError ? cause.message : 'Pesanan belum dapat dibuat. Periksa koneksi lalu coba lagi.') }
    finally { setBusy(false) }
  }

  if (productsLoading || lensesLoading) return <div className="page-wrap"><p>Memuat keranjang dan pilihan lensa…</p></div>
  if (!rows.length) return <div className="page-wrap empty-state"><h2>{items.length ? 'Produk di keranjang sudah tidak tersedia' : 'Keranjang Anda masih kosong'}</h2><button className="button button-primary" onClick={() => navigate('/collections')}>Kembali ke koleksi</button></div>

  return <div className="page-wrap"><span className="eyebrow">Satu langkah lagi</span><h1 className="page-title">Checkout</h1>
    <div className="two-column"><form onSubmit={submit}>
      <h2 className="form-section-title">Pilihan lensa</h2>
      {lensError && <p className="form-error" role="alert">{lensError} <button type="button" onClick={() => window.location.reload()}>Coba lagi</button></p>}
      {!lensError && lenses.length === 0 && <p className="notice">Pilihan lensa belum diatur. Silakan hubungi admin toko sebelum melanjutkan.</p>}
      {rows.map(({ item, product }) => {
        const key = cartKey(item.productId, item.colorName)
        return <div className="form-field" key={key}><label htmlFor={`lens-${key}`}>{product!.name} · {item.colorName}</label>
          <select id={`lens-${key}`} value={selections[key] || ''} disabled={!lensesReady} onChange={event => setSelections(current => ({ ...current, [key]: event.target.value }))}>
            {lenses.map(lens => <option key={lens.id} value={lens.id}>{lens.name} · {lensTypeNames[lens.type]} · +{formatCurrency(lens.price)}{lens.stock < item.quantity ? ' (stok tidak cukup)' : ''}</option>)}
          </select>
        </div>
      })}
      <h2 className="form-section-title">Informasi penerima</h2>
      <div className="form-grid"><div className="form-field"><label htmlFor="checkout-name">Nama lengkap</label><input id="checkout-name" name="name" required defaultValue={customer || ''} autoComplete="name" /></div>
        <div className="form-field"><label htmlFor="checkout-phone">Nomor telepon</label><input id="checkout-phone" name="phone" required type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" /></div>
        <div className="form-field full"><label htmlFor="checkout-address">Alamat lengkap</label><textarea id="checkout-address" name="address" required autoComplete="street-address" placeholder="Nama jalan, nomor rumah, kecamatan" /></div>
        <div className="form-field"><label htmlFor="checkout-city">Kota/Kabupaten</label><input id="checkout-city" name="city" required autoComplete="address-level2" /></div>
        <div className="form-field"><label htmlFor="checkout-postal">Kode pos</label><input id="checkout-postal" name="postal" required inputMode="numeric" autoComplete="postal-code" /></div></div>
      <div className="notice">Pesanan dibuat oleh server dan pembayaran dilanjutkan melalui Midtrans.</div>{error && <p className="form-error" role="alert">{error}</p>}{pendingOrderId && <p className="helper-text">Pesanan sudah tersimpan. Lengkapi langkah ini untuk melanjutkan.</p>}
      <button className="button button-primary" disabled={busy || !lensesReady}>{busy ? 'Menyiapkan pesanan…' : 'Lanjut ke pembayaran'}</button>
    </form>
    <aside className="summary-card"><h2>Pesanan Anda</h2>{rows.map(({ item, product }) => { const lens = lenses.find(option => option.id === selections[cartKey(item.productId, item.colorName)]); return <div className="checkout-line" key={cartKey(item.productId, item.colorName)}><span>{product!.name} · {lens?.name || 'Pilih lensa'} × {item.quantity}</span><strong>{formatCurrency(((product?.price || 0) + (lens?.price || 0)) * item.quantity)}</strong></div> })}<div className="summary-row"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div><div className="summary-row"><span>Pengiriman</span><span>Belum dihitung</span></div><div className="summary-row summary-total"><span>Total sementara</span><span>{formatCurrency(subtotal)}</span></div><p className="helper-text">Ongkos kirim untuk sementara Rp 0.</p></aside></div>
  </div>
}
