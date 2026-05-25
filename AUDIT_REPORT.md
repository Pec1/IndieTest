# AUDIT_REPORT — IndieTest
**Data:** 25/05/2026 | **Auditor:** Claude Sonnet 4.6 (análise automatizada)

---

## 1. Resumo Executivo

O IndieTest é um MVP acadêmico funcional com integração frontend↔backend bem estruturada. **Não está pronto para produção** pelos seguintes motivos principais:

1. **Dois endpoints públicos sem autenticação** (`GET /users`, `GET /users/:id`) expõem e-mails e dados pessoais de todos os usuários cadastrados sem nenhum token.
2. **JWT_SECRET é um placeholder óbvio** no `.env` — qualquer um que leia o arquivo pode forjar tokens de qualquer usuário.
3. **Sem `.gitignore`** — as credenciais reais do banco Supabase (senha no `.env`) podem ser commitadas acidentalmente a qualquer momento.

As regras de negócio (RN01–RN08) estão corretamente implementadas. A stack está moderna e bem escolhida. As falhas são corrigíveis em poucas horas de trabalho.

---

## 2. Stack Confirmada

### Backend (`apps/api`)
| Componente | Tecnologia | Versão |
|---|---|---|
| Runtime | Node.js | ^20 LTS |
| Framework HTTP | Fastify | ^5.8.5 |
| ORM | Prisma | ^5.12.1 |
| Banco de dados | PostgreSQL (Supabase, pgbouncer SA-East-1) | — |
| Validação | Zod + fastify-type-provider-zod | ^3.22.4 / ^4.0.2 |
| Autenticação | JWT (jsonwebtoken) + cookie (@fastify/cookie) | ^9.0.2 / ^11.0.0 |
| Criptografia | bcryptjs | ^2.4.3 |
| Build | tsup + tsx watch | — |
| Testes | **nenhum** | — |

### Frontend (`apps/web`)
| Componente | Tecnologia | Versão |
|---|---|---|
| Framework | React | ^18.3.1 |
| Build | Vite | ^6.3.5 |
| Linguagem | TypeScript | ^5.5.3 |
| CSS | Tailwind CSS v4 | ^4.1.12 |
| Componentes | Radix UI (primitivos) | diversas |
| Roteamento | React Router | ^7.13.0 |
| HTTP client | fetch nativo (centralizado) | — |
| Testes | **nenhum** | — |

**Workspace manager:** npm workspaces (raiz)

---

## 3. Diagrama da Arquitetura

```mermaid
graph LR
    subgraph Frontend ["Frontend (Vite + React)"]
        APP[App.tsx<br/>React Router v7]
        API_CLIENT[api/client.ts<br/>fetch + Bearer token]
        LS[(localStorage<br/>@indietest:token)]
    end

    subgraph Backend ["Backend (Fastify 5 + Node 20)"]
        SERVER[server.ts<br/>CORS · Cookie · Zod]
        ROUTES[/routes/*.ts<br/>15 handlers]
        AUTH[authMiddleware<br/>JWT verify]
        PRISMA[Prisma Client 5]
    end

    subgraph Database ["Banco de Dados"]
        SUPABASE[(PostgreSQL<br/>Supabase SA-East-1<br/>pgbouncer :6543)]
    end

    subgraph External ["Externo"]
        FONTS[Google Fonts CDN]
    end

    APP --> API_CLIENT
    API_CLIENT -->|Bearer JWT| SERVER
    SERVER --> AUTH
    AUTH --> ROUTES
    ROUTES --> PRISMA
    PRISMA -->|DATABASE_URL pgbouncer| SUPABASE
    PRISMA -->|DIRECT_URL| SUPABASE
    APP --> FONTS
    APP --- LS
```

---

## 4. Tabela de Endpoints — Status Análise + Teste

