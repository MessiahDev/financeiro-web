// useJournalEntries.ts — gerado automaticamente, implemente logica especifica conforme necessario
import { useCrud } from './useCrud'
import { JournalEntriesService } from '../services/JournalEntries.service'
export function useJournalEntries() {
  // @ts-expect-error service shape may differ slightly
  const crud = useCrud(JournalEntriesService)
  return { ...crud }
}
