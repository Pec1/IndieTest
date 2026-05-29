import { expect, it, describe } from 'vitest'
import request from 'supertest'
const app = "http://localhost:3333"

describe('Gestão de Bugs (RN07, RN08)', () => {
  const mockToken = 'seu-token-de-teste' // Simulação de token de desenvolvedor

  it('deve criar um bug com sucesso (RN02)', async () => {
    const response = await request(app)
      .post('/bugs')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        testeSessaoId: 'uuid-sessao-ativa',
        titulo: 'Erro de colisão no nível 1',
        descricao: 'O player atravessa a parede ao pular',
        tipo: 'Bug',
        severidade: 'Alta'
      })

    expect(response.status).toBe(201)
  })

  it('não deve permitir bugs duplicados na mesma sessão (RN07)', async () => {
    // Tentando enviar o mesmo título para a mesma sessão
    const response = await request(app)
      .post('/bugs')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        testeSessaoId: 'uuid-sessao-ativa',
        titulo: 'Erro de colisão no nível 1',
        descricao: 'Descrição diferente',
        tipo: 'Bug',
        severidade: 'Media'
      })

    expect(response.status).toBe(409)
    expect(response.body.message).toContain('já existe')
  })

  it('deve barrar alteração de status por usuários não autorizados (RN08)', async () => {
    const tokenTestador = 'token-de-um-testador'
    const response = await request(app)
      .patch('/bugs/id-do-bug/status')
      .set('Authorization', `Bearer ${tokenTestador}`)
      .send({ status: 'corrigido' })

    expect(response.status).toBe(403)
    expect(response.body.message).toContain('permissão')
  })
})