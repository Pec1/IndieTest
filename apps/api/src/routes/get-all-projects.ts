import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getAllProjects(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/projetos', {
        preHandler: authMiddleware,
        schema: {
            querystring: z.object({
                status: z.string().optional(),
                categoria: z.string().optional(),
                page: z.coerce.number().int().min(1).default(1),
                limit: z.coerce.number().int().min(1).max(100).default(20),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { status, categoria, page, limit } = request.query

        const where = {
            ...(status && { status }),
            ...(categoria && { categoria }),
        }

        const [projetos, total] = await prisma.$transaction([
            prisma.projeto.findMany({
                where,
                include: {
                    desenvolvedor: {
                        select: {
                            nomeEstudio: true,
                            usuario: { select: { nome: true } }
                        }
                    },
                    _count: {
                        select: {
                            versoes: true,
                            convites: true,
                        }
                    }
                },
                orderBy: { dataCriacao: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.projeto.count({ where }),
        ])

        return reply.send({
            projetos,
            paginacao: { total, pagina: page, limite: limit, paginas: Math.ceil(total / limit) },
        })
    })
}
