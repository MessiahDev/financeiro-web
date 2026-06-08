// =============================================================================
// useCustomers.ts
// =============================================================================

import { useCallback, useState } from 'react'
import { useCrud } from './useCrud'
import { customersService, type CreateCustomerRequest, type UpdateCustomerRequest, type GetCustomersParams } from '../services/customers.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { Customer } from '../types/domain.types'

export function useCustomers() {
  const crud = useCrud<Customer, CreateCustomerRequest, UpdateCustomerRequest>(customersService)
  const [filters, setFilters] = useState<GetCustomersParams>({})

  const fetchCustomers = useCallback((params?: GetCustomersParams) => {
    const merged = { ...filters, ...params }
    setFilters(merged)
    return crud.fetchAll(merged as Record<string, unknown>)
  }, [crud, filters])

  const blockCustomer = useCallback(async (id: string, reason: string) => {
    try {
      await customersService.block(id, reason)
      await fetchCustomers()
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [fetchCustomers])

  return { ...crud, filters, fetchCustomers, blockCustomer }
}
