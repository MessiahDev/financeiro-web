import { useCallback, useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { FinancialSummaryCards, SecondaryStats } from '../../components/features/dashboard/FinancialSummaryCard'
import { OverdueAlerts, type OverdueItem } from '../../components/features/dashboard/OverdueAlerts'
import { CashFlowChart } from '../../components/features/dashboard/CashFlowChart'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useAuthContext } from '../../contexts/AuthContext'
import { reportsService } from '../../services/reports.service'
import { bankAccountsService } from '../../services/bankAccounts.service'
import { accountsPayableService } from '../../services/accountsPayable.service'
import { accountsReceivableService } from '../../services/accountsReceivable.service'
import { taxEntriesService } from '../../services/taxEntries.service'
import { toISODate, today } from '../../utils/formatters'
import type { FinancialSummary } from '../../types/domain.types'
import { AccountPayableStatus, AccountReceivableStatus, TaxEntryStatus } from '../../types/enums'

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function monthsAgo(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() - n, 1)
}

function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className={spinning ? 'animate-spin' : ''}
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  )
}

export default function DashboardPage() {
  const { user } = useAuthContext()

  const [monthSummary, setMonthSummary] = useState<FinancialSummary | null>(null)
  const [trendSummary, setTrendSummary] = useState<FinancialSummary | null>(null)
  const [cashBalance, setCashBalance]   = useState(0)
  const [overdueItems, setOverdueItems] = useState<OverdueItem[]>([])

  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [isLoadingTrend, setIsLoadingTrend]     = useState(true)
  const [isLoadingCash, setIsLoadingCash]       = useState(true)
  const [isLoadingOverdue, setIsLoadingOverdue] = useState(true)
  const [isRefreshing, setIsRefreshing]         = useState(false)

  const [pendingPayablesTotal, setPendingPayablesTotal] = useState(0)
  const [pendingReceivablesTotal, setPendingReceivablesTotal] = useState(0)

  const loadSummary = useCallback(async () => {
    setIsLoadingSummary(true)
    try {
      const now = new Date()
      const data = await reportsService.getFinancialSummary({
        periodStart: toISODate(startOfMonth(now)),
        periodEnd: today(),
      })
      setMonthSummary(data)
    } catch {
      setMonthSummary(null)
    } finally {
      setIsLoadingSummary(false)
    }
  }, [])

  const loadTrend = useCallback(async () => {
    setIsLoadingTrend(true)
    try {
      const now = new Date()
      const data = await reportsService.getFinancialSummary({
        periodStart: toISODate(startOfMonth(monthsAgo(now, 5))),
        periodEnd: today(),
      })
      setTrendSummary(data)
    } catch {
      setTrendSummary(null)
    } finally {
      setIsLoadingTrend(false)
    }
  }, [])

  const loadCashBalance = useCallback(async () => {
    setIsLoadingCash(true)
    try {
      const result = await bankAccountsService.getAll()
      const total = (result.items ?? [])
        .filter(a => a.isActive)
        .reduce((sum, a) => sum + a.balance, 0)
      setCashBalance(total)
    } catch {
      setCashBalance(0)
    } finally {
      setIsLoadingCash(false)
    }
  }, [])

  const loadOverdue = useCallback(async () => {
    setIsLoadingOverdue(true)
    try {
      const todayStr = today()
      const [payables, receivables, taxes] = await Promise.all([
        accountsPayableService.getAll(),
        accountsReceivableService.getAll(),
        taxEntriesService.getAll(),
      ])

      const items: OverdueItem[] = []
      let payablesTotal = 0
      let receivablesTotal = 0

      for (const p of payables.items ?? []) {
        const isOpen = p.status !== AccountPayableStatus.Paid && p.status !== AccountPayableStatus.Cancelled
        if (isOpen) payablesTotal += p.remainingAmount
        if (isOpen && p.dueDate < todayStr) {
          items.push({ id: p.id, name: p.supplierName || p.description, amount: p.remainingAmount, dueDate: p.dueDate, type: 'payable' })
        }
      }

      for (const r of receivables.items ?? []) {
        const isOpen = r.status !== AccountPayableStatus.Received && r.status !== AccountPayableStatus.Cancelled
        if (isOpen) receivablesTotal += r.remainingAmount
        if (isOpen && r.dueDate < todayStr) {
          items.push({ id: r.id, name: r.customerName || r.description, amount: r.remainingAmount, dueDate: r.dueDate, type: 'receivable' })
        }
      }

      for (const t of taxes.items ?? []) {
        if (t.dueDate < todayStr && t.status !== AccountPayableStatus.Paid && t.status !== AccountPayableStatus.Cancelled) {
          items.push({ id: t.id, name: t.description, amount: t.taxAmount, dueDate: t.dueDate, type: 'tax' })
        }
      }

      items.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      setOverdueItems(items)
      setPendingPayablesTotal(payablesTotal)
      setPendingReceivablesTotal(receivablesTotal)
    } catch {
      setOverdueItems([])
      setPendingPayablesTotal(0)
      setPendingReceivablesTotal(0)
    } finally {
      setIsLoadingOverdue(false)
    }
  }, [])

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true)
    await Promise.all([loadSummary(), loadTrend(), loadCashBalance(), loadOverdue()])
    setIsRefreshing(false)
  }, [loadSummary, loadTrend, loadCashBalance, loadOverdue])

  useEffect(() => {
    loadSummary()
    loadTrend()
    loadCashBalance()
    loadOverdue()
  }, [loadSummary, loadTrend, loadCashBalance, loadOverdue])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const isInitialLoading = isLoadingSummary && !monthSummary

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting()}, ${user?.name?.split(' ')[0] ?? 'usuário'}!`}
        subtitle={`Resumo financeiro — ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
        actions={
          <button
            onClick={refreshAll}
            disabled={isRefreshing}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshIcon spinning={isRefreshing} />
            Atualizar
          </button>
        }
      />

      {isInitialLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" className="text-blue-500" />
        </div>
      ) : (
        <>
          <FinancialSummaryCards
            totalRevenue={monthSummary?.totalCredits ?? 0}
            totalExpenses={monthSummary?.totalDebits ?? 0}
            netResult={monthSummary?.netBalance ?? 0}
            cashBalance={cashBalance}
            pendingReceivables={pendingReceivablesTotal}
            pendingPayables={pendingPayablesTotal}
            isLoadingCash={isLoadingCash}
          />

          <SecondaryStats
            activeEmployees={monthSummary?.activeEmployees ?? 0}
            payrollsProcessed={monthSummary?.payrollsProcessed ?? 0}
            totalReceived={monthSummary?.totalReceived ?? 0}
            totalTaxesPaid={monthSummary?.totalTaxesPaid ?? 0}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
            <CashFlowChart data={trendSummary?.monthlyTrend ?? []} isLoading={isLoadingTrend} />
            <OverdueAlerts items={overdueItems} isLoading={isLoadingOverdue} />
          </div>
        </>
      )}
    </div>
  )
}