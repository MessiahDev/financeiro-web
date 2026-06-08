import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { useCrud } from '../../hooks/useCrud'
import { bankReconciliationsService } from '../../services/bankReconciliations.service'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { Badge, type BadgeVariant } from '../../components/ui/Badge/Badge'
import type { BankReconciliation } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  InProgress: { label: 'Em andamento', variant: 'info'    },
  Completed:  { label: 'Concluida',    variant: 'success' },
  Cancelled:  { label: 'Cancelada',    variant: 'default' },
}

export default function BankReconciliationsPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll } = useCrud<BankReconciliation, unknown, unknown>(bankReconciliationsService as never)
  const [completeTarget, setCompleteTarget] = useState<BankReconciliation | null>(null)
  const [cancelTarget, setCancelTarget]     = useState<BankReconciliation | null>(null)

  const pagedData: PagedResult<BankReconciliation> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<BankReconciliation>[] = [
    { key: 'bankAccountName', header: 'Conta' },
    { key: 'statementDate',   header: 'Data Extrato',    render: r => formatDate(r.statementDate) },
    { key: 'openingBalance',  header: 'Saldo Inicial',   render: r => formatCurrency(r.openingBalance) },
    { key: 'closingBalance',  header: 'Saldo Final',     render: r => formatCurrency(r.closingBalance) },
    { key: 'status',          header: 'Status',          render: r => { const s = statusMap[r.status] ?? { label: r.status, variant: 'default' as BadgeVariant }; return <Badge variant={s.variant} dot>{s.label}</Badge> } },
    { key: 'actions',         header: '', render: r => r.status === 'InProgress' ? (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => setCompleteTarget(r)}>Concluir</Button>
        <Button size="sm" variant="ghost" onClick={() => setCancelTarget(r)} className="text-red-500 hover:bg-red-50">Cancelar</Button>
      </div>
    ) : null },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Conciliacoes Bancarias" subtitle={`${totalCount} conciliacao${totalCount !== 1 ? 'es' : ''}`} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhuma conciliacao encontrada." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <ConfirmModal isOpen={!!completeTarget} onClose={() => setCompleteTarget(null)}
        onConfirm={async () => { try { await bankReconciliationsService.complete(completeTarget!.id); success('Concluida!'); setCompleteTarget(null); fetchAll() } catch { notifyError('Erro.') } }}
        title="Concluir conciliacao" message="Deseja concluir esta conciliacao? Nao sera possivel adicionar novos itens." confirmLabel="Concluir" variant="primary" isLoading={isSaving} />
      <ConfirmModal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)}
        onConfirm={async () => { try { await bankReconciliationsService.cancel(cancelTarget!.id, 'Cancelado pelo usuário'); success('Cancelada.'); setCancelTarget(null); fetchAll() } catch { notifyError('Erro.') } }}
        title="Cancelar conciliacao" message="Cancelar esta conciliacao?" confirmLabel="Cancelar" isLoading={isSaving} />
    </div>
  )
}
