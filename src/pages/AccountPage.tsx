import { Link } from 'react-router-dom'
import AccountNav from '../components/AccountNav'
import { useSession } from '../stores/session'
import { useOrders } from '../hooks/useOrders'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { formatCurrency, formatDate } from '../utils/format'
import '../styles/dashboard.css'

const statusLabels:Record<string,string>={pending:'Menunggu pembayaran',paid:'Dibayar',failed:'Pembayaran gagal',expired:'Kedaluwarsa',cancelled:'Dibatalkan',awaiting_payment:'Menunggu pembayaran',processing:'Diproses',completed:'Selesai'}

export default function AccountPage(){
  const name=useSession(s=>s.name),email=useSession(s=>s.email)
  const {orders,loading:ordersLoading}=useOrders(email)
  const {products,loading:productsLoading,error:productsError}=useProducts({})
  const activeOrders=orders.filter(order=>order.status!=='completed'&&order.status!=='cancelled').length
  const unpaidOrders=orders.filter(order=>order.paymentStatus==='pending').length
  const availableProducts=products.filter(product=>product.stock>0).length
  const recentOrders=orders.slice(0,3)
  return <div className="page-wrap"><span className="eyebrow">Ruang Anda</span><h1 className="page-title">Akun saya</h1><div className="account-grid"><AccountNav/><section className="account-content dashboard-content">
    <div className="dashboard-welcome"><div><span className="eyebrow">Refa Optical</span><h2>Halo, {name}</h2><p className="page-intro">Pantau pesanan Anda dan temukan pilihan frame yang tersedia.</p></div><Link className="button button-primary" to="/collections">Belanja koleksi</Link></div>
    <div className="dashboard-stats"><article className="dashboard-stat"><span>Pesanan aktif</span><strong>{ordersLoading?'—':activeOrders}</strong><small>Pesanan yang sedang berjalan</small></article><article className="dashboard-stat"><span>Menunggu pembayaran</span><strong>{ordersLoading?'—':unpaidOrders}</strong><small>Perlu diselesaikan di Midtrans</small></article><article className="dashboard-stat"><span>Produk tersedia</span><strong>{productsLoading?'—':availableProducts}</strong><small>Frame siap dipilih</small></article></div>
    <div className="dashboard-section-head"><div><span className="eyebrow">Aktivitas terbaru</span><h2>Pesanan terbaru</h2></div><Link className="text-link" to="/account/orders">Semua pesanan</Link></div>
    {ordersLoading?<p className="dashboard-empty">Memuat pesanan…</p>:recentOrders.length===0?<div className="dashboard-empty"><p>Pesanan Anda akan muncul di sini setelah checkout.</p><Link className="text-link" to="/collections">Mulai memilih frame</Link></div>:<div className="dashboard-orders">{recentOrders.map(order=><article className="dashboard-order" key={order.id}><div className="dashboard-order-main"><img src={order.items[0]?.image} alt=""/><div><strong>{order.number}</strong><span>{formatDate(order.createdAt)} · {order.items.length} produk</span></div></div><div className="dashboard-order-status"><span className={`status-pill status-${order.paymentStatus}`}>{statusLabels[order.paymentStatus]}</span><strong>{formatCurrency(order.total)}</strong></div><Link className="text-link" to={`/account/orders/${order.id}`}>Detail</Link></article>)}</div>}
    <div className="dashboard-section-head dashboard-products-head"><div><span className="eyebrow">Tersedia untuk Anda</span><h2>Temukan frame berikutnya</h2></div><Link className="text-link" to="/collections">Lihat katalog</Link></div>
    {productsLoading?<div className="product-grid">{Array.from({length:3},(_,index)=><div className="skeleton-card" key={index}><div className="skeleton-image"/><div className="skeleton-line"/></div>)}</div>:productsError?<p className="dashboard-empty">Produk belum dapat dimuat. Coba buka katalog beberapa saat lagi.</p>:products.filter(product=>product.stock>0).length===0?<p className="dashboard-empty">Belum ada produk tersedia saat ini.</p>:<div className="product-grid dashboard-product-grid">{products.filter(product=>product.stock>0).slice(0,3).map(product=><div className="dashboard-product" key={product.id}><ProductCard product={product}/><span className="dashboard-stock">Tersedia · {product.stock} stok</span></div>)}</div>}
    <div className="summary-card account-summary"><span className="eyebrow">Informasi akun</span><p>{email}</p><Link className="text-link" to="/account/orders">Lihat riwayat pesanan</Link></div>
  </section></div></div>
}
