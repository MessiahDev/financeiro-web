import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { BudgetStatus } from '../../../types/enums'
const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [BudgetStatus.Draft]: { label: 'Rascunho', variant: 'default' },
  [BudgetStatus.Approved]: { label: 'Aprovado', variant: 'success' },
  [BudgetStatus.Closed]: { label: 'Encerrado', variant: 'warning' },
}
export function BudgetStatusBadge({ status }: { status: string }) {
  const c = map[status] ?? { label: String(status), variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
