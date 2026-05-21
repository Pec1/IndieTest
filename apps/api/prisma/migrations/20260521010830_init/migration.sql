-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administrador" (
    "id_admin" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nivel_acesso" TEXT NOT NULL,

    CONSTRAINT "administrador_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "testador" (
    "id_testador" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3),
    "pais" TEXT,

    CONSTRAINT "testador_pkey" PRIMARY KEY ("id_testador")
);

-- CreateTable
CREATE TABLE "perfil_desenvolvedor" (
    "id_perfil_dev" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nome_estudio" TEXT NOT NULL,
    "descricao" TEXT,
    "website" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfil_desenvolvedor_pkey" PRIMARY KEY ("id_perfil_dev")
);

-- CreateTable
CREATE TABLE "projeto" (
    "id_projeto" TEXT NOT NULL,
    "id_perfil_dev" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "projeto_pkey" PRIMARY KEY ("id_projeto")
);

-- CreateTable
CREATE TABLE "versao" (
    "id_versao" TEXT NOT NULL,
    "id_projeto" TEXT NOT NULL,
    "numero_versao" TEXT NOT NULL,
    "changelog" TEXT NOT NULL,
    "data_publicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "versao_pkey" PRIMARY KEY ("id_versao")
);

-- CreateTable
CREATE TABLE "convite" (
    "id_convite" TEXT NOT NULL,
    "id_projeto" TEXT NOT NULL,
    "id_testador" TEXT,
    "email_convidado" TEXT NOT NULL,
    "token_convite" TEXT NOT NULL,
    "data_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_convite" TEXT NOT NULL,

    CONSTRAINT "convite_pkey" PRIMARY KEY ("id_convite")
);

-- CreateTable
CREATE TABLE "teste_sessao" (
    "id_teste" TEXT NOT NULL,
    "id_versao" TEXT NOT NULL,
    "id_testador" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),
    "dispositivo" TEXT NOT NULL,
    "sistema_operacional" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "teste_sessao_pkey" PRIMARY KEY ("id_teste")
);

-- CreateTable
CREATE TABLE "feedback_bug" (
    "id_feedback" TEXT NOT NULL,
    "id_teste" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "severidade" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_bug_pkey" PRIMARY KEY ("id_feedback")
);

-- CreateTable
CREATE TABLE "anexo" (
    "id_anexo" TEXT NOT NULL,
    "id_feedback" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "tipo_arquivo" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "data_upload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anexo_pkey" PRIMARY KEY ("id_anexo")
);

-- CreateTable
CREATE TABLE "resposta_desenvolvedor" (
    "id_resposta" TEXT NOT NULL,
    "id_feedback" TEXT NOT NULL,
    "id_desenvolvedor" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "data_resposta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visivel_para_testador" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "resposta_desenvolvedor_pkey" PRIMARY KEY ("id_resposta")
);

-- CreateTable
CREATE TABLE "notificacao" (
    "id_notificacao" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("id_notificacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "administrador_id_usuario_key" ON "administrador"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "testador_id_usuario_key" ON "testador"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_desenvolvedor_id_usuario_key" ON "perfil_desenvolvedor"("id_usuario");

-- CreateIndex
CREATE INDEX "projeto_id_perfil_dev_idx" ON "projeto"("id_perfil_dev");

-- CreateIndex
CREATE INDEX "projeto_status_idx" ON "projeto"("status");

-- CreateIndex
CREATE INDEX "versao_id_projeto_idx" ON "versao"("id_projeto");

-- CreateIndex
CREATE UNIQUE INDEX "convite_token_convite_key" ON "convite"("token_convite");

-- CreateIndex
CREATE INDEX "convite_id_projeto_idx" ON "convite"("id_projeto");

-- CreateIndex
CREATE INDEX "convite_id_testador_idx" ON "convite"("id_testador");

-- CreateIndex
CREATE INDEX "teste_sessao_id_versao_idx" ON "teste_sessao"("id_versao");

-- CreateIndex
CREATE INDEX "teste_sessao_id_testador_idx" ON "teste_sessao"("id_testador");

-- CreateIndex
CREATE INDEX "teste_sessao_status_idx" ON "teste_sessao"("status");

-- CreateIndex
CREATE INDEX "feedback_bug_id_teste_idx" ON "feedback_bug"("id_teste");

-- CreateIndex
CREATE INDEX "feedback_bug_status_idx" ON "feedback_bug"("status");

-- CreateIndex
CREATE INDEX "feedback_bug_severidade_idx" ON "feedback_bug"("severidade");

-- CreateIndex
CREATE INDEX "anexo_id_feedback_idx" ON "anexo"("id_feedback");

-- CreateIndex
CREATE INDEX "resposta_desenvolvedor_id_feedback_idx" ON "resposta_desenvolvedor"("id_feedback");

-- CreateIndex
CREATE INDEX "resposta_desenvolvedor_id_desenvolvedor_idx" ON "resposta_desenvolvedor"("id_desenvolvedor");

-- CreateIndex
CREATE INDEX "notificacao_id_usuario_idx" ON "notificacao"("id_usuario");

-- CreateIndex
CREATE INDEX "notificacao_status_idx" ON "notificacao"("status");

-- AddForeignKey
ALTER TABLE "administrador" ADD CONSTRAINT "administrador_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testador" ADD CONSTRAINT "testador_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_desenvolvedor" ADD CONSTRAINT "perfil_desenvolvedor_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_id_perfil_dev_fkey" FOREIGN KEY ("id_perfil_dev") REFERENCES "perfil_desenvolvedor"("id_perfil_dev") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versao" ADD CONSTRAINT "versao_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "projeto"("id_projeto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "projeto"("id_projeto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_id_testador_fkey" FOREIGN KEY ("id_testador") REFERENCES "testador"("id_testador") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teste_sessao" ADD CONSTRAINT "teste_sessao_id_versao_fkey" FOREIGN KEY ("id_versao") REFERENCES "versao"("id_versao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teste_sessao" ADD CONSTRAINT "teste_sessao_id_testador_fkey" FOREIGN KEY ("id_testador") REFERENCES "testador"("id_testador") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_bug" ADD CONSTRAINT "feedback_bug_id_teste_fkey" FOREIGN KEY ("id_teste") REFERENCES "teste_sessao"("id_teste") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anexo" ADD CONSTRAINT "anexo_id_feedback_fkey" FOREIGN KEY ("id_feedback") REFERENCES "feedback_bug"("id_feedback") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta_desenvolvedor" ADD CONSTRAINT "resposta_desenvolvedor_id_feedback_fkey" FOREIGN KEY ("id_feedback") REFERENCES "feedback_bug"("id_feedback") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resposta_desenvolvedor" ADD CONSTRAINT "resposta_desenvolvedor_id_desenvolvedor_fkey" FOREIGN KEY ("id_desenvolvedor") REFERENCES "perfil_desenvolvedor"("id_perfil_dev") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
