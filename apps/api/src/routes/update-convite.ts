import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../authMiddleware/authenticate"

export async function updateConvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().patch('/convites/:id', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
            body: z.object({
                acao: z.enum(['aceitar', 'recusar']),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { id } = request.params
        const { acao } = request.body
        const userId = request.user.userId

        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
            select: { email: true },
        })

        if (!usuario) {
            return reply.status(404).send({ message: 'Usuário não encontrado' })
        }

        const convite = await prisma.convite.findUnique({ where: { id } })

        if (!convite) {
            return reply.status(404).send({ message: 'Convite não encontrado' })
        }

        if (convite.emailConvidado !== usuario.email) {
            return reply.status(403).send({ message: 'Este convite não é para você' })
        }

        if (convite.statusConvite !== 'pendente') {
            return reply.status(409).send({ message: 'Convite já foi respondido anteriormente' })
        }

        const novoStatus = acao === 'aceitar' ? 'aceito' : 'recusado'

        // Ao aceitar, vincula o testador ao convite (se o usuário for testador)
        let testadorId: string | undefined
        if (acao === 'aceitar') {
            const testador = await prisma.testador.findUnique({ where: { usuarioId: userId } })
            if (testador) testadorId = testador.id
        }

        const atualizado = await prisma.convite.update({
            where: { id },
            data: {
                statusConvite: novoStatus,
                ...(testadorId && { testadorId }),
            },
        })

        return reply.send({
            message: acao === 'aceitar' ? 'Convite aceito com sucesso' : 'Convite recusado',
            convite: atualizado,
        })
    })
}
