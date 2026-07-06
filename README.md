# 📋 Taskly - Gerenciador de Tarefas

O **Taskly** é um ecossistema completo para gerenciamento de produtividade e tarefas organizadas. O projeto possui uma arquitetura moderna e desacoplada, integrando uma API RESTful robusta no Backend a uma SPA (Single Page Application) reativa e de alta performance no Frontend.

---

## 🗺️ Mapa do Projeto & Status de Desenvolvimento

- [x] **Etapa 1: Arquitetura e Modelagem** — Definição do banco PostgreSQL e schemas de dados.
- [x] **Etapa 2: Setup do Projeto** — Inicialização dos ambientes Backend (Node/TypeScript) e Frontend (Angular).
- [x] **Etapa 3: Backend (Autenticação)** — Camada de segurança com JWT, hash de senhas e middlewares de proteção.
- [x] **Etapa 4: Backend (CRUD de Tarefas)** — Endpoints completos, validações estritas (Zod) e persistência via Prisma.
- [x] **Etapa 5: Frontend Angular** — Interface interativa construída com componentes funcionais, Lazy Loading e controle de rotas.
- [➔] **Etapa 6: Ajustes Finais** — **[VOCÊ ESTÁ AQUI]** Testes de integração, interceptors de requisições e validações de ponta a ponta.
- [ ] **Etapa 7: Deploy + README** — Publicação em ambiente de produção e encerramento da documentação.

---

## 📂 Estrutura de Pastas do Projeto

O projeto é organizado de forma desacoplada, dividindo claramente as responsabilidades de negócio do servidor (API) e as regras de renderização da interface do usuário (Client).

```text
Taskly/
├── BACKEND/
│   ├── prisma/                  # Schema e migrações do banco de dados PostgreSQL
│   ├── src/
│   │   ├── modules/
│   │   │   └── users/           # Módulo de Usuários (Controllers, Services)
│   │   │   └── tasks/           # Módulo de Tarefas/CRUD (Controllers, Services)
│   │   ├── shared/
│   │   │   ├── middleware/      # Middlewares de Autenticação e Segurança
│   │   │   └── utils/           # Utilitários globais (JWT, Criptografia)
│   │   └── server.ts            # Ponto de entrada da API Express
│   └── .env.example             # Modelo das variáveis de ambiente necessárias
│
├── FRONTEND/
│   ├── envoriment/              # Arquivos de ambiente para troca dinâmica de endpoints
│   │   ├── environment.prod.ts  # Configurações para produção (Deploy)
│   │   └── environment.ts       # Configurações para desenvolvimento local
│   ├── public/                  # Arquivos públicos estáticos (Favicon, imagens)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/      # Guardas funcionais de proteção de rotas (authGuard)
│   │   │   │   ├── interceptors/# Interceptors HTTP para anexar tokens JWT nas requisições
│   │   │   │   └── services/    # Serviços globais de integração (AuthService, TaskService)
│   │   │   ├── models/          # Tipagens e interfaces de dados (index.ts)
│   │   │   ├── pages/           # Componentes Standalone das telas do ecossistema
│   │   │   │   ├── dashboard/   # Tela principal de gerenciamento de tarefas
│   │   │   │   ├── login/       # Tela de autenticação
│   │   │   │   └── register/    # Tela de criação de novas contas
│   │   │   ├── app.component.ts # Componente raiz estrutural do Angular
│   │   │   ├── app.config.ts    # Provedores globais e injeção do roteador
│   │   │   ├── app.html         # Template HTML principal do app
│   │   │   ├── app.routes.ts    # Configuração de rotas dinâmicas (Lazy Loading)
│   │   │   ├── app.scss         # Estilos específicos do componente global
│   │   │   ├── app.spec.ts      # Arquivo de testes do componente raiz
│   │   │   └── app.ts           # Mapeamento interno lógico complementar
│   │   ├── index.html           # Arquivo HTML base da SPA
│   │   ├── main.ts              # Ponto de inicialização do bootstrap com Zone.js ativo
│   │   └── styles.scss          # Folha de estilos globais da aplicação
│   ├── .editorconfig            # Padronização de formatação do editor de código
│   ├── .prettierrc              # Regras de estilo de código do Prettier
│   ├── angular.json             # Configuração do workspace Angular e do motor Vite
│   ├── package.json             # Dependências e scripts de execução do projeto
│   ├── tsconfig.app.json        # Configurações do TypeScript voltadas para produção
│   ├── tsconfig.json            # Configurações estritas globais do compilador TS
│   └── tsconfig.spec.json       # Configuração isolada do ambiente de testes (Vitest)
```
---
## 🚀 Como Executar o Código Localmente

##Pré-requisitos

#Certifique-se de ter instalado em sua máquina:

    - Node.js (Versão 20 ou superior recomendada)

    - Um banco de dados PostgreSQL ativo localmente.

### 1. Executando o Backend

1. Abra o terminal e navegue até a pasta do backend:

```bash
cd taskly/BACKEND
```

2. Instale as dependências:

```bash
npm install
```

3. Copie o arquivo .env.example para .env e preencha com suas credenciais:
```Snippet de código
DATABASE_URL="postgresql://usuario:senha@localhost:5432/taskly?schema=public"
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
JWT_EXPIRES_IN="1d"
PORT=3000
```

4. Rode as migrações do Prisma para criar as tabelas no PostgreSQL:
```bash
npx prisma migrate dev
```
5. Inicie o servidor:
```bash
npm run dev
```
O backend rodará em http://localhost:3000.

### 2. Executando o Frontend Angular

1. Em um novo terminal, entre na pasta do cliente:
```bash
cd FRONTEND
```

2. Instale as dependências do ecossistema:
```bash
npm install
```

3.  Inicie o servidor de desenvolvimento limpando as otimizações prévias do cache do Vite:
```bash
npx ng serve
```

O frontend estará acessível em http://localhost:4200 e redirecionará automaticamente para o login.
