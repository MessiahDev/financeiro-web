import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { ROUTES } from './routes'

interface PrivateRouteProps {
  requiredRole?: string
}

export function PrivateRoute({ requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, hasRole } = useAuthContext()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  return <Outlet />
}
