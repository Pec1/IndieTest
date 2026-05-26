# IndieTest

Plataforma de beta testing para softwares e jogos indie. Conecta desenvolvedores que precisam testar seus produtos com uma comunidade de testadores voluntários que reportam bugs e dão feedback estruturado.

> Trabalho acadêmico — Laboratório de Desenvolvimento de Software (UNIJORGE)

---

## Estrutura do monorepo

```
IndieTest/
├── apps/
│   ├── api/          # Back-end — Fastify + Prisma + PostgreSQL
│   └── web/          # Front-end — React + Vite + Tailwind CSS
├── docs/             # Documentos internos (auditorias, diagramas)
├── package.json      # Workspace root (npm workspaces)
└── README.md
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Front-end | React 18 · Vite · TypeScript · Tailwind CSS v4 · React Router v7 |
| Back-end | Fastify 5 · TypeScript · Prisma 5 · PostgreSQL |
| Autenticação | JWT (cookie `accessToken` ou header `Authorization: Bearer`) |
| Validação | Zod |

---

## Pré-requisitos

- Node.js 22 LTS
- PostgreSQL 15+
- npm 10+

---

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
# API
cp apps/api/.env.example apps/api/.env
# Edite apps/api/.env: DATABASE_URL e JWT_SECRET
```

### 3. Rodar migrations

```bash
cd apps/api
npx prisma migrate dev
```

### 4. Iniciar em modo desenvolvimento

```bash
# Em terminais separados:
npm run dev:api   # http://localhost:3333
npm run dev:web   # http://localhost:5173
```

---

## Scripts disponíveis (raiz)

| Comando | Descrição |
|---------|-----------|
| `npm run dev:api` | API em modo watch |
| `npm run dev:web` | Frontend com HMR |
| `npm run build:api` | Build de produção da API |
| `npm run build:web` | Build de produção do frontend |

---

## Documentação por app

- [`apps/api/README.md`](apps/api/README.md) — endpoints, autenticação, regras de negócio
- [`apps/api/api.http`](apps/api/api.http) — coleção de requests (VS Code REST Client)
- [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma) — schema completo do banco
