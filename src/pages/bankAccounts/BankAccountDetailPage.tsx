import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Badge } from '../../components/ui/Badge/Badge'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Input } from '../../components/ui/Input/Input'
import { Select } from '../../components/ui/Select/Select'
import { CurrencyInput } from '../../components/ui/CurrencyInput/CurrencyInput'
import { useBankAccounts } from '../../hooks/useBankAccounts'
import { bankStatementsService } from '../../services/bankStatements.service'
import { transactionsService } from '../../services/transactions.service'
import type { ImportBankStatementRequest, BankStatement, Transaction } from '../../types/domain.types'
import { BankStatementEntryType, BankAccountType, BankStatementStatus, TransactionType } from '../../types/enums'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'

type ImportBankStatementEntryRequest = ImportBankStatementRequest['entries'][number]

const typeLabel: Record<BankAccountType, string> = {
  [BankAccountType.Checking]: 'Conta Corrente',
  [BankAccountType.Savings]:  'Poupança',
  [BankAccountType.Payment]:  'Pagamento',
}

const statusVariant = (status: BankStatementStatus) =>
  status === BankStatementStatus.Imported || status === BankStatementStatus.Reconciled
    ? 'success'
    : 'default'

const statusLabel = (status: BankStatementStatus) => {
  const map: Record<BankStatementStatus, string> = {
    [BankStatementStatus.Imported]:   'Importado',
    [BankStatementStatus.Reconciled]: 'Conciliado',
    [BankStatementStatus.Cancelled]:  'Cancelado',
  }
  return map[status] ?? String(status)
}

const entryTypeOptions = [
  { value: BankStatementEntryType.Credit, label: 'Crédito' },
  { value: BankStatementEntryType.Debit,  label: 'Débito'  },
]

const emptyEntry = (): ImportBankStatementEntryRequest & { _id: string } => ({
  _id:            crypto.randomUUID(),
  date:           '',
  description:    '',
  amount:         0,
  entryType:      BankStatementEntryType.Credit,
  documentNumber: '',
})

const emptyForm = (): ImportBankStatementRequest => ({
  bankAccountId:  '',
  statementDate:  '',
  periodStart:    '',
  periodEnd:      '',
  openingBalance: 0,
  closingBalance: 0,
  fileName:       '',
  notes:          '',
  entries:        [],
})

