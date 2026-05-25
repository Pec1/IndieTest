import { FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';

export interface JwtPayload {
    userId: string;
    tipo: string;
    iat: number;
    exp: number;
}

// Torna user disponível em FastifyRequest para que preHandler e handlers sejam compatíveis
declare module 'fastify' {
    interface FastifyRequest {
        user: JwtPayload;
    }
}

// CRequest mantido como alias para uso nos handlers de rota
export interface CRequest extends FastifyRequest {
    body: any;
    params: any;
    query: any;
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
        throw new Error('JWT secret é obrigatório')
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
        const decodedToken = verify(token, jwtSecret) as JwtPayload;
        request.user = decodedToken;
        return;
    } catch {
        return reply.status(401).send({ message: 'Token inválido ou expirado' });
    }
}
