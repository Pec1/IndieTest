import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function createProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/projetos', {
        preHandler: authMiddleware,
        schema: {
            body: z.object({
                nome: z.string().min(2),
                descricao: z.string().min(10),
                categoria: z.string(),
                status: z.string().default('em_teste'),
            }),
            response: {
                201: z.object({
                    message: z.string(),
                    projeto: z.object({
                        id: z.string().uuid(),
                        nome: z.string(),
                        status: z.string(),
                    }),
                }),
                403: z.object({ message: z.string() }),
            }
        },
    }, async (request: CRequest, reply) => {
        const { nome, descricao, categoria, status } = request.body
        const userId = request.user.userId

        // Apenas desenvolvedores podem criar projetos (RN01)
        const perfil = await prisma.perfilDesenvolvedor.findUnique({
            where: { usuarioId: userId }
        })

        if (!perfil) {
            return reply.status(403).send({
                message: 'Apenas desenvolvedores podem criar projetos'
            })
        }

        const projeto = await prisma.projeto.create({
            data: {
                nome,
                descricao,
                categoria,
                status,
                perfilDevId: perfil.id,
            }
        })

        return reply.status(201).send({
            message: 'Projeto criado com sucesso',
            projeto: {
                id: projeto.id,
                nome: projeto.nome,
                status: projeto.status,
            }
        })
    })
}
