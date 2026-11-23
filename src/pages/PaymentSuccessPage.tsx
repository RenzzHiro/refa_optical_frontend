import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getMyOrders } from '../api/orders'
import type { CustomerOrder } from '../types'
import { formatCurrency } from '../utils/format'

export default function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const orderNumber = params.get('order_id') || ''
  const [order, setOrder] = useState<CustomerOrder>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let attempts = 0
    const refresh = async () => {
      try {
        const orders = await getMyOrders()
        if (active) {
          setOrder(orders.find(item => item.number === orderNumber))
          setError('')
        }
      } catch {
        if (active) setError('Status pembayaran belum dapat dimuat. Coba perbarui halaman.')
      } finally {
        if (active) setLoading(false)
      }
      attempts += 1
      if (active && attempts < 15) window.setTimeout(refresh, 2000)
    }
    if (orderNumber) void refresh()
    else setLoading(false)
    return () => { active = false }
  }, [orderNumber])

  const paid = order?.paymentStatus === 'paid'
  return <div className="page-wrap payment-shell">
    <span className="eyebrow">Status pembayaran</span>
    <div className="success-mark" aria-hidden="true">{paid ? '✓' : '…'}</div>
    <h1 className="page-title">{paid ? 'Pembayaran berhasil' : 'Pembayaran sedang diverifikasi'}</h1>
    <div className="summary-card">
      {!orderNumber ? <p>Nomor pesanan tidak ditemukan pada tautan ini.</p> : <>
        <p>{paid ? 'Pembayaran Anda telah dikonfirmasi. Pesanan segera kami proses.' : 'Midtrans telah mengembalikan Anda ke Refa Optical. Kami sedang memastikan status pembayaran dari server.'}</p>
        {loading && <p className="helper-text">Memeriksa status pembayaran…</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {order && <><div className="summary-row"><span>Nomor pesanan</span><strong>{order.number}</strong></div><div className="summary-row summary-total"><span>Total</span><strong>{formatCurrency(order.total)}</strong></div></>}
      </>}
      <div className="button-row"><Link className="button button-primary" to="/account/orders">Lihat pesanan</Link><Link className="button button-secondary" to="/collections">Lanjut belanja</Link></div>
    </div>
  </div>
}
