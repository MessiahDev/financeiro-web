// =============================================================================
// OverdueAlerts.tsx
// =============================================================================

import { Card, CardHeader } from '../../ui/Card/Card'
import { Badge } from '../../ui/Badge/Badge'
import { formatCurrency, formatDate } from '../../../utils/formatters'
import { EmptyState } from '../../ui/EmptyState/EmptyState'

interface OverdueItem {
  id:       string
  name:     string
  amount:   number
  dueDate:  string
  type:     'payable' | 'receivable' | 'tax'
}

interface OverdueAlertsProps {
  items: OverdueItem[]
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

export function OverdueAlerts({ items }: OverdueAlertsProps) {
  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <CardHeader
          title="Vencimentos em Atraso"
          subtitle={items.length > 0 ? `${items.length} itens pendentes` : undefined}
        />
      </div>

      {items.length === 0 ? (
        <div className="py-8">
          <EmptyState message="Nenhum item em atraso." icon="✓" />
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400">Venceu em {formatDate(item.dueDate)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant={typeVariant[item.type]}>{typeLabel[item.type]}</Badge>
                <span className="text-sm font-semibold text-red-600">
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
