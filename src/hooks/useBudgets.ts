import { useCrud } from './useCrud'
import {
  budgetsService,
  type UpdateBudgetRequest,
} from '../services/budgets.service'
import type { Budget, CreateBudgetRequest } from '../types/domain.types'

export function useBudgets() {
  const crud = useCrud<Budget, CreateBudgetRequest, UpdateBudgetRequest>(budgetsService)

  return { ...crud, fetchBudgets: crud.fetchAll }
}
