import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Badge } from '../../components/ui/Badge/Badge'
import { useCrud } from '../../hooks/useCrud'
import { bankStatementsService } from '../../services/bankStatements.service'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/formatters'
import type { BankStatement } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

export default function BankStatementsPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, page, pageSize, totalCount, totalPages, setPage, fetchAll } = useCrud<BankStatement, unknown, unknown>(bankStatementsService as never)

  const pagedData: PagedResult<BankStatement> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<BankStatement>[] = [
    { key: 'bankAccountName', header: 'Conta' },
    { key: 'referenceDate',   header: 'Data Referencia', render: r => formatDate(r.referenceDate) },
    { key: 'entries',         header: 'Lancamentos',     render: r => `${r.entries?.length ?? 0} lancamento${r.entries?.length !== 1 ? 's' : ''}` },
    { key: 'status',          header: 'Status',          render: r => <Badge variant={r.status === 'Active' ? 'success' : 'default'} dot>{r.status === 'Active' ? 'Ativo' : 'Cancelado'}</Badge> },
    { key: 'actions',         header: '', render: r => r.status === 'Active' ? (
      <Button size="sm" variant="ghost" onClick={async () => { try { await bankStatementsService.cancel(r.id, 'Cancelado pelo usuário'); success('Cancelado.'); fetchAll() } catch { notifyError('Erro.') } }} className="text-red-500 hover:bg-red-50">Cancelar</Button>
    ) : null },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Extratos Bancarios" subtitle={`${totalCount} extrato${totalCount !== 1 ? 's' : ''}`} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhum extrato importado." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
    </div>
  )
}
