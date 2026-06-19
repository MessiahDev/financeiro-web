import { useState, useCallback } from 'react'
import { useCrud } from './useCrud'
import { accountsPayableService } from '../services/accountsPayable.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { AccountPayable, CreateAccountPayableRequest, PayAccountPayableRequest } from '../types/domain.types'

export function useAccountsPayable() {
  const crud = useCrud<AccountPayable, CreateAccountPayableRequest, Partial<CreateAccountPayableRequest>>(accountsPayableService as never)
  const [filters, setFilters] = useState<Record<string, unknown>>({})

  const fetch = useCallback((params?: Record<string, unknown>) => {
    const merged = { ...filters, ...params }; setFilters(merged); return crud.fetchAll(merged)
  }, [crud, filters])

  const pay = useCallback(async (id: string, data: PayAccountPayableRequest) => {
    try { await accountsPayableService.pay(id, data); await fetch() }
    catch (err) { throw new Error(getErrorMessage(err)) }
  }, [fetch])

  const cancel = useCallback(async (id: string, reason: string) => {
    try { await accountsPayableService.cancel(id, reason); await fetch() }
    catch (err) { throw new Error(getErrorMessage(err)) }
  }, [fetch])

  return { ...crud, filters, fetch, pay, cancel }
}