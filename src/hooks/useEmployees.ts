import { useCallback, useState } from 'react'
import { useCrud } from './useCrud'
import { employeesService, type CreateEmployeeRequest, type UpdateEmployeeRequest, type UpdateSalaryRequest, type GetEmployeesParams } from '../services/employees.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { Employee } from '../types/domain.types'

export function useEmployees() {
  const crud = useCrud<Employee, CreateEmployeeRequest, UpdateEmployeeRequest>(employeesService)
  const [filters, setFilters] = useState<GetEmployeesParams>({})

  const fetchEmployees = useCallback((params?: GetEmployeesParams) => {
    const merged = { ...filters, ...params }
    setFilters(merged)
    return crud.fetchAll(merged as Record<string, unknown>)
  }, [crud, filters])

  const updateSalary = useCallback(async (id: string, data: UpdateSalaryRequest) => {
    try {
      await employeesService.updateSalary(id, data)
      await fetchEmployees()
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [fetchEmployees])

  return { ...crud, filters, fetchEmployees, updateSalary }
}