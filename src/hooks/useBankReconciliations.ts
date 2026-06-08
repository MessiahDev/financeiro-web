// useBankReconciliations.ts — gerado automaticamente, implemente logica especifica conforme necessario
import { useCrud } from './useCrud'
import { BankReconciliationsService } from '../services/BankReconciliations.service'
export function useBankReconciliations() {
  // @ts-expect-error service shape may differ slightly
  const crud = useCrud(BankReconciliationsService)
  return { ...crud }
}