| Método | Rota | Arquivo:linha | Auth? | Validação | Teste | Observação |
|---|---|---|---|---|---|---|
| POST | /users | create-user.ts:9 | ❌ | ✅ Zod | ✅ OK | Cria usuario+papel em transação implícita |
| POST | /login | login.ts:10 | ❌ | ✅ Zod | ✅ OK | ⚠️ User enumeration (mensagens diferentes) |
| GET | /users | get-all-users.ts:6 | ❌ | ❌ | ⚠️ FALHA | **Sem auth — expõe todos os e-mails** |
| GET | /users/:id | get-user.ts:8 | ❌ | ✅ Zod | ⚠️ FALHA | **Sem auth — expõe dados pessoais** |
| GET | /painel | server.ts:76 | ✅ | ❌ | ✅ OK | — |
| POST | /projetos | create-project.ts:8 | ✅ | ✅ Zod | ✅ OK | RN01 implementado |
| GET | /projetos | get-all-projects.ts:8 | ✅ | ✅ Zod query | ✅ OK | Sem paginação |
| GET | /projetos/:id | get-project.ts:8 | ✅ | ✅ Zod | ✅ OK | — |
| POST | /projetos/:id/versoes | create-version.ts:8 | ✅ | ✅ Zod | ✅ OK | — |
| POST | /teste-sessoes | create-test-session.ts:8 | ✅ | ✅ Zod | ✅ OK | — |
| POST | /bugs | create-bug.ts:8 | ✅ | ✅ Zod | ✅ OK | RN07 implementado |
| GET | /bugs | get-all-bugs.ts:8 | ✅ | ✅ Zod query | ✅ OK | Sem paginação; join pesado |
| GET | /bugs/:id | get-bug.ts:8 | ✅ | ✅ Zod | ✅ OK | — |
| PATCH | /bugs/:id/status | update-bug-status.ts:8 | ✅ | ✅ Zod | ✅ OK | RN08 implementado |
| POST | /bugs/:id/respostas | create-bug-response.ts:8 | ✅ | ✅ Zod | ✅ OK | — |
| GET | /health | server.ts:105 | ❌ | ❌ | ✅ OK | Endpoint interno |

**Resultado:** 13/15 endpoints saudáveis funcionalmente | 2 com falha de segurança (autenticação ausente)

---

## 5. Tabela de Telas — Status

| Rota (frontend) | Componente | Chama API? | Endpoints usados | Status |
|---|---|---|---|---|
| `/` | Auth.tsx | ✅ | POST /login, POST /users | ✅ OK |
| `/dashboard` | Dashboard.tsx | ✅ | GET /projetos | ✅ OK |
| `/dev` | DevDashboard.tsx | ✅ | GET /projetos, GET /bugs | ✅ OK |
| `/dev/new-project` | NewProject.tsx | ✅ | POST /projetos, POST /projetos/:id/versoes | ⚠️ UI de convite de testadores não tem endpoint |
| `/dev/project/:id/versoes` | ManageVersions.tsx | ✅ | GET /projetos/:id, POST /projetos/:id/versoes | ✅ OK |
| `/report-bug` | BugReport.tsx | ✅ | GET /projetos, GET /projetos/:id, POST /teste-sessoes, POST /bugs | ⚠️ Upload de anexos não implementado no backend |
| `/bug-tracker` | BugTracker.tsx | ✅ | GET /bugs, PATCH /bugs/:id/status | ✅ OK |
| `/bug/:id` | BugDiscussion.tsx | ✅ | GET /bugs/:id, PATCH /bugs/:id/status, POST /bugs/:id/respostas | ✅ OK |
| `/project/:id` | ProjectDetails.tsx | ✅ | GET /projetos/:id | ✅ OK |
| `/feedback` | FeedbackHub.tsx | ✅ | GET /bugs | ✅ OK |
| `/settings` | Settings.tsx | ❓ | — | ✅ Tela estática (intencional) |
| `/start-session` | StartTestSession.tsx | ✅ | GET /projetos, GET /projetos/:id, POST /teste-sessoes | ✅ OK |
| `/convites` | Invites.tsx | ✅ | GET /projetos | 🔴 Aceitar/recusar é somente local — não persiste |
| `/notificacoes` | Notifications.tsx | ❌ | — | 🔴 Usa dados mock hardcoded; API tem model Notificacao |

---

## 6. Achados por Severidade

### 🔴 Crítico

