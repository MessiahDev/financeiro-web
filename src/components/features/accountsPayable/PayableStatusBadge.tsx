import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { AccountPayableStatus } from '../../../types/enums'

const map: Record<number, { label: string; variant: BadgeVariant }> = {
  [AccountPayableStatus.Pending]:       { label: 'Pendente',          variant: 'warning' },
  [AccountPayableStatus.PartiallyPaid]: { label: 'Pago Parcialmente', variant: 'info'    },
  [AccountPayableStatus.Paid]:          { label: 'Pago',              variant: 'success' },
  [AccountPayableStatus.Overdue]:       { label: 'Vencido',           variant: 'danger'  },
  [AccountPayableStatus.Cancelled]:     { label: 'Cancelado',         variant: 'default' },
}

export function AccountPayableStatusBadge({ status }: { status: number }) {
  const c = map[status] ?? { label: String(status), variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}