import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getAllUsers(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/users', {
        preHandler: authMiddleware,
        schema: {
            querystring: z.object({
                page: z.coerce.number().int().min(1).default(1),
                limit: z.coerce.number().int().min(1).max(100).default(20),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { page, limit } = request.query

        const [usuarios, total] = await prisma.$transaction([
            prisma.usuario.findMany({
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    dataCadastro: true,
                    testador: { select: { id: true } },
                    desenvolvedor: { select: { id: true, nomeEstudio: true } },
                    administrador: { select: { id: true } },
                },
                orderBy: { dataCadastro: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.usuario.count(),
        ])

        const result = usuarios.map((u) => {
            let tipo = 'usuario'
            if (u.administrador) tipo = 'administrador'
            else if (u.desenvolvedor) tipo = 'desenvolvedor'
            else if (u.testador) tipo = 'testador'
            return { ...u, tipo }
        })

        return reply.send({
            users: result,
            paginacao: { total, pagina: page, limite: limit, paginas: Math.ceil(total / limit) },
        })
    })
}
