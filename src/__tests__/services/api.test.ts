import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.hoisted: garante que essas variáveis existam antes do vi.mock('axios', ...)
// rodar (os mocks são içados para o topo do arquivo pelo Vitest).
const { mockAxiosInstance, requestHandlers, responseHandlers } = vi.hoisted(() => {
  const requestHandlers: { fulfilled: any; rejected: any }[] = []
  const responseHandlers: { fulfilled: any; rejected: any }[] = []
  const mockAxiosInstance = {
    interceptors: {
      request: { use: (f: any, r: any) => requestHandlers.push({ fulfilled: f, rejected: r }) },
      response: { use: (f: any, r: any) => responseHandlers.push({ fulfilled: f, rejected: r }) },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
  return { mockAxiosInstance, requestHandlers, responseHandlers }
})

vi.mock('axios', () => ({
  default: { create: () => mockAxiosInstance },
}))

vi.mock('../../utils/storage', () => ({
  storage: { getToken: vi.fn(), clearAuth: vi.fn() },
}))

vi.mock('../../utils/jwt', () => ({
  isTokenExpired: vi.fn(),
}))

import { storage } from '../../utils/storage'
import { isTokenExpired } from '../../utils/jwt'
import { get, post, put, patch, del } from '../../services/api'

function setLocationHref(href: string) {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href },
  })
}

describe('interceptor de requisição', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setLocationHref('')
  })

  it('anexa o header Authorization quando existe um token válido', () => {
    vi.mocked(storage.getToken).mockReturnValue('meu-token')
    vi.mocked(isTokenExpired).mockReturnValue(false)

    const config = { headers: {} } as any
    const result = requestHandlers[0].fulfilled(config)

    expect(result.headers.Authorization).toBe('Bearer meu-token')
  })

  it('não anexa Authorization quando não há token armazenado', () => {
    vi.mocked(storage.getToken).mockReturnValue(null)

    const config = { headers: {} } as any
    const result = requestHandlers[0].fulfilled(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('limpa a sessão e redireciona ao login quando o token está expirado', async () => {
    vi.mocked(storage.getToken).mockReturnValue('token-velho')
    vi.mocked(isTokenExpired).mockReturnValue(true)

    const config = { headers: {} } as any

    await expect(requestHandlers[0].fulfilled(config)).rejects.toThrow('Token expirado')
    expect(storage.clearAuth).toHaveBeenCalledTimes(1)
    expect(window.location.href).toBe('/login')
  })

  it('adiciona um header X-Correlation-ID em toda requisição', () => {
    vi.mocked(storage.getToken).mockReturnValue(null)

    const config = { headers: {} } as any
    const result = requestHandlers[0].fulfilled(config)

    expect(result.headers['X-Correlation-ID']).toBeTruthy()
  })
})

describe('interceptor de resposta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setLocationHref('')
  })

  it('limpa a sessão e redireciona ao login em erro 401', async () => {
    const error = { response: { status: 401 } }

    await expect(responseHandlers[0].rejected(error)).rejects.toEqual(error)
    expect(storage.clearAuth).toHaveBeenCalledTimes(1)
    expect(window.location.href).toBe('/login')
  })

  it('não limpa a sessão para erros diferentes de 401', async () => {
    const error = { response: { status: 500 } }

    await expect(responseHandlers[0].rejected(error)).rejects.toEqual(error)
    expect(storage.clearAuth).not.toHaveBeenCalled()
  })
})

describe('wrappers get/post/put/patch/del', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('get envia os params e retorna response.data', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: { ok: true } })

    const result = await get('/foo', { page: 1 })

    expect(result).toEqual({ ok: true })
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/foo', { params: { page: 1 } })
  })

  it('post envia o body e retorna response.data', async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: { id: '1' } })

    const result = await post('/foo', { name: 'teste' })

    expect(result).toEqual({ id: '1' })
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/foo', { name: 'teste' })
  })

  it('put envia o body e retorna response.data', async () => {
    mockAxiosInstance.put.mockResolvedValue({ data: { updated: true } })

    const result = await put('/foo/1', { name: 'novo' })

    expect(result).toEqual({ updated: true })
  })

  it('patch envia o body e retorna response.data', async () => {
    mockAxiosInstance.patch.mockResolvedValue({ data: { patched: true } })

    const result = await patch('/foo/1/activate', {})

    expect(result).toEqual({ patched: true })
  })

  it('del retorna response.data', async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: null })

    const result = await del('/foo/1')

    expect(result).toBeNull()
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/foo/1')
  })
})