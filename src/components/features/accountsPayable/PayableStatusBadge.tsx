import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { AccountPayableStatus } from '../../../types/enums'
const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [AccountPayableStatus.Pending]: { label: 'Pendente', variant: 'warning' },
  [AccountPayableStatus.Paid]: { label: 'Pago', variant: 'success' },
  [AccountPayableStatus.Overdue]: { label: 'Vencido', variant: 'danger' },
  [AccountPayableStatus.Cancelled]: { label: 'Cancelado', variant: 'default' },
}
export function AccountPayableStatusBadge({ status }: { status: string }) {
  const c = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
