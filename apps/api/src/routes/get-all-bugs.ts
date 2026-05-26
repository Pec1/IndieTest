import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getAllBugs(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/bugs', {
        preHandler: authMiddleware,
        schema: {
            querystring: z.object({
                projetoId: z.string().uuid().optional(),
                status: z.string().optional(),
                severidade: z.string().optional(),
                tipo: z.string().optional(),
                page: z.coerce.number().int().min(1).default(1),
                limit: z.coerce.number().int().min(1).max(100).default(20),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { projetoId, status, severidade, tipo, page, limit } = request.query

        const where = {
            ...(status && { status }),
            ...(severidade && { severidade }),
            ...(tipo && { tipo }),
            ...(projetoId && {
                testeSessao: {
                    versao: { projetoId }
                }
            }),
        }

        const [bugs, total] = await prisma.$transaction([
            prisma.feedbackBug.findMany({
                where,
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
                orderBy: { dataCriacao: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.feedbackBug.count({ where }),
        ])

        return reply.send({
            bugs,
            paginacao: { total, pagina: page, limite: limit, paginas: Math.ceil(total / limit) },
        })
    })
}
