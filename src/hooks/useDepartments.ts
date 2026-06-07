import { useCrud } from './useCrud'
import { departmentsService, type CreateDepartmentRequest, type UpdateDepartmentRequest } from '../services/departments.service'
import type { Department } from '../types/domain.types'

export function useDepartments() {
  const crud = useCrud<Department, CreateDepartmentRequest, UpdateDepartmentRequest>(departmentsService)
  return { ...crud, fetchDepartments: crud.fetchAll }
}