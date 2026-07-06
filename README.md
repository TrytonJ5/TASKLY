# 🚀 Taskly - Gestão Inteligente de Tarefas

O **Taskly** é uma plataforma completa de produtividade projetada para centralizar e otimizar a gestão de atividades diárias. O projeto aplica conceitos de separação de responsabilidades (SoC), arquitetura em camadas e tipagem estática para construir um ecossistema escalável, robusto e totalmente alinhado com os padrões atuais do mercado de software.

Este repositório foi estruturado utilizando a estratégia de **Monorepo**, isolando o ecossistema da API e a interface do usuário em diretórios independentes para facilitar a governança, a manutenção e a avaliação técnica.

---

## 🗺️ Mapa do Projeto & Status de Desenvolvimento

- [x] **Etapa 1: Arquitetura e Modelagem** — Definição do banco PostgreSQL e schemas de dados.
- [x] **Etapa 2: Setup do Projeto** — Inicialização do ambiente com TypeScript, Node e gerenciadores.
- [x] **Etapa 3: Backend (Autenticação)** — Camada de segurança com JWT, hash de senhas e middlewares.
- [x] **Etapa 4: Backend (CRUD de Tarefas)** — Endpoints completos, validações estritas (Zod) e persistência.
- [➔] **Etapa 5: Frontend Angular** — **[VOCÊ ESTÁ AQUI]** Construção da interface SPA interativa e integração com a API.
- [ ] **Etapa 6: Ajustes Finais** — Testes de ponta a ponta, tratamento global de exceções e refinamento.
- [ ] **Etapa 7: Deploy & Documentação Final** — Publicação em ambiente de produção.

---

## ⚙️ Backend (Concluído)

A API do Taskly foi desenhada seguindo princípios de arquitetura limpa, separação de responsabilidades por módulos e tipagem estática rigorosa para evitar falhas em tempo de execução.

### 🛠️ Tecnologias Utilizadas
* **Runtime:** Node.js v24+ com `tsx` (TypeScript Execute) para desenvolvimento ágil em memória.
* **Linguagem:** TypeScript (Configuração estrita com `exactOptionalPropertyTypes` ativo).
* **Framework Web:** Express.js.
* **ORM:** Prisma Client conectado ao banco relacional **PostgreSQL**.
* **Validação de Dados:** Zod (Mapeamento de payloads e prevenção de dados corrompidos).
* **Segurança:** Autenticação via JSON Web Tokens (JWT) e criptografia de credenciais.

### 🔒 Segurança e Variáveis de Ambiente
O projeto faz uso isolado de variáveis de ambiente (`.env`). As credenciais sensíveis e segredos criptográficos **nunca** são expostos no repositório público, sendo gerenciados localmente e mapeados através do arquivo `.env.example`.

### 🔀 Principais Endpoints Disponíveis
* `POST /users/register` -> Criação de novas contas com validação de duplicidade.
* `POST /users/login` -> Autenticação de usuários e geração de token JWT.
* `POST /tasks` -> Criação de tarefas associadas ao usuário logado (Campos opcionais tratados estritamente como `null` no banco).
* `GET /tasks` -> Listagem filtrada das tarefas.
* `PATCH /tasks/:id` -> Atualizações parciais dinâmicas (Inputs `undefined` são expurgados programaticamente para integridade do ORM).
* `DELETE /tasks/:id` -> Remoção segura de registros.

---

## 📐 Próxima Etapa: Frontend Angular 🚀

Com a nossa API RESTful totalmente operacional e protegida, o foco agora se volta para a aplicação cliente:

1. **Setup do Workspace:** Criação do projeto via Angular CLI e estruturação de módulos/componentes standalones.
2. **Integração de Recursos:** Avaliação do uso do **Angular CDK** para mecânicas complexas de interface (como comportamentos de arrastar e soltar cartões de tarefas) e controle fino de reatividade.
3. **Gerenciamento de Estado e Rotas:** Criação de Guards de rotas para proteger as telas internas contra usuários não autenticados.

## 🛠️ Stack Tecnológica Atualizada

### Back-end
* **Node.js** + **Express**
* **TypeScript** (Compilação avançada e tipagem estática integrada via `nodenext`)
* **Prisma ORM** + **PostgreSQL** (Persistência relacional estável)
* **Zod** (Validação matemática de esquemas e contratos de entrada)
* **BcryptJS** & **JSONWebToken (JWT)** (Segurança de tráfego e identidade)
* **CORS** & **Dotenv** (Regras de compartilhamento de recursos e variáveis de ambiente)

### Front-end (Fase Futura)
* **Angular SPA** (Arquitetura baseada em componentes reativos)
* **RxJS** (Gerenciamento assíncrono de fluxos de eventos)

---

## 📁 Estrutura de Pastas Atualizada

```text
TASKLY/                       # Raiz do projeto (Repositório Git)
├── BACKEND/                  # Ecossistema da API REST
│   ├── src/
│   │   ├── modules/          # Domínios de negócio isolados
│   │   │   ├── users/        # Fluxo de Usuários (Controllers, Services, Repositories, Routes)
│   │   │   └── tasks/        # Fluxo de Tarefas (Em desenvolvimento)
│   │   ├── shared/           # Estruturas compartilhadas globalmente
│   │   │   ├── infra/
│   │   │   │   └── http/     # Hub central de roteamento externo
│   │   │   └── middlewares/  # Guardiões de Autenticação JWT e Manipulação Global de Erros
│   │   ├── app.ts            # Inicialização, injeção de middlewares comuns e CORS do Express
│   │   └── server.ts         # Inicialização do servidor HTTP e carregamento imediato do Dotenv
│   ├── .env                  # Arquivo confidencial de variáveis de ambiente (PORT, JWT_SECRET, DATABASE_URL)
│   ├── package.json          # Gerenciador de dependências, metadados e scripts
│   └── tsconfig.json         # Configurações otimizadas do compilador TypeScript
└── FRONTEND/                 # Interface do Usuário (Angular)
```

---
## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório e Navegar
```bash
git clone [https://github.com/TrytonJ5/taskly.git](https://github.com/TrytonJ5/taskly.git)
cd taskly/BACKEND
```
### 2. Configurar o Ambiente (.env)
Crie o arquivo .env na raiz da pasta /BACKEND:
```Snippet de código

PORT=3000
JWT_SECRET=sua_chave_criptografica_gerada_aqui
DATABASE_URL=postgresql://usuario:senha@localhost:5432/taskly_db
```

### 3. Instalar as Dependências
```bash
npm install
```

### 4. Rodar em Modo de Desenvolvimento (Live Reload)
```bash
npm run dev
```

Ao iniciar, você verá a confirmação no terminal:
```Plaintext
🔥 Taskly rodando com sucesso na porta 3000!
```