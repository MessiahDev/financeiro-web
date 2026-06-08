import { get, post, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { JournalEntry, CreateJournalEntryRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const journalEntriesService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<JournalEntry>> {
    return get<PagedResult<JournalEntry>>(
      API_ROUTES.JOURNAL_ENTRIES +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<JournalEntry> {
    return get<JournalEntry>(`${API_ROUTES.JOURNAL_ENTRIES}/${id}`)
  },
  async create(data: CreateJournalEntryRequest): Promise<JournalEntry> {
    return post<JournalEntry>(API_ROUTES.JOURNAL_ENTRIES, data)
  },
  async postEntry(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.JOURNAL_ENTRIES}/${id}/post`, {})
  },
  async reverse(id: string): Promise<JournalEntry> {
    return post<JournalEntry>(`${API_ROUTES.JOURNAL_ENTRIES}/${id}/reverse`, {})
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.JOURNAL_ENTRIES}/${id}`)
  },
}
