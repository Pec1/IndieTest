import { api } from './client';

export interface Atividade {
  tipo: 'bug' | 'sessao' | 'convite';
  texto: string;
  data: string;
  cor: string;
}

export async function getAtividades(): Promise<{ atividades: Atividade[] }> {
  return api('/atividades');
}
