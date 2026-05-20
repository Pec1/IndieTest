# CLAUDE.md

Guia para o Claude trabalhar no projeto **IndieTest** — plataforma de beta testing para softwares e jogos indie.

## Contexto do projeto

Trabalho acadêmico da disciplina **Laboratório de Desenvolvimento de Software** (UNIJORGE). Sistema web completo dividido em quatro entregas quinzenais entre maio e junho.

A ideia: conectar desenvolvedores indie que precisam testar seus jogos/softwares com uma comunidade de testadores voluntários, que reportam bugs e dão feedback estruturado.

## Stack

**Estrutura monorepo:**
```
apps/
  web/   → frontend (React + Vite + TypeScript)
  api/   → backend  (Fastify + Prisma + PostgreSQL)
```

**Front-end** (`/apps/web`):
- React 18 + Vite + TypeScript
- Tailwind CSS + **shadcn/ui** (Radix primitives)
- React Router v7
- Lucide icons

**Back-end** (`/apps/api`):
- Node.js 22 LTS + TypeScript
- Fastify (não Express)
- **Prisma ORM 5.x** + PostgreSQL
- Zod para validação
- JWT (em cookie `accessToken` ou header `Authorization: Bearer`)
- bcryptjs para hash de senha

Padrão de organização do back é inspirado em `Pec1/users-api`: cada endpoint vive em um arquivo separado em `src/routes/` exportando uma função `async (app: FastifyInstance) => {}`.

**Decisão de stack (maio/2026):** consideramos migrar para Hono+Drizzle+Bun (que viraram tendência em 2026), mas mantemos Fastify+Prisma+Node porque (a) o trabalho é acadêmico e troca de stack atrasaria as entregas, (b) Prisma 7 eliminou os problemas de cold start que justificavam Drizzle, (c) Fastify continua moderno e mantido. Atualizar versões > trocar de stack.

## Modelagem

12 models no Prisma, com herança 1:0..1 entre `Usuario` e os papéis (`Administrador`, `Testador`, `PerfilDesenvolvedor`). Fluxo central: `Projeto → Versao → Convite → TesteSessao → FeedbackBug → (Anexo, RespostaDesenvolvedor)`.

Schema completo está em `apps/api/prisma/schema.prisma`. **Nunca modifique sem perguntar** — qualquer alteração precisa refletir no MER/DER do documento da entrega.

## Status das entregas

- **Entrega 1** (04–06/maio) — ✅ Concluída. Documento `IndieTest_Entregavel1_Final.docx` com situação hipotética, requisitos, MER/DER e schema Prisma.
- **Entrega 2** (18–20/maio) — 🔄 Em andamento. Back-end pronto com 15 endpoints. Front-end avançado mas ainda usa mocks (falta integração) e tem 4 telas faltando.
- **Entrega 3** (01–03/junho) — pendente. Sistema funcional integrado.
- **Entrega 4** (15–17/junho) — pendente. Sistema completo + testes + apresentação final.

## Telas no front (todas implementadas)

Todas as 4 telas que estavam pendentes foram implementadas:
- `StartTestSession.tsx` — iniciar sessão de teste
- `ManageVersions.tsx` — gerenciar versões do projeto
- `Invites.tsx` — listar convites (aceite/recusa ainda é somente local, sem endpoint backend)
- `Notifications.tsx` — notificações

## Endpoints existentes (back)

**Auth**: `POST /users`, `POST /login`, `GET /painel`
**Usuários**: `GET /users`, `GET /users/:id`
**Projetos**: `POST /projetos`, `GET /projetos`, `GET /projetos/:id`
**Versões**: `POST /projetos/:id/versoes`
**Sessões**: `POST /teste-sessoes`
**Bugs**: `POST /bugs`, `GET /bugs`, `GET /bugs/:id`, `PATCH /bugs/:id/status`, `POST /bugs/:id/respostas`

Detalhes e exemplos de payload em `apps/api/api.http`.

## Regras de negócio importantes

- **RN01** — Apenas desenvolvedores (com `PerfilDesenvolvedor`) podem criar projetos
- **RN02** — Bug exige título, descrição e severidade (validado por Zod nas rotas)
- **RN07** — Bloqueia bugs duplicados (mesmo título na mesma sessão)
- **RN08** — Apenas administradores ou o dev dono do projeto podem alterar status do bug

Essas regras já estão implementadas nas rotas correspondentes — se for adicionar endpoints novos que mexem com bug/projeto, manter o mesmo padrão de checagem.

## Convenções de código

- Tudo em **português** (nomes de variáveis, campos, mensagens) — `nome`, `senhaHash`, `dataCadastro`, `Usuário não encontrado`. Exceções: termos técnicos consagrados (`token`, `bcrypt`, `JWT`).
- No Prisma: nomes em camelCase no schema (`senhaHash`) mapeados para snake_case no banco (`@map("senha_hash")`).
- Tipos do Fastify: usar `CRequest` do `authMiddleware/authenticate.ts` em handlers que precisam de `request.user`. Para outras rotas, deixar o tipo ser inferido pelo Zod.
- Validação sempre via Zod no `schema.body/params/query` da rota — nunca validar manualmente dentro do handler.
- Erros: status HTTP apropriado + `{ message: '...' }` em português:
  - **400** — body/params inválidos (Zod já cuida)
  - **401** — não autenticado (token faltando/inválido)
  - **403** — autenticado mas sem permissão
  - **404** — recurso não encontrado
  - **409** — conflito/duplicação (e-mail já cadastrado, bug duplicado, etc.) — **NÃO usar 401 pra isso**
  - **500** — erro interno (não usar manualmente, deixar o Fastify cuidar)

## Documentos e arquivos importantes

- `IndieTest_Entregavel1_Final.docx` — documento oficial da Entrega 1 (situação, requisitos, MER/DER, schema)
- `MER_IndieTest.png` / `DER_IndieTest.png` — diagramas standalone
- `apps/api/api.http` — coleção de requests para testar a API no VS Code REST Client
- `apps/api/README.md` — instruções de setup e lista de endpoints
- `apps/api/.env.example` — variáveis de ambiente necessárias

## Preferências de interação

- Respostas em português brasileiro, tom direto e prático
- Quando for criar arquivos novos no back, seguir o padrão `Pec1/users-api`: um arquivo por endpoint, importar no `server.ts`, usar `withTypeProvider<ZodTypeProvider>()`
- Antes de mexer no schema Prisma, avisar — porque exige atualizar o documento da entrega e os diagramas
- Para tarefas longas (criar várias rotas, várias telas), entregar tudo de uma vez ao invés de ir perguntando a cada passo
- Não criar dependências pesadas com binding nativo (tipo `bcrypt`) — preferir alternativas puro-JS (`bcryptjs`) porque o sandbox de execução não compila C++

## O que evitar

- Não trocar Fastify por Express ou Hono — toda a estrutura existente assume Fastify, e a decisão foi avaliada (ver seção Stack)
- Não trocar Prisma por Drizzle — schema já está documentado oficialmente
- Não trocar Node por Bun — sandbox da faculdade pode ter problemas com binding nativo
- Não adicionar autenticação OAuth/Google nesta fase — JWT simples é suficiente para o escopo acadêmico
- Não sugerir microsserviços, Docker compose elaborado, CI/CD — é um trabalho acadêmico de 4 entregas
- Não usar status code **401 para conflito/duplicação** — usar **409** (erro comum no código antigo da equipe)