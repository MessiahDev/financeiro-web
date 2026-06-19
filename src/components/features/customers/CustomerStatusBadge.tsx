import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { CustomerStatus } from '../../../types/enums'

interface PersonStatusBadgeProps {
  status: string
}

const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [CustomerStatus.Active]:   { label: 'Ativo',     variant: 'success'  },
  [CustomerStatus.Inactive]: { label: 'Inativo',   variant: 'default'  },
  [CustomerStatus.Blocked]:  { label: 'Bloqueado', variant: 'danger'   },
}

export function PersonStatusBadge({ status }: PersonStatusBadgeProps) {
  const cfg = map[status] ?? { label: String(status), variant: 'default' as BadgeVariant }
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}