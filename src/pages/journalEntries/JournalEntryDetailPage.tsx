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
import { ROUTES } from '../../router/routes'
import type { JournalEntry, JournalEntryLine } from '../../types/domain.types'

export default function JournalEntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useCrud<JournalEntry, unknown, unknown>(journalEntriesService as never)

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Lancamento nao encontrado.</p>

  const e = selected
  const columns: Column<JournalEntryLine>[] = [
    { key: 'chartOfAccountCode', header: 'Codigo',  render: l => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{l.chartOfAccountCode}</span> },
    { key: 'chartOfAccountName', header: 'Conta',   render: l => <span className="font-medium">{l.chartOfAccountName}</span> },
    { key: 'costCenterName',     header: 'C. Custo',render: l => l.costCenterName ?? '-' },
    { key: 'type',               header: 'Tipo',    render: l => l.type === 'Debit' ? <span className="text-blue-600 font-medium">Debito</span> : <span className="text-green-600 font-medium">Credito</span> },
    { key: 'amount',             header: 'Valor',   render: l => formatCurrency(l.amount) },
    { key: 'description',        header: 'Obs.',    render: l => l.description ?? '-' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Lancamento Contabil" subtitle={e.description} backTo={ROUTES.JOURNAL_ENTRIES} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados do Lancamento" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Data</dt><dd className="font-medium">{formatDate(e.entryDate)}</dd></div>
            <div><dt className="text-slate-400">Periodo</dt><dd>{e.accountingPeriodName}</dd></div>
            <div><dt className="text-slate-400">Referencia</dt><dd>{e.referenceNumber ?? '-'}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><JournalEntryStatusBadge status={e.status} /></dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Totais" />
          <CardDivider />
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Total Debito</span><span className="font-semibold text-blue-600">{formatCurrency(e.totalDebit)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Total Credito</span><span className="font-semibold text-green-600">{formatCurrency(e.totalCredit)}</span></div>
            <div className="flex justify-between border-t border-slate-100 pt-3">
              <span className="text-slate-400">Diferenca</span>
              <span className={`font-semibold ${e.totalDebit === e.totalCredit ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(e.totalDebit - e.totalCredit)}</span>
            </div>
          </div>
        </Card>
      </div>
      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Linhas do Lancamento" subtitle={`${e.lines?.length ?? 0} linhas`} />
        </div>
        <Table columns={columns} data={e.lines ?? []} keyExtractor={l => l.id} emptyMessage="Sem linhas." />
      </Card>
    </div>
  )
}