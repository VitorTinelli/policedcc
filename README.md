# Polícia DCC

Sistema de Gestão de Dados (SGD) da Polícia DCC — PMDCC

## Descrição
Este projeto é um sistema web para gerenciamento de perfis, cursos e autenticação de usuários da Polícia DCC, inspirado no universo Habbo. O sistema permite registro, login, aplicação de cursos por instrutores e gerenciamento de perfis, com integração à Supabase para autenticação e banco de dados.

## Tecnologias Utilizadas

### Frontend
- **React 19** — Biblioteca principal para construção da interface.
- **TypeScript** — Tipagem estática para maior robustez.
- **Vite** — Bundler e servidor de desenvolvimento rápido.
- **React Router DOM** — Roteamento SPA.
- **React Hook Form** — Gerenciamento de formulários.
- **React Input Mask** — Máscaras de input.
- **CSS** — Estilização customizada e responsiva.

### Backend/API
- **Node.js (Vercel Serverless Functions)** — Funções serverless para endpoints de autenticação, registro, cursos, etc. 
- **Supabase** — Backend as a Service para autenticação, banco de dados.
- **uuid** — Geração de códigos únicos para verificação.

### Outras Dependências
- **@vitejs/plugin-react** — Integração React + Vite.
- **ESLint** — Linting e padronização de código.
- **TypeScript ESLint** — Linting para TypeScript.

## Estrutura do Projeto
```
├── src/
│   ├── commons/         # Helpers e contextos globais
│   ├── modules/         # Componentes de página (login, register, instrutores, etc)
│   ├── assets/          # Imagens e SVGs
│   └── main.tsx         # Entry point React
├── api/                 # Funções serverless (Vercel)
├── public/              # Arquivos estáticos
├── index.html           # HTML principal
├── package.json         # Dependências e scripts
├── tsconfig*.json       # Configurações TypeScript
└── vite.config.ts       # Configuração Vite
```

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/policedcc.git
   cd policedcc
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente:**
   - Pergunte a um desenvolvedor.
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   vercel dev
   ```
5. **Acesse:**
   - [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis
- `npm run dev` — Inicia o frontend em modo desenvolvimento.
- `npm run build` — Gera build de produção.
- `npm run preview` — Visualiza build de produção localmente.
- `npm run lint` — Lint do código.

## Deploy
O deploy pode ser feito facilmente na [Vercel](https://vercel.com/) usando as funções serverless da pasta `api/`.

## Licença
Este projeto é open-source e está sob a licença MIT.

---
Desenvolvido por DCCDev — PMDCC
