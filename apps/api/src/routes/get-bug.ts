import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getBug(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/bugs/:id', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { id } = request.params

        const bug = await prisma.feedbackBug.findUnique({
            where: { id },
            include: {
                testeSessao: {
                    include: {
                        testador: {
                            include: { usuario: { select: { nome: true, email: true } } }
                        },
                        versao: {
                            include: { projeto: true }
                        }
                    }
                },
                anexos: true,
                respostas: {
                    include: {
                        desenvolvedor: {
                            include: { usuario: { select: { nome: true } } }
                        }
                    },
                    orderBy: { dataResposta: 'asc' }
                },
            }
        })

        if (bug === null) {
            return reply.status(404).send({ message: 'Bug não encontrado' })
        }

        return reply.send({ bug })
    })
}
