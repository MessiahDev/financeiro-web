import { useState, useCallback } from 'react'
import { reportsService } from '../services/reports.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { FinancialSummary, TrialBalance } from '../types/domain.types'

export function useReports() {
  const [summary, setSummary]         = useState<FinancialSummary | null>(null)
  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null)
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const fetchSummary = useCallback(async (params?: { startDate?: string; endDate?: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await reportsService.getFinancialSummary(params)
      setSummary(data)
      return data
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchTrialBalance = useCallback(async (periodId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await reportsService.getTrialBalance(periodId)
      setTrialBalance(data)
      return data
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { summary, trialBalance, isLoading, error, fetchSummary, fetchTrialBalance }
}