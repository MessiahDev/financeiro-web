import { useCallback } from 'react'
import { useCrud } from './useCrud'
import { payrollService } from '../services/payroll.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { Payroll, ProcessPayrollRequest, PayPayrollRequest } from '../types/domain.types'

export function usePayroll() {
  const crud = useCrud<Payroll, ProcessPayrollRequest, Partial<ProcessPayrollRequest>>(payrollService as never)

  const fetchById = useCallback(async (id: string) => {
    return payrollService.getById(id)
  }, [])

  const process_ = useCallback(async (data: ProcessPayrollRequest) => {
    try { const p = await payrollService.process(data); await crud.fetchAll(); return p }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [crud])

  const approve = useCallback(async (id: string) => {
    try { await payrollService.approve(id); await crud.fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [crud])

  const pay = useCallback(async (id: string, data: PayPayrollRequest) => {
    try { await payrollService.pay(id, data); await crud.fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [crud])

  const cancel = useCallback(async (id: string, reason: string) => {
    try { await payrollService.cancel(id, reason); await crud.fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [crud])

  return { ...crud, fetchById, process: process_, approve, pay, cancel }
}