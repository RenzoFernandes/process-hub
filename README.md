# ProcessHub

ProcessHub e uma plataforma full stack para gestao corporativa de processos em modelo SaaS multi-tenant. O projeto permite que empresas organizem areas, processos, subprocessos, responsaveis, prioridades, status, ferramentas e documentacao operacional dentro de workspaces isolados.

A proposta e transformar processos que normalmente ficam espalhados em planilhas, fluxogramas estaticos e documentos soltos em uma experiencia operacional mais proxima de produtos como Jira, Linear, ClickUp e Notion.

## Destaques

- SaaS multi-tenant com isolamento por organizacao.
- Autenticacao com JWT e senhas protegidas com bcrypt.
- Backend REST em Node.js, Express, TypeScript e Prisma.
- Banco PostgreSQL local via Docker e pronto para Neon em producao.
- Frontend em React, TypeScript, Vite e Tailwind CSS.
- Dashboard executivo com indicadores do workspace.
- Process Explorer com Kanban por status, cards arrastaveis e detalhes laterais.
- CRUD completo de areas, processos e subprocessos recursivos.
- Deploy pensado para Vercel, Render e Neon.

## Visao do produto

Empresas precisam entender quem faz o que, em qual area, com qual prioridade, em qual status e onde esta a documentacao de apoio. O ProcessHub centraliza essa informacao em uma interface corporativa simples de navegar.

Fluxo principal:

1. Criar uma conta e um workspace.
2. Cadastrar areas da empresa.
3. Criar processos raiz e subprocessos.
4. Acompanhar o andamento no pipeline.
5. Abrir detalhes, editar informacoes e manter a documentacao organizada.

## Demo local

O projeto possui seed de usuario demo:

```text
Email: demo@processhub.com
Senha: 123456
```

Para criar esse usuario, rode o seed depois das migrations:

```bash
cd backend
npm run seed:demo
```

## Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- dnd-kit
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Token
- bcrypt
- CORS
- dotenv

### Infraestrutura

- Docker Compose para PostgreSQL local
- Vercel para frontend
- Render para API
- Neon para PostgreSQL em cloud

## Arquitetura

```mermaid
flowchart LR
  Client[React + Vite] -->|Axios + JWT| API[Node.js + Express]
  API --> Auth[Auth Controller]
  API --> Middleware[Auth Middleware]
  Middleware --> Routes[Private Routes]
  Routes --> Prisma[Prisma ORM]
  Prisma --> Database[(PostgreSQL)]
```

O tenant principal e a `Organization`. Usuarios, areas e processos carregam `organizationId`, e as rotas privadas sempre filtram os dados pelo workspace autenticado.

```mermaid
erDiagram
  Organization ||--o{ User : possui
  Organization ||--o{ Area : possui
  Organization ||--o{ Process : possui
  Area ||--o{ Process : classifica
  Process ||--o{ Process : possui_subprocessos
```

## Funcionalidades

### Autenticacao e workspace

- Cadastro de usuario e workspace.
- Login com email e senha.
- Sessao persistida no frontend.
- Rotas privadas protegidas.
- Edicao do nome do workspace.
- Exclusao de workspace.
- Logout com limpeza da sessao local.

### Areas

- Criar, listar, editar e excluir areas.
- Contagem de processos vinculados.
- Filtro de processos por area.

### Processos

- Criar processos raiz.
- Criar subprocessos em multiplos niveis.
- Editar status, prioridade, tipo, responsaveis, ferramentas e documentacao.
- Excluir processos e seus descendentes.
- Visualizar arvore recursiva via `children`.
- Impedir ciclos na hierarquia de subprocessos.

### Experiencia

- Dashboard com indicadores por area, status e prioridade.
- Pipeline em Kanban com colunas: Aberto, Em Andamento, Em Revisao e Concluido.
- Drag and drop entre colunas.
- Drawer lateral com detalhes do processo.
- Interface responsiva para desktop e mobile.

## Estrutura do projeto

