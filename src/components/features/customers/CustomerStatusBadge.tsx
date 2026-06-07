import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { PersonStatus } from '../../../types/enums'

interface PersonStatusBadgeProps { status: string }

const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [PersonStatus.Active]:  { label: 'Ativo',    variant: 'success' },
  [PersonStatus.Blocked]: { label: 'Bloqueado', variant: 'danger'  },
  [PersonStatus.Deleted]: { label: 'Inativo',  variant: 'default' },
}

export function PersonStatusBadge({ status }: PersonStatusBadgeProps) {
  const cfg = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}