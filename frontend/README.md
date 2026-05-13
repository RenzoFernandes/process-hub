# ProcessHub Frontend

Frontend do ProcessHub, construido com React, TypeScript, Vite e Tailwind CSS.

## Responsabilidades

- Autenticacao e persistencia de sessao.
- Rotas protegidas.
- Consumo da API REST com Axios.
- Dashboard do workspace.
- CRUD de areas.
- Cadastro e edicao de processos.
- Pipeline Kanban com drag and drop.
- Drawer de detalhes do processo.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- dnd-kit
- Lucide React

## Variaveis de ambiente

Crie `frontend/.env` quando quiser apontar para uma API especifica:

```env
VITE_API_URL=http://localhost:3333
```

Se essa variavel nao existir, o frontend usa `http://localhost:3333`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Aplicacao local:

```text
http://localhost:5173
```
