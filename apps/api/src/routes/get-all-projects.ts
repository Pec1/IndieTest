import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../authMiddleware/authenticate"

export async function getAllProjects(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/projetos', {
        preHandler: authMiddleware,
        schema: {
            querystring: z.object({
                status: z.string().optional(),
                categoria: z.string().optional(),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { status, categoria } = request.query

        const projetos = await prisma.projeto.findMany({
            where: {
                ...(status && { status }),
                ...(categoria && { categoria }),
            },
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
            orderBy: { dataCriacao: 'desc' }
        })

        return reply.send({ projetos })
    })
}
