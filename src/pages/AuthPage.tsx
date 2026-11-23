import { useState } from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { authenticate } from '../api/auth'
import { ApiError } from '../api/client'
import { useSession } from '../stores/session'

export default function AuthPage({mode}:{mode:'login'|'register'}) {
  const [error,setError] = useState('')
  const [busy,setBusy] = useState(false)
  const setUser = useSession(s => s.setUser)
  const navigate = useNavigate()
  const location = useLocation()
  const requestedFrom = (location.state as {from?:string}|null)?.from
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setBusy(true); setError('')
    try {
      const result = await authenticate(mode, {
        name: mode === 'register' ? String(data.get('name')).trim() : undefined,
        email: String(data.get('email')).trim(),
        password: String(data.get('password')),
      })
      setUser(result.user)
      navigate(requestedFrom || (result.user.role === 'admin' ? '/admin' : '/account'),{replace:true})
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Tidak dapat terhubung ke server. Coba lagi.')
    } finally { setBusy(false) }
  }
  return <div className="auth-shell"><span className="eyebrow">Akun Refa Optical</span><h1>{mode==='login'?'Selamat datang kembali':'Buat akun Anda'}</h1><p>{mode==='login'?'Masuk untuk melanjutkan belanja dan melihat pesanan.':'Daftar agar checkout dan riwayat pesanan tersimpan di satu tempat.'}</p><form onSubmit={submit}>{mode==='register'&&<div className="form-field"><label htmlFor="name">Nama lengkap</label><input id="name" name="name" autoComplete="name" required placeholder="Nama Anda"/></div>}<div className="form-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="nama@email.com"/></div><div className="form-field"><label htmlFor="password">Kata sandi</label><input id="password" name="password" type="password" autoComplete={mode==='login'?'current-password':'new-password'} required minLength={8} placeholder="Minimal 8 karakter"/></div>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-wide" disabled={busy}>{busy?'Memproses…':mode==='login'?'Masuk':'Buat akun'}</button></form><div className="auth-switch">{mode==='login'?<>Belum punya akun? <Link to="/register">Daftar</Link></>:<>Sudah punya akun? <Link to="/login">Masuk</Link></>}</div></div>
}

