import { useState, useCallback } from 'react'
import { useCrud } from './useCrud'
import { accountsReceivableService } from '../services/accountsReceivable.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { AccountReceivable, CreateAccountReceivableRequest, ReceivePaymentRequest } from '../types/domain.types'

export function useAccountsReceivable() {
  const crud = useCrud<AccountReceivable, CreateAccountReceivableRequest, Partial<CreateAccountReceivableRequest>>(accountsReceivableService as never)
  const [filters, setFilters] = useState<Record<string, unknown>>({})

  const fetch = useCallback((params?: Record<string, unknown>) => {
    const merged = { ...filters, ...params }; setFilters(merged); return crud.fetchAll(merged)
  }, [crud, filters])

  const receive = useCallback(async (id: string, data: ReceivePaymentRequest) => {
    try { await accountsReceivableService.receive(id, data); await fetch() }
    catch (err) { throw new Error(getErrorMessage(err)) }
  }, [fetch])

  const cancel = useCallback(async (id: string, reason: string) => {
    try { await accountsReceivableService.cancel(id, reason); await fetch() }
    catch (err) { throw new Error(getErrorMessage(err)) }
  }, [fetch])

  return { ...crud, filters, fetch, receive, cancel }
}
