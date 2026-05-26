import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/users/:id', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { id } = request.params

        const usuario = await prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                nome: true,
                email: true,
                dataCadastro: true,
                testador: {
                    select: {
                        id: true,
                        pais: true,
                        dataNascimento: true,
                    }
                },
                desenvolvedor: {
                    select: {
                        id: true,
                        nomeEstudio: true,
                        descricao: true,
                        website: true,
                    }
                },
                administrador: {
                    select: {
                        id: true,
                        nivelAcesso: true,
                    }
                },
            }
        })

        if (usuario === null) {
            return reply.status(404).send({ message: 'Usuário não encontrado' })
        }

        let tipo = 'usuario'
        if (usuario.administrador) tipo = 'administrador'
        else if (usuario.desenvolvedor) tipo = 'desenvolvedor'
        else if (usuario.testador) tipo = 'testador'

        return reply.send({ user: { ...usuario, tipo } })
    })
}
