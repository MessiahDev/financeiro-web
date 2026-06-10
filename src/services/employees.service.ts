import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, UpdateSalaryRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface GetEmployeesParams {
  pageNumber?:   number
  pageSize?:     number
  search?:       string
  departmentId?: string
  status?:       string
}

export const employeesService = {
  async getAll(params?: GetEmployeesParams): Promise<PagedResult<Employee>> {
    return get<PagedResult<Employee>>(API_ROUTES.EMPLOYEES + buildQueryString(
      (params ?? {}) as Record<string, string | number | boolean | null | undefined>))
  },
  async getById(id: string): Promise<Employee> {
    return get<Employee>(`${API_ROUTES.EMPLOYEES}/${id}`)
  },
  async getByDepartment(departmentId: string): Promise<Employee[]> {
    return get<Employee[]>(`${API_ROUTES.EMPLOYEES}/by-department/${departmentId}`)
  },
  async create(data: CreateEmployeeRequest): Promise<Employee> {
    return post<Employee>(API_ROUTES.EMPLOYEES, data)
  },
  async update(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    return put<Employee>(`${API_ROUTES.EMPLOYEES}/${id}`, data)
  },
  async updateSalary(id: string, data: UpdateSalaryRequest): Promise<void> {
    return post<void>(`${API_ROUTES.EMPLOYEES}/${id}/update-salary`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.EMPLOYEES}/${id}`)
  },
}