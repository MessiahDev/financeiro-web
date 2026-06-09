import { useEffect, useState } from 'react'
import { useBankReconciliations } from '../../../hooks/useBankReconciliations'
import type { BankReconciliation } from '../../../types/domain.types'
import { BankReconciliationForm } from './BankReconciliationForm'

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  Open:       { label: 'Aberta',       cls: 'bg-blue-100   text-blue-700'   },
  InProgress: { label: 'Em Andamento', cls: 'bg-yellow-100 text-yellow-700' },
  Completed:  { label: 'Concluída',    cls: 'bg-green-100  text-green-700'  },
  Cancelled:  { label: 'Cancelada',    cls: 'bg-red-100    text-red-700'    },
}

const fmt     = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')

export function BankReconciliationList() {
  const { items, isLoading, error, fetchAll: fetchReconciliations, cancel } = useBankReconciliations()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<BankReconciliation | null>(null)

  useEffect(() => { fetchReconciliations() }, [fetchReconciliations])

  function handleClose() { setShowForm(false); setEditing(null); fetchReconciliations() }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Conciliações Bancárias</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm
                     font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          + Nova Conciliação
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Conta Bancária', 'Período', 'Saldo Abertura', 'Saldo Fechamento', 'Diferença', 'Status', 'Ações'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Carregando…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nenhuma conciliação encontrada.</td></tr>
            ) : (
              items.map((r) => {
                const s = STATUS_LABEL[r.status] ?? { label: r.status, cls: 'bg-gray-100 text-gray-600' }
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.bankAccountName}</td>
                    <td className="px-4 py-3 text-gray-600">{fmtDate(r.periodStart)} — {fmtDate(r.periodEnd)}</td>
                    <td className="px-4 py-3 text-gray-600">{fmt.format(r.statementOpeningBalance)}</td>
                    <td className="px-4 py-3 text-gray-600">{fmt.format(r.statementClosingBalance)}</td>
                    <td className={`px-4 py-3 font-medium ${r.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt.format(r.difference)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' + s.cls}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(r); setShowForm(true) }}
                          className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">Editar</button>
                       <button onClick={() => cancel(r.id, 'Cancelado pelo usuário')}
                          className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Cancelar</button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? 'Editar Conciliação' : 'Nova Conciliação'}
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="px-6 py-5">
              <BankReconciliationForm initialData={editing} onSuccess={handleClose} onCancel={handleClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}