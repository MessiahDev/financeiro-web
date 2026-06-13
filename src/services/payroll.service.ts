import { get, post, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { Payroll, PayrollDetail, ProcessPayrollRequest, PayPayrollRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const payrollService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<Payroll>> {
    return get<PagedResult<Payroll>>(API_ROUTES.PAYROLL + buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>))
  },
  async getById(id: string): Promise<PayrollDetail> {
    return get<PayrollDetail>(`${API_ROUTES.PAYROLL}/${id}`)
  },
  async process(data: ProcessPayrollRequest): Promise<Payroll> {
    return post<Payroll>(`${API_ROUTES.PAYROLL}/process`, data)
  },
  async approve(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.PAYROLL}/${id}/approve`, {})
  },
  async pay(id: string, data: PayPayrollRequest): Promise<void> {
    return post<void>(`${API_ROUTES.PAYROLL}/${id}/pay`, data)
  },
  async cancel(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.PAYROLL}/${id}/cancel`, { reason })
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.PAYROLL}/${id}`)
  },
}