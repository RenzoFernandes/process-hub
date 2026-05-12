# ProcessHub

ProcessHub e uma aplicacao full-stack para gestao, documentacao e navegacao de processos corporativos. A plataforma centraliza areas, processos, subprocessos, responsaveis, ferramentas, status, prioridades e documentacao em uma experiencia visual de produto SaaS.

O objetivo e substituir planilhas e documentos dispersos por um workspace operacional onde equipes conseguem entender rapidamente quem executa cada processo, quais ferramentas sao utilizadas e como a hierarquia de subprocessos esta estruturada.

## Visao do produto

- **Dashboard operacional:** indicadores de areas, processos, subprocessos, prioridades e status, com filtro por area.
- **Process Explorer:** visualizacao principal dos processos em raias verticais por status, com cards horizontais navegaveis, arvore expansivel de subprocessos e drawer lateral de detalhes.
- **Areas:** cadastro e gestao das unidades organizacionais responsaveis pelos processos.
- **Hierarquia ilimitada:** processos e subprocessos usam uma relacao recursiva por `parentId`, permitindo qualquer profundidade.
- **Detalhamento operacional:** cada processo pode registrar tipo de execucao, responsaveis, ferramentas, documentacao, status e prioridade.

## Tecnologias

**Frontend**

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Axios

**Backend**

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL

**Infraestrutura local**

- Docker Compose
- PostgreSQL 16

## Como executar

### 1. Subir o banco

```bash
docker compose up -d
```

O PostgreSQL roda no container na porta `5432` e fica disponivel no host pela porta `5433`.

### 2. Configurar variaveis do backend

Crie ou confira o arquivo `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/processhub?schema=public
PORT=3333
```

### 3. Rodar o backend

```bash
cd backend
npm install
npx.cmd prisma migrate dev
npm run dev
```

No Windows, `npx.cmd` evita bloqueios do PowerShell com scripts `.ps1`.

### 4. Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

URLs padrao:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`
- PostgreSQL local: `localhost:5433`

## Arquitetura

```mermaid
flowchart LR
  User[Usuario] --> Frontend[React + Vite]
  Frontend -->|HTTP JSON| API[Express API]
  API --> Routes[Routes]
  Routes --> Controllers[Controllers]
  Controllers --> Prisma[Prisma Client]
  Prisma --> Postgres[(PostgreSQL)]
```

O frontend concentra a experiencia de produto e consome a API REST. O backend valida payloads, protege a integridade da hierarquia, monta a arvore de processos e persiste os dados via Prisma.

## Modelagem principal

```mermaid
erDiagram
  Area ||--o{ Process : possui
  Process ||--o{ Process : possui_subprocessos

  Area {
    string id
    string name
    string description
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
    string areaId
    string parentId
  }
```

O campo `parentId` e a base da hierarquia. Quando e nulo, o registro e um processo raiz. Quando aponta para outro processo, o registro se torna subprocesso daquele item.

Essa modelagem por lista de adjacencia permite profundidade ilimitada sem criar tabelas por nivel.

## API principal

Areas:

- `GET /areas`
- `POST /areas`
- `PUT /areas/:id`
- `DELETE /areas/:id`

Processos:

- `GET /processes`
- `GET /processes/tree`
- `POST /processes`
- `PUT /processes/:id`
- `DELETE /processes/:id`

O endpoint `GET /processes/tree` retorna os processos ja organizados em arvore, com `children` recursivo. A tela Process Explorer consome essa estrutura diretamente para renderizar cards, subprocessos expansivos e detalhes laterais.

## Regras e validacoes

- Nome e area sao obrigatorios para processos.
- Status, prioridade e tipo de execucao sao validados no backend.
- A API impede que um processo seja pai dele mesmo.
- A API impede ciclos na hierarquia ao editar `parentId`.
- A exclusao de um processo tambem remove seus subprocessos descendentes.
- A exclusao de uma area remove os processos vinculados por cascade.

## Qualidade

Comandos usados para validar o projeto:

```bash
cd frontend
npm run lint
npm run build

cd ../backend
npm run build
```

## Material tecnico

A apresentacao tecnica do projeto esta em:

[docs/APRESENTACAO_TECNICA.md](docs/APRESENTACAO_TECNICA.md)
