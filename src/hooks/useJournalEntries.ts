import { useCrud } from './useCrud'
import { journalEntriesService } from '../services/journalEntries.service'
import type { JournalEntry, CreateJournalEntryRequest } from '../types/domain.types'

export function useJournalEntries() {
  const crud = useCrud<JournalEntry, CreateJournalEntryRequest, Partial<CreateJournalEntryRequest>>({
    getAll:  (p)       => journalEntriesService.getAll(p),
    getById: (id)      => journalEntriesService.getById(id),
    create:  (d)       => journalEntriesService.create(d),
    update:  (_id, _d) => Promise.reject('not supported'),
    delete:  (id)      => journalEntriesService.delete(id),
  })

  return { ...crud, fetchEntries: crud.fetchAll }
}
