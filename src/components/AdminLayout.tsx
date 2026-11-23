import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { useSession } from '../stores/session'
import '../styles/admin.css'

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const clear = useSession(state => state.clear)
  const name = useSession(state => state.name)
  const navigate = useNavigate()
  function signOut() {
    void logout().catch(() => undefined).finally(() => { clear(); navigate('/') })
  }
  const links = <>
    <NavLink to="/admin" end onClick={() => setMenuOpen(false)}><span className="admin-nav-mark">⌂</span> Ringkasan</NavLink>
    <a href="/admin#orders" onClick={() => setMenuOpen(false)}><span className="admin-nav-mark">▤</span> Pesanan</a>
    <a href="/admin#products" onClick={() => setMenuOpen(false)}><span className="admin-nav-mark">◫</span> Produk & stok</a>
  </>
  return <div className="admin-shell">
    <aside className={`admin-sidebar ${menuOpen ? 'admin-sidebar-open' : ''}`}>
      <Link to="/admin" className="admin-wordmark" aria-label="Kembali ke dashboard Refa Optical">refa<span>optical</span></Link>
      <span className="admin-sidebar-label">TOKO</span>
      <nav className="admin-nav" aria-label="Navigasi dashboard">{links}</nav>
      <div className="admin-sidebar-bottom">
        <Link to="/" className="admin-view-store">Lihat toko ↗</Link>
        <button className="admin-logout" onClick={signOut}>Keluar</button>
      </div>
    </aside>
    {menuOpen && <button className="admin-overlay" aria-label="Tutup menu" onClick={() => setMenuOpen(false)} />}
    <div className="admin-main-column">
      <header className="admin-topbar">
        <button className="admin-mobile-toggle" aria-label="Buka navigasi" onClick={() => setMenuOpen(value => !value)}>☰</button>
        <div className="admin-breadcrumb">Dashboard <span>/</span> <strong>Refa Optical</strong></div>
        <div className="admin-profile"><span className="admin-avatar">{(name || 'A').slice(0, 1).toUpperCase()}</span><span>{name || 'Admin'}</span></div>
      </header>
      <main className="admin-main"><Outlet /></main>
    </div>
  </div>
}
