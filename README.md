# ProcessHub

ProcessHub e uma plataforma SaaS multi-tenant para gestao corporativa de processos. Cada empresa trabalha dentro do seu proprio workspace, com usuarios, areas, processos, subprocessos e documentacao isolados por organizacao.

A proposta do produto e substituir planilhas, fluxos informais e documentos espalhados por um ambiente operacional moderno: autenticacao, workspaces, Dashboard executivo, Process Explorer, gestao de areas e hierarquia ilimitada de subprocessos.

## Destaques

- **SaaS multi-tenant:** dados isolados por `organizationId`.
- **Autenticacao segura:** cadastro, login, JWT, hash de senha com bcrypt e logout.
- **Workspaces organizacionais:** criacao e edicao do nome do workspace/empresa.
- **Process Explorer:** raias verticais por status, cards horizontais, subprocessos expansivos e drawer lateral de detalhes.
- **Dashboard operacional:** indicadores por area, status, prioridade, processos e subprocessos.
- **CRUD completo:** areas, processos e subprocessos por workspace.
- **Hierarquia recursiva:** subprocessos ilimitados com `parentId` e `children`.
- **Docker first:** PostgreSQL em container para setup local rapido e consistente.

## Stack tecnica

**Frontend**

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React

**Backend**

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JSON Web Token
- bcrypt

**Ambiente local**

- Docker Compose
- PostgreSQL 16

## Como executar localmente

### 1. Subir o PostgreSQL

```bash
docker compose up -d
```

O banco roda dentro do Docker e fica exposto em `localhost:5433`.

### 2. Configurar variaveis de ambiente

Crie ou confira o arquivo `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/processhub?schema=public
PORT=3333
JWT_SECRET=processhub-local-development-secret
```

### 3. Instalar dependencias

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 4. Aplicar migrations e gerar Prisma Client

```bash
cd backend
npx.cmd prisma migrate deploy
npx.cmd prisma generate
```

Durante desenvolvimento, para criar novas migrations:

```bash
npx.cmd prisma migrate dev
```

### 5. Rodar backend

```bash
cd backend
npm run dev
```

API local: `http://localhost:3333`

### 6. Rodar frontend

```bash
cd frontend
npm run dev
```

Aplicacao local: `http://localhost:5173`

## Fluxo principal

1. Usuario acessa `/auth`.
2. Pode entrar com uma conta existente ou criar uma conta nova.
3. Ao criar conta, tambem cria o workspace da empresa.
4. A sessao e persistida no navegador com JWT.
5. A aplicacao abre o workspace autenticado.
6. Dashboard, Areas e Processos carregam somente dados da organizacao do usuario.
7. O nome do workspace aparece na sidebar e pode ser editado.
8. Logout remove token e sessao local.

## Arquitetura

```mermaid
flowchart LR
  Browser[React + Vite] -->|JWT + HTTP JSON| API[Express API]
  API --> AuthRoutes[Auth Routes]
  API --> AuthMiddleware[Auth Middleware]
  AuthMiddleware --> PrivateRoutes[Areas / Processes]
  PrivateRoutes --> Controllers[Controllers]
  Controllers --> Prisma[Prisma Client]
  Prisma --> Postgres[(PostgreSQL Docker)]
```

## API

Rotas publicas:

- `POST /auth/register`
- `POST /auth/login`

Rotas autenticadas:

- `GET /auth/me`
- `PUT /auth/workspace`
- `GET /areas`
- `POST /areas`
- `PUT /areas/:id`
- `DELETE /areas/:id`
- `GET /processes`
- `GET /processes/tree`
- `POST /processes`
- `PUT /processes/:id`
- `DELETE /processes/:id`

Rotas privadas exigem:

```http
Authorization: Bearer <token>
```

## Modelo de dados

```mermaid
erDiagram
  Organization ||--o{ User : possui
  Organization ||--o{ Area : possui
  Organization ||--o{ Process : possui
  Area ||--o{ Process : classifica
  Process ||--o{ Process : possui_subprocessos

  Organization {
    string id
    string name
    string slug
  }

  User {
    string id
    string name
    string email
    string passwordHash
    string organizationId
  }

  Area {
    string id
    string name
    string description
    string organizationId
  }

  Process {
    string id
    string name
    string description
    string status
    string priority
    string executionType
    string tools
    string responsibles
    string documentation
    string organizationId
    string areaId
    string parentId
  }
```

## Isolamento multi-tenant

O JWT carrega `userId` e `organizationId`. O middleware valida o token e injeta esses dados na request.

Todas as operacoes de areas e processos usam:

```ts
organizationId: req.user.organizationId
```

Com isso, listagens, criacoes, edicoes, exclusoes e a arvore `/processes/tree` operam apenas dentro do workspace autenticado.

## Seguranca e integridade

- Senhas armazenadas como hash com bcrypt.
- JWT assinado com `JWT_SECRET`.
- Rotas privadas protegidas por middleware.
- Usuario pertence a uma unica organizacao.
- Area e processo sempre pertencem a uma organizacao.
- Processo so pode usar area do mesmo workspace.
- Processo pai precisa existir no mesmo workspace.
- Validacao impede ciclos na hierarquia.
- Exclusao de processo remove subprocessos descendentes.
- Exclusao de area remove processos vinculados via cascade.

## Validacao do projeto

```bash
cd backend
npm run build

cd ../frontend
npm run lint
npm run build
```

## Material complementar

A apresentacao tecnica esta em:

[docs/APRESENTACAO_TECNICA.md](docs/APRESENTACAO_TECNICA.md)
