// useBankStatements.ts — gerado automaticamente, implemente logica especifica conforme necessario
import { useCrud } from './useCrud'
import { BankStatementsService } from '../services/BankStatements.service'
export function useBankStatements() {
  // @ts-expect-error service shape may differ slightly
  const crud = useCrud(BankStatementsService)
  return { ...crud }
}
