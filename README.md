# 🚀 Taskly - Gestão Inteligente de Tarefas

O **Taskly** é uma plataforma completa de produtividade projetada para centralizar e otimizar a gestão de atividades diárias. O projeto aplica conceitos de separação de responsabilidades (SoC), arquitetura em camadas e tipagem estática para construir um ecossistema escalável, robusto e totalmente alinhado com os padrões atuais do mercado de software.

Este repositório foi estruturado utilizando a estratégia de **Monorepo**, isolando o ecossistema da API e a interface do usuário em diretórios independentes para facilitar a governança, a manutenção e a avaliação técnica.

---

## 🎯 Status do Cronograma e Fases do Projeto

O plano de desenvolvimento do Taskly foi dividido de forma cirúrgica em etapas incrementais. Atualmente, atingimos um marco crítico com a **conclusão da Fase 3**:

* [x] **Fase 1: Arquitetura e Modelagem** — Definição do fluxo entre camadas (Controllers ➡️ Services ➡️ Repositories) e mapeamento das tabelas.
* [x] **Fase 2: Setup do Projeto** — Estrutura de pastas unificada, configurações modernas do TypeScript (`nodenext`), ambientes locais e variáveis globais.
* [x] **Fase 3: Backend - Autenticação & Autorização (Concluída 🚀)** — Implementação de rotas para cadastro, login, geração de tokens seguros, criptografia de credenciais e interceptação via middleware de proteção.
* [ ] **Fase 4: Backend - CRUD de Tarefas** — Endpoints de manipulação, validações com Zod e histórico de auditoria em tempo real.
* [ ] **Fase 5: Frontend Angular** — Desenvolvimento do cliente web (telas de login, dashboards reativos, filtros e consumo da API).
* [ ] **Fase 6: Ajustes Finais & Testes Manuais** — Garantia de qualidade de ponta a ponta.
* [ ] **Fase 7: Deploy & Entrega** — Publicação em nuvem (Render/Railway para o backend, Vercel/Netlify para o frontend Angular) e documentação de encerramento.

---

## 📐 Arquitetura do Sistema e Fluxo de Dados (Fase 1 & 2)

O ecossistema do servidor foi desenhado seguindo uma **Arquitetura Baseada em Módulos/Domínios**. Cada entidade de negócio possui isolamento estrito de suas camadas técnicas para garantir facilidade de testes e manutenibilidade:

1. **Rotas (`routes`)**: Porta de entrada e mapeamento dos caminhos expostos pela API.
2. **Middlewares**: Camada interceptadora global. Usada para autenticação JWT, tratamento global de falhas e validações.
3. **Controllers**: Camada de transporte que recebe os dados HTTP (`req`, `res`), valida os formatos de entrada e despacha a execução.
4. **Services**: O coração do software, onde as **regras de negócio** reais rolam de forma isolada do Express ou do banco de dados.
5. **Repositories**: Abstração da camada de persistência. Comunica-se com o banco através do Prisma ORM.

---

## 🔒 Detalhes Técnicos da Fase 3: Autenticação & Autorização

A API agora conta com uma camada rigorosa de segurança nativa baseada nos padrões mais recomendados de segurança web:

* **Cadastro de Usuários:** Proteção contra vazamento de dados. As senhas enviadas nunca são gravadas em texto limpo no banco; elas passam por um processo de hash criptográfico de alta entropia alimentado pelo **BcryptJS**.
* **Autenticação via JWT:** Ao realizar login com sucesso, a API gera um token **JSON Web Token (JWT)** criptografado com o segredo exclusivo da aplicação (`JWT_SECRET`).
* **Middleware de Proteção de Rotas:** Desenvolvido para atuar como um guardião nas rotas privadas de tarefas. Ele intercepta as requisições HTTP, extrai o token enviado no cabeçalho (*Authorization Bearer*), valida sua integridade/expiração e injeta os dados do usuário autenticado diretamente na requisição para consumo seguro pelas camadas seguintes.

---

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
git clone [https://github.com/seu-usuario/taskly.git](https://github.com/seu-usuario/taskly.git)
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