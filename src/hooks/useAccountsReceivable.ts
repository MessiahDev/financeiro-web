import { useCallback } from 'react'
import { useCrud } from './useCrud'
import { accountsReceivableService, type CreateAccountReceivableRequest, type ReceivePaymentRequest } from '../services/accountsReceivable.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { AccountReceivable } from '../types/domain.types'

export function useAccountsReceivable() {
  const crud = useCrud<AccountReceivable, CreateAccountReceivableRequest, Partial<CreateAccountReceivableRequest>>(accountsReceivableService)

  const receivePayment = useCallback(async (id: string, data: ReceivePaymentRequest) => {
    try {
      return await accountsReceivableService.receive(id, data)
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [])

  const cancelReceivable = useCallback(async (id: string, reason: string) => {
    try {
      await accountsReceivableService.cancel(id, reason)
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [])

  return { ...crud, fetchReceivables: crud.fetchAll, receivePayment, cancelReceivable }
}