import { useCallback } from 'react'
import { useCrud } from './useCrud'
import { accountsPayableService, type CreateAccountPayableRequest, type PayAccountPayableRequest } from '../services/accountsPayable.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { AccountPayable } from '../types/domain.types'

export function useAccountsPayable() {
  const crud = useCrud<AccountPayable, CreateAccountPayableRequest, Partial<CreateAccountPayableRequest>>(accountsPayableService)

  const payPayable = useCallback(async (id: string, data: PayAccountPayableRequest) => {
    try {
      return await accountsPayableService.pay(id, data)
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [])

  const cancelPayable = useCallback(async (id: string, reason: string) => {
    try {
      await accountsPayableService.cancel(id, reason)
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [])

  return { ...crud, fetchPayables: crud.fetchAll, payPayable, cancelPayable }
}