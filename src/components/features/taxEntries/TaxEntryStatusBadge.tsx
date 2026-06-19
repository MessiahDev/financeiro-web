import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { TaxEntryStatus } from '../../../types/enums'

const map: Record<TaxEntryStatus, { label: string; variant: BadgeVariant }> = {
  [TaxEntryStatus.Pending]:    { label: 'Pendente',   variant: 'warning' },
  [TaxEntryStatus.Calculated]: { label: 'Calculado',  variant: 'info'    },
  [TaxEntryStatus.Paid]:       { label: 'Pago',       variant: 'success' },
  [TaxEntryStatus.Cancelled]:  { label: 'Cancelado',  variant: 'default' },
}

export function TaxEntryStatusBadge({ status }: { status: TaxEntryStatus }) {
  const c = map[status] ?? { label: String(status), variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}