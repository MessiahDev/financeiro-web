import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { PayrollStatus } from '../../../types/enums'
const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [PayrollStatus.Processing]: { label: 'Processando', variant: 'info' },
  [PayrollStatus.Processed]: { label: 'Processado', variant: 'success' },
  [PayrollStatus.Cancelled]: { label: 'Cancelado', variant: 'danger' },
}
export function PayrollStatusBadge({ status }: { status: string }) {
  const c = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
