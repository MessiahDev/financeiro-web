import { useCallback, useState } from 'react'
import { journalEntriesService } from '../services/journalEntries.service'
import { getErrorMessage } from '../utils/errorHandler'
import type { JournalEntry } from '../types/domain.types'

export function useJournalEntries() {
  const [items, setItems]     = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const fetchAll = useCallback(async (params?: Record<string, unknown>) => {
    setIsLoading(true); setError(null)
    try { const r = await journalEntriesService.getAll(params); setItems(r.items) }
    catch (e) { setError(getErrorMessage(e)) }
    finally { setIsLoading(false) }
  }, [])

  const create = useCallback(async (data: Parameters<typeof journalEntriesService.create>[0]) => {
    try { return await journalEntriesService.create(data) }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [])

  const postEntry = useCallback(async (id: string) => {
    try { await journalEntriesService.postEntry(id); await fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [fetchAll])

  const reverse = useCallback(async (id: string) => {
    try { await journalEntriesService.reverse(id); await fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [fetchAll])

  const remove = useCallback(async (id: string) => {
    try { await journalEntriesService.delete(id); await fetchAll() }
    catch (e) { throw new Error(getErrorMessage(e)) }
  }, [fetchAll])

  return { items, isLoading, error, fetchAll, create, postEntry, reverse, remove }
}