export default function BankAccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useBankAccounts()
  const { success, error: notifyError } = useNotifications()

  const [statements, setStatements]   = useState<BankStatement[]>([])
  const [loadingStmt, setLoadingStmt] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTx, setLoadingTx]     = useState(false)
  const [importOpen, setImportOpen]   = useState(false)
  const [isSaving, setIsSaving]       = useState(false)
  const [form, setForm]               = useState<ImportBankStatementRequest>(emptyForm())
  const [entries, setEntries]         = useState<(ImportBankStatementEntryRequest & { _id: string })[]>([])

  const refreshStatements = async () => {
    if (!id) return
    setLoadingStmt(true)
    bankStatementsService
      .getAll({ bankAccountId: id })
      .then(r => setStatements(r.items))
      .catch(() => setStatements([]))
      .finally(() => setLoadingStmt(false))
  }

  const refreshTransactions = async () => {
    if (!id) return
    setLoadingTx(true)
    try {
      const result = await transactionsService.getAll({ bankAccountId: id, pageSize: 50 })
      setTransactions(result.items ?? [])
    } catch {
      setTransactions([])
    } finally {
      setLoadingTx(false)
    }
  }

  useEffect(() => { if (id) fetchById(id) }, [id])
  useEffect(() => { refreshStatements() }, [id])
  useEffect(() => { refreshTransactions() }, [id])

  const openImport = () => {
    setForm({ ...emptyForm(), bankAccountId: id! })
    setEntries([emptyEntry()])
    setImportOpen(true)
  }

  const addEntry = () => setEntries(e => [...e, emptyEntry()])

  const removeEntry = (eid: string) =>
    setEntries(e => e.filter(x => x._id !== eid))

  const updateEntry = (eid: string, field: string, value: string | number) =>
    setEntries(e => e.map(x => x._id === eid ? { ...x, [field]: value } : x))

  const handleImport = async () => {
    if (entries.length === 0) {
      notifyError('Adicione ao menos um lançamento.')
      return
    }
    setIsSaving(true)
    try {
      const payload: ImportBankStatementRequest = {
        ...form,
        entries: entries.map(({ _id, ...e }) => e),
      }
      await bankStatementsService.import(payload)
      success('Extrato importado com sucesso!')
      setImportOpen(false)
      await refreshStatements()
    } catch {
      notifyError('Erro ao importar extrato.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = async (statementId: string) => {
    try {
      await bankStatementsService.cancel(statementId, 'Cancelado pelo usuário')
      success('Extrato cancelado.')
      await refreshStatements()
    } catch {
      notifyError('Erro ao cancelar extrato.')
    }
  }

  const statementColumns: Column<BankStatement>[] = [
    { key: 'periodStart',    header: 'Período',        render: r => `${formatDate((r as any).periodStart)} – ${formatDate((r as any).periodEnd)}` },
    { key: 'openingBalance', header: 'Saldo Inicial',  render: r => formatCurrency((r as any).openingBalance ?? 0) },
    { key: 'closingBalance', header: 'Saldo Final',    render: r => formatCurrency((r as any).closingBalance ?? 0) },
    { key: 'totalEntries',   header: 'Lançamentos',    render: r => (r as any).totalEntries ?? r.entries?.length ?? 0 },
    { key: 'status',         header: 'Status',         render: r => <Badge variant={statusVariant(r.status)} dot>{statusLabel(r.status)}</Badge> },
    { key: 'actions',        header: '',               render: r => r.status === BankStatementStatus.Imported ? (
      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleCancel(r.id)}>
        Cancelar
      </Button>
    ) : null },
  ]

  const transactionColumns: Column<Transaction>[] = [
    { key: 'transactionDate', header: 'Data',        render: r => formatDate(r.transactionDate) },
    { key: 'description',     header: 'Descrição',   render: r => <span className="font-medium">{r.description}</span> },
    { key: 'referenceNumber', header: 'Referência',  render: r => r.referenceNumber || '-' },
    { key: 'amount',          header: 'Valor',       render: r => (
      <span className={r.type === TransactionType.Debit ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
        {r.type === TransactionType.Debit ? '-' : '+'}{formatCurrency(r.amount)}
      </span>
    )},
  ]

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Conta não encontrada.</p>

  const a = selected

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={a.bankName}
        subtitle={`Ag. ${a.agency} · Cc. ${a.accountNumber}`}
        backTo={ROUTES.BANK_ACCOUNTS}
      />

      {/* Dados + Saldo */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados da Conta" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Banco</dt><dd className="font-medium text-slate-900">{a.bankName}</dd></div>
            <div><dt className="text-slate-400">Tipo</dt><dd>{typeLabel[a.accountType] ?? a.accountType}</dd></div>
            <div><dt className="text-slate-400">Agência</dt><dd>{a.agency}</dd></div>
            <div><dt className="text-slate-400">Conta</dt><dd>{a.accountNumber}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><Badge variant={a.isActive ? 'success' : 'default'} dot>{a.isActive ? 'Ativa' : 'Inativa'}</Badge></dd></div>
            <div><dt className="text-slate-400">Cadastrado em</dt><dd>{formatDate(a.createdAt)}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Saldo Atual" />
          <CardDivider />
          <p className={`font-display text-3xl font-bold mt-2 ${a.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
            {formatCurrency(a.balance)}
          </p>
        </Card>
      </div>

      {/* Movimentações (extrato do sistema) */}
      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Movimentações" subtitle="Transações registradas pelo sistema" />
        </div>
        <Table
          columns={transactionColumns}
          data={transactions}
          keyExtractor={r => r.id}
          isLoading={loadingTx}
          emptyMessage="Nenhuma movimentação registrada ainda."
        />
      </Card>

      {/* Extratos importados (banco real) */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-slate-900">Extratos Importados</h2>
        <Button onClick={openImport}>+ Importar Extrato</Button>
      </div>
      <Table
        columns={statementColumns}
        data={statements}
        keyExtractor={r => r.id}
        isLoading={loadingStmt}
        emptyMessage="Nenhum extrato importado para esta conta."
      />

      {/* Modal de importação */}
      <Modal isOpen={importOpen} onClose={() => setImportOpen(false)} title="Importar Extrato" size="lg">
        <div className="flex flex-col gap-5">

          {/* Dados gerais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Data do extrato" type="date" required
                value={form.statementDate}
                onChange={e => setForm(f => ({ ...f, statementDate: e.target.value }))}
              />
            </div>
            <Input label="Período início" type="date" required
              value={form.periodStart}
              onChange={e => setForm(f => ({ ...f, periodStart: e.target.value }))}
            />
            <Input label="Período fim" type="date" required
              value={form.periodEnd}
              onChange={e => setForm(f => ({ ...f, periodEnd: e.target.value }))}
            />
            <CurrencyInput label="Saldo inicial"
              value={form.openingBalance}
              onChange={v => setForm(f => ({ ...f, openingBalance: v }))}
            />
            <CurrencyInput label="Saldo final"
              value={form.closingBalance}
              onChange={v => setForm(f => ({ ...f, closingBalance: v }))}
            />
            <Input label="Nome do arquivo" placeholder="extrato-janeiro.pdf"
              value={form.fileName ?? ''}
              onChange={e => setForm(f => ({ ...f, fileName: e.target.value }))}
            />
            <Input label="Observações" placeholder="Opcional"
              value={form.notes ?? ''}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {/* Lançamentos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-700">
                Lançamentos <span className="text-red-500">*</span>
              </p>
              <Button size="sm" variant="secondary" onClick={addEntry}>+ Adicionar</Button>
            </div>

            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <div key={entry._id} className="rounded-lg border border-slate-200 p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Lançamento {i + 1}</span>
                    {entries.length > 1 && (
                      <button onClick={() => removeEntry(entry._id)}
                        className="text-xs text-red-400 hover:text-red-600">
                        Remover
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Data" type="date" required
                      value={entry.date}
                      onChange={e => updateEntry(entry._id, 'date', e.target.value)}
                    />
                    <Select label="Tipo" required options={entryTypeOptions}
                      value={entry.entryType}
                      onChange={e => updateEntry(entry._id, 'entryType', e.target.value)}
                    />
                    <div className="col-span-2">
                      <Input label="Descrição" required
                        value={entry.description}
                        onChange={e => updateEntry(entry._id, 'description', e.target.value)}
                      />
                    </div>
                    <CurrencyInput label="Valor" required
                      value={entry.amount}
                      onChange={v => updateEntry(entry._id, 'amount', v)}
                    />
                    <Input label="Nº Documento"
                      value={entry.documentNumber ?? ''}
                      onChange={e => updateEntry(entry._id, 'documentNumber', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setImportOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button onClick={handleImport} isLoading={isSaving}>Importar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}