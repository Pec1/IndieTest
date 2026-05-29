import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import bcrypt from "bcryptjs"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function updateUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().patch('/users/:id', {
        preHandler: authMiddleware,
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
            body: z.object({
                nome: z.string().min(2).optional(),
                senha: z.string().min(6).optional(), // Esta é a nova senha
                currentPassword: z.string().optional(), // Adicionado currentPassword para validação
            }),
            response: {
                200: z.object({
                    message: z.string(),
                }),
                400: z.object({ // Adicionado 400 para senha atual inválida ou ausente
                    message: z.string(),
                }),
                403: z.object({
                    message: z.string(),
                }),
                404: z.object({
                    message: z.string(),
                }),
            }
        },
    }, async (request: CRequest, reply) => {
        const { id: targetId } = request.params
        const { nome, senha, currentPassword } = request.body // Desestruturado currentPassword
        const authenticatedUserId = request.user.userId

        // RN: Apenas o próprio usuário ou um administrador pode atualizar os dados
        if (authenticatedUserId !== targetId && request.user.tipo !== 'administrador') {
            return reply.status(403).send({ message: 'Acesso negado: você não tem permissão para atualizar este perfil.' })
        }

        let senhaHash: string | undefined

        if (senha) { // Se uma nova senha for fornecida, validar currentPassword
            if (!currentPassword) {
                return reply.status(400).send({ message: 'A senha atual é obrigatória para alterar a senha.' })
            }

            const userToUpdate = await prisma.usuario.findUnique({
                where: { id: targetId }
            })

            if (!userToUpdate || !userToUpdate.senhaHash) {
                return reply.status(404).send({ message: 'Usuário não encontrado ou sem senha definida.' })
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, userToUpdate.senhaHash)
            if (!isPasswordValid) {
                return reply.status(400).send({ message: 'A senha atual está incorreta.' })
            }

            senhaHash = await bcrypt.hash(senha, 10)
        }

        try {
            await prisma.usuario.update({
                where: { id: targetId },
                data: { nome, senhaHash } // Usa o novo senhaHash se gerado, caso contrário é undefined
            })
            return reply.status(200).send({ message: 'Perfil atualizado com sucesso' })
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to update not found')) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }
            console.error(error); // Loga outros erros
            return reply.status(500).send({ message: 'Erro interno do servidor ao atualizar perfil.' });
        }
    })
}