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
import { JournalEntryStatus } from '../../types/enums'
import type { JournalEntry } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

export default function JournalEntriesPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll } = useCrud<JournalEntry, unknown, unknown>(journalEntriesService as never)
  const [postTarget, setPostTarget]       = useState<JournalEntry | null>(null)
  const [reverseTarget, setReverseTarget] = useState<JournalEntry | null>(null)

  const pagedData: PagedResult<JournalEntry> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<JournalEntry>[] = [
    { key: 'entryDate',            header: 'Data',      render: r => formatDate(r.entryDate) },
    { key: 'description',          header: 'Descrição', render: r => <span className="font-medium">{r.description}</span> },
    { key: 'accountingPeriodName', header: 'Período' },
    { key: 'totalDebits',          header: 'Débito',    render: r => formatCurrency(r.totalDebits) },
    { key: 'totalCredits',         header: 'Crédito',   render: r => formatCurrency(r.totalCredits) },
    { key: 'status',               header: 'Status',    render: r => <JournalEntryStatusBadge status={r.status} /> },
    { key: 'actions',              header: '', render: r => (
      <div className="flex justify-end gap-1">
        {r.status === JournalEntryStatus.Draft    && <Button size="sm" variant="ghost" onClick={() => setPostTarget(r)}>Lançar</Button>}
        {r.status === JournalEntryStatus.Posted   && <Button size="sm" variant="ghost" onClick={() => setReverseTarget(r)} className="text-amber-600 hover:bg-amber-50">Estornar</Button>}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Lançamentos Contábeis" subtitle={`${totalCount} lançamento${totalCount !== 1 ? 's' : ''}`} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhum lançamento encontrado." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <ConfirmModal isOpen={!!postTarget} onClose={() => setPostTarget(null)}
        onConfirm={async () => { try { await journalEntriesService.postEntry(postTarget!.id); success('Lançado!'); setPostTarget(null); fetchAll() } catch { notifyError('Erro.') } }}
        title="Lançar entrada" message={`Deseja lançar "${postTarget?.description}"? Esta ação não pode ser desfeita.`} confirmLabel="Lançar" variant="primary" isLoading={isSaving} />
      <ConfirmModal isOpen={!!reverseTarget} onClose={() => setReverseTarget(null)}
        onConfirm={async () => { try { await journalEntriesService.reverse(reverseTarget!.id); success('Estornado!'); setReverseTarget(null); fetchAll() } catch { notifyError('Erro.') } }}
        title="Estornar lançamento" message={`Estornar "${reverseTarget?.description}"?`} confirmLabel="Estornar" isLoading={isSaving} />
    </div>
  )
}