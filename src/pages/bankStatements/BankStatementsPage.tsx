import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Badge } from '../../components/ui/Badge/Badge'
import { Select } from '../../components/ui/Select/Select'
import { bankStatementsService } from '../../services/bankStatements.service'
import { bankAccountsService } from '../../services/bankAccounts.service'
import { formatCurrency, formatDate } from '../../utils/formatters'
import type { BankStatement, BankAccount } from '../../types/domain.types'

const statusVariant = (status: string) =>
  status === 'Imported' || status === 'Reconciled' ? 'success' : 'default'

const statusLabel = (status: string) => ({
  Imported: 'Importado',
  Reconciled: 'Conciliado',
  Cancelled: 'Cancelado',
}[status] ?? status)

export default function BankStatementsPage() {
  const [items, setItems] = useState<BankStatement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [selectedAccount, setSelected] = useState<string>('')

  useEffect(() => {
    bankAccountsService.getAll()
      .then(r => setAccounts(r.items))
      .catch(() => setAccounts([]))
  }, [])

  useEffect(() => {
    setIsLoading(true)

    const request = selectedAccount
      ? bankStatementsService.getAll({ bankAccountId: selectedAccount })
      : bankStatementsService.getAll({})

    request
      .then(r => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false))
  }, [selectedAccount])

  const accountOptions = [
    { value: '', label: 'Todas as contas' },
    ...accounts.map(a => ({
      value: a.id,
      label: `${a.bankName} — Ag. ${a.agency} · Cc. ${a.accountNumber}`,
    }))
  ]

  const columns: Column<BankStatement>[] = [
    { key: 'bankAccountName', header: 'Conta' },
    { key: 'period', header: 'Período', render: r => `${formatDate((r as any).periodStart)} – ${formatDate((r as any).periodEnd)}` },
    { key: 'openingBalance', header: 'Saldo Inicial', render: r => formatCurrency((r as any).openingBalance ?? 0) },
    { key: 'closingBalance', header: 'Saldo Final', render: r => formatCurrency((r as any).closingBalance ?? 0) },
    { key: 'totalEntries', header: 'Lançamentos', render: r => (r as any).totalEntries ?? r.entries?.length ?? 0 },
    { key: 'status', header: 'Status', render: r => <Badge variant={statusVariant(r.status)} dot>{statusLabel(r.status)}</Badge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Extratos Bancários"
        subtitle={`${items.length} extrato${items.length !== 1 ? 's' : ''}`}
      />

      <div className="max-w-sm">
        <Select
          label="Filtrar por conta"
          placeholder="Selecione uma conta..."
          options={accountOptions}
          value={selectedAccount}
          onChange={e => setSelected(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={items}
        keyExtractor={r => r.id}
        isLoading={isLoading}
        emptyMessage={selectedAccount ? 'Nenhum extrato para esta conta.' : 'Selecione uma conta para ver os extratos.'}
      />
    </div>
  )
}