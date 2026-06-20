import { get, put, post } from './api'
import { API_ROUTES } from '../utils/constants'
import type { UserSummary, UserAuditLog } from '../types/domain.types'

export const usersService = {
  async updateName(name: string): Promise<void> {
    return put<void>(`${API_ROUTES.USERS}/me/name`, { name })
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return put<void>(`${API_ROUTES.USERS}/me/password`, { currentPassword, newPassword })
  },
  async getAll(): Promise<UserSummary[]> {
    return get<UserSummary[]>(API_ROUTES.USERS)
  },
  async changeRole(id: string, role: string): Promise<void> {
    return put<void>(`${API_ROUTES.USERS}/${id}/role`, { role })
  },
  async activate(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.USERS}/${id}/activate`, {})
  },
  async deactivate(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.USERS}/${id}/deactivate`, {})
  },
  async getAuditLog(userId?: string): Promise<UserAuditLog[]> {
    return get<UserAuditLog[]>(`${API_ROUTES.USERS}/audit-log`, userId ? { userId } : undefined)
  },
}