import { useCrud } from './useCrud'
import { budgetsService } from '../services/budgets.service'

export function useBudgets() {
  return useCrud(budgetsService)
}