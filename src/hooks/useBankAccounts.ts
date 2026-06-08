import { useCrud } from './useCrud'
import {
  bankAccountsService,
  type CreateBankAccountRequest,
} from '../services/bankAccounts.service'
import type { BankAccount } from '../types/domain.types'

export function useBankAccounts() {
  // CORRIGIDO: genéricos tipados explicitamente (sem cast)
  const crud = useCrud<
    BankAccount,
    CreateBankAccountRequest,
    Partial<CreateBankAccountRequest>
  >(bankAccountsService)

  return { ...crud, fetchBankAccounts: crud.fetchAll }
}
