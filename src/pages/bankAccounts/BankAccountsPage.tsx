import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card } from '../../components/ui/Card/Card'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { Badge } from '../../components/ui/Badge/Badge'
import { useBankAccounts } from '../../hooks/useBankAccounts'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bankAccountSchema, type BankAccountFormData } from '../../schemas/bankAccount.schema'
import { Input } from '../../components/ui/Input/Input'
import { Select } from '../../components/ui/Select/Select'
import { CurrencyInput } from '../../components/ui/CurrencyInput/CurrencyInput'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import type { BankAccount } from '../../types/domain.types'

const typeOptions = [{ value: 'Checking', label: 'Conta Corrente' }, { value: 'Savings', label: 'Poupanca' }, { value: 'Investment', label: 'Investimento' }]
const typeLabel: Record<string, string> = { Checking: 'Conta Corrente', Savings: 'Poupanca', Investment: 'Investimento' }

function BankAccountForm({ onSubmit, onCancel, isSaving }: { onSubmit: (d: BankAccountFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(bankAccountSchema) })
  const balance = watch('initialBalance')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="Nome do banco" required error={errors.bankName?.message} {...register('bankName')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Agencia" required error={errors.agency?.message} {...register('agency')} />
        <Input label="Numero da conta" required error={errors.accountNumber?.message} {...register('accountNumber')} />
      </div>
      <Select label="Tipo" required options={typeOptions} placeholder="Selecione..." error={errors.accountType?.message} {...register('accountType')} />
      <CurrencyInput label="Saldo inicial" value={balance} onChange={v => setValue('initialBalance', v)} error={errors.initialBalance?.message} />
      <div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button><Button type="submit" isLoading={isSaving}>Cadastrar</Button></div>
    </form>
  )
}

function AccountCard({ account }: { account: BankAccount }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-semibold text-slate-900">{account.bankName}</p>
          <p className="text-sm text-slate-500">Ag. {account.agency} · Cc. {account.accountNumber}</p>
          <p className="text-xs text-slate-400 mt-0.5">{typeLabel[account.accountType] ?? account.accountType}</p>
        </div>
        <Badge variant={account.isActive ? 'success' : 'default'} dot>{account.isActive ? 'Ativa' : 'Inativa'}</Badge>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">Saldo atual</p>
        <p className={`font-display text-xl font-semibold ${account.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>{formatCurrency(account.balance)}</p>
      </div>
    </Card>
  )
}

export default function BankAccountsPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, fetchBankAccounts, create } = useBankAccounts()
  const [newOpen, setNewOpen] = useState(false)

  useEffect(() => { fetchBankAccounts() }, [])

  const totalBalance = items.reduce((s, a) => s + a.balance, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contas Bancarias"
        subtitle={`Saldo total: ${formatCurrency(totalBalance)}`}
        actions={<Button onClick={() => setNewOpen(true)}>+ Nova conta</Button>}
      />
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" className="text-blue-500" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(a => <AccountCard key={a.id} account={a} />)}
        </div>
      )}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Nova conta bancaria" size="md">
        <BankAccountForm isSaving={isSaving} onCancel={() => setNewOpen(false)} onSubmit={async d => { try { await create(d); success('Conta cadastrada!'); setNewOpen(false); fetchBankAccounts() } catch { notifyError('Erro ao cadastrar.') } }} />
      </Modal>
    </div>
  )
}