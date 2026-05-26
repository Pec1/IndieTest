import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getNotificacoes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/notificacoes', {
        preHandler: authMiddleware,
        schema: {
            querystring: z.object({
                status: z.enum(['pendente', 'lida']).optional(),
                page: z.coerce.number().int().min(1).default(1),
                limit: z.coerce.number().int().min(1).max(100).default(30),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { status, page, limit } = request.query
        const userId = request.user.userId

        const where = {
            destinatarioId: userId,
            ...(status && { status }),
        }

        const [notificacoes, total] = await prisma.$transaction([
            prisma.notificacao.findMany({
                where,
                orderBy: { dataCriacao: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.notificacao.count({ where }),
        ])

        return reply.send({
            notificacoes,
            paginacao: { total, pagina: page, limite: limit, paginas: Math.ceil(total / limit) },
        })
    })
}
