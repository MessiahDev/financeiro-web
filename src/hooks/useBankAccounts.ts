import { useCallback } from 'react'
import { useCrud } from './useCrud'
import { bankAccountsService } from '../services/bankAccounts.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { BankAccount, CreateBankAccountRequest } from '../types/domain.types'

export function useBankAccounts() {
  const crud = useCrud<BankAccount, CreateBankAccountRequest, Partial<CreateBankAccountRequest>>(bankAccountsService as never)

  const transfer = useCallback(async (fromId: string, toId: string, amount: number, description: string) => {
    try { await bankAccountsService.transfer(fromId, toId, amount, description); await crud.fetchAll() }
    catch (err) { throw new Error(getErrorMessage(err)) }
  }, [crud])

  return { ...crud, fetchBankAccounts: crud.fetchAll, transfer }
}
