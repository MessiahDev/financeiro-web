import { useState, useCallback } from 'react'
import { getErrorMessage } from '../utils/errorHandler'
import type { PagedResult } from '../types/pagination.types'
import { DEFAULT_PAGE_SIZE } from '../types/pagination.types'

interface CrudService<T, CreateDto, UpdateDto> {
  getAll:   (params?: Record<string, unknown>) => Promise<PagedResult<T>>
  getById:  (id: string) => Promise<T>
  create:   (data: CreateDto) => Promise<T>
  update:   (id: string, data: UpdateDto) => Promise<T>
  delete:   (id: string) => Promise<void>
}

export function useCrud<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  service: CrudService<T, CreateDto, UpdateDto>,
) {
  const [items, setItems]       = useState<T[]>([])
  const [selected, setSelected] = useState<T | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [isSaving, setSaving]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [page, setPage]         = useState(1)
  const [pageSize]              = useState(DEFAULT_PAGE_SIZE)
  const [totalCount, setTotal]  = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchAll = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await service.getAll({ pageNumber: page, pageSize, ...params })

      setItems(result?.items ?? [])
      setTotal(result?.totalCount ?? 0)
      setTotalPages(result?.totalPages ?? 0)

      return result
    } catch (err) {
      setItems([])
      setTotal(0)
      setTotalPages(0)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [service, page, pageSize])

  const fetchById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const item = await service.getById(id)
      setSelected(item)
      return item
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [service])

  const create = useCallback(async (data: CreateDto) => {
    setSaving(true)
    setError(null)
    try {
      const item = await service.create(data)
      setItems((prev) => [item, ...prev])
      setTotal((n) => n + 1)
      return item
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setSaving(false)
    }
  }, [service])

  const update = useCallback(async (id: string, data: UpdateDto) => {
    setSaving(true)
    setError(null)
    try {
      const item = await service.update(id, data)
      setItems((prev) => prev.map((i) => ((i as { id: string }).id === id ? item : i)))
      if ((selected as { id: string } | null)?.id === id) setSelected(item)
      return item
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setSaving(false)
    }
  }, [service, selected])

  const remove = useCallback(async (id: string) => {
    setSaving(true)
    setError(null)
    try {
      await service.delete(id)
      setItems((prev) => prev.filter((i) => (i as { id: string }).id !== id))
      setTotal((n) => n - 1)
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setSaving(false)
    }
  }, [service])

  return {
    items, selected, isLoading, isSaving, error,
    page, pageSize, totalCount, totalPages,
    setPage, setSelected,
    fetchAll, fetchById, create, update, remove,
    clearError: () => setError(null),
  }
}
