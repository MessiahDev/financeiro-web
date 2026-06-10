import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useReports } from '../../hooks/useReports'
import { formatCurrency } from '../../utils/formatters'
import { AccountType } from '../../types/enums'
import { ROUTES } from '../../router/routes'
import type { TrialBalanceLine } from '../../types/domain.types'

const typeLabel: Record<AccountType, string> = {
  [AccountType.Asset]:       'Ativo',
  [AccountType.Liability]:   'Passivo',
  [AccountType.Equity]:      'Patrimônio',
  [AccountType.Revenue]:     'Receita',
  [AccountType.Expense]:     'Despesa',
  [AccountType.CostOfGoods]: 'CMV',
}

export default function TrialBalancePage() {
  const { trialBalance, isLoading, fetchTrialBalance } = useReports()
  const [periodId, setPeriodId] = useState('')

  const columns: Column<TrialBalanceLine>[] = [
    { key: 'accountCode',  header: 'Código',  render: r => <span className="font-mono text-xs">{r.accountCode}</span> },
    { key: 'accountName',  header: 'Conta',   render: r => <span className="font-medium">{r.accountName}</span> },
    { key: 'accountType',  header: 'Tipo',    render: r => typeLabel[r.accountType] ?? String(r.accountType) },
    { key: 'totalDebits',  header: 'Débito',  render: r => formatCurrency(r.totalDebits) },
    { key: 'totalCredits', header: 'Crédito', render: r => formatCurrency(r.totalCredits) },
    { key: 'balance',      header: 'Saldo',   render: r => <span className={r.balance >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{formatCurrency(r.balance)}</span> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Balancete de Verificação" backTo={ROUTES.REPORTS} />
      <div className="flex items-end gap-3">
        <div className="w-80"><Input label="ID do Período Contábil" value={periodId} onChange={e => setPeriodId(e.target.value)} placeholder="Cole o ID do período..." /></div>
        <Button onClick={() => periodId && fetchTrialBalance(periodId)} disabled={!periodId}>Gerar balancete</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" className="text-blue-500" /></div>
      ) : trialBalance ? (
        <>
          <div className="flex items-center gap-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div><p className="text-xs text-slate-400">Período</p><p className="font-medium">{trialBalance.periodName}</p></div>
            <div><p className="text-xs text-slate-400">Total Débitos</p><p className="font-semibold text-slate-900">{formatCurrency(trialBalance.totalDebits)}</p></div>
            <div><p className="text-xs text-slate-400">Total Créditos</p><p className="font-semibold text-slate-900">{formatCurrency(trialBalance.totalCredits)}</p></div>
          </div>
          <Table columns={columns} data={trialBalance.lines} keyExtractor={r => r.accountId} emptyMessage="Sem lançamentos no período." />
        </>
      ) : (
        <p className="text-sm text-slate-400">Informe o ID do período e clique em Gerar.</p>
      )}
    </div>
  )
}