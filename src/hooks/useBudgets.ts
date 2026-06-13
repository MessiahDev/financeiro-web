import { useCallback } from 'react'
import { useCrud } from './useCrud'
import { budgetsService } from '../services/budgets.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { BudgetVsActual } from '../types/domain.types'

export function useBudgets() {
  const crud = useCrud(budgetsService)

  const getVsActual = useCallback(async (id: string): Promise<BudgetVsActual> => {
    try { return await budgetsService.getVsActual(id) }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [])

  const approve = useCallback(async (id: string, approvedBy: string) => {
    try { await budgetsService.approve(id, approvedBy); await crud.fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [crud])

  const close = useCallback(async (id: string) => {
    try { await budgetsService.close(id); await crud.fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [crud])

  return { ...crud, getVsActual, approve, close }
}