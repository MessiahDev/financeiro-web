import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { TransactionStatus } from '../../../types/enums'
const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [TransactionStatus.Pending]: { label: 'Pendente', variant: 'warning' },
  [TransactionStatus.Confirmed]: { label: 'Confirmado', variant: 'success' },
  [TransactionStatus.Cancelled]: { label: 'Cancelado', variant: 'default' },
}
export function TransactionStatusBadge({ status }: { status: number }) {
  const c = map[status] ?? { label: String(status), variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
