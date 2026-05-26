import { FastifyInstance, FastifyRequest } from "fastify"
import "@fastify/multipart"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/authenticate"
import path from "node:path"
import fs from "node:fs/promises"
import crypto from "node:crypto"

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export async function createBugAttachment(app: FastifyInstance) {
  // Garante que o diretório de uploads existe
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  app.post('/bugs/:id/anexos', { preHandler: authMiddleware }, async (request: FastifyRequest, reply) => {
    const { id } = request.params as { id: string }

    const bug = await prisma.feedbackBug.findUnique({ where: { id } })
    if (!bug) return reply.status(404).send({ message: 'Bug não encontrado' })

    const data = await request.file()
    if (!data) return reply.status(400).send({ message: 'Nenhum arquivo enviado' })

    const ext = path.extname(data.filename)
    const nomeUnico = `${crypto.randomUUID()}${ext}`
    const destino = path.join(UPLOAD_DIR, nomeUnico)

    const buffer = await data.toBuffer()
    await fs.writeFile(destino, buffer)

    const anexo = await prisma.anexo.create({
      data: {
        feedbackBugId: id,
        nomeArquivo: data.filename,
        caminhoArquivo: `/uploads/${nomeUnico}`,
        tipoArquivo: data.mimetype,
        tamanho: buffer.length,
      },
    })

    return reply.status(201).send({ message: 'Arquivo enviado', anexo })
  })
}
