import type { AuthUser } from '../types/auth.types'
import { storage } from '../utils/storage'

export interface AuthStoreState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

export type AuthAction =
  | { type: 'LOGIN'; payload: { user: AuthUser; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: AuthUser }

export function getInitialAuthState(): AuthStoreState {
  const token = storage.getToken()
  const user = storage.getUser<AuthUser>()
 
  if (token && user) {
    return { token, user, isAuthenticated: true }
  }
 
  return { token: null, user: null, isAuthenticated: false }
}

export function authReducer(state: AuthStoreState, action: AuthAction): AuthStoreState {
  switch (action.type) {
    case 'LOGIN': {
      const { user, token } = action.payload
      storage.setToken(token)
      storage.setUser(user)
      return { token, user, isAuthenticated: true }
    }
 
    case 'LOGOUT': {
      storage.clearAuth()
      return { token: null, user: null, isAuthenticated: false }
    }
 
    case 'SET_USER': {
      storage.setUser(action.payload)
      return { ...state, user: action.payload }
    }
 
    default:
      return state
  }
}