import { expect, it, describe } from 'vitest'
import request from 'supertest'
// Nota: Importe a instância do seu app (app ou server) aqui
const app = "http://localhost:3333" 

describe('Fluxo de Autenticação (RN_AUTH)', () => {
  it('deve retornar 200 e um token ao logar com credenciais válidas', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'testador@indietest.com',
        senha: 'senha-valida'
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it('deve retornar 401 para credenciais inválidas', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'email-inexistente@test.com',
        senha: 'qualquer-senha'
      })

    expect(response.status).toBe(401)
    
    // Correção A1 da Auditoria: Mensagens genéricas para evitar enumeração de usuários
    const responseWrongPass = await request(app)
      .post('/login')
      .send({
        email: 'testador@indietest.com',
        senha: 'senha-errada'
      })
    expect(response.body.message).toBe(responseWrongPass.body.message)
  })
})