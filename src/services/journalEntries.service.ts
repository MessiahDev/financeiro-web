import { get, post, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { JournalEntry, CreateJournalEntryRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const journalEntriesService = {
  async getAll(params?: { accountingPeriodId?: string }): Promise<PagedResult<JournalEntry>> {
    if (!params?.accountingPeriodId) {
      return {
        items: [], totalCount: 0, totalPages: 1, pageNumber: 1, pageSize: 0,
        hasPreviousPage: false, hasNextPage: false,
      }
    }
    const data = await get<JournalEntry[]>(API_ROUTES.JOURNAL_ENTRIES, { accountingPeriodId: params.accountingPeriodId })
    return {
      items:           data ?? [],
      totalCount:      data?.length ?? 0,
      totalPages:      1,
      pageNumber:      1,
      pageSize:        data?.length ?? 0,
      hasPreviousPage: false,
      hasNextPage:     false,
    }
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