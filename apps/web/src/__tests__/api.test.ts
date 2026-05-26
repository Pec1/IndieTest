import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiError } from '../api/client'

// Mock global fetch
const mockFetch = vi.fn()
globalThis.fetch = mockFetch as typeof globalThis.fetch

describe('ApiError', () => {
  it('deve ser instância de Error', () => {
    const err = new ApiError('não autenticado', 401)
    expect(err).toBeInstanceOf(Error)
    expect(err.status).toBe(401)
    expect(err.message).toBe('não autenticado')
    expect(err.name).toBe('ApiError')
  })
})

describe('api client - getBugs', () => {
  beforeEach(() => mockFetch.mockReset())

  it('faz GET /bugs com credentials include', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: [], paginacao: { total: 0, pagina: 1, limite: 20, paginas: 0 } }),
    })
    const { getBugs } = await import('../api/bugs')
    const result = await getBugs()
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/bugs'),
      expect.objectContaining({ credentials: 'include' })
    )
    expect(result.bugs).toEqual([])
  })

  it('lança ApiError quando resposta não é ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Não autenticado' }),
    })
    const { getBugs } = await import('../api/bugs')
    await expect(getBugs()).rejects.toBeInstanceOf(ApiError)
  })
})
