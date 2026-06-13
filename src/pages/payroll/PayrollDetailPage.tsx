import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card/Card'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { Select } from '../../components/ui/Select/Select'
import { PayrollStatusBadge } from '../../components/features/payroll/PayrollStatusBadge'
import { usePayroll } from '../../hooks/usePayroll'
import { useNotifications } from '../../hooks/useNotifications'
import { bankAccountsService } from '../../services/bankAccounts.service'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import { PayrollStatus } from '../../types/enums'
import type { BankAccount, PayrollDetail, PayrollItem } from '../../types/domain.types'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { fetchById, approve, pay } = usePayroll()
  const { success, error } = useNotifications()
  const [isLoading, setIsLoading]       = useState(false)
  const [isActing, setIsActing]         = useState(false)
  const [selected, setSelected]         = useState<PayrollDetail | null>(null)
  const [showPayModal, setShowPayModal] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [bankAccountId, setBankAccountId] = useState('')

  const reload = () => {
    if (!id) return
    setIsLoading(true)
    fetchById(id)
      .then(setSelected)
      .catch(() => setSelected(null))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { reload() }, [id])

  useEffect(() => {
    bankAccountsService.getAll().then(r => setBankAccounts(r.items ?? []))
  }, [])

  const handleApprove = async () => {
    if (!id) return
    setIsActing(true)
    try {
      await approve(id)
      success('Folha aprovada com sucesso!')
      reload()
    } catch {
      error('Erro ao aprovar a folha.')
    } finally {
      setIsActing(false)
    }
  }

  const handlePay = async () => {
    if (!id || !bankAccountId) return
    setIsActing(true)
    try {
      await pay(id, { bankAccountId })
      success('Folha paga com sucesso!')
      setShowPayModal(false)
      reload()
    } catch {
      error('Erro ao pagar a folha.')
    } finally {
      setIsActing(false)
    }
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Folha não encontrada.</p>

  const p = selected

  const columns: Column<PayrollItem>[] = [
    { key: 'employeeName',   header: 'Funcionário',   render: i => <span className="font-medium">{i.employeeName}</span> },
    { key: 'grossSalary',    header: 'Salário Bruto', render: i => formatCurrency(i.grossSalary) },
    { key: 'inssDiscount',   header: 'INSS',          render: i => formatCurrency(i.inssDiscount) },
    { key: 'irpfDiscount',   header: 'IRRF',          render: i => formatCurrency(i.irpfDiscount) },
    { key: 'otherDiscounts', header: 'Outros',        render: i => formatCurrency(i.otherDiscounts) },
    { key: 'netSalary',      header: 'Salário Líq.',  render: i => <span className="font-semibold text-green-600">{formatCurrency(i.netSalary)}</span> },
  ]

  const bankOptions = bankAccounts.map(b => ({
    value: b.id,
    label: `${b.bankName} — ${b.accountNumber} (${formatCurrency(b.balance)})`,
  }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Folha — ${MONTHS[p.month - 1]}/${p.year}`}
        subtitle={p.processedAt ? `Processada em ${formatDateTime(p.processedAt)}` : 'Não processada'}
        backTo={ROUTES.PAYROLL}
        actions={
          <div className="flex gap-2">
            {p.status === PayrollStatus.Processing && (
              <Button variant="secondary" size="sm" isLoading={isActing} onClick={handleApprove}>
                Aprovar
              </Button>
            )}
            {p.status === PayrollStatus.Approved && (
              <Button variant="success" size="sm" onClick={() => setShowPayModal(true)}>
                Pagar Folha
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Bruto',   value: p.totalGross,     color: 'text-slate-900' },
          { label: 'INSS + IRRF',   value: p.totalDiscounts, color: 'text-red-600'   },
          { label: 'Total Líquido', value: p.totalNet,       color: 'text-green-600' },
        ].map(m => (
          <Card key={m.label}>
            <p className="text-xs text-slate-400">{m.label}</p>
            <p className={`font-display text-xl font-bold mt-1 ${m.color}`}>{formatCurrency(m.value)}</p>
          </Card>
        ))}
        <Card>
          <p className="text-xs text-slate-400">Status</p>
          <div className="mt-2"><PayrollStatusBadge status={p.status} /></div>
        </Card>
      </div>

      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Funcionários" subtitle={`${p.items?.length ?? 0} registros`} />
        </div>
        <Table columns={columns} data={p.items ?? []} keyExtractor={i => i.id} emptyMessage="Nenhum funcionário na folha." />
      </Card>

      <Modal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        title="Pagar Folha de Pagamento"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPayModal(false)}>Cancelar</Button>
            <Button variant="success" isLoading={isActing} disabled={!bankAccountId} onClick={handlePay}>
              Confirmar Pagamento
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Valor total a debitar: <span className="font-semibold text-slate-900">{formatCurrency(p.totalNet)}</span>
          </p>
          <Select
            label="Conta Bancária"
            required
            placeholder="Selecione uma conta..."
            options={bankOptions}
            value={bankAccountId}
            onChange={e => setBankAccountId(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}