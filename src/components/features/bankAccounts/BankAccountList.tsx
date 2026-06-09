import { useEffect, useState } from 'react'
import { useBankAccounts } from '../../../hooks/useBankAccounts'
import type { BankAccount } from '../../../types/domain.types'
import { BankAccountForm } from './BankAccountForm'

const TYPE_LABEL: Record<string, string> = {
  Checking:   'Corrente',
  Savings:    'Poupança',
  Investment: 'Investimento',
}

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function BankAccountList() {
  const { items, isLoading, error, fetchBankAccounts, remove } = useBankAccounts()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<BankAccount | null>(null)

  useEffect(() => { fetchBankAccounts() }, [fetchBankAccounts])

  function openCreate() { setEditing(null); setShowForm(true) }
  function openEdit(a: BankAccount) { setEditing(a); setShowForm(true) }
  function handleClose() { setShowForm(false); setEditing(null); fetchBankAccounts() }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esta conta bancária?')) return
    await remove(id)
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Contas Bancárias</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm
                     font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          + Nova Conta
        </button>
      </div>

      {/* Erro */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Banco', 'Conta / Agência', 'Tipo', 'Saldo', 'Status', 'Ações'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Carregando…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma conta bancária cadastrada.
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.bankName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.accountNumber}
                    <span className="ml-1 text-gray-400">/ Ag. {a.agency}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={TYPE_LABEL[a.accountType] ?? a.accountType} variant="info" />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{fmt.format(a.balance)}</td>
                  <td className="px-4 py-3">
                    <Badge label={a.isActive ? 'Ativa' : 'Inativa'} variant={a.isActive ? 'success' : 'neutral'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionButton onClick={() => openEdit(a)}>Editar</ActionButton>
                      <ActionButton variant="danger" onClick={() => handleDelete(a.id)}>Excluir</ActionButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <Modal
          title={editing ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
          onClose={handleClose}
        >
          <BankAccountForm initialData={editing} onSuccess={handleClose} onCancel={handleClose} />
        </Modal>
      )}
    </div>
  )
}

// ── Componentes auxiliares inline ────────────────────────────────────────────

function Badge({ label, variant }: { label: string; variant: 'success' | 'info' | 'neutral' | 'danger' | 'warning' }) {
  const cls = {
    success: 'bg-green-100 text-green-700',
    info:    'bg-blue-100  text-blue-700',
    neutral: 'bg-gray-100  text-gray-600',
    danger:  'bg-red-100   text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
  }[variant]
  return (
    <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' + cls}>
      {label}
    </span>
  )
}

function ActionButton({
  children,
  onClick,
  variant = 'default',
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded px-2 py-1 text-xs font-medium transition-colors ' +
        (variant === 'danger'
          ? 'text-red-600 hover:bg-red-50'
          : 'text-blue-600 hover:bg-blue-50')
      }
    >
      {children}
    </button>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}