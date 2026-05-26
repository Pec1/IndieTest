import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/projetos/:id', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { id } = request.params

        const projeto = await prisma.projeto.findUnique({
            where: { id },
            include: {
                desenvolvedor: {
                    include: { usuario: { select: { nome: true, email: true } } }
                },
                versoes: {
                    orderBy: { dataPublicacao: 'desc' }
                },
                convites: {
                    select: {
                        id: true,
                        emailConvidado: true,
                        statusConvite: true,
                        dataEnvio: true,
                    }
                },
            }
        })

        if (projeto === null) {
            return reply.status(404).send({ message: 'Projeto não encontrado' })
        }

        return reply.send({ projeto })
    })
}
