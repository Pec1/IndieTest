# IndieTest API

Back-end do **IndieTest** — plataforma de beta testing para softwares e jogos indie.

**Stack:** Fastify 5 · TypeScript · Prisma 5 · PostgreSQL · Zod · JWT

---

## Estrutura

```
apps/api/
├── prisma/
│   ├── migrations/
│   └── schema.prisma          # Schema do banco (12 models)
├── src/
│   ├── middleware/
│   │   └── authenticate.ts    # Middleware JWT + tipo CRequest
│   ├── lib/
│   │   └── prisma.ts          # Client Prisma (singleton)
│   ├── routes/                # Um arquivo por endpoint
│   │   ├── create-user.ts
│   │   ├── login.ts
│   │   ├── get-user.ts
│   │   ├── get-all-users.ts
│   │   ├── create-project.ts
│   │   ├── get-all-projects.ts
│   │   ├── get-project.ts
│   │   ├── create-version.ts
│   │   ├── create-test-session.ts
│   │   ├── create-bug.ts
│   │   ├── get-all-bugs.ts
│   │   ├── get-bug.ts
│   │   ├── update-bug-status.ts
│   │   ├── create-bug-response.ts
│   │   ├── create-convite.ts
│   │   ├── get-convites.ts
│   │   ├── update-convite.ts
│   │   ├── get-notificacoes.ts
│   │   └── update-notificacao-lida.ts
│   └── server.ts              # Bootstrap do Fastify
├── api.http                   # Requests de teste (REST Client)
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Variáveis de ambiente
cp .env.example .env
# Edite .env: DATABASE_URL e JWT_SECRET

# 3. Rodar migrations
npx prisma migrate dev

# 4. Iniciar em modo dev (porta 3333)
npm run dev
```

---

## Endpoints

### Autenticação

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/users` | — | Cadastrar usuário |
| `POST` | `/login` | — | Autenticar e receber JWT |
| `GET` | `/painel` | ✓ | Dados do usuário logado |

### Usuários

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/users` | ✓ | Listar usuários |
| `GET` | `/users/:id` | ✓ | Detalhes de um usuário |

### Projetos

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/projetos` | ✓ dev | Criar projeto |
| `GET` | `/projetos` | ✓ | Listar projetos |
| `GET` | `/projetos/:id` | ✓ | Detalhes de um projeto |

### Versões

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/projetos/:id/versoes` | ✓ dev | Publicar versão |

### Sessões de Teste

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/teste-sessoes` | ✓ | Iniciar sessão de teste |

### Bugs

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/bugs` | ✓ | Reportar bug |
| `GET` | `/bugs` | ✓ | Listar bugs (filtros: `severidade`, `status`) |
| `GET` | `/bugs/:id` | ✓ | Detalhes de um bug |
| `PATCH` | `/bugs/:id/status` | ✓ dev/admin | Atualizar status |
| `POST` | `/bugs/:id/respostas` | ✓ dev | Responder a um bug |

### Convites

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/convites` | ✓ dev | Enviar convite a testador |
| `GET` | `/convites` | ✓ | Listar convites do usuário |
| `PATCH` | `/convites/:id` | ✓ | Aceitar ou recusar convite |

### Notificações

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/notificacoes` | ✓ | Listar notificações do usuário |
| `PATCH` | `/notificacoes/:id/lida` | ✓ | Marcar notificação como lida |

---

## Autenticação

Endpoints marcados com ✓ exigem JWT, passado como:
- **Cookie** `accessToken` (setado automaticamente no login)
- **Header** `Authorization: Bearer <token>`

---

## Regras de negócio

| Código | Regra |
|--------|-------|
| RN01 | Apenas desenvolvedores podem criar projetos |
| RN02 | Bug exige título, descrição e severidade (validado por Zod) |
| RN07 | Bloqueia bugs duplicados (mesmo título na mesma sessão) |
| RN08 | Apenas administradores ou o dev dono do projeto podem alterar status do bug |

---

## Testando

Use o arquivo **`api.http`** com a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) no VS Code para testar todos os endpoints em sequência.
