import { api } from './client';

export interface Versao {
  id: string;
  projetoId: string;
  numeroVersao: string;
  changelog: string;
  dataPublicacao: string;
  status: string;
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  dataCriacao: string;
  status: string;
  desenvolvedor: {
    id?: string;
    nomeEstudio: string;
    usuario: { nome: string; email?: string };
  };
  _count?: { versoes: number; convites: number };
  versoes?: Versao[];
  convites?: {
    id: string;
    emailConvidado: string;
    statusConvite: string;
    dataEnvio: string;
    tokenConvite?: string;
  }[];
}

export async function getProjetos(params?: { status?: string; categoria?: string }): Promise<{ projetos: Projeto[] }> {
  const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return api(`/projetos${qs}`);
}

export async function getProjeto(id: string): Promise<{ projeto: Projeto }> {
  return api(`/projetos/${id}`);
}

export async function criarProjeto(body: {
  nome: string;
  descricao: string;
  categoria: string;
  status?: string;
}): Promise<{ message: string; projeto: { id: string; nome: string; status: string } }> {
  return api('/projetos', { method: 'POST', body: JSON.stringify(body) });
}

export async function criarVersao(
  projetoId: string,
  body: { numeroVersao: string; changelog: string; status?: string }
): Promise<{ message: string; versao: Versao }> {
  return api(`/projetos/${projetoId}/versoes`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
