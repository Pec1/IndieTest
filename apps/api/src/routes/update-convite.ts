import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

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

        let testadorId: string | undefined
        if (acao === 'aceitar') {
            const testador = await prisma.testador.findUnique({ where: { usuarioId: userId } })
            if (!testador) {
                return reply.status(403).send({ message: 'Apenas testadores podem aceitar convites' })
            }
            testadorId = testador.id
        }

        const atualizado = await prisma.convite.update({
            where: { id },
            data: {
                statusConvite: novoStatus,
                ...(testadorId && { testadorId }),
            },
        })

        // Notifica o desenvolvedor sobre a resposta ao convite
        const conviteComProjeto = await prisma.convite.findUnique({
            where: { id },
            include: {
                projeto: {
                    include: { desenvolvedor: { select: { usuarioId: true } } }
                }
            }
        })
        if (conviteComProjeto?.projeto?.desenvolvedor) {
            const acaoLabel = acao === 'aceitar' ? 'aceitou' : 'recusou'
            await prisma.notificacao.create({
                data: {
                    destinatarioId: conviteComProjeto.projeto.desenvolvedor.usuarioId,
                    tipo: 'convite',
                    mensagem: `${usuario.email} ${acaoLabel} o convite para o projeto "${conviteComProjeto.projeto.nome}"`,
                    status: 'pendente',
                },
            })
        }

        return reply.send({
            message: acao === 'aceitar' ? 'Convite aceito com sucesso' : 'Convite recusado',
            convite: atualizado,
        })
    })
}
