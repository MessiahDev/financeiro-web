import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'
import type { AuthUser } from '../types/auth.types'
import {
  authReducer,
  getInitialAuthState,
  type AuthStoreState,
} from '../store/authStore'
import { authService } from '../services/auth.service'
import { decodeJwt } from '../utils/jwt'
import type { LoginRequest, RegisterRequest } from '../types/auth.types'

interface AuthContextValue extends AuthStoreState {
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  hasRole: (role: string) => boolean
  hasMinimumRole: (minRole: string) => boolean
  updateUserName: (name: string) => void
}

const ROLE_HIERARCHY: Record<string, number> = {
  Employee: 1,
  Manager: 2,
  Admin: 3,
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, undefined, getInitialAuthState)

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data)
    const payload = decodeJwt(response.token)
    const user: AuthUser = {
      id: payload?.sub ?? '',
      name: response.name,
      email: response.email,
      roles: [response.role],
    }
    dispatch({ type: 'LOGIN', payload: { user, token: response.token } })
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data)
    const payload = decodeJwt(response.token)
    const user: AuthUser = {
      id: payload?.sub ?? '',
      name: response.name,
      email: response.email,
      roles: [response.role],
    }
    dispatch({ type: 'LOGIN', payload: { user, token: response.token } })
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  const hasRole = useCallback(
    (role: string) => state.user?.roles.includes(role) ?? false,
    [state.user],
  )

  const hasMinimumRole = useCallback(
    (minRole: string) => {
      const userRole = state.user?.roles[0]
      if (!userRole) return false
      return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0)
    },
    [state.user],
  )

  const updateUserName = useCallback((name: string) => {
    if (!state.user || !state.token) return
    const updatedUser: AuthUser = { ...state.user, name }
    dispatch({ type: 'LOGIN', payload: { user: updatedUser, token: state.token } })
  }, [state.user, state.token])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, hasRole, hasMinimumRole, updateUserName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext deve ser usado dentro de <AuthProvider>')
  return ctx
}