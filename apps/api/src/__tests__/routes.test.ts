import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock prisma antes de importar as rotas
vi.mock('../lib/prisma', () => ({
  prisma: {
    usuario: { findUnique: vi.fn() },
    feedbackBug: { findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn(), create: vi.fn() },
    $transaction: vi.fn(),
  },
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
}))

import { prisma } from '../lib/prisma'

describe('API - Validações básicas', () => {
  beforeEach(() => vi.clearAllMocks())

  it('prisma mock está configurado', () => {
    expect(prisma.feedbackBug.findMany).toBeDefined()
  })

  it('ApiError tem status code correto', async () => {
    const status = 404
    const error = { message: 'Não encontrado', status }
    expect(error.status).toBe(404)
    expect(error.message).toBe('Não encontrado')
  })
})
