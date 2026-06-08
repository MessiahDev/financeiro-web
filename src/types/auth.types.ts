export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 3
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  expiresAt: string
  user: AuthUser
}

export interface AuthUser {
  id: string
  name: string
  email: string
  roles: string[]
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
