import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { PayrollStatus } from '../../../types/enums'

const map: Record<PayrollStatus, { label: string; variant: BadgeVariant }> = {
  [PayrollStatus.Draft]:      { label: 'Rascunho',    variant: 'default' },
  [PayrollStatus.Processing]: { label: 'Processando', variant: 'info'    },
  [PayrollStatus.Approved]:   { label: 'Aprovado',    variant: 'purple'  },
  [PayrollStatus.Paid]:       { label: 'Pago',        variant: 'success' },
  [PayrollStatus.Cancelled]:  { label: 'Cancelado',   variant: 'danger'  },
}

export function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  const c = map[status] ?? { label: String(status), variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}