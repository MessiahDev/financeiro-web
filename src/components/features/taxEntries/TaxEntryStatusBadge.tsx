import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { TaxEntryStatus } from '../../../types/enums'
const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [TaxEntryStatus.Pending]: { label: 'Pendente', variant: 'warning' },
  [TaxEntryStatus.Paid]: { label: 'Pago', variant: 'success' },
  [TaxEntryStatus.Overdue]: { label: 'Vencido', variant: 'danger' },
  [TaxEntryStatus.Cancelled]: { label: 'Cancelado', variant: 'default' },
}
export function TaxEntryStatusBadge({ status }: { status: string }) {
  const c = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
