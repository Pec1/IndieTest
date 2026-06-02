import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { CRequest } from "../middleware/authenticate";

export async function login(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/login', {
        schema: {
            body: z.object({
                email: z.string().email(),
                senha: z.string(),
            }),
            response: {
                200: z.object({
                    message: z.string(),
                    token: z.string(),
                    user: z.object({
                        id: z.string(),
                        nome: z.string(),
                        email: z.string(),
                        tipo: z.string(),
                    }),
                }),
                401: z.object({
                    message: z.string(),
                }),
            },
        },
    }, async (request: CRequest, reply) => {
        const { email, senha } = request.body

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            throw new Error('JWT secret is not defined')
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                testador: true,
                desenvolvedor: true,
                administrador: true,
            }
        })
        if (!usuario) {
            return reply.status(401).send({ message: 'E-mail ou senha inválidos' })
        }

        const isValidPassword = await bcrypt.compare(senha, usuario.senhaHash)
        if (!isValidPassword) {
            return reply.status(401).send({ message: 'E-mail ou senha inválidos' });
        }

        // Determina o tipo do usuário a partir das relações
        let tipo = 'usuario'
        if (usuario.administrador) tipo = 'administrador'
        else if (usuario.desenvolvedor) tipo = 'desenvolvedor'
        else if (usuario.testador) tipo = 'testador'

        const token = sign(
            { userId: usuario.id, tipo },
            jwtSecret,
            { expiresIn: '1d' }
        );

        const isProduction = process.env.NODE_ENV === 'production';
        reply.setCookie('accessToken', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: isProduction,
        });

        return reply.status(200).send({
            message: 'Login bem-sucedido',
            token,
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo,
            }
        });
    });
}
