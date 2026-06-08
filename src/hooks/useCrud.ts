import { useState, useCallback, useRef } from 'react'
import { getErrorMessage } from '../utils/errorHandler'
import type { PagedResult } from '../types/pagination.types'
import { DEFAULT_PAGE_SIZE } from '../types/pagination.types'

interface CrudService<T, CreateDto, UpdateDto> {
  getAll:  (params?: Record<string, unknown>) => Promise<PagedResult<T>>
  getById: (id: string) => Promise<T>
  create:  (data: CreateDto) => Promise<T>
  update:  (id: string, data: UpdateDto) => Promise<T>
  delete:  (id: string) => Promise<void>
}

export function useCrud<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  service: CrudService<T, CreateDto, UpdateDto>,
) {
  const serviceRef = useRef(service)
  serviceRef.current = service

  const [items, setItems]           = useState<T[]>([])
  const [selected, setSelected]     = useState<T | null>(null)
  const [isLoading, setLoading]     = useState(false)
  const [isSaving, setSaving]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [page, setPage]             = useState(1)
  const [pageSize]                  = useState(DEFAULT_PAGE_SIZE)
  const [totalCount, setTotal]      = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // CORRIGIDO: retorno tipado explicitamente como PagedResult<T> | undefined
  const fetchAll = useCallback(async (
    params?: Record<string, unknown>,
  ): Promise<PagedResult<T> | undefined> => {
    setLoading(true)
    setError(null)
    try {
      const result = await serviceRef.current.getAll({ pageNumber: page, pageSize, ...params })
      setItems(result.items)
      setTotal(result.totalCount)
      setTotalPages(result.totalPages)
      return result
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize]) // 'service' removido — serviceRef garante acesso sempre atualizado

  // CORRIGIDO: retorno tipado explicitamente como T | undefined
  const fetchById = useCallback(async (id: string): Promise<T | undefined> => {
    setLoading(true)
    setError(null)
    try {
      const item = await serviceRef.current.getById(id)
      setSelected(item)
      return item
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(async (data: CreateDto) => {
    setSaving(true)
    setError(null)
    try {
      const item = await serviceRef.current.create(data)
      setItems((prev) => [item, ...prev])
      setTotal((n) => n + 1)
      return item
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const update = useCallback(async (id: string, data: UpdateDto) => {
    setSaving(true)
    setError(null)
    try {
      const item = await serviceRef.current.update(id, data)
      setItems((prev) => prev.map((i) => ((i as { id: string }).id === id ? item : i)))
      if ((selected as { id: string } | null)?.id === id) setSelected(item)
      return item
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setSaving(false)
    }
  }, [selected])

  const remove = useCallback(async (id: string) => {
    setSaving(true)
    setError(null)
    try {
      await serviceRef.current.delete(id)
      setItems((prev) => prev.filter((i) => (i as { id: string }).id !== id))
      setTotal((n) => n - 1)
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  return {
    items, selected, isLoading, isSaving, error,
    page, pageSize, totalCount, totalPages,
    setPage, setSelected,
    fetchAll, fetchById, create, update, remove,
    clearError: () => setError(null),
  }
}
