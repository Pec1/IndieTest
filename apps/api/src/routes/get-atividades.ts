import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { authMiddleware, CRequest } from "../middleware/authenticate"

export async function getAtividades(app: FastifyInstance) {
  app.get('/atividades', { preHandler: authMiddleware }, async (request: CRequest, reply) => {
    const userId = request.user.userId

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { email: true },
    })

    const [bugs, sessoes, convites] = await Promise.all([
      prisma.feedbackBug.findMany({
        take: 8,
        orderBy: { dataCriacao: 'desc' },
        where: {
          OR: [
            { testeSessao: { testador: { usuarioId: userId } } },
            { testeSessao: { versao: { projeto: { desenvolvedor: { usuarioId: userId } } } } },
          ],
        },
        include: {
          testeSessao: {
            include: { versao: { include: { projeto: { select: { nome: true } } } } }
          }
        },
      }),
      prisma.testeSessao.findMany({
        take: 5,
        orderBy: { dataInicio: 'desc' },
        where: {
          OR: [
            { testador: { usuarioId: userId } },
            { versao: { projeto: { desenvolvedor: { usuarioId: userId } } } },
          ],
        },
        include: { versao: { include: { projeto: { select: { nome: true } } } } },
      }),
      prisma.convite.findMany({
        take: 5,
        orderBy: { dataEnvio: 'desc' },
        where: {
          OR: [
            ...(usuario ? [{ emailConvidado: usuario.email }] : []),
            { projeto: { desenvolvedor: { usuarioId: userId } } },
          ],
        },
        select: { emailConvidado: true, dataEnvio: true, statusConvite: true, projeto: { select: { nome: true } } },
      }),
    ])

    const atividades = [
      ...bugs.map(b => ({
        tipo: 'bug' as const,
        texto: `Bug "${b.titulo}" reportado em "${b.testeSessao?.versao?.projeto?.nome || 'projeto'}"`,
        data: b.dataCriacao,
        cor: '#D4FF00',
      })),
      ...sessoes.map(s => ({
        tipo: 'sessao' as const,
        texto: `Sessão iniciada em "${s.versao?.projeto?.nome || 'projeto'}"`,
        data: s.dataInicio,
        cor: '#4A3AFF',
      })),
      ...convites.map(c => ({
        tipo: 'convite' as const,
        texto: `Convite para "${c.projeto?.nome}" — ${c.emailConvidado}`,
        data: c.dataEnvio,
        cor: '#10b981',
      })),
    ]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 15)

    return reply.send({ atividades })
  })
}
