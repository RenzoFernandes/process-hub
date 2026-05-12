# ProcessHub SaaS Full Stack

Plataforma full stack para gestao corporativa de processos com arquitetura SaaS multi-tenant, autenticacao JWT, API REST em Node.js, banco PostgreSQL e interface responsiva em React.

O projeto simula um produto real para empresas organizarem areas, processos, subprocessos, responsaveis, ferramentas e documentacao operacional dentro de workspaces isolados. Cada empresa acessa somente seus proprios dados.

Frontend hospedado na Vercel, backend hospedado no Render e banco PostgreSQL em cloud com Neon.

**Node.js Express Prisma PostgreSQL React Vite Tailwind CSS JWT bcrypt Docker Vercel Render Neon**

## Sobre o projeto

O ProcessHub foi desenvolvido para demonstrar uma arquitetura full stack moderna, com foco em produto SaaS, seguranca, experiencia corporativa e isolamento de dados por organizacao.

A aplicacao substitui fluxogramas complexos por uma experiencia de Process Explorer, inspirada em ferramentas como Jira, Linear, ClickUp e Notion. Os processos sao organizados por status, exibidos em cards modernos e podem conter subprocessos recursivos em profundidade ilimitada.

## Funcionalidades

- Criar conta e workspace/empresa.
- Fazer login com email e senha.
- Gerar e validar token JWT.
- Proteger rotas privadas no backend e no frontend.
- Exibir usuario autenticado e workspace atual.
- Editar informacoes do workspace.
- Criar, listar, editar e excluir areas.
- Criar, listar, editar e excluir processos.
- Criar subprocessos em multiplos niveis.
- Renderizar hierarquia recursiva via `children`.
- Filtrar automaticamente dados por workspace autenticado.
- Visualizar Dashboard com indicadores operacionais.
- Navegar por Process Explorer com cards, status e drawer de detalhes.
- Exibir tipo, responsaveis, ferramentas, prioridade, status e documentacao.
- Fazer logout e limpar sessao local.
- Manter PostgreSQL local via Docker para desenvolvimento.

## Arquitetura SaaS multi-tenant

Cada usuario pertence a uma organizacao. Areas, processos e subprocessos tambem sao vinculados a essa organizacao.

Isso garante que usuarios de empresas diferentes nunca visualizem dados uns dos outros.

```mermaid
flowchart LR
  Browser[React + Vite] -->|Axios + JWT| API[Node.js + Express]
  API --> Auth[Auth Controller]
  API --> Middleware[Auth Middleware]
  Middleware --> PrivateRoutes[Areas e Processes]
  PrivateRoutes --> Prisma[Prisma ORM]
  Prisma --> Database[(PostgreSQL / Neon)]
```

## Tecnologias utilizadas

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Token
- bcrypt
- dotenv
- CORS

### Infraestrutura

- Docker Compose para PostgreSQL local
- Vercel para deploy do frontend
- Render para deploy da API
- Neon para banco PostgreSQL em cloud

## Estrutura do projeto

```text
process-hub/
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   |-- src/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- routes/
|   |   |-- lib/
|   |   |-- app.ts
|   |   `-- server.ts
|   |-- .env
|   `-- package.json
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- App.tsx
|   |   `-- main.tsx
|   |-- index.html
|   |-- vercel.json
|   `-- package.json
|
|-- docs/
|   `-- APRESENTACAO_TECNICA.md
|-- docker-compose.yml
|-- .env.example
`-- README.md
```

## Modelo de dados

```mermaid
erDiagram
  Organization ||--o{ User : possui
  Organization ||--o{ Area : possui
  Organization ||--o{ Process : possui
  Area ||--o{ Process : classifica
  Process ||--o{ Process : possui_subprocessos
```

Entidades principais:

- **Organization:** workspace ou empresa.
- **User:** usuario autenticado vinculado a uma organizacao.
- **Area:** area da empresa dentro do workspace.
- **Process:** processo ou subprocesso com suporte a hierarquia recursiva.

## Endpoints da API

