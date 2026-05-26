import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function createVersion(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/projetos/:id/versoes', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
            body: z.object({
                numeroVersao: z.string().min(1),
                changelog: z.string(),
                status: z.string().default('ativa'),
            }),
        },
    }, async (request: CRequest, reply) => {
        const { id: projetoId } = request.params
        const { numeroVersao, changelog, status } = request.body
        const userId = request.user.userId

        // Verifica se o projeto existe e pertence ao desenvolvedor logado
        const projeto = await prisma.projeto.findUnique({
            where: { id: projetoId },
            include: { desenvolvedor: true }
        })

        if (!projeto) {
            return reply.status(404).send({ message: 'Projeto não encontrado' })
        }

        if (projeto.desenvolvedor.usuarioId !== userId) {
            return reply.status(403).send({
                message: 'Apenas o desenvolvedor dono do projeto pode adicionar versões'
            })
        }

        const versao = await prisma.versao.create({
            data: {
                numeroVersao,
                changelog,
                status,
                projetoId,
            }
        })

        return reply.status(201).send({
            message: 'Versão criada com sucesso',
            versao,
        })
    })
}
