import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function updateBugStatus(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().patch('/bugs/:id/status', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
            body: z.object({
                status: z.enum(['aberto', 'em_analise', 'corrigido', 'fechado']),
            }),
        },
    }, async (request: CRequest, reply) => {
        const { id } = request.params
        const { status } = request.body
        const userId = request.user.userId

        // RN08: apenas moderadores (administradores) ou desenvolvedor dono do projeto podem alterar status
        const bug = await prisma.feedbackBug.findUnique({
            where: { id },
            include: {
                testeSessao: {
                    include: {
                        versao: {
                            include: { projeto: { include: { desenvolvedor: true } } }
                        }
                    }
                }
            }
        })

        if (!bug) {
            return reply.status(404).send({ message: 'Bug não encontrado' })
        }

        if (!bug.testeSessao?.versao?.projeto?.desenvolvedor) {
            return reply.status(404).send({ message: 'Projeto ou desenvolvedor não encontrado' })
        }

        const isAdmin = await prisma.administrador.findUnique({ where: { usuarioId: userId } })
        const isOwnerDev = bug.testeSessao.versao.projeto.desenvolvedor.usuarioId === userId

        if (!isAdmin && !isOwnerDev) {
            return reply.status(403).send({
                message: 'Apenas moderadores ou o desenvolvedor do projeto podem alterar o status'
            })
        }

        const atualizado = await prisma.feedbackBug.update({
            where: { id },
            data: { status }
        })

        return reply.send({
            message: 'Status atualizado',
            bug: atualizado,
        })
    })
}
