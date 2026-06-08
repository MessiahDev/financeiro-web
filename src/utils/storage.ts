import { STORAGE_KEYS } from './constants'

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  },

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
  },

  removeRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  getUser<T>(): T | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  setUser<T>(user: T): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  removeUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },
}