#### C1 — `GET /users` e `GET /users/:id` sem autenticação
- **Arquivo:** `src/routes/get-all-users.ts:6`, `src/routes/get-user.ts:8`
- **Descrição:** Os dois endpoints de listagem/detalhe de usuários não têm `preHandler: authMiddleware`. Qualquer pessoa (sem token) pode obter a lista completa de e-mails, IDs, tipos e dados pessoais de todos os usuários.
- **Como reproduzir:** `curl http://localhost:3333/users` sem header Authorization → HTTP 200 com todos os usuários.
- **Correção:** Adicionar `preHandler: authMiddleware` às duas rotas. Considerar filtrar campos sensíveis (e-mail) dependendo do contexto.

#### C2 — JWT_SECRET é um placeholder trivial
- **Arquivo:** `apps/api/.env:6`
- **Descrição:** `JWT_SECRET="troque-este-valor-em-producao-com-uma-string-aleatoria-longa"`. Qualquer pessoa com acesso ao repositório pode forjar um JWT válido e se passar por qualquer usuário.
- **Como reproduzir:** Assinar `{ userId: "<uuid_qualquer>", tipo: "administrador" }` com a string do .env.
- **Correção:** Gerar `openssl rand -base64 64`, colocar no .env. Nunca versionar o .env.

#### C3 — Ausência de `.gitignore` com credenciais Supabase no `.env`
- **Arquivo:** Raiz do repo (sem .gitignore), `apps/api/.env`
- **Descrição:** O `.env` da API contém a senha real do banco Supabase (`jys5XCJ0Fmw9ZHzC`), mas não existe nenhum `.gitignore` protegendo o arquivo. Um `git add .` acidental commitaria a senha para o histórico git (potencialmente público).
- **Correção:** Criar `.gitignore` na raiz com `**/.env`, `**/dist/`, `**/node_modules/`. Verificar se o .env já foi commitado em algum histórico com `git log --all -- apps/api/.env`.

---

### 🟠 Alto

#### A1 — Enumeração de usuários no `/login`
- **Arquivo:** `src/routes/login.ts:48-50`
- **Descrição:** Respostas diferentes para e-mail inexistente ("Usuário não encontrado! E-mail ou senha inválidos") vs senha errada ("Senha inválida") permitem confirmar quais e-mails estão cadastrados.
- **Correção:** Retornar sempre a mesma mensagem genérica ("E-mail ou senha inválidos") independente do motivo.

#### A2 — Cookie `accessToken` sem flags `Secure` e `SameSite`
- **Arquivo:** `src/routes/login.ts:70`
- **Descrição:** Cookie definido como `accessToken=${token}; Path=/; HttpOnly` — sem `Secure` (transmite por HTTP) e sem `SameSite` (suscetível a CSRF).
- **Correção:** `reply.header('Set-Cookie', \`accessToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict\`);`

#### A3 — Sem rate limiting nos endpoints de autenticação
- **Arquivo:** `src/server.ts` (ausência de configuração)
- **Descrição:** Não há limite de tentativas em `POST /login`. Um atacante pode tentar senhas ilimitadas por força bruta.
- **Correção:** Adicionar `@fastify/rate-limit` com limite de ~5 tentativas/minuto por IP em `/login` e `/users`.

#### A4 — XSS stored: API aceita e persiste tags HTML/script sem sanitização
- **Arquivo:** `src/routes/create-bug.ts` (ausência de sanitização)
- **Descrição:** O campo `titulo` de um bug aceita `<script>alert(1)</script>` e o armazena no banco. Confirmado em teste. O risco imediato é baixo porque React escapa HTML por padrão, mas o dado sujo persiste no banco e pode ser usado por integrações futuras (e-mail, mobile, export) que não sanitizem.
- **Como reproduzir:** POST /bugs com `titulo: "<script>alert(1)</script>"` → 201, dado salvo.
- **Correção:** Sanitizar inputs de texto livre com uma lib como `DOMPurify` (ou strip-tags no backend) antes de persistir.

---

### 🟡 Médio

