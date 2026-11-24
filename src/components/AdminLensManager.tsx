import { useCallback, useEffect, useState } from 'react'
import { adminApi, type LensInput } from '../api/admin'
import { ApiError } from '../api/client'
import type { LensOption, LensType } from '../types'
import { formatCurrency } from '../utils/format'

type LensForm = { name: string; type: LensType; description: string; price: string; stock: string }
const blankForm: LensForm = { name: '', type: 'minus', description: '', price: '', stock: '0' }
const typeLabels: Record<LensType, string> = { minus: 'Minus', anti_radiation: 'Anti radiasi', photochromic: 'Photochromic' }

function toPayload(form: LensForm): LensInput {
  return { name: form.name.trim(), type: form.type, description: form.description.trim(), price: Number(form.price), stock: Number(form.stock), isActive: true }
}

export default function AdminLensManager() {
  const [lenses, setLenses] = useState<LensOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<LensOption | null>(null)
  const [form, setForm] = useState<LensForm>(blankForm)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setLenses(await adminApi.listLenses()) }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : 'Data lensa tidak dapat dimuat.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])

  function openCreate() { setEditing(null); setForm(blankForm); setModal(true); setNotice('') }
  function openEdit(lens: LensOption) {
    setEditing(lens); setForm({ name: lens.name, type: lens.type, description: lens.description, price: String(lens.price), stock: String(lens.stock) }); setModal(true); setNotice('')
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setNotice('')
    try {
      const payload = toPayload(form)
      const saved = editing ? await adminApi.updateLens(editing.id, payload) : await adminApi.createLens(payload)
      setLenses(rows => editing ? rows.map(row => row.id === saved.id ? saved : row) : [saved, ...rows])
      setModal(false); setNotice(`${saved.name} berhasil ${editing ? 'diperbarui' : 'ditambahkan'}.`)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Lensa tidak dapat disimpan.') }
    finally { setSaving(false) }
  }
  async function adjustStock(lens: LensOption, delta: number) {
    setBusyId(lens.id)
    try {
      const result = await adminApi.adjustLensStock(lens.id, delta)
      setLenses(rows => rows.map(row => row.id === lens.id ? { ...row, stock: result.stock } : row))
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Stok lensa tidak dapat diperbarui.') }
    finally { setBusyId('') }
  }
  async function deactivate(lens: LensOption) {
    if (!window.confirm(`Nonaktifkan ${lens.name}?`)) return
    setBusyId(lens.id)
    try {
      await adminApi.deactivateLens(lens.id)
      setLenses(rows => rows.map(row => row.id === lens.id ? { ...row, isActive: false } : row))
      setNotice(`${lens.name} dinonaktifkan.`)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Lensa tidak dapat dinonaktifkan.') }
    finally { setBusyId('') }
  }
  async function reactivate(lens: LensOption) {
    setBusyId(lens.id)
    try {
      await adminApi.setLensActive(lens.id, true)
      setLenses(rows => rows.map(row => row.id === lens.id ? { ...row, isActive: true } : row))
      setNotice(`${lens.name} diaktifkan kembali.`)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Lensa tidak dapat diaktifkan kembali.') }
    finally { setBusyId('') }
  }
  async function deletePermanently(lens: LensOption) {
    if (!window.confirm(`Hapus permanen lensa ${lens.name}? Lensa yang sudah dipakai dalam pesanan tidak dapat dihapus.`)) return
    setBusyId(lens.id); setNotice('')
    try {
      await adminApi.deleteLensPermanently(lens.id)
      setLenses(rows => rows.filter(row => row.id !== lens.id))
      setNotice(`${lens.name} dihapus permanen.`)
    } catch (cause) { setNotice(cause instanceof ApiError ? cause.message : 'Lensa belum dapat dihapus.') }
    finally { setBusyId('') }
  }

  return <section className="admin-panel" id="lenses">
    <div className="admin-panel-heading"><div><span className="admin-kicker">KONFIGURASI</span><h2>Jenis lensa</h2></div><button className="admin-button admin-button-dark" onClick={openCreate}>＋ Tambah lensa</button></div>
    {error && <div className="admin-alert admin-alert-error" role="alert">{error}<button onClick={() => void load()}>Coba lagi</button></div>}
    {notice && <div className="admin-alert" role="status">{notice}<button aria-label="Tutup pemberitahuan" onClick={() => setNotice('')}>×</button></div>}
    {loading ? <div className="admin-loading">Memuat pilihan lensa…</div> : lenses.length === 0 ? <div className="admin-empty">Belum ada pilihan lensa. Tambahkan jenis dan harga sebelum pelanggan checkout.</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nama lensa</th><th>Jenis</th><th>Harga tambahan</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{lenses.map(lens => <tr key={lens.id}><td><strong>{lens.name}</strong><small>{lens.description || '—'}</small></td><td>{typeLabels[lens.type]}</td><td>{formatCurrency(lens.price)}</td><td><div className="admin-stock-control"><button aria-label={`Kurangi stok ${lens.name}`} disabled={!lens.isActive || busyId === lens.id || lens.stock <= 0} onClick={() => void adjustStock(lens, -1)}>−</button><strong>{lens.stock}</strong><button aria-label={`Tambah stok ${lens.name}`} disabled={!lens.isActive || busyId === lens.id} onClick={() => void adjustStock(lens, 1)}>＋</button></div></td><td><span className={`admin-stock-label ${lens.isActive ? '' : 'admin-stock-low'}`}>{lens.isActive ? lens.stock > 0 ? 'Tersedia' : 'Stok habis' : 'Nonaktif'}</span></td><td><div className="admin-product-actions">{lens.isActive ? <><button className="admin-link-button" disabled={busyId === lens.id} onClick={() => openEdit(lens)}>Edit</button><button className="admin-link-button admin-danger-link" disabled={busyId === lens.id} onClick={() => void deactivate(lens)}>{busyId === lens.id ? 'Menonaktifkan…' : 'Nonaktifkan'}</button></> : <button className="admin-link-button" disabled={busyId === lens.id} onClick={() => void reactivate(lens)}>{busyId === lens.id ? 'Mengaktifkan…' : 'Aktifkan'}</button>}<button className="admin-link-button admin-danger-link" disabled={busyId === lens.id} onClick={() => void deletePermanently(lens)}>{busyId === lens.id ? 'Menghapus…' : 'Hapus'}</button></div></td></tr>)}</tbody></table></div>}
    {modal && <div className="admin-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setModal(false) }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="lens-modal-title"><div className="admin-modal-heading"><div><span className="admin-kicker">KATALOG LENSA</span><h2 id="lens-modal-title">{editing ? 'Edit lensa' : 'Tambah lensa'}</h2></div><button type="button" className="admin-modal-close" aria-label="Tutup" onClick={() => setModal(false)}>×</button></div><form onSubmit={save}><label className="admin-field">Nama lensa<input required maxLength={120} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Contoh: Photochromic 1.56" /></label><label className="admin-field">Jenis<select value={form.type} onChange={event => setForm({ ...form, type: event.target.value as LensType })}><option value="minus">Lensa minus</option><option value="anti_radiation">Anti radiasi</option><option value="photochromic">Photochromic</option></select></label><div className="admin-form-row"><label className="admin-field">Harga tambahan (Rp)<input type="number" min="0" required value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} /></label><label className="admin-field">Stok<input type="number" min="0" required value={form.stock} onChange={event => setForm({ ...form, stock: event.target.value })} /></label></div><label className="admin-field">Deskripsi<textarea rows={3} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label><p className="admin-form-note">Lensa minus memerlukan upload foto dan detail resep saat checkout.</p>{notice && <p className="admin-form-error" role="alert">{notice}</p>}<div className="admin-modal-actions"><button type="button" className="admin-button admin-button-outline" onClick={() => setModal(false)}>Batal</button><button className="admin-button admin-button-dark" disabled={saving}>{saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Simpan lensa'}</button></div></form></section></div>}
  </section>
}
