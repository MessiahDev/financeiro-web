import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { AccountingPeriodStatus } from '../../../types/enums'
const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [AccountingPeriodStatus.Open]: { label: 'Aberto', variant: 'success' },
  [AccountingPeriodStatus.Closed]: { label: 'Fechado', variant: 'warning' },
  [AccountingPeriodStatus.Locked]: { label: 'Bloqueado', variant: 'danger' },
}
export function AccountingPeriodStatusBadge({ status }: { status: string }) {
  const c = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
