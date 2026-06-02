import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function createTestSession(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/teste-sessoes', {
        preHandler: authMiddleware,
        schema: {
            body: z.object({
                versaoId: z.string().uuid(),
                dispositivo: z.string(),
                sistemaOperacional: z.string(),
            }),
        },
    }, async (request: CRequest, reply) => {
        const { versaoId, dispositivo, sistemaOperacional } = request.body
        const userId = request.user.userId

        const testador = await prisma.testador.findUnique({ where: { usuarioId: userId } })
        if (!testador) {
            return reply.status(403).send({ message: 'Apenas testadores podem iniciar sessões' })
        }

        const versao = await prisma.versao.findUnique({ where: { id: versaoId } })
        if (!versao) {
            return reply.status(404).send({ message: 'Versão não encontrada' })
        }

        const conviteAceito = await prisma.convite.findFirst({
            where: {
                testadorId: testador.id,
                projetoId: versao.projetoId,
                statusConvite: 'aceito',
            },
        })
        if (!conviteAceito) {
            return reply.status(403).send({ message: 'Você não tem um convite aceito para testar este projeto' })
        }

        const sessao = await prisma.testeSessao.create({
            data: {
                versaoId,
                testadorId: testador.id,
                dispositivo,
                sistemaOperacional,
                status: 'em_andamento',
            }
        })

        return reply.status(201).send({
            message: 'Sessão de teste iniciada',
            sessao,
        })
    })
}
