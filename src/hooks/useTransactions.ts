import { useState, useCallback } from 'react'
import { useCrud } from './useCrud'
import { transactionsService } from '../services/transactions.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { Transaction, CreateTransactionRequest } from '../types/domain.types'

export function useTransactions() {
  const crud = useCrud<Transaction, CreateTransactionRequest, Partial<CreateTransactionRequest>>(transactionsService as never)
  const [filters, setFilters] = useState<Record<string, unknown>>({})

  const fetch = useCallback((params?: Record<string, unknown>) => {
    const merged = { ...filters, ...params }; setFilters(merged); return crud.fetchAll(merged)
  }, [crud, filters])

  const confirm = useCallback(async (id: string) => {
    try { await transactionsService.confirm(id); await fetch() }
    catch (err) { throw new Error(getErrorMessage(err)) }
  }, [fetch])

  const cancel = useCallback(async (id: string, reason: string) => {
    try { await transactionsService.cancel(id, reason); await fetch() }
    catch (err) { throw new Error(getErrorMessage(err)) }
  }, [fetch])

  return { ...crud, filters, fetch, confirm, cancel }
}