#### M1 — Tela de Notificações usa dados mock hardcoded
- **Arquivo:** `src/pages/Notifications.tsx:73-104`
- **Descrição:** A tela `/notificacoes` exibe 4 notificações fixas (`DEMO_NOTIFS`). O schema Prisma tem o model `Notificacao` mas não existe endpoint para listá-las. Nenhum endpoint cria notificações automaticamente.
- **Impacto:** Funcionalidade completamente não-funcional em produção.
- **Correção:** Implementar `GET /notificacoes` e `PATCH /notificacoes/:id/lida`.

#### M2 — Convites: aceitar/recusar é somente local (sem backend)
- **Arquivo:** `src/pages/Invites.tsx:69-75`
- **Descrição:** `handleAceitar` e `handleRecusar` apenas alteram estado React local. A mudança não persiste. Nenhum endpoint de aceite/recusa existe na API. O model `Convite` tem `statusConvite` mas não há rota que o altere.
- **Correção:** Implementar `PATCH /convites/:id` para atualizar `statusConvite`.

#### M3 — Upload de anexos na UI sem implementação no backend
- **Arquivo:** `src/pages/BugReport.tsx:202-232`
- **Descrição:** A tela de reporte de bugs tem UI completa de drag-and-drop de arquivos. Os arquivos são selecionados localmente mas nunca enviados — o `handleSubmit` não inclui o upload. O model `Anexo` existe no schema mas não há endpoint de upload.
- **Impacto:** Usuário seleciona arquivos acreditando que serão enviados, mas eles são descartados silenciosamente.

#### M4 — Sem paginação nas listagens
- **Arquivo:** `get-all-bugs.ts:21`, `get-all-projects.ts:19`, `get-all-users.ts:6`
- **Descrição:** Todos os `findMany` retornam registros sem `take`/`skip`. Com muitos dados, isso causa:
  - Respostas lentas (já observado: ~1.8s para GET /bugs)
  - Alto consumo de memória
  - Payload HTTP gigante
- **Correção:** Aceitar `?page=1&limit=20` nos querystrings e aplicar `take`/`skip` no Prisma.

#### M5 — CORS com regex permissivo
- **Arquivo:** `src/server.ts:40`
- **Descrição:** `origin: /\.app\.github\.dev$/` permite qualquer subdomínio de `app.github.dev`, não apenas o do projeto. Qualquer Codespace público poderia fazer requests com credentials.
- **Correção:** Usar allowlist explícita de origens em vez de regex, ou pelo menos ancorar ao prefixo correto do projeto.

#### M6 — BASE_URL no frontend falha silenciosamente se VITE_API_URL não estiver configurado
- **Arquivo:** `src/api/client.ts:1`
- **Descrição:** `const BASE_URL = import.meta.env.VITE_API_URL /* || 'http://localhost:3333' */;` — o fallback está comentado. Se o `.env` não existir ou a variável estiver ausente, `BASE_URL` é `undefined` e toda a API falha com "TypeError: Failed to fetch" sem mensagem útil.
- **Correção:** Descomentar o fallback OU lançar erro explícito: `if (!BASE_URL) throw new Error('VITE_API_URL não configurado')`.

#### M7 — Latência alta nas queries (>1s)
- **Observação:** `GET /bugs` ~1.8s, `GET /projetos` ~1.1s em dev com banco vazio (5 registros).
- **Causa provável:** Conexão do Codespace (Europa) ao Supabase SA-East-1 via pgbouncer — round-trip de ~200ms multiplicado pelas queries encadeadas com includes.
- **Correção:** Não crítico para escopo acadêmico, mas em produção real considerar: conexão direct (sem pgbouncer para queries não-transacionais), cache de resultados, ou endpoint Supabase regional mais próximo.

---

### 🔵 Baixo

#### B1 — `CRequest.user` tipado como `any`
- **Arquivo:** `src/authMiddleware/authenticate.ts:5`
- **Descrição:** `user?: any` perde tipagem do payload JWT. Erros de acesso a `request.user.userId` só seriam detectados em runtime.
- **Correção:** `user?: { userId: string; tipo: string; iat: number; exp: number }`.

