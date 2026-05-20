import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../lib/prisma"

export async function getAllUsers(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/users', async (request, reply) => {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                dataCadastro: true,
                testador: { select: { id: true } },
                desenvolvedor: { select: { id: true, nomeEstudio: true } },
                administrador: { select: { id: true } },
            },
            orderBy: { dataCadastro: 'desc' }
        })

        const result = usuarios.map((u: any) => {
            let tipo = 'usuario'
            if (u.administrador) tipo = 'administrador'
            else if (u.desenvolvedor) tipo = 'desenvolvedor'
            else if (u.testador) tipo = 'testador'
            return { ...u, tipo }
        })

        return reply.send({ users: result })
    })
}
