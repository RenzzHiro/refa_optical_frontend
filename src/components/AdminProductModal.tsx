import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { FaceType, Gender } from '../types'
import type { ProductForm } from '../pages/AdminDashboardPage'

interface Props {
  form: ProductForm
  setForm: Dispatch<SetStateAction<ProductForm>>
  saving: boolean
  notice: string
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  editing?: boolean
}

const genders: Gender[] = ['Pria', 'Wanita', 'Unisex']
const faceTypes: FaceType[] = ['Bulat', 'Kotak', 'Oval', 'Hati', 'Oblong']
const frames = ['Bulat', 'Kotak', 'Cat eye', 'Aviator', 'Rectangle'] as const

export default function AdminProductModal({ form, setForm, saving, notice, onClose, onSubmit, editing = false }: Props) {
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <div className="admin-modal-heading"><div><span className="admin-kicker">KATALOG REFA OPTICAL</span><h2 id="product-modal-title">{editing ? 'Edit frame / produk' : 'Tambah frame / produk'}</h2></div><button type="button" className="admin-modal-close" aria-label="Tutup" onClick={onClose}>×</button></div>
      <form onSubmit={onSubmit}>
        <label className="admin-field">Nama produk<input required maxLength={180} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Contoh: Aika Round 02" /></label>
        <div className="admin-form-row">
          <label className="admin-field">Kategori<select value={form.category} onChange={event => setForm({ ...form, category: event.target.value as ProductForm['category'] })}><option value="fashion">Fashion</option><option value="minus">Kacamata minus</option></select></label>
          <label className="admin-field">Bentuk frame<select value={form.frame} onChange={event => setForm({ ...form, frame: event.target.value as ProductForm['frame'] })}>{frames.map(frame => <option key={frame} value={frame}>{frame}</option>)}</select></label>
        </div>
        <div className="admin-form-row">
          <label className="admin-field">Harga (Rp)<input type="number" min="1" required value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} placeholder="350000" /></label>
          <label className="admin-field">Stok awal<input type="number" min="0" required value={form.stock} onChange={event => setForm({ ...form, stock: event.target.value })} /></label>
        </div>
        <fieldset className="admin-choice-field"><legend>Gender</legend><div className="admin-choice-list">{genders.map(value => <label key={value}><input type="checkbox" checked={form.gender.includes(value)} onChange={event => setForm({ ...form, gender: event.target.checked ? [...form.gender, value] : form.gender.filter(item => item !== value) })} />{value}</label>)}</div></fieldset>
        <fieldset className="admin-choice-field"><legend>Tipe wajah yang cocok</legend><div className="admin-choice-list">{faceTypes.map(value => <label key={value}><input type="checkbox" checked={form.faceTypes.includes(value)} onChange={event => setForm({ ...form, faceTypes: event.target.checked ? [...form.faceTypes, value] : form.faceTypes.filter(item => item !== value) })} />{value}</label>)}</div></fieldset>
        <label className="admin-field">Warna frame<input required value={form.colors} onChange={event => setForm({ ...form, colors: event.target.value })} placeholder="Onyx:#171717, Champagne:#d6c6a5" /><small>Format: nama warna:kode HEX. Pisahkan beberapa warna dengan koma.</small></label>
        <label className="admin-field">URL foto produk<input type="url" value={form.image} onChange={event => setForm({ ...form, image: event.target.value })} placeholder="https://…" /></label>
        <label className="admin-field">Deskripsi<textarea rows={3} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="Ceritakan bahan, bentuk, dan karakter frame." /></label>
        {notice && <p className="admin-form-error" role="alert">{notice}</p>}
        <div className="admin-modal-actions"><button type="button" className="admin-button admin-button-outline" onClick={onClose}>Batal</button><button className="admin-button admin-button-dark" disabled={saving}>{saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Simpan produk'}</button></div>
      </form>
    </section>
  </div>
}
