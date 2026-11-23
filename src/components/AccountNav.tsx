import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useSession } from "../stores/session";
export default function AccountNav() {
  const clear = useSession((s) => s.clear),
    navigate = useNavigate();
  return (
    <nav className="account-nav" aria-label="Menu akun">
      <NavLink to="/account" end>
        Ringkasan akun
      </NavLink>
      <NavLink to="/account/orders">Pesanan saya</NavLink>
      <button
        onClick={() => {
          void logout().catch(() => undefined).finally(clear);
          navigate("/");
        }}
      >
        Keluar
      </button>
    </nav>
  );
}
