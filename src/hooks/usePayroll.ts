import { useCrud } from './useCrud'
import { payrollService } from '../services/payroll.service'
import type { Payroll, ProcessPayrollRequest } from '../types/domain.types'

export function usePayroll() {
  const crud = useCrud<Payroll, ProcessPayrollRequest, Partial<ProcessPayrollRequest>>({
    getAll:  (p)       => payrollService.getAll(p),
    getById: (id)      => payrollService.getById(id),
    create:  (d)       => payrollService.process(d),
    update:  (_id, _d) => Promise.reject('not supported'),
    delete:  (id)      => payrollService.delete(id),
  })

  return { ...crud, fetchPayrolls: crud.fetchAll, processPayroll: crud.create }
}
