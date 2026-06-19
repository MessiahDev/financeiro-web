import { Badge, type BadgeVariant } from '../../ui/Badge/Badge'
import { JournalEntryStatus } from '../../../types/enums'
const map: Record<string, { label: string; variant: BadgeVariant }> = {
  [JournalEntryStatus.Draft]: { label: 'Rascunho', variant: 'default' },
  [JournalEntryStatus.Posted]: { label: 'Lancado', variant: 'success' },
  [JournalEntryStatus.Reversed]: { label: 'Estornado', variant: 'warning' },
}
export function JournalEntryStatusBadge({ status }: { status: string }) {
  const c = map[status] ?? { label: String(status), variant: 'default' as BadgeVariant }
  return <Badge variant={c.variant} dot>{c.label}</Badge>
}
