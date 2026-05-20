import { FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';

export interface CRequest extends FastifyRequest {
    user?: any;
    // Permite acesso direto a body/params/query — a validação é feita pelo Zod no schema
    body: any;
    params: any;
    query: any;
}

export async function authMiddleware(request: CRequest, reply: FastifyReply) {

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
        throw new Error('JWT secret is not defined')
    }

    // Aceita token via cookie (accessToken) ou Authorization header (Bearer)
    let token = request.cookies['accessToken'];
    if (!token) {
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    if (!token) {
        return reply.status(401).send({ message: 'Não autenticado' });
    }

    if (token.split('.').length !== 3) {
        return reply.status(401).send({ message: 'Token inválido' });
    }

    try {
        const decodedToken = verify(token, jwtSecret);
        request.user = decodedToken;
        return;
    } catch {
        return reply.status(401).send({ message: 'Token inválido ou expirado' });
    }
}
