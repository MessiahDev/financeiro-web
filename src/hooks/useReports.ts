import { useState, useCallback } from 'react'
import { reportsService } from '../services/reports.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { FinancialSummary, TrialBalance } from '../types/domain.types'

export function useReports() {
  const [summary, setSummary]           = useState<FinancialSummary | null>(null)
  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null)
  const [isSummaryLoading, setSummaryLoading]             = useState(false)
  const [isTrialBalanceLoading, setTrialBalanceLoading]   = useState(false)
  const [summaryError, setSummaryError]                   = useState<string | null>(null)
  const [trialBalanceError, setTrialBalanceError]         = useState<string | null>(null)

  const fetchSummary = useCallback(
    async (params?: { startDate?: string; endDate?: string }) => {
      setSummaryLoading(true)
      setSummaryError(null)
      try {
        const data = await reportsService.getFinancialSummary(params)
        setSummary(data)
        return data
      } catch (err) {
        setSummaryError(getErrorMessage(err))
      } finally {
        setSummaryLoading(false)
      }
    },
    [],
  )

  const fetchTrialBalance = useCallback(async (periodId: string) => {
    setTrialBalanceLoading(true)
    setTrialBalanceError(null)
    try {
      const data = await reportsService.getTrialBalance(periodId)
      setTrialBalance(data)
      return data
    } catch (err) {
      setTrialBalanceError(getErrorMessage(err))
    } finally {
      setTrialBalanceLoading(false)
    }
  }, [])

  return {
    summary,
    trialBalance,
    isSummaryLoading,
    isTrialBalanceLoading,
    summaryError,
    trialBalanceError,
    fetchSummary,
    fetchTrialBalance,
    clearSummaryError:      () => setSummaryError(null),
    clearTrialBalanceError: () => setTrialBalanceError(null),
  }
}
