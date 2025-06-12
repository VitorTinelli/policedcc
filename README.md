# Polícia DDM - Sistema de Gestão de Dados

Sistema de Gestão de Dados (SGD) da Polícia DDM — PMDDM

## Descrição
Este projeto é um sistema web completo para gerenciamento de perfis, cursos, promoções e autenticação de usuários da Polícia DDM, inspirado no universo Habbo. O sistema permite registro, login, aplicação de cursos por instrutores, solicitação de TAGs, promoções e gerenciamento completo de perfis, com integração à Supabase para autenticação e banco de dados.

## ✨ Funcionalidades Principais

### 🏠 Homepage
- **Dashboard personalizado** com resumo do perfil do militar logado
- **Atividade recente** com os últimos 3 registros do histórico
- **Links organizados por categorias:**
  - 📋 **Requerimentos**: Solicitar TAG, Promoções
  - 🎓 **Escola de Formação Básica**: Aplicar Cursos
  - 👥 **Perfis e Administração**: Buscar militares, relatórios (em desenvolvimento)
  - ⚙️ **Configurações**: Configurações da conta, logs (em desenvolvimento)

### 🔐 Autenticação
- **Sistema seguro** com verificação de perfil do Habbo
- **Registro em duas etapas**: Verificação no Habbo + Credenciais
- **Login integrado** com email/senha
- **Proteção de rotas** com contexto de autenticação

### 👤 Perfis de Militares
- **Visualização completa** de perfis com avatar do Habbo
- **Histórico detalhado** de cursos, promoções, punições e TAGs
- **Status do militar** (ativo/inativo)
- **Informações hierárquicas** (patente, cargo, TAG)
- **Busca por nickname** via header

### 🎓 Sistema de Cursos
- **Aplicação de cursos** por instrutores autorizados
- **Variedade de cursos**: CFS, CPO, CPS, CFL, CFB, CbFS, CAC
- **Histórico completo** de cursos aplicados
- **Criação automática** de militares para CFS

### ⭐ Sistema de Promoções
- **Promoção hierárquica** automatizada
- **Validação de patente** atual
- **Sistema de aprovação** com status
- **Histórico de promoções** e punições

### 🏷️ Sistema de TAGs
- **Solicitação de TAGs** personalizadas (3 caracteres)
- **Sistema de aprovação** com status
- **Verificação de duplicatas**
- **Integração com perfil**

### 📱 Interface Responsiva
- **Design moderno** com gradientes e sombras
- **Totalmente responsivo** para mobile, tablet e desktop
- **Modo escuro** automático baseado no sistema
- **Navegação intuitiva** com header expansível
- **Feedback visual** em todas as ações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** — Biblioteca principal para construção da interface
- **TypeScript** — Tipagem estática para maior robustez  
- **Vite** — Bundler e servidor de desenvolvimento rápido
- **React Router DOM** — Roteamento SPA
- **React Hook Form** — Gerenciamento de formulários
- **CSS Moderno** — Flexbox, Grid, animações e responsividade

### Backend/API  
- **Node.js (Vercel Serverless Functions)** — Funções serverless para endpoints
- **Supabase** — Backend as a Service para autenticação e banco de dados
- **Sistema de Segurança** — Middleware de autenticação personalizado
- **Integração Habbo** — Verificação de perfis via API


## 📁 Estrutura do Projeto
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
