import { Link } from 'react-router-dom'
export default function NotFoundPage(){return <div className="page-wrap empty-state"><span className="eyebrow">404</span><h1 className="page-title">Halaman tidak ditemukan</h1><p>Sepertinya halaman yang dicari tidak tersedia.</p><Link className="button button-primary" to="/">Kembali ke beranda</Link></div>}
