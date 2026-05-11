# ProcessHub

ProcessHub é uma aplicação full-stack para mapear áreas, processos e subprocessos de uma empresa, criada para atender ao case técnico da Stage Consulting.

O projeto resolve um problema comum em empresas em crescimento: processos internos pouco documentados, responsáveis dispersos, ferramentas não centralizadas e dificuldade para visualizar como uma atividade se conecta a outra.

## Aderência ao case

| Requisito do case | Como foi atendido |
| --- | --- |
| Separar frontend e backend | Projeto dividido em `frontend` e `backend`, comunicando por API REST JSON. |
| Cadastro de áreas | Tela de Áreas com criação, listagem, edição, exclusão e contagem de processos. |
| Cadastro de processos e subprocessos | Tela de Processos com CRUD completo e vínculo hierárquico por `parentId`. |
| Subprocessos ilimitados | Modelagem recursiva na tabela `Process`, permitindo qualquer profundidade. |
| Ferramentas, responsáveis e documentação | Campos próprios no cadastro e visualização dos processos. |
| Visualização clara da cadeia | Fluxograma navegável com React Flow, linhas, setas, zoom, minimapa e cores por prioridade. |
| Status e prioridade | Dashboard e cards exibem status, prioridade e destaque visual. |
| Banco relacional | PostgreSQL com Prisma ORM e migrations versionadas. |
| Ambiente reproduzível | PostgreSQL executado via Docker Compose. |
| Material de apresentação | Documento técnico em `docs/APRESENTACAO_TECNICA.md`. |

## Funcionalidades

- **Dashboard:** visão geral com total de áreas, processos, subprocessos, alta prioridade, status, prioridades e filtro por área.
- **Processos:** tela principal do case, com criação, edição, exclusão, subprocessos, detalhes operacionais e fluxograma.
- **Áreas:** gestão organizacional com CRUD de áreas e quantidade de processos por área.
- **Fluxograma:** visualização horizontal da hierarquia, com processos raiz à esquerda e subprocessos nas colunas seguintes.

## Tecnologias

**Backend**

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL

**Frontend**

- React
- TypeScript
- Vite
- Tailwind CSS
- React Flow
- Lucide React
- Axios

**Infraestrutura local**

- Docker Compose
- PostgreSQL 16

## Como executar

### 1. Subir o banco

```bash
docker compose up -d
```

O PostgreSQL roda no container na porta `5432` e fica disponível no host pela porta `5433`.

### 2. Configurar variáveis do backend

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

URLs padrão:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`
- PostgreSQL local: `localhost:5433`

## Arquitetura

```mermaid
flowchart LR
  User[Usuário] --> Frontend[React + Vite]
  Frontend -->|HTTP JSON| API[Express API]
  API --> Routes[Routes]
  Routes --> Controllers[Controllers]
  Controllers --> Prisma[Prisma Client]
  Prisma --> Postgres[(PostgreSQL em Docker)]
```

O frontend é responsável pela experiência visual e pelo consumo da API. O backend concentra regras, endpoints REST e persistência. O Prisma faz a ponte tipada entre o código TypeScript e o PostgreSQL.

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

O campo `parentId` é o ponto central da hierarquia. Quando ele é nulo, o registro é um processo raiz. Quando aponta para outro processo, o registro passa a ser um subprocesso.

Essa modelagem é chamada de lista de adjacência e permite representar subprocessos ilimitados sem criar tabelas extras para cada nível.

## API principal

Áreas:

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

O endpoint `GET /processes/tree` busca os processos no banco, monta a árvore usando `parentId` e devolve a estrutura pronta para o fluxograma.

## Decisões técnicas

- **Express:** simples, direto e adequado para uma API REST objetiva.
- **Controllers separados das rotas:** deixam os endpoints organizados e facilitam manutenção.
- **Prisma:** entrega tipagem, migrations, relações e acesso seguro ao PostgreSQL.
- **PostgreSQL:** banco relacional adequado para áreas, processos e relacionamentos.
- **Docker:** padroniza o banco local e reduz problemas de ambiente.
- **React Flow:** atende ao requisito de visualização criativa e navegável da cadeia de processos.
- **`parentId`:** permite hierarquia flexível, subprocessos ilimitados e fácil montagem da árvore.

## Material técnico

A apresentação objetiva do projeto está em:

[docs/APRESENTACAO_TECNICA.md](docs/APRESENTACAO_TECNICA.md)
