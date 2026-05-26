import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import bcrypt from "bcryptjs"
import { CRequest } from "../middleware/authenticate"

export async function createUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
        schema: {
            body: z.object({
                nome: z.string().min(2),
                email: z.string().email(),
                senha: z.string().min(6),
                tipo: z.enum(['testador', 'desenvolvedor', 'administrador']),
                // Campos opcionais para desenvolvedor
                nomeEstudio: z.string().optional(),
                // Campos opcionais para testador
                dataNascimento: z.string().datetime().optional(),
                pais: z.string().optional(),
                // Campo para administrador
                nivelAcesso: z.string().optional(),
            }),
            response: {
                201: z.object({
                    message: z.string(),
                    userId: z.string().uuid(),
                    tipo: z.string(),
                }),
                409: z.object({
                    message: z.string(),
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        },
    }, async (request: CRequest, reply) => {
        const {
            nome, email, senha, tipo,
            nomeEstudio, dataNascimento, pais, nivelAcesso
        } = request.body

        const normalizedEmail = email.toLowerCase()

        // Verifica se o e-mail já existe
        const existingUser = await prisma.usuario.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            return reply.status(409).send({ message: 'Usuário com este e-mail já existe' });
        }

        // Validação de campos obrigatórios por tipo
        if (tipo === 'desenvolvedor' && !nomeEstudio) {
            return reply.status(400).send({ message: 'Desenvolvedor precisa informar nomeEstudio' });
        }
        if (tipo === 'administrador' && !nivelAcesso) {
            return reply.status(400).send({ message: 'Administrador precisa informar nivelAcesso' });
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        // Cria Usuario + papel em uma transação
        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email: normalizedEmail,
                senhaHash,
                ...(tipo === 'testador' && {
                    testador: {
                        create: {
                            dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
                            pais: pais ?? null,
                        }
                    }
                }),
                ...(tipo === 'desenvolvedor' && {
                    desenvolvedor: {
                        create: {
                            nomeEstudio: nomeEstudio!,
                        }
                    }
                }),
                ...(tipo === 'administrador' && {
                    administrador: {
                        create: {
                            nivelAcesso: nivelAcesso!,
                        }
                    }
                }),
            }
        })

        return reply.status(201).send({
            message: 'Usuário criado com sucesso',
            userId: usuario.id,
            tipo,
        })
    })
}
