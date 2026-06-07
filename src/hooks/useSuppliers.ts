import { useCallback, useState } from 'react'
import { useCrud } from './useCrud'
import { suppliersService, type CreateSupplierRequest, type UpdateSupplierRequest, type GetSuppliersParams } from '../services/suppliers.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { Supplier } from '../types/domain.types'

export function useSuppliers() {
  const crud = useCrud<Supplier, CreateSupplierRequest, UpdateSupplierRequest>(suppliersService)
  const [filters, setFilters] = useState<GetSuppliersParams>({})

  const fetchSuppliers = useCallback((params?: GetSuppliersParams) => {
    const merged = { ...filters, ...params }
    setFilters(merged)
    return crud.fetchAll(merged as Record<string, unknown>)
  }, [crud, filters])

  const blockSupplier = useCallback(async (id: string, reason: string) => {
    try {
      await suppliersService.block(id, reason)
      await fetchSuppliers()
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [fetchSuppliers])

  return { ...crud, filters, fetchSuppliers, blockSupplier }
}