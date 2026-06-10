import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Badge } from '../../components/ui/Badge/Badge'
import { Select } from '../../components/ui/Select/Select'
import { bankStatementsService } from '../../services/bankStatements.service'
import { bankAccountsService } from '../../services/bankAccounts.service'
import { formatCurrency, formatDate } from '../../utils/formatters'
import type { BankStatement, BankAccount } from '../../types/domain.types'
import { BankStatementStatus } from '../../types/enums'

const statusVariant = (status: BankStatementStatus) =>
  status === BankStatementStatus.Imported || status === BankStatementStatus.Reconciled
    ? 'success'
    : 'default'

const statusLabel = (status: BankStatementStatus) => ({
  [BankStatementStatus.Imported]:   'Importado',
  [BankStatementStatus.Reconciled]: 'Conciliado',
  [BankStatementStatus.Cancelled]:  'Cancelado',
}[status] ?? String(status))

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
    { key: 'periodStart',     header: 'Período',       render: r => `${formatDate(r.periodStart)} – ${formatDate(r.periodEnd)}` },
    { key: 'openingBalance',  header: 'Saldo Inicial',  render: r => formatCurrency(r.openingBalance) },
    { key: 'closingBalance',  header: 'Saldo Final',    render: r => formatCurrency(r.closingBalance) },
    { key: 'totalEntries',    header: 'Lançamentos',    render: r => r.totalEntries },
    { key: 'status',          header: 'Status',         render: r => <Badge variant={statusVariant(r.status)} dot>{statusLabel(r.status)}</Badge> },
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