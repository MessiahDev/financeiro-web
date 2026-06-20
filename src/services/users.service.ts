import { put } from './api'
import { API_ROUTES } from '../utils/constants'

export const usersService = {
  async updateName(name: string): Promise<void> {
    return put<void>(`${API_ROUTES.USERS}/me/name`, { name })
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return put<void>(`${API_ROUTES.USERS}/me/password`, { currentPassword, newPassword })
  },
}