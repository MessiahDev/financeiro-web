import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { JournalEntryStatusBadge } from '../../components/features/journalEntries/JournalEntryStatusBadge'
import { useCrud } from '../../hooks/useCrud'
import { journalEntriesService } from '../../services/journalEntries.service'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import type { JournalEntry } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

export default function JournalEntriesPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll } = useCrud<JournalEntry, unknown, unknown>(journalEntriesService as never)
  const [postTarget, setPostTarget] = useState<JournalEntry | null>(null)
  const [reverseTarget, setReverseTarget] = useState<JournalEntry | null>(null)

  const pagedData: PagedResult<JournalEntry> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<JournalEntry>[] = [
    { key: 'entryDate',           header: 'Data',       render: r => formatDate(r.entryDate) },
    { key: 'description',         header: 'Descricao',  render: r => <span className="font-medium">{r.description}</span> },
    { key: 'accountingPeriodName',header: 'Periodo' },
    { key: 'totalDebit',          header: 'Debito',     render: r => formatCurrency(r.totalDebit) },
    { key: 'totalCredit',         header: 'Credito',    render: r => formatCurrency(r.totalCredit) },
    { key: 'status',              header: 'Status',     render: r => <JournalEntryStatusBadge status={r.status} /> },
    { key: 'actions',             header: '', render: r => (
      <div className="flex justify-end gap-1">
        {r.status === 'Draft'  && <Button size="sm" variant="ghost" onClick={() => setPostTarget(r)}>Lancar</Button>}
        {r.status === 'Posted' && <Button size="sm" variant="ghost" onClick={() => setReverseTarget(r)} className="text-amber-600 hover:bg-amber-50">Estornar</Button>}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Lancamentos Contabeis" subtitle={`${totalCount} lancamento${totalCount !== 1 ? 's' : ''}`} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhum lancamento encontrado." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <ConfirmModal isOpen={!!postTarget} onClose={() => setPostTarget(null)}
        onConfirm={async () => { try { await journalEntriesService.postEntry(postTarget!.id); success('Lancado!'); setPostTarget(null); fetchAll() } catch { notifyError('Erro.') } }}
        title="Lancar entrada" message={`Deseja lancar "${postTarget?.description}"? Esta acao nao pode ser desfeita.`} confirmLabel="Lancar" variant="primary" isLoading={isSaving} />
      <ConfirmModal isOpen={!!reverseTarget} onClose={() => setReverseTarget(null)}
        onConfirm={async () => { try { await journalEntriesService.reverse(reverseTarget!.id); success('Estornado!'); setReverseTarget(null); fetchAll() } catch { notifyError('Erro.') } }}
        title="Estornar lancamento" message={`Estornar "${reverseTarget?.description}"?`} confirmLabel="Estornar" isLoading={isSaving} />
    </div>
  )
}
