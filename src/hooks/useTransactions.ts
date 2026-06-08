import { useCallback } from 'react'
import { useCrud } from './useCrud'
import { transactionsService } from '../services/transactions.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { Transaction, CreateTransactionRequest } from '../types/domain.types'

export function useTransactions() {
  const crud = useCrud<Transaction, CreateTransactionRequest, Partial<CreateTransactionRequest>>({
    getAll:  (p)       => transactionsService.getAll(p),
    getById: (id)      => transactionsService.getById(id),
    create:  (d)       => transactionsService.create(d),
    update:  (_id, _d) => Promise.reject('transactions are immutable after creation'),
    delete:  (id)      => transactionsService.delete(id),
  })

  const confirmTransaction = useCallback(async (id: string) => {
    try {
      return await transactionsService.confirm(id)
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [])

  const cancelTransaction = useCallback(async (id: string, reason: string) => {
    try {
      await transactionsService.cancel(id, reason)
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [])

  return { ...crud, fetchTransactions: crud.fetchAll, confirmTransaction, cancelTransaction }
}
