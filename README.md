# 🚀 Taskly - Gestão Inteligente de Tarefas

O **Taskly** é uma plataforma completa de produtividade projetada para centralizar e otimizar a gestão de atividades diárias. O projeto aplica conceitos de separação de responsabilidades (SoC), arquitetura em camadas e tipagem estática para construir um ecossistema escalável e profissional.

Este repositório foi estruturado utilizando a estratégia de **Monorepo**, isolando o ecossistema da API e a interface do usuário em diretórios independentes para facilitar a manutenção.

---

## 📐 Arquitetura do Sistema (Back-end)

O ecossistema do servidor foi desenhado seguindo uma **Arquitetura Baseada em Módulos/Domínios**, onde cada entidade do sistema possui isolamento de suas camadas técnicas:

1. **Rotas (`routes`)**: Define as portas de entrada das requisições HTTP e direciona o fluxo.
2. **Middlewares**: Camada de interceptação global para tratamentos de segurança, validação de dados e erros.
3. **Controllers**: Camada de transporte que recebe as requisições HTTP, valida o formato dos dados e invoca as regras de negócio.
4. **Services**: Onde residem estritamente as **regras de negócio** isoladas da aplicação.
5. **Repositories**: Abstração da camada de persistência de dados. Comunica-se diretamente com o banco através do Prisma ORM.

---

## 🛠️ Tecnologias Utilizadas

### Back-end (Construído)
* **Node.js** + **Express**
* **TypeScript** (Compilação moderna via `nodenext`)
* **Prisma ORM** + **PostgreSQL** (Abstração de persistência)
* **Zod** (Validação de esquemas e dados de entrada)
* **CORS** & **Dotenv** (Segurança e variáveis de ambiente)
* **JWT (JSON Web Tokens)** & **BcryptJS** (Criptografia e sessões seguras)

### Front-end (Arquitetura Futura)
* **Angular SPA**
* **RxJS** (Programação reativa)

---

## 📁 Estrutura de Pastas do Monorepo

```text
TASKLY/                       # Raiz do projeto (Repositório Git)
├── BACKEND/                  # Ecossistema da API REST
│   ├── src/
│   │   ├── modules/          # Domínios de negócio isolados
│   │   │   ├── users/        # Fluxo de Usuários (Controllers, Services, Repositories, Routes)
│   │   │   └── tasks/        # Fluxo de Tarefas e Auditorias (Histórico)
│   │   ├── shared/           # Estruturas compartilhadas globalmente
│   │   │   ├── infra/
│   │   │   │   └── http/     # Hub central de roteamento externo
│   │   │   └── middlewares/  # Autenticação JWT e Manipulação Global de Erros
│   │   ├── app.ts            # Inicialização, injeção de middlewares e CORS do Express
│   │   └── server.ts         # Inicialização do servidor HTTP e carregamento do Dotenv
│   ├── .env                  # Arquivo confidencial de variáveis de ambiente
│   ├── package.json          # Gerenciador de dependências e scripts de execução
│   └── tsconfig.json         # Configurações do compilador TypeScript
└── FRONTEND/                 # Aplicação Client (Interface do Usuário em Angular)