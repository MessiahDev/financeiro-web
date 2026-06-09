import { useEffect, useState } from 'react'
import { useCostCenters } from '../../../hooks/useCostCenters'
import type { CostCenter } from '../../../types/domain.types'
import { CostCenterForm } from './CostCenterForm'

export function CostCenterList() {
  const { items, isLoading, error, fetchAll: fetchCostCenters, remove } = useCostCenters()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<CostCenter | null>(null)

  useEffect(() => { fetchCostCenters() }, [fetchCostCenters])

  function handleClose() { setShowForm(false); setEditing(null); fetchCostCenters() }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este centro de custo?')) return
    await remove(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Centros de Custo</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm
                     font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          + Novo Centro de Custo
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Código', 'Nome', 'Orçamento Anual', 'Gestor', 'Status', 'Ações'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Carregando…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Nenhum centro de custo cadastrado.</td></tr>
            ) : (
              items.map((cc) => (
                <tr key={cc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{cc.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {cc.parentName && <span className="mr-1 text-gray-300">↳</span>}
                    {cc.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cc.annualBudget)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{cc.managerName ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' + (cc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                      {cc.status === 'Active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(cc); setShowForm(true) }}
                        className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">Editar</button>
                      <button onClick={() => handleDelete(cc.id)}
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
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="px-6 py-5">
              <CostCenterForm initialData={editing} onSuccess={handleClose} onCancel={handleClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}