| Metodo | Rota | Descricao | Autenticacao |
| --- | --- | --- | --- |
| POST | `/auth/register` | Cria usuario e workspace | Nao |
| POST | `/auth/login` | Autentica usuario e retorna JWT | Nao |
| GET | `/auth/me` | Retorna usuario e workspace autenticados | Sim |
| PUT | `/auth/workspace` | Atualiza nome do workspace | Sim |
| GET | `/areas` | Lista areas do workspace | Sim |
| POST | `/areas` | Cria area | Sim |
| PUT | `/areas/:id` | Atualiza area | Sim |
| DELETE | `/areas/:id` | Remove area | Sim |
| GET | `/processes` | Lista processos do workspace | Sim |
| GET | `/processes/tree` | Lista processos em arvore recursiva | Sim |
| POST | `/processes` | Cria processo ou subprocesso | Sim |
| PUT | `/processes/:id` | Atualiza processo | Sim |
| DELETE | `/processes/:id` | Remove processo e descendentes | Sim |

Rotas privadas utilizam o header:

```http
Authorization: Bearer seu_token_jwt
```

## Seguranca

- Senhas armazenadas com hash usando bcrypt.
- Autenticacao baseada em JSON Web Token.
- Middleware para proteger rotas privadas.
- Token carrega `userId` e `organizationId`.
- Controllers sempre filtram por `organizationId`.
- Areas e processos pertencem obrigatoriamente a um workspace.
- Processos pais precisam pertencer ao mesmo workspace.
- Validacao impede ciclos na arvore de subprocessos.
- Exclusoes respeitam o escopo da organizacao autenticada.

## Como rodar localmente

### 1. Clone o repositorio

```bash
git clone https://github.com/RenzoFernandes/process-hub.git
cd process-hub
```

### 2. Suba o PostgreSQL com Docker

```bash
docker compose up -d
```

O PostgreSQL local fica disponivel em:

```text
localhost:5433
```

### 3. Configure as variaveis de ambiente

Crie ou confira o arquivo `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/processhub?schema=public
PORT=3333
JWT_SECRET=sua_chave_secreta
```

Para producao, use a URL do banco Neon em `DATABASE_URL` e uma chave forte em `JWT_SECRET`.

### 4. Instale as dependencias

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 5. Execute as migrations do Prisma

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

Durante desenvolvimento:

```bash
npx prisma migrate dev
```

### 6. Rode o backend

```bash
cd backend
npm run dev
```

API local:

```text
http://localhost:3333
```

### 7. Rode o frontend

```bash
cd frontend
npm run dev
```

Aplicacao local:

```text
http://localhost:5173
```

## Interface

A interface foi desenhada para parecer um produto SaaS corporativo:

- tela de autenticacao responsiva;
- sidebar com usuario, workspace e logout;
- dashboard executivo compacto;
- CRUD de areas;
- Process Explorer com cards por status;
- subprocessos expansivos e recolhiveis;
- drawer lateral com detalhes completos do processo;
- feedback visual, estados vazios e transicoes suaves.

## Deploy

### Frontend

Hospedado na Vercel.

Link da aplicacao:

```text
URL publica da Vercel
```

O arquivo `frontend/vercel.json` configura fallback para SPA:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend

Hospedado no Render.

Link da API:

```text
URL publica do Render
```

No plano gratuito do Render, a primeira requisicao pode demorar alguns segundos quando o servidor esta inativo.

### Banco de dados

PostgreSQL hospedado no Neon.

Variavel usada pelo backend em producao:

```env
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/database?sslmode=require
```

## Validacao

Comandos usados para validar o projeto:

```bash
cd backend
npm run build

cd ../frontend
npm run lint
npm run build
```

## Aprendizados aplicados

- Separacao entre frontend e backend.
- API REST com Express e TypeScript.
- ORM com Prisma e migrations versionadas.
- Autenticacao JWT com rotas privadas.
- Hash de senha com bcrypt.
- Multi-tenancy por organizacao.
- Controle de acesso por workspace autenticado.
- Arvore recursiva de processos e subprocessos.
- Consumo de API com Axios.
- Protecao de rotas no React.
- Deploy full stack com Vercel, Render e Neon.
- Ambiente local padronizado com Docker.

## Status

Projeto em versao V1, contendo autenticacao, workspaces organizacionais, isolamento multi-tenant, CRUD completo de areas/processos, hierarquia recursiva de subprocessos, dashboard, Process Explorer e deploy em cloud.

## Autor

Desenvolvido por Renzo Heiki.

GitHub: [RenzoFernandes](https://github.com/RenzoFernandes)

LinkedIn: [renzo-fernandes](https://www.linkedin.com/in/renzo-fernandes)

## Material complementar

Apresentacao tecnica:

[docs/APRESENTACAO_TECNICA.md](docs/APRESENTACAO_TECNICA.md)
