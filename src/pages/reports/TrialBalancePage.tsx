import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useReports } from '../../hooks/useReports'
import { formatCurrency } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import type { TrialBalanceEntry } from '../../types/domain.types'

const typeLabel: Record<string, string> = { Asset: 'Ativo', Liability: 'Passivo', Equity: 'Patrimonio', Revenue: 'Receita', Expense: 'Despesa' }

export default function TrialBalancePage() {
  const { trialBalance, isLoading, fetchTrialBalance } = useReports()
  const [periodId, setPeriodId] = useState('')

  const columns: Column<TrialBalanceEntry>[] = [
    { key: 'accountCode',  header: 'Codigo',  render: r => <span className="font-mono text-xs">{r.accountCode}</span> },
    { key: 'accountName',  header: 'Conta',   render: r => <span className="font-medium">{r.accountName}</span> },
    { key: 'accountType',  header: 'Tipo',    render: r => typeLabel[r.accountType] ?? r.accountType },
    { key: 'debitTotal',   header: 'Debito',  render: r => formatCurrency(r.debitTotal) },
    { key: 'creditTotal',  header: 'Credito', render: r => formatCurrency(r.creditTotal) },
    { key: 'balance',      header: 'Saldo',   render: r => <span className={r.balance >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{formatCurrency(r.balance)}</span> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Balancete de Verificacao" backTo={ROUTES.REPORTS} />
      <div className="flex items-end gap-3">
        <div className="w-80"><Input label="ID do Periodo Contabil" value={periodId} onChange={e => setPeriodId(e.target.value)} placeholder="Cole o ID do periodo..." /></div>
        <Button onClick={() => periodId && fetchTrialBalance(periodId)} disabled={!periodId}>Gerar balancete</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" className="text-blue-500" /></div>
      ) : trialBalance ? (
        <>
          <div className="flex items-center gap-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div><p className="text-xs text-slate-400">Periodo</p><p className="font-medium">{trialBalance.periodName}</p></div>
            <div><p className="text-xs text-slate-400">Total Debitos</p><p className="font-semibold text-slate-900">{formatCurrency(trialBalance.totalDebit)}</p></div>
            <div><p className="text-xs text-slate-400">Total Creditos</p><p className="font-semibold text-slate-900">{formatCurrency(trialBalance.totalCredit)}</p></div>
          </div>
          <Table columns={columns} data={trialBalance.entries} keyExtractor={r => r.accountCode} emptyMessage="Sem lancamentos no periodo." />
        </>
      ) : (
        <p className="text-sm text-slate-400">Informe o ID do periodo e clique em Gerar.</p>
      )}
    </div>
  )
}
