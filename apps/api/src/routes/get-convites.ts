import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getConvites(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/convites', {
        preHandler: authMiddleware,
        schema: {
            querystring: z.object({
                status: z.enum(['pendente', 'aceito', 'recusado']).optional(),
            }),
        }
    }, async (request: CRequest, reply) => {
        const { status } = request.query
        const userId = request.user.userId

        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
            select: { email: true },
        })

        if (!usuario) {
            return reply.status(404).send({ message: 'Usuário não encontrado' })
        }

        const convites = await prisma.convite.findMany({
            where: {
                emailConvidado: usuario.email,
                ...(status && { statusConvite: status }),
            },
            include: {
                projeto: {
                    select: {
                        id: true,
                        nome: true,
                        categoria: true,
                        desenvolvedor: {
                            select: { nomeEstudio: true }
                        },
                    }
                }
            },
            orderBy: { dataEnvio: 'desc' },
        })

        return reply.send({ convites })
    })
}
