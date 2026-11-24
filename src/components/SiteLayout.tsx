import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "./Icon";
import { useCart } from "../stores/cart";
import { useSession } from "../stores/session";
export default function SiteLayout() {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState("");
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const name = useSession((s) => s.name);
  const role = useSession((s) => s.role);
  const navigate = useNavigate();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/collections?q=${encodeURIComponent(query)}`);
    setSearch(false);
  }
  return (
    <>
      <div className="announcement">
        Gratis konsultasi pemilihan frame · Temukan gaya yang terasa seperti
        Anda
      </div>
      <header className="site-header">
        <button
          className="icon-button mobile-menu-button"
          aria-label="Buka menu"
          onClick={() => setMenu(!menu)}
        >
          <Icon name={menu ? "close" : "menu"} />
        </button>
        <Link to="/" className="wordmark" aria-label="Refa Optical beranda">
          refa<span>optical</span>
        </Link>
        <nav
          className={`main-nav ${menu ? "is-open" : ""}`}
          aria-label="Navigasi utama"
        >
          <NavLink to="/collections" onClick={() => setMenu(false)}>
            Belanja
          </NavLink>
          <a href="#footer" onClick={() => setMenu(false)}>
            Tentang
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Cari produk"
            onClick={() => setSearch(!search)}
          >
            <Icon name="search" />
          </button>
          <Link
            className="icon-button"
            aria-label={name ? "Kembali ke dashboard" : "Masuk atau daftar"}
            title={name ? "Kembali ke dashboard" : "Masuk atau daftar"}
            to={name ? (role === "admin" ? "/admin" : "/account") : "/login"}
          >
            <Icon name={name ? "home" : "user"} />
          </Link>
          <Link
            className="icon-button"
            aria-label={`Keranjang, ${count} item`}
            to="/cart"
          >
            <Icon name="bag" />
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
        {search && (
          <form className="header-search" onSubmit={submit}>
            <Icon name="search" />
            <input
              autoFocus
              aria-label="Cari produk"
              placeholder="Cari frame favorit Anda"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="text-button">Cari</button>
          </form>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer" id="footer">
        <div className="footer-main">
          <div>
            <Link to="/" className="wordmark footer-wordmark">
              refa<span>optical</span>
            </Link>
            <p>
              Temukan frame yang membuat Anda merasa paling menjadi diri
              sendiri.
            </p>
          </div>
          <div>
            <strong>Jelajahi</strong>
            <Link to="/collections">Semua koleksi</Link>
            <Link to="/collections?category=minus">Kacamata minus</Link>
            <Link to="/collections?category=fashion">Kacamata fashion</Link>
          </div>
          <div>
            <strong>Bantuan</strong>
            <Link to="/account/orders">Pesanan saya</Link>
            <Link to="/account">Akun</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Refa Optical</span>
          <span>Dibuat untuk melihat lebih jelas.</span>
        </div>
      </footer>
    </>
  );
}
