import { post } from './api'
import { API_ROUTES } from '../utils/constants'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'
 
export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return post<AuthResponse>(API_ROUTES.AUTH_LOGIN, data)
  },
 
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return post<AuthResponse>(API_ROUTES.AUTH_REGISTER, data)
  },
}