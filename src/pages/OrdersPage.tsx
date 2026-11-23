import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useOrders } from "../hooks/useOrders";
import { useSession } from "../stores/session";
import { formatCurrency, formatDate } from "../utils/format";
const labels: Record<string, string> = {
  pending: "Menunggu pembayaran",
  paid: "Dibayar",
  failed: "Pembayaran gagal",
  expired: "Kedaluwarsa",
  cancelled: "Dibatalkan",
  awaiting_payment: "Menunggu pembayaran",
  processing: "Diproses",
  completed: "Selesai",
};
export default function OrdersPage() {
  const email = useSession((s) => s.email);
  const { orders, loading } = useOrders(email);
  return (
    <div className="page-wrap">
      <span className="eyebrow">Ruang Anda</span>
      <h1 className="page-title">Pesanan saya</h1>
      <div className="account-grid">
        <AccountNav />
        <section className="account-content">
          <h2>Riwayat pesanan</h2>
          {loading ? (
            <p>Memuat pesanan…</p>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <h2>Belum ada pesanan</h2>
              <p>Pesanan yang Anda buat akan muncul di sini.</p>
              <Link className="button button-primary" to="/collections">
                Mulai belanja
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-head">
                  <div>
                    <strong>{order.number}</strong>
                    <div className="helper-text">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <span className={`status-pill status-${order.paymentStatus}`}>
                    {labels[order.paymentStatus]}
                  </span>
                </div>
                <div className="order-item-preview">
                  <img src={order.items[0]?.image} alt="" />
                  <span>
                    {order.items[0]?.name}
                    {order.items.length > 1
                      ? ` + ${order.items.length - 1} produk lainnya`
                      : ""}
                  </span>
                </div>
                <div className="order-card-foot">
                  <span>{labels[order.status]}</span>
                  <strong>{formatCurrency(order.total)}</strong>
                  <Link
                    className="text-link"
                    to={`/account/orders/${order.id}`}
                  >
                    Detail
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
