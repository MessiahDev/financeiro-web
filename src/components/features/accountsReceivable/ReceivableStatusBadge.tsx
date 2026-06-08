import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { AccountReceivableStatus } from '../../../types/enums'
const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [AccountReceivableStatus.Pending]: { label: 'Pendente', variant: 'warning' },
  [AccountReceivableStatus.Received]: { label: 'Recebido', variant: 'success' },
  [AccountReceivableStatus.Overdue]: { label: 'Vencido', variant: 'danger' },
  [AccountReceivableStatus.Cancelled]: { label: 'Cancelado', variant: 'default' },
}
export function AccountReceivableStatusBadge({ status }: { status: string }) {
  const c = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
