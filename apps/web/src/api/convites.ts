import { api } from './client';

export interface Convite {
  id: string;
  projetoId: string;
  testadorId: string | null;
  emailConvidado: string;
  tokenConvite: string;
  dataEnvio: string;
  statusConvite: 'pendente' | 'aceito' | 'recusado';
  projeto: {
    id: string;
    nome: string;
    categoria: string;
    desenvolvedor: { nomeEstudio: string };
  };
}

export async function getConvites(params?: {
  status?: 'pendente' | 'aceito' | 'recusado';
}): Promise<{ convites: Convite[] }> {
  const qs = params?.status ? `?status=${params.status}` : '';
  return api(`/convites${qs}`);
}

export async function convidarTestador(
  projetoId: string,
  emailConvidado: string
): Promise<{ message: string; convite: Convite }> {
  return api('/convites', {
    method: 'POST',
    body: JSON.stringify({ projetoId, emailConvidado }),
  });
}

export async function responderConvite(
  id: string,
  acao: 'aceitar' | 'recusar'
): Promise<{ message: string; convite: Convite }> {
  return api(`/convites/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ acao }),
  });
}
