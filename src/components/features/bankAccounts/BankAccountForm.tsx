import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  bankAccountSchema,
  type BankAccountFormData,
} from '../../../schemas/bankAccount.schema'

import { useBankAccounts } from '../../../hooks/useBankAccounts'
import type { BankAccount } from '../../../types/domain.types'

import { Input } from '../../../components/ui/Input/Input'
import { Select } from '../../../components/ui/Select/Select'
import { CurrencyInput } from '../../../components/ui/CurrencyInput/CurrencyInput'
import { Button } from '../../../components/ui/Button/Button'

interface Props {
  initialData?: BankAccount | null
  onSuccess: () => void
  onCancel: () => void
}

const typeOptions = [
  { value: 'Checking', label: 'Conta Corrente' },
  { value: 'Savings', label: 'Poupança' },
  { value: 'Investment', label: 'Investimento' },
]

export function BankAccountForm({
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const {
    create,
    update,
    isSaving,
    error,
  } = useBankAccounts()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: initialData
      ? {
          bankName: initialData.bankName,
          bankCode: initialData.bankCode,
          agency: initialData.agency,
          accountNumber: initialData.accountNumber,
          accountType: initialData.accountType as BankAccountFormData['accountType'],
          pixKey: initialData.pixKey ?? '',
          description: initialData.description ?? '',
          initialBalance: initialData.balance,
        }
      : {
          initialBalance: 0,
        },
  })

  const balance = watch('initialBalance')

  useEffect(() => {
    if (balance == null) {
      setValue('initialBalance', 0)
    }
  }, [balance, setValue])

  async function onSubmit(data: BankAccountFormData) {
    try {
      if (initialData) {
        await update(initialData.id, data)
      } else {
        await create(data)
      }

      onSuccess()
    } catch {
      // tratado pelo hook
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nome do banco"
          required
          disabled={isSaving}
          error={errors.bankName?.message}
          {...register('bankName')}
        />

        <Input
          label="Código do banco"
          required
          disabled={isSaving}
          error={errors.bankCode?.message}
          {...register('bankCode')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Agência"
          required
          disabled={isSaving}
          error={errors.agency?.message}
          {...register('agency')}
        />

        <Input
          label="Número da conta"
          required
          disabled={isSaving}
          error={errors.accountNumber?.message}
          {...register('accountNumber')}
        />
      </div>

      <Select
        label="Tipo"
        required
        disabled={isSaving}
        options={typeOptions}
        placeholder="Selecione..."
        error={errors.accountType?.message}
        {...register('accountType')}
      />

      {!initialData && (
        <CurrencyInput
          label="Saldo inicial"
          value={balance}
          error={errors.initialBalance?.message}
          onChange={(value) =>
            setValue('initialBalance', value, {
              shouldValidate: true,
            })
          }
        />
      )}

      <Input
        label="Chave PIX"
        disabled={isSaving}
        error={errors.pixKey?.message}
        {...register('pixKey')}
      />

      <Input
        label="Descrição"
        disabled={isSaving}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          isLoading={isSaving}
        >
          {initialData ? 'Salvar alterações' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  )
}