```text
process-hub/
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   |-- schema.prisma
|   |   `-- seed-demo.js
|   |-- src/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- routes/
|   |   |-- lib/
|   |   |-- app.ts
|   |   `-- server.ts
|   `-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- App.tsx
|   |   `-- main.tsx
|   |-- index.html
|   `-- package.json
|
|-- docs/
|   `-- APRESENTACAO_TECNICA.md
|-- docker-compose.yml
|-- .env.example
`-- README.md
```

## Como rodar localmente

### 1. Clone o repositorio

```bash
git clone https://github.com/RenzoFernandes/process-hub.git
cd process-hub
```

### 2. Suba o PostgreSQL

```bash
docker compose up -d
```

Banco local:

```text
localhost:5433
```

### 3. Configure variaveis de ambiente

Crie `backend/.env` com base em `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/processhub?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5433/postgres"
PORT=3333
JWT_SECRET="change-me-in-development"
```

Opcionalmente, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:3333
```

### 4. Instale as dependencias

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 5. Rode migrations e seed

```bash
cd ../backend
npx prisma migrate dev
npx prisma generate
npm run seed:demo
```

### 6. Inicie a API

```bash
cd backend
npm run dev
```

API:

```text
http://localhost:3333
```

### 7. Inicie o frontend

```bash
cd frontend
npm run dev
```

Aplicacao:

```text
http://localhost:5173
```

## Endpoints principais

| Metodo | Rota | Descricao | Auth |
| --- | --- | --- | --- |
| POST | `/auth/register` | Cria usuario e workspace | Nao |
| POST | `/auth/login` | Autentica usuario e retorna JWT | Nao |
| GET | `/auth/me` | Retorna sessao autenticada | Sim |
| PUT | `/auth/workspace` | Atualiza workspace | Sim |
| DELETE | `/auth/workspace` | Exclui workspace | Sim |
| GET | `/areas` | Lista areas | Sim |
| POST | `/areas` | Cria area | Sim |
| PUT | `/areas/:id` | Atualiza area | Sim |
| DELETE | `/areas/:id` | Exclui area | Sim |
| GET | `/processes` | Lista processos | Sim |
| GET | `/processes/tree` | Lista processos em arvore | Sim |
| POST | `/processes` | Cria processo ou subprocesso | Sim |
| PUT | `/processes/:id` | Atualiza processo | Sim |
| DELETE | `/processes/:id` | Exclui processo | Sim |

Rotas privadas usam:

```http
Authorization: Bearer <token>
```

## Qualidade e validacao

Comandos recomendados:

```bash
cd backend
npm run build

cd ../frontend
npm run lint
npm run build
```

## Roteiro de apresentacao

1. Mostrar a proposta: processos centralizados por workspace.
2. Entrar com o usuario demo ou criar uma nova conta.
3. Apresentar a sidebar com usuario e workspace.
4. Mostrar o Dashboard e os indicadores.
5. Criar uma area.
6. Criar um processo raiz e um subprocesso.
7. Abrir o Process Explorer.
8. Mover um card entre status.
9. Abrir o drawer de detalhes.
10. Mostrar o isolamento criando outro workspace ou usando outra conta.

## Evolucoes futuras

- Convite de usuarios para workspace.
- Perfis e permissoes por papel.
- Recuperacao de senha.
- Refresh token.
- Busca global.
- Filtros avancados.
- Auditoria de alteracoes.
- Upload de anexos.
- Testes automatizados de API e frontend.

## Status

Versao V1 funcional, com autenticacao, multi-tenancy, CRUD completo, hierarquia recursiva, dashboard, Process Explorer e base preparada para deploy full stack.

## Autor

Desenvolvido por Renzo Heiki.

GitHub: [RenzoFernandes](https://github.com/RenzoFernandes)

LinkedIn: [renzo-fernandes](https://www.linkedin.com/in/renzo-fernandes)

## Material complementar

- [Apresentacao tecnica](docs/APRESENTACAO_TECNICA.md)
