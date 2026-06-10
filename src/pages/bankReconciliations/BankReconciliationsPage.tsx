import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { useCrud } from '../../hooks/useCrud'
import { bankReconciliationsService } from '../../services/bankReconciliations.service'
import { useNotifications } from '../../contexts/NotificationContext'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { Badge, type BadgeVariant } from '../../components/ui/Badge/Badge'
import type { BankReconciliation } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'
import { BankReconciliationStatus } from '../../types/enums'

const statusMap: Record<number, { label: string; variant: BadgeVariant }> = {
  [BankReconciliationStatus.Open]:       { label: 'Aberta',       variant: 'info'    },
  [BankReconciliationStatus.InProgress]: { label: 'Em andamento', variant: 'warning' },
  [BankReconciliationStatus.Completed]:  { label: 'Concluída',    variant: 'success' },
  [BankReconciliationStatus.Cancelled]:  { label: 'Cancelada',    variant: 'default' },
}

export default function BankReconciliationsPage() {
  const { user } = useAuth()
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll } =
    useCrud<BankReconciliation, unknown, unknown>(bankReconciliationsService as never)

  const [completeTarget, setCompleteTarget] = useState<BankReconciliation | null>(null)
  const [cancelTarget, setCancelTarget]     = useState<BankReconciliation | null>(null)

  const safeItems = items ?? []

  const pagedData: PagedResult<BankReconciliation> = {
    items: safeItems, totalCount, pageNumber: page, pageSize, totalPages,
    hasPreviousPage: page > 1, hasNextPage: page < totalPages,
  }

  useEffect(() => { fetchAll() }, [page, fetchAll])

  const columns: Column<BankReconciliation>[] = [
    { key: 'bankAccountName',         header: 'Conta' },
    { key: 'periodStart',             header: 'Período',       render: r => `${formatDate(r.periodStart)} – ${formatDate(r.periodEnd)}` },
    { key: 'statementOpeningBalance', header: 'Saldo Inicial', render: r => formatCurrency(r.statementOpeningBalance) },
    { key: 'statementClosingBalance', header: 'Saldo Final',   render: r => formatCurrency(r.statementClosingBalance) },
    { key: 'difference',              header: 'Diferença',     render: r => <span className={r.difference === 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(r.difference)}</span> },
    { key: 'status', header: 'Status', render: r => {
      const s = statusMap[r.status] ?? { label: String(r.status), variant: 'default' as BadgeVariant }
      return <Badge variant={s.variant} dot>{s.label}</Badge>
    }},
    { key: 'actions', header: '', render: r => r.status === BankReconciliationStatus.InProgress ? (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => setCompleteTarget(r)}>Concluir</Button>
        <Button size="sm" variant="ghost" onClick={() => setCancelTarget(r)} className="text-red-500 hover:bg-red-50">Cancelar</Button>
      </div>
    ) : null },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Conciliações Bancárias" subtitle={`${totalCount} conciliação${totalCount !== 1 ? 'es' : ''}`} />

      <Table columns={columns} data={safeItems} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhuma conciliação encontrada." />

      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}

      <ConfirmModal
        isOpen={!!completeTarget} onClose={() => setCompleteTarget(null)}
        onConfirm={async () => {
          try {
            await bankReconciliationsService.complete(completeTarget!.id, user?.name ?? user?.email ?? 'Usuário')
            success('Concluída!'); setCompleteTarget(null); fetchAll()
          } catch { notifyError('Erro.') }
        }}
        title="Concluir conciliação"
        message="Deseja concluir esta conciliação? Não será possível adicionar novos itens."
        confirmLabel="Concluir" variant="primary" isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)}
        onConfirm={async () => {
          try {
            await bankReconciliationsService.cancel(cancelTarget!.id, 'Cancelado pelo usuário')
            success('Cancelada.'); setCancelTarget(null); fetchAll()
          } catch { notifyError('Erro.') }
        }}
        title="Cancelar conciliação" message="Cancelar esta conciliação?"
        confirmLabel="Cancelar" isLoading={isSaving}
      />
    </div>
  )
}