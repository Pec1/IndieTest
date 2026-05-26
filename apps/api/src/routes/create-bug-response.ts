import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function createBugResponse(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/bugs/:id/respostas', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
            body: z.object({
                mensagem: z.string().min(1),
                visivelTestador: z.boolean().default(true),
            }),
        },
    }, async (request: CRequest, reply) => {
        const { id: feedbackBugId } = request.params
        const { mensagem, visivelTestador } = request.body
        const userId = request.user.userId

        const perfilDev = await prisma.perfilDesenvolvedor.findUnique({
            where: { usuarioId: userId }
        })

        if (!perfilDev) {
            return reply.status(403).send({
                message: 'Apenas desenvolvedores podem responder bugs'
            })
        }

        const bug = await prisma.feedbackBug.findUnique({ where: { id: feedbackBugId } })
        if (!bug) {
            return reply.status(404).send({ message: 'Bug não encontrado' })
        }

        const resposta = await prisma.respostaDesenvolvedor.create({
            data: {
                feedbackBugId,
                perfilDevId: perfilDev.id,
                mensagem,
                visivelTestador,
            }
        })

        // Notifica o testador que o bug recebeu uma resposta
        const bugComSessao = await prisma.feedbackBug.findUnique({
            where: { id: feedbackBugId },
            include: {
                testeSessao: {
                    include: { testador: { select: { usuarioId: true } } }
                }
            }
        })
        if (bugComSessao?.testeSessao?.testador) {
            await prisma.notificacao.create({
                data: {
                    destinatarioId: bugComSessao.testeSessao.testador.usuarioId,
                    tipo: 'resposta',
                    mensagem: `Seu bug "${bugComSessao.titulo}" recebeu uma resposta do desenvolvedor`,
                    status: 'pendente',
                },
            })
        }

        return reply.status(201).send({
            message: 'Resposta registrada',
            resposta,
        })
    })
}
