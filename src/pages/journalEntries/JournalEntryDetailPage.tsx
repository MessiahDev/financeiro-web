import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { JournalEntryStatusBadge } from '../../components/features/journalEntries/JournalEntryStatusBadge'
import { useCrud } from '../../hooks/useCrud'
import { journalEntriesService } from '../../services/journalEntries.service'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { DebitCredit } from '../../types/enums'
import { ROUTES } from '../../router/routes'
import type { JournalEntry, JournalEntryLine } from '../../types/domain.types'

export default function JournalEntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useCrud<JournalEntry, unknown, unknown>(journalEntriesService as never)

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 dark:text-slate-500 p-6">Lancamento nao encontrado.</p>

  const e = selected
  const columns: Column<JournalEntryLine>[] = [
    { key: 'accountCode',  header: 'Código',   render: l => <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{l.accountCode}</span> },
    { key: 'accountName',  header: 'Conta',    render: l => <span className="font-medium">{l.accountName}</span> },
    { key: 'debitCredit',  header: 'Tipo',     render: l => l.debitCredit === DebitCredit.Debit ? <span className="text-blue-600 font-medium">Débito</span> : <span className="text-green-600 font-medium">Crédito</span> },
    { key: 'amount',       header: 'Valor',    render: l => formatCurrency(l.amount) },
    { key: 'description',  header: 'Obs.',     render: l => l.description ?? '-' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Lançamento Contábil" subtitle={e.description} backTo={ROUTES.JOURNAL_ENTRIES} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados do Lançamento" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400 dark:text-slate-500">Data</dt><dd className="font-medium">{formatDate(e.entryDate)}</dd></div>
            <div><dt className="text-slate-400 dark:text-slate-500">Período</dt><dd>{e.accountingPeriodName}</dd></div>
            <div><dt className="text-slate-400 dark:text-slate-500">Referência</dt><dd>{e.referenceDocument ?? '-'}</dd></div>
            <div><dt className="text-slate-400 dark:text-slate-500">Status</dt><dd><JournalEntryStatusBadge status={e.status} /></dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Totais" />
          <CardDivider />
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">Total Débito</span><span className="font-semibold text-blue-600">{formatCurrency(e.totalDebits)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">Total Crédito</span><span className="font-semibold text-green-600">{formatCurrency(e.totalCredits)}</span></div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-slate-400 dark:text-slate-500">Diferença</span>
              <span className={`font-semibold ${e.isBalanced ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(e.totalDebits - e.totalCredits)}</span>
            </div>
          </div>
        </Card>
      </div>
      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Linhas do Lançamento" subtitle={`${e.lines?.length ?? 0} linhas`} />
        </div>
        <Table columns={columns} data={e.lines ?? []} keyExtractor={l => l.id} emptyMessage="Sem linhas." />
      </Card>
    </div>
  )
}