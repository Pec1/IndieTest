# IndieTest API

API do **IndieTest** — plataforma de beta testing para softwares e jogos indie.

Stack: **Fastify + TypeScript + Prisma + PostgreSQL + Zod + JWT**.

## Estrutura

```
backend/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── authMiddleware/
│   │   └── authenticate.ts    # Middleware JWT
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
│   │   └── create-bug-response.ts
│   └── server.ts              # Bootstrap do Fastify
├── api.http                   # Requests de teste (REST Client)
├── .env.example
├── package.json
└── tsconfig.json
```

## Setup local

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Edite .env e preencha DATABASE_URL e JWT_SECRET
   ```

3. **Rodar migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Iniciar em modo dev:**
   ```bash
   npm run dev
   ```

   Servidor sobe em `http://localhost:3333`.

## Endpoints implementados (Entrega 2)

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/users` | Cadastrar usuário (testador/desenvolvedor/administrador) |
| POST | `/login` | Autenticar e receber JWT |
| GET | `/painel` | Dados do usuário logado |

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users` | Listar todos os usuários |
| GET | `/users/:id` | Detalhes de um usuário |

### Projetos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/projetos` | Criar projeto (dev) |
| GET | `/projetos` | Listar projetos (com filtros) |
| GET | `/projetos/:id` | Detalhes de um projeto |

### Versões
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/projetos/:id/versoes` | Criar versão de um projeto |

### Sessões de Teste
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/teste-sessoes` | Iniciar sessão de teste |

### Bugs / Feedback
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/bugs` | Reportar bug em uma sessão |
| GET | `/bugs` | Listar bugs (com filtros) |
| GET | `/bugs/:id` | Detalhes de um bug |
| PATCH | `/bugs/:id/status` | Atualizar status (mod/dev) |
| POST | `/bugs/:id/respostas` | Responder a um bug (dev) |

## Testando

Use o arquivo **`api.http`** com a extensão REST Client do VS Code (ou Insomnia/Postman) para testar todos os endpoints em sequência.

## Autenticação

Todos os endpoints (exceto `/users` POST, `/login` e `/health`) exigem JWT, que pode ser passado como:
- **Cookie** `accessToken` (gerado automaticamente no login)
- **Header** `Authorization: Bearer <token>`

## Regras de negócio aplicadas

- **RN01** — Apenas desenvolvedores podem criar projetos
- **RN02** — Bug exige título, descrição e severidade (validado por Zod)
- **RN07** — Bloqueia bugs duplicados (mesmo título, mesma sessão)
- **RN08** — Apenas administradores ou o dev dono podem alterar status do bug
