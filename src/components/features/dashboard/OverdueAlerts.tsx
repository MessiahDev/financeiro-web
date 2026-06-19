import { Card, CardHeader } from '../../ui/Card/Card'
import { Badge } from '../../ui/Badge/Badge'
import { formatCurrency, formatDate } from '../../../utils/formatters'
import { EmptyState } from '../../ui/EmptyState/EmptyState'

export interface OverdueItem {
  id:      string
  name:    string
  amount:  number
  dueDate: string
  type:    'payable' | 'receivable' | 'tax'
}

interface OverdueAlertsProps {
  items:     OverdueItem[]
  isLoading?: boolean
}

const typeLabel: Record<OverdueItem['type'], string> = {
  payable:    'A Pagar',
  receivable: 'A Receber',
  tax:        'Fiscal',
}

const typeVariant: Record<OverdueItem['type'], 'danger' | 'warning' | 'purple'> = {
  payable:    'danger',
  receivable: 'warning',
  tax:        'purple',
}

export function OverdueAlerts({ items, isLoading = false }: OverdueAlertsProps) {
  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <CardHeader
          title="Vencimentos em Atraso"
          subtitle={!isLoading && items.length > 0 ? `${items.length} ${items.length === 1 ? 'item pendente' : 'itens pendentes'}` : undefined}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2 px-5 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-8">
          <EmptyState message="Nenhum item em atraso." description="Tudo certo por aqui!" icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          } />
        </div>
      ) : (
        <ul className="max-h-[22rem] divide-y divide-slate-100 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400">Venceu em {formatDate(item.dueDate)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant={typeVariant[item.type]}>{typeLabel[item.type]}</Badge>
                <span className="text-sm font-semibold text-red-600 tabular-nums">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}