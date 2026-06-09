import { useState, useCallback } from 'react'
import { useCrud } from './useCrud'
import { taxEntriesService } from '../services/taxEntries.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { TaxEntry, TaxPayment, CreateTaxEntryRequest, CreateTaxPaymentRequest } from '../types/domain.types'

export function useTaxEntries() {
  const crud = useCrud<TaxEntry, CreateTaxEntryRequest, Partial<CreateTaxEntryRequest>>(taxEntriesService as never)
  const [payments, setPayments] = useState<TaxPayment[]>([])

  const cancel = useCallback(async (id: string, reason: string) => {
    try { await taxEntriesService.cancel(id, reason); await crud.fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [crud])

  const pay = useCallback(async (id: string, data: CreateTaxPaymentRequest) => {
    try { const p = await taxEntriesService.pay(id, data); setPayments(prev => [p, ...prev]); await crud.fetchAll(); return p }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [crud])

  return { ...crud, payments, cancel, pay }
}