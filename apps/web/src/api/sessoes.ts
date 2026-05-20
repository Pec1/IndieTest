import { api } from './client';

export interface TesteSessao {
  id: string;
  versaoId: string;
  testadorId: string;
  dataInicio: string;
  dataFim: string | null;
  dispositivo: string;
  sistemaOperacional: string;
  status: string;
}

export async function criarSessao(body: {
  versaoId: string;
  dispositivo: string;
  sistemaOperacional: string;
}): Promise<{ message: string; sessao: TesteSessao }> {
  return api('/teste-sessoes', { method: 'POST', body: JSON.stringify(body) });
}
