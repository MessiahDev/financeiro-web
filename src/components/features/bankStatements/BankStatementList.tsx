import { useEffect, useState } from 'react'
import { useBankStatements } from '../../../hooks/useBankStatements'
import type { BankStatement } from '../../../types/domain.types'
import { BankStatementImportForm } from './BankStatementImportForm'

const STATUS_CLS: Record<string, string> = {
  Imported:   'bg-blue-100   text-blue-700',
  Reconciled: 'bg-green-100  text-green-700',
  Cancelled:  'bg-red-100    text-red-700',
}
const STATUS_LABEL: Record<string, string> = {
  Imported:   'Importado',
  Reconciled: 'Conciliado',
  Cancelled:  'Cancelado',
}

const fmt     = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')

export function BankStatementList() {
  const { items, isLoading, error, fetchAll: fetchStatements, cancel } = useBankStatements()
  const [showForm, setShowForm]     = useState(false)
  const [selected, setSelected]     = useState<BankStatement | null>(null)

  useEffect(() => { fetchStatements() }, [fetchStatements])

  function handleClose() { setShowForm(false); fetchStatements() }

  async function handleCancel(id: string) {
    if (!confirm('Deseja cancelar este extrato?')) return
    await cancel(id, 'Cancelado pelo usuário')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Extratos Bancários</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm
                     font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          + Importar Extrato
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Conta Bancária', 'Período', 'Entradas', 'Créditos', 'Débitos', 'Status', 'Ações'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Carregando…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nenhum extrato importado.</td></tr>
            ) : (
              items.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.bankAccountName}</td>
                  <td className="px-4 py-3 text-gray-600">{fmtDate(s.periodStart)} — {fmtDate(s.periodEnd)}</td>
                  <td className="px-4 py-3 text-gray-600">{s.totalEntries} lançamento(s)</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{fmt.format(s.totalCredits)}</td>
                  <td className="px-4 py-3 text-red-600 font-medium">{fmt.format(s.totalDebits)}</td>
                  <td className="px-4 py-3">
                    <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' + (STATUS_CLS[s.status] ?? 'bg-gray-100 text-gray-600')}>
                      {STATUS_LABEL[s.status] ?? s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(s)}
                        className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">Ver</button>
                      <button onClick={() => handleCancel(s.id)}
                        className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Cancelar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-base font-semibold text-gray-900">
                Extrato — {selected.bankAccountName} ({fmtDate(selected.periodStart)} — {fmtDate(selected.periodEnd)})
              </h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead><tr>
                  {['Data', 'Descrição', 'Tipo', 'Valor', 'Conciliado'].map((h) => (
                    <th key={h} className="pb-2 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {selected.entries.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2 text-gray-600">{fmtDate(e.date)}</td>
                      <td className="py-2 text-gray-900">{e.description}</td>
                      <td className="py-2">
                        <span className={'inline-flex rounded-full px-2 py-0.5 text-xs font-medium ' + (e.entryType === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                          {e.entryType === 1 ? 'Crédito' : 'Débito'}
                        </span>
                      </td>
                      <td className={'py-2 font-medium ' + (e.entryType === 1 ? 'text-green-600' : 'text-red-600')}>
                        {fmt.format(e.amount)}
                      </td>
                      <td className="py-2 text-gray-500">{e.isReconciled ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-base font-semibold text-gray-900">Importar Extrato</h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="px-6 py-5">
              <BankStatementImportForm onSuccess={handleClose} onCancel={handleClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}