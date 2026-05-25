import { api } from './client';

export interface Notificacao {
  id: string;
  destinatarioId: string;
  tipo: string;
  mensagem: string;
  status: 'pendente' | 'lida';
  dataCriacao: string;
}

export async function getNotificacoes(params?: {
  status?: 'pendente' | 'lida';
  page?: number;
  limit?: number;
}): Promise<{ notificacoes: Notificacao[]; paginacao: { total: number; pagina: number; limite: number; paginas: number } }> {
  const qs = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : '';
  return api(`/notificacoes${qs}`);
}

export async function marcarNotificacaoLida(id: string): Promise<{ message: string; notificacao: Notificacao }> {
  return api(`/notificacoes/${id}/lida`, { method: 'PATCH' });
}
