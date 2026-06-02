import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { fastify } from "fastify";
import fastifyCookie = require('@fastify/cookie');
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart';
import path from 'node:path';

// Rotas de Usuario / Autenticação
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { getUser } from "./routes/get-user";
import { getAllUsers } from "./routes/get-all-users";

// Rotas de Projeto
import { createProject } from "./routes/create-project";
import { getAllProjects } from "./routes/get-all-projects";
import { getProject } from "./routes/get-project";

// Rotas de Versão
import { createVersion } from "./routes/create-version";

// Rotas de TesteSessao
import { createTestSession } from "./routes/create-test-session";

// Rotas de Bug / Feedback
import { createBug } from "./routes/create-bug";
import { getAllBugs } from "./routes/get-all-bugs";
import { getBug } from "./routes/get-bug";
import { updateBugStatus } from "./routes/update-bug-status";
import { createBugResponse } from "./routes/create-bug-response";

// Rotas de Notificações
import { getNotificacoes } from "./routes/get-notificacoes";
import { updateNotificacaoLida } from "./routes/update-notificacao-lida";

// Rotas de Convites
import { createConvite } from "./routes/create-convite";
import { getConvites } from "./routes/get-convites";
import { updateConvite } from "./routes/update-convite";

// Rotas de Atividades
import { getAtividades } from "./routes/get-atividades";

// Rota de Anexos de Bug
import { createBugAttachment } from "./routes/create-bug-attachment";

// Painel
import { authMiddleware, CRequest } from "./middleware/authenticate";
import { prisma } from "./lib/prisma";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
    origin: [
        'http://localhost:5173',
        'http://localhost:5000',
        'http://0.0.0.0:5173',
        'http://0.0.0.0:5000',
        /\.replit\.dev$/,
        /\.repl\.co$/,
        /\.app\.github\.dev$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

app.register(fastifyCookie, {
    secret: process.env.C_SECRET,
    hook: 'onRequest' as const,
});

app.register(fastifyMultipart);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Registro de rotas
app.register(createUser);
app.register(login);
app.register(getUser);
app.register(getAllUsers);

app.register(createProject);
app.register(getAllProjects);
app.register(getProject);

app.register(createVersion);

app.register(createTestSession);

app.register(createBug);
app.register(getAllBugs);
app.register(getBug);
app.register(updateBugStatus);
app.register(createBugResponse);

app.register(getNotificacoes);
app.register(updateNotificacaoLida);

app.register(createConvite);
app.register(getConvites);
app.register(updateConvite);

app.register(getAtividades);
app.register(createBugAttachment);

// Painel: dados do usuário logado
app.get('/painel', { preHandler: authMiddleware }, async (request: CRequest, reply) => {
    const userId = request.user.userId;

    const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        select: {
            id: true,
            nome: true,
            email: true,
            dataCadastro: true,
            testador: { select: { id: true, pais: true } },
            desenvolvedor: { select: { id: true, nomeEstudio: true } },
            administrador: { select: { id: true, nivelAcesso: true } },
        }
    });

    if (usuario === null) {
        return reply.status(404).send({ message: 'Usuário não encontrado' });
    }

    let tipo = 'usuario';
    if (usuario.administrador) tipo = 'administrador';
    else if (usuario.desenvolvedor) tipo = 'desenvolvedor';
    else if (usuario.testador) tipo = 'testador';

    return reply.send({ user: { ...usuario, tipo } });
});

// Health check
app.get('/health', async () => ({ status: 'ok', service: 'indietest-api' }));

// Serve arquivos estáticos de uploads
app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
});

app.listen({
    host: 'localhost',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
}).then(() => {
    console.log(`HTTP Server running on port ${process.env.PORT ?? 3000}`);
});
