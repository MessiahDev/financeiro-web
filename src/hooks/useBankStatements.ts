import { useState, useCallback } from 'react'
import { bankStatementsService } from '../services/bankStatements.service'
import type { BankStatement, ImportBankStatementRequest } from '../types/domain.types'

export function useBankStatements() {
  const [items, setItems]         = useState<BankStatement[]>([])
  const [selected, setSelected]   = useState<BankStatement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving]   = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const fetchAll = useCallback(async (params?: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await bankStatementsService.getAll(params)
      setItems(result.items)
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar extratos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchById = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await bankStatementsService.getById(id)
      setSelected(result)
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar extrato')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const importStatement = useCallback(async (data: ImportBankStatementRequest) => {
    setIsSaving(true)
    setError(null)
    try {
      const result = await bankStatementsService.import(data)
      setItems(prev => [...prev, result])
      return result
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao importar extrato')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  const cancel = useCallback(async (id: string, reason: string) => {
    setIsSaving(true)
    setError(null)
    try {
      const result = await bankStatementsService.cancel(id, reason)
      setItems(prev => prev.map(i => i.id === id ? result : i))
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao cancelar extrato')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { items, selected, isLoading, isSaving, error, fetchAll, fetchById, importStatement, cancel, clearError }
}