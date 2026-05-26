import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"
import crypto from "node:crypto"

export async function createConvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/convites', {
        preHandler: authMiddleware,
        schema: {
            body: z.object({
                projetoId: z.string().uuid(),
                emailConvidado: z.string().email(),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { projetoId, emailConvidado } = request.body
        const userId = request.user.userId

        const dev = await prisma.perfilDesenvolvedor.findUnique({
            where: { usuarioId: userId },
        })

        if (!dev) {
            return reply.status(403).send({ message: 'Apenas desenvolvedores podem enviar convites' })
        }

        const projeto = await prisma.projeto.findUnique({
            where: { id: projetoId },
            select: { id: true, nome: true, perfilDevId: true },
        })

        if (!projeto) {
            return reply.status(404).send({ message: 'Projeto não encontrado' })
        }

        if (projeto.perfilDevId !== dev.id) {
            return reply.status(403).send({ message: 'Você não tem permissão para convidar testadores neste projeto' })
        }

        const conviteExistente = await prisma.convite.findFirst({
            where: { projetoId, emailConvidado, statusConvite: 'pendente' },
        })

        if (conviteExistente) {
            return reply.status(409).send({ message: `Já existe um convite pendente para ${emailConvidado} neste projeto` })
        }

        const convite = await prisma.convite.create({
            data: {
                projetoId,
                emailConvidado,
                tokenConvite: crypto.randomUUID(),
                statusConvite: 'pendente',
            },
        })

        // Cria notificação se o convidado já tem conta no sistema
        const usuarioConvidado = await prisma.usuario.findUnique({
            where: { email: emailConvidado },
            select: { id: true },
        })

        if (usuarioConvidado) {
            await prisma.notificacao.create({
                data: {
                    destinatarioId: usuarioConvidado.id,
                    tipo: 'convite',
                    mensagem: `Você foi convidado para testar o projeto "${projeto.nome}". Acesse a Central de Convites para aceitar ou recusar.`,
                    status: 'pendente',
                },
            })
        }

        return reply.status(201).send({ message: 'Convite enviado com sucesso', convite })
    })
}
