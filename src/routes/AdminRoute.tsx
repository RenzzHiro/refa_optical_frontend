import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../stores/session'

export default function AdminRoute() {
  const email = useSession(state => state.email)
  const role = useSession(state => state.role)
  const location = useLocation()
  if (!email) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role !== 'admin') return <Navigate to="/account" replace />
  return <Outlet />
}
