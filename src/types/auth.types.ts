export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name:            string
  email:           string
  password:        string
  confirmPassword: string
  role:            number
}

export interface MeResponse {
  id:    string
  email: string
  role:  number
}

export interface AuthResponse {
  token:     string
  name:      string
  email:     string
  role:      string
  expiresAt: string
}

export interface AuthUser {
  id:    string
  name:  string
  email: string
  roles: string[]
}

export interface AuthState {
  user:            AuthUser | null
  token:           string | null
  isAuthenticated: boolean
  isLoading:       boolean
}