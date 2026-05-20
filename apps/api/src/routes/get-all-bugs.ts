import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../authMiddleware/authenticate"

export async function getAllBugs(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/bugs', {
        preHandler: authMiddleware,
        schema: {
            querystring: z.object({
                projetoId: z.string().uuid().optional(),
                status: z.string().optional(),
                severidade: z.string().optional(),
                tipo: z.string().optional(),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { projetoId, status, severidade, tipo } = request.query

        const bugs = await prisma.feedbackBug.findMany({
            where: {
                ...(status && { status }),
                ...(severidade && { severidade }),
                ...(tipo && { tipo }),
                ...(projetoId && {
                    testeSessao: {
                        versao: { projetoId }
                    }
                }),
            },
            include: {
                testeSessao: {
                    include: {
                        testador: {
                            include: { usuario: { select: { nome: true } } }
                        },
                        versao: {
                            select: {
                                numeroVersao: true,
                                projeto: { select: { id: true, nome: true } }
                            }
                        }
                    }
                },
                _count: {
                    select: { anexos: true, respostas: true }
                }
            },
            orderBy: { dataCriacao: 'desc' }
        })

        return reply.send({ bugs })
    })
}
