import { api } from './client';

export interface Bug {
  id: string;
  testeSessaoId: string;
  titulo: string;
  descricao: string;
  tipo: string;
  severidade: string;
  status: string;
  dataCriacao: string;
  testeSessao?: {
    id: string;
    versaoId: string;
    testadorId: string;
    dataInicio: string;
    dataFim: string | null;
    dispositivo: string;
    sistemaOperacional: string;
    status: string;
    testador?: { id: string; usuario: { nome: string; email?: string } };
    versao?: { numeroVersao: string; projeto: { id: string; nome: string } };
  };
  anexos?: {
    id: string;
    nomeArquivo: string;
    caminhoArquivo: string;
    tipoArquivo: string;
    tamanho: number;
    dataUpload: string;
  }[];
  respostas?: {
    id: string;
    feedbackBugId: string;
    perfilDevId: string;
    mensagem: string;
    dataResposta: string;
    visivelTestador: boolean;
    desenvolvedor?: { id: string; usuario: { nome: string } };
  }[];
  _count?: { anexos: number; respostas: number };
}

export interface Paginacao {
  total: number;
  pagina: number;
  limite: number;
  paginas: number;
}

export async function getBugs(params?: {
  projetoId?: string;
  status?: string;
  severidade?: string;
  tipo?: string;
  page?: number;
  limit?: number;
}): Promise<{ bugs: Bug[]; paginacao?: Paginacao }> {
  const qs = params ? '?' + new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
  ).toString() : '';
  return api(`/bugs${qs}`);
}

export async function getBug(id: string): Promise<{ bug: Bug }> {
  return api(`/bugs/${id}`);
}

export async function criarBug(body: {
  testeSessaoId: string;
  titulo: string;
  descricao: string;
  tipo: string;
  severidade: string;
  status?: string;
}): Promise<{ message: string; bug: Bug }> {
  return api('/bugs', { method: 'POST', body: JSON.stringify(body) });
}

export async function atualizarStatusBug(
  id: string,
  status: string
): Promise<{ message: string; bug: Bug }> {
  return api(`/bugs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function criarRespostaBug(
  id: string,
  body: { mensagem: string; visivelTestador?: boolean }
): Promise<{ message: string; resposta: NonNullable<Bug['respostas']>[0] }> {
  return api(`/bugs/${id}/respostas`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
