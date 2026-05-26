import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function updateNotificacaoLida(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().patch('/notificacoes/:id/lida', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { id } = request.params
        const userId = request.user.userId

        const notificacao = await prisma.notificacao.findUnique({ where: { id } })

        if (!notificacao) {
            return reply.status(404).send({ message: 'Notificação não encontrada' })
        }

        if (notificacao.destinatarioId !== userId) {
            return reply.status(403).send({ message: 'Sem permissão para marcar esta notificação' })
        }

        const atualizada = await prisma.notificacao.update({
            where: { id },
            data: { status: 'lida' },
        })

        return reply.send({ message: 'Notificação marcada como lida', notificacao: atualizada })
    })
}
