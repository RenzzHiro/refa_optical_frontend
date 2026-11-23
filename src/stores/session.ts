import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAccessToken } from '../api/client'
import type { AuthUser } from '../api/auth'

interface SessionState {
  email: string | null
  name: string | null
  role: string | null
  setUser: (user: AuthUser) => void
  clear: () => void
}

export const useSession = create<SessionState>()(persist((set) => ({
  email: null,
  name: null,
  role: null,
  setUser: (user) => set({ email: user.email, name: user.name, role: user.role }),
  clear: () => { setAccessToken(null); set({ email: null, name: null, role: null }) },
}), { name: 'refa-optical-session' }))
