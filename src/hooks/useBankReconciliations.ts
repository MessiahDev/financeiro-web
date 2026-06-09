import { useState, useCallback } from 'react'
import { bankReconciliationsService } from '../services/bankReconciliations.service'
import type { BankReconciliation, CreateBankReconciliationRequest, AddReconciliationItemRequest } from '../types/domain.types'

export function useBankReconciliations() {
  const [items, setItems]         = useState<BankReconciliation[]>([])
  const [selected, setSelected]   = useState<BankReconciliation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving]   = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const fetchAll = useCallback(async (params?: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await bankReconciliationsService.getAll(params)
      setItems(result.items)
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar conciliações')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchById = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await bankReconciliationsService.getById(id)
      setSelected(result)
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar conciliação')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const create = useCallback(async (data: CreateBankReconciliationRequest) => {
    setIsSaving(true)
    setError(null)
    try {
      const result = await bankReconciliationsService.create(data)
      setItems(prev => [...prev, result])
      return result
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao criar conciliação')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  const addItem = useCallback(async (id: string, data: AddReconciliationItemRequest) => {
    setIsSaving(true)
    setError(null)
    try {
      const result = await bankReconciliationsService.addItem(id, data)
      setSelected(result)
      return result
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao adicionar item')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  const complete = useCallback(async (id: string, completedBy: string) => {
    setIsSaving(true)
    setError(null)
    try {
      const result = await bankReconciliationsService.complete(id, completedBy)
      setItems(prev => prev.map(i => i.id === id ? result : i))
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao concluir conciliação')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  const cancel = useCallback(async (id: string, reason: string) => {
    setIsSaving(true)
    setError(null)
    try {
      const result = await bankReconciliationsService.cancel(id, reason)
      setItems(prev => prev.map(i => i.id === id ? result : i))
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao cancelar conciliação')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { items, selected, isLoading, isSaving, error, fetchAll, fetchById, create, addItem, complete, cancel, clearError }
}