#### B2 — Função `cn()` duplicada em todos os componentes do frontend
- **Arquivo:** Todos os `.tsx` de páginas (>10 arquivos)
- **Descrição:** Cada página redefine `function cn(...) { return twMerge(clsx(...)) }`. Deveria ser um utilitário compartilhado em `src/lib/utils.ts`.
- **Impacto:** Dívida técnica; fácil de corrigir.

#### B3 — Bundle sem code splitting
- **Arquivo:** `apps/web/dist/assets/index-*.js` (394KB / 102KB gzip)
- **Descrição:** Todo o app em um único chunk. React Router v7 suporta lazy loading por rota com `React.lazy()`. Para 14 rotas, code splitting reduziria o bundle inicial.
- **Impacto:** Tempo de carregamento inicial mais longo para usuários.

#### B4 — CSS `@import` fora de ordem no Tailwind
- **Arquivo:** `src/index.css`
- **Descrição:** Warning no build: `@import rules must precede all rules aside from @charset and @layer statements`. Pode causar comportamento inesperado em alguns navegadores.

#### B5 — `GET /users` e `GET /users/:id` sem uso nas páginas atuais
- **Arquivo:** `src/api/usuarios.ts`
- **Descrição:** As funções `getUsuarios()` e `getUsuario()` existem e são exportadas mas não são usadas em nenhuma das 14 páginas atuais. Podem ser dead code, ou indicam funcionalidades futuras não implementadas (ex: tela de admin).

#### B6 — Verificação de dono de projeto via `email` vs. `id`
- **Arquivo:** `src/pages/ProjectDetails.tsx:50`
- **Descrição:** `const ehDono = user?.tipo === 'desenvolvedor' && projeto?.desenvolvedor?.usuario?.email === user?.email` — compara e-mails (string) em vez de IDs. Funcionalmente equivalente se e-mails forem únicos (garantido pelo banco), mas semanticamente mais frágil. Preferível comparar IDs.

---

## 7. Análise de Cobertura Frontend ↔ API

### Endpoints Órfãos (API tem, frontend não chama)
| Endpoint | Classificação | Motivo |
|---|---|---|
| GET /health | 🔵 Interno | Endpoint de monitoramento; não precisa de UI |
| GET /users | 🟡 Pode ser legado | Arquivo `usuarios.ts` existe mas nenhuma página usa |
| GET /users/:id | 🟡 Pode ser legado | Idem acima |

### Funcionalidades com Gap (UI existe, backend não implementou)
| Funcionalidade | UI | Backend | Severidade |
|---|---|---|---|
| Notificações reais | ✅ Tela existe | ❌ Sem endpoint GET/PATCH | 🔴 |
| Aceitar/recusar convite | ✅ Botões existem | ❌ Sem endpoint PATCH | 🔴 |
| Upload de anexos de bug | ✅ UI completa | ❌ Sem endpoint POST | 🟠 |
| Convidar testadores por e-mail | ✅ Campo no NewProject | ❌ Sem endpoint POST /convites | 🟠 |

---

## 8. Resultados dos Testes

### Testes Automáticos
```
API:  0/0 testes (nenhum framework configurado)
Web:  0/0 testes (nenhum framework configurado)
```

### Testes de Integração (executados nesta auditoria)
```
Total endpoints testados: 15
  ✅ OK (happy path + edge cases): 13
  ⚠️ Falha de segurança (auth ausente): 2 (GET /users, GET /users/:id)

Casos de borda testados:
  ✅ Payload inválido → 400 (Zod funciona em todas as rotas validadas)
  ✅ Token ausente/malformado → 401
  ✅ Acesso a recurso de outro usuário → 403
  ✅ ID inexistente → 404
  ✅ Criação duplicada (e-mail, bug) → 409
  ⚠️ XSS no título: aceito e persistido (sem sanitização)
  ✅ SQL injection: bloqueado por Zod (email inválido) + Prisma parametrizado
```

### Vulnerabilidades (npm audit)
```
API:  0 críticas, 0 altas, 0 moderadas, 0 baixas
Web:  0 críticas, 0 altas, 0 moderadas, 0 baixas
```

### Build do Frontend
```
Status: ✅ Sucesso
Tempo:  5.94s
Bundle: 394.40 KB (102.37 KB gzip)
Chunks: 1 (sem code splitting)
Warnings: 2 (CSS @import, auth.ts static+dynamic import)
```

---

## 9. Recomendações Priorizadas

### Agora (antes da próxima entrega)

1. **Criar `.gitignore`** com `**/.env`, `**/dist/`, `**/node_modules/` — evita vazar secrets no git *(30 min)*
2. **Adicionar `preHandler: authMiddleware`** a `GET /users` e `GET /users/:id` *(15 min)*
3. **Trocar JWT_SECRET** por valor aleatório real: `openssl rand -base64 64` *(5 min)*
4. **Unificar mensagem de erro do login** — remover enumeração de usuário *(5 min)*

### Próxima sprint (Entrega 3)

5. **Implementar `GET /notificacoes` + `PATCH /notificacoes/:id`** para eliminar mock da tela
6. **Implementar `PATCH /convites/:id`** para persistir aceite/recusa
7. **Implementar `POST /bugs/:id/anexos`** com `@fastify/multipart` (já está no package.json)
8. **Adicionar paginação** em todos os `findMany` com `?page` e `?limit`
9. **Adicionar flags `Secure; SameSite=Strict` ao cookie** do login
10. **Descomentar fallback de URL** no `client.ts:1` ou lançar erro claro

### Médio prazo (Entrega 4)

11. **Adicionar `@fastify/rate-limit`** em `/login` e `POST /users`
12. **Sanitizar inputs** de texto livre (título/descrição de bugs) com strip-tags
13. **Implementar testes automatizados** — sugestão: Vitest para ambos os apps, Supertest para API
14. **Extrair `cn()` para `src/lib/utils.ts`** no frontend
15. **Code splitting por rota** com `React.lazy()` no frontend

---

## 10. Pontos Fortes

- **Estrutura de rotas limpa e consistente** — cada endpoint em seu próprio arquivo, padrão homogêneo
- **Regras de negócio corretamente implementadas** — RN01 (só devs criam projetos), RN07 (bug duplicado = 409), RN08 (só dev/admin altera status)
- **Zod bem aplicado** — todos os endpoints protegidos têm validação de body/params/query
- **Herança de papéis no schema** — `Usuario → Testador/PerfilDesenvolvedor/Administrador` (1:0..1) está bem modelada e consistente com o DER
- **`senhaHash` não vaza** nas respostas — todas as queries usam `select` explícito ou respondem apenas os campos necessários
- **Tratamento de erro coerente** — status HTTP semânticos corretos (400/401/403/404/409), mensagens em português
- **Frontend com design system coerente** — Tailwind + Radix, visual consistente em todas as telas
- **CORS configurado corretamente** para o ambiente de desenvolvimento
- **npm audit limpo** — zero vulnerabilidades de dependências
- **Transação implícita em `create-user.ts`** — `prisma.usuario.create` com nested write garante atomicidade

---

## Dados de Teste Criados (para cleanup manual)

Os seguintes registros foram inseridos no banco Supabase durante os testes de integração:

| Tipo | ID / E-mail |
|---|---|
| Usuário testador | `audit999999-testador@test.com` |
| Usuário dev | `audit999999-dev@test.com` |
| Projeto | `061d0e6a-afbb-4b0d-bcc2-500e9307246f` |
| Versão | `2f6fd326-877b-422b-bdf5-346164212c99` |
| Sessão | `4d45a74e-20af-499b-8feb-5e721118a793` |
| Bug | `9c5a1258-d69b-4cc3-9a86-710326b379d5` |
| Bug (XSS test) | `53082414-3d7b-4395-818f-a04e94e5ba8f` |
| Outros usuários de teste | `audit-testador-*@test.com`, `audit-dev-*@test.com`, `extra-*@test.com` |

Para remover: executar `DELETE FROM usuario WHERE email LIKE 'audit%' OR email LIKE 'extra-%';` no Supabase SQL editor (cascade deleta os papéis, projetos e demais registros relacionados via `onDelete: Cascade`).
