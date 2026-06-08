// useBudgets.ts — gerado automaticamente, implemente logica especifica conforme necessario
import { useCrud } from './useCrud'
import { BudgetsService } from '../services/Budgets.service'
export function useBudgets() {
  // @ts-expect-error service shape may differ slightly
  const crud = useCrud(BudgetsService)
  return { ...crud }
}
