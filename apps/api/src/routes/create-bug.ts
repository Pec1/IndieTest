import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function createBug(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/bugs', {
        preHandler: authMiddleware,
        schema: {
            body: z.object({
                testeSessaoId: z.string().uuid(),
                titulo: z.string().min(3),
                descricao: z.string().min(10),
                tipo: z.enum(['Bug', 'Melhoria', 'Outro']),
                severidade: z.enum(['Baixa', 'Media', 'Alta', 'Critica']),
            }),
        },
    }, async (request: CRequest, reply) => {
        const { testeSessaoId, titulo, descricao, tipo, severidade } = request.body
        const userId = request.user.userId

        // Verifica que a sessão pertence ao testador logado
        const sessao = await prisma.testeSessao.findUnique({
            where: { id: testeSessaoId },
            include: { testador: true }
        })

        if (!sessao) {
            return reply.status(404).send({ message: 'Sessão de teste não encontrada' })
        }

        if (sessao.testador.usuarioId !== userId) {
            return reply.status(403).send({
                message: 'Você só pode reportar bugs em suas próprias sessões'
            })
        }

        // Verifica duplicação por título (RN07)
        const duplicado = await prisma.feedbackBug.findFirst({
            where: {
                testeSessaoId,
                titulo,
            }
        })
        if (duplicado) {
            return reply.status(409).send({
                message: 'Já existe um relatório com este título nesta sessão'
            })
        }

        const bug = await prisma.feedbackBug.create({
            data: {
                titulo,
                descricao,
                tipo,
                severidade,
                status: 'aberto',
                testeSessaoId,
            }
        })

        // Notifica o desenvolvedor do projeto sobre o novo bug
        const sessaoComProjeto = await prisma.testeSessao.findUnique({
            where: { id: testeSessaoId },
            include: {
                versao: {
                    include: {
                        projeto: {
                            include: { desenvolvedor: { select: { usuarioId: true, nomeEstudio: true } } }
                        }
                    }
                }
            }
        })
        if (sessaoComProjeto?.versao?.projeto?.desenvolvedor) {
            const { usuarioId } = sessaoComProjeto.versao.projeto.desenvolvedor
            const nomeProjeto = sessaoComProjeto.versao.projeto.nome
            await prisma.notificacao.create({
                data: {
                    destinatarioId: usuarioId,
                    tipo: 'bug',
                    mensagem: `Novo bug "${titulo}" [${severidade}] reportado no projeto "${nomeProjeto}"`,
                    status: 'pendente',
                },
            })
        }

        return reply.status(201).send({
            message: 'Bug/feedback registrado com sucesso',
            bug,
        })
    })
}
