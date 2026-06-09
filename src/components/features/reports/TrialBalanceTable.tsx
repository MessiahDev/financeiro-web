import type { TrialBalance } from '../../../types/domain.types'

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const ACCOUNT_TYPE_LABEL: Record<string, string> = {
  Asset:     'Ativo',
  Liability: 'Passivo',
  Equity:    'Patrimônio',
  Revenue:   'Receita',
  Expense:   'Despesa',
}

interface Props {
  trialBalance: TrialBalance | null
  isLoading:    boolean
}

export function TrialBalanceTable({ trialBalance, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse h-10 rounded bg-gray-100" />
        ))}
      </div>
    )
  }

  if (!trialBalance) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center">
        <p className="text-sm text-gray-400">Selecione um período contábil para gerar o balancete.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Período: <strong className="text-gray-900">{trialBalance.periodName}</strong></span>
        <span>Gerado em: {new Date(trialBalance.generatedAt).toLocaleString('pt-BR')}</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Código', 'Conta', 'Tipo', 'Débito', 'Crédito', 'Saldo'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {trialBalance.lines.map((e) => (
              <tr key={e.accountCode} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.accountCode}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{e.accountName}</td>
                <td className="px-4 py-3 text-gray-500">{ACCOUNT_TYPE_LABEL[e.accountType] ?? e.accountType}</td>
                <td className="px-4 py-3 text-right text-gray-700">{fmt.format(e.totalDebits)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{fmt.format(e.totalCredits)}</td>
                <td className={'px-4 py-3 text-right font-semibold ' + (e.balance >= 0 ? 'text-gray-900' : 'text-red-600')}>
                  {fmt.format(e.balance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-semibold">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-xs uppercase text-gray-500">Totais</td>
              <td className="px-4 py-3 text-right text-gray-900">{fmt.format(trialBalance.totalDebits)}</td>
              <td className="px-4 py-3 text-right text-gray-900">{fmt.format(trialBalance.totalCredits)}</td>
              <td className={'px-4 py-3 text-right ' + (trialBalance.totalDebits === trialBalance.totalCredits ? 'text-green-700' : 'text-red-600')}>
                {trialBalance.totalDebits === trialBalance.totalCredits ? '✓ Balanceado' : '✗ Desbalanceado'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}