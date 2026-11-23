import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../stores/session'
export default function ProtectedRoute(){const email=useSession(s=>s.email);const location=useLocation();return email?<Outlet/>:<Navigate to="/login" replace state={{from:location.pathname}}/>}
