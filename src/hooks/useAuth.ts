import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { getErrorMessage } from '../utils/errorHandler'
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema'

export function useAuth() {
  const auth = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function login(data: LoginFormData) {
    setIsLoading(true)
    setError(null)
    try {
      await auth.login(data)
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function register(data: RegisterFormData) {
    setIsLoading(true)
    setError(null)
    try {
      await auth.register(data)
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // state
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading,
    error,
    // actions
    login,
    register,
    logout: auth.logout,
    hasRole: auth.hasRole,
    clearError: () => setError(null),
  }
}
