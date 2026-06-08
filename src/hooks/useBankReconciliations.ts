import { useCrud } from './useCrud'

import {
  bankReconciliationsService,
  type CreateBankReconciliationRequest,
} from '../services/bankReconciliations.service'

import type { BankReconciliation } from '../types/domain.types'

export function useBankReconciliations() {
  const crud = useCrud<
    BankReconciliation,
    CreateBankReconciliationRequest
  >({
    getAll: (p) => bankReconciliationsService.getAll(p),
    getById: (id) => bankReconciliationsService.getById(id),
    create: (d) => bankReconciliationsService.create(d),
    update: (_id, _d) => Promise.reject('not supported'),
    delete: (id) => bankReconciliationsService.delete(id),
  })

  return { ...crud, fetchReconciliations: crud.fetchAll }
}