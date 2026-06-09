import { useEffect, useState } from 'react'
import { useChartOfAccounts } from '../../../hooks/useChartOfAccounts'
import type { ChartOfAccount } from '../../../types/domain.types'
import { ChartOfAccountForm } from './ChartOfAccountForm'

const ACCOUNT_TYPE_LABEL: Record<string, string> = {
  Asset:       'Ativo',
  Liability:   'Passivo',
  Equity:      'Patrimônio',
  Revenue:     'Receita',
  Expense:     'Despesa',
  CostOfGoods: 'Custo de Mercadorias',
}

const TYPE_CLS: Record<string, string> = {
  Asset:       'bg-blue-100   text-blue-700',
  Liability:   'bg-red-100    text-red-700',
  Equity:      'bg-purple-100 text-purple-700',
  Revenue:     'bg-green-100  text-green-700',
  Expense:     'bg-orange-100 text-orange-700',
  CostOfGoods: 'bg-yellow-100 text-yellow-700',
}

export function ChartOfAccountList() {
  const { items, isLoading, error, fetchAll: fetchAccounts, remove } = useChartOfAccounts()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<ChartOfAccount | null>(null)

  useEffect(() => { fetchAccounts() }, [fetchAccounts])

  function handleClose() { setShowForm(false); setEditing(null); fetchAccounts() }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esta conta contábil?')) return
    await remove(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Plano de Contas</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm
                     font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          + Nova Conta
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Código', 'Nome', 'Tipo', 'Natureza', 'Aceita Lançamentos', 'Status', 'Ações'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Carregando…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nenhuma conta cadastrada.</td></tr>
            ) : (
              items.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{a.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {a.parentAccountId && <span className="mr-1 text-gray-300">↳</span>}
                    {a.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' + (TYPE_CLS[a.accountType] ?? 'bg-gray-100 text-gray-600')}>
                      {ACCOUNT_TYPE_LABEL[a.accountType] ?? a.accountType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.accountNature === 1 ? 'Devedora' : 'Credora'}</td>
                  <td className="px-4 py-3 text-gray-600">{a.acceptsEntries ? 'Sim' : 'Não'}</td>
                  <td className="px-4 py-3">
                    <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' + (a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                      {a.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(a); setShowForm(true) }}
                        className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">Editar</button>
                      <button onClick={() => handleDelete(a.id)}
                        className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? 'Editar Conta' : 'Nova Conta Contábil'}
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="px-6 py-5">
              <ChartOfAccountForm initialData={editing} onSuccess={handleClose} onCancel={handleClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}