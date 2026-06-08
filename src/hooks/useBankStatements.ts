import { useCrud } from './useCrud'
import {
  bankStatementsService,
  type ImportBankStatementRequest,
} from '../services/bankStatements.service'
import type { BankStatement } from '../types/domain.types'

export function useBankStatements() {
  const crud = useCrud<BankStatement, ImportBankStatementRequest, Partial<ImportBankStatementRequest>>({
    getAll:  (p)       => bankStatementsService.getAll(p),
    getById: (id)      => bankStatementsService.getById(id),
    create:  (d)       => bankStatementsService.import(d),
    update:  (_id, _d) => Promise.reject('not supported'),
    delete:  (id)      => bankStatementsService.delete(id),
  })

  return { ...crud, fetchStatements: crud.fetchAll }
}
