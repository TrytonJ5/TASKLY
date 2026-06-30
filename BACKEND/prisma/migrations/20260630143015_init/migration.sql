-- CreateEnum
CREATE TYPE "StatusTarefa" AS ENUM ('pendente', 'em_andamento', 'concluida');

-- CreateEnum
CREATE TYPE "PrioridadeTarefa" AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" "StatusTarefa" NOT NULL DEFAULT 'pendente',
    "prioridade" "PrioridadeTarefa" NOT NULL DEFAULT 'media',
    "responsavel" TEXT,
    "data_limite" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_tarefas" (
    "id" TEXT NOT NULL,
    "tarefa_id" TEXT NOT NULL,
    "alterado_por" TEXT,
    "campo_alterado" TEXT NOT NULL,
    "valor_anterior" TEXT,
    "valor_novo" TEXT,
    "alterado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "tarefas_usuario_id_idx" ON "tarefas"("usuario_id");

-- CreateIndex
CREATE INDEX "tarefas_status_idx" ON "tarefas"("status");

-- CreateIndex
CREATE INDEX "tarefas_prioridade_idx" ON "tarefas"("prioridade");

-- CreateIndex
CREATE INDEX "tarefas_data_limite_idx" ON "tarefas"("data_limite");

-- CreateIndex
CREATE INDEX "tarefas_usuario_id_status_idx" ON "tarefas"("usuario_id", "status");

-- CreateIndex
CREATE INDEX "historico_tarefas_tarefa_id_idx" ON "historico_tarefas"("tarefa_id");

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_tarefas" ADD CONSTRAINT "historico_tarefas_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_tarefas" ADD CONSTRAINT "historico_tarefas_alterado_por_fkey" FOREIGN KEY ("alterado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
