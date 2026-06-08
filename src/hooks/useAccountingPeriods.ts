import { useCallback } from 'react'
import { useCrud } from './useCrud'
import { accountingPeriodsService } from '../services/accountingPeriods.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { AccountingPeriod, CreateAccountingPeriodRequest } from '../types/domain.types'

export function useAccountingPeriods() {
  const crud = useCrud<AccountingPeriod, CreateAccountingPeriodRequest, Partial<CreateAccountingPeriodRequest>>(accountingPeriodsService as never)

  const close   = useCallback(async (id: string) => { try { await accountingPeriodsService.close(id);   await crud.fetchAll() } catch (e) { throw new Error(getErrorMessage(e)) } }, [crud])
  const lock    = useCallback(async (id: string) => { try { await accountingPeriodsService.lock(id);    await crud.fetchAll() } catch (e) { throw new Error(getErrorMessage(e)) } }, [crud])
  const reopen  = useCallback(async (id: string) => { try { await accountingPeriodsService.reopen(id);  await crud.fetchAll() } catch (e) { throw new Error(getErrorMessage(e)) } }, [crud])

  return { ...crud, close, lock, reopen }
}
