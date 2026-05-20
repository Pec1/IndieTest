import { api } from './client';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  dataCadastro: string;
  tipo: string;
  testador?: { id: string; pais?: string };
  desenvolvedor?: { id: string; nomeEstudio: string };
  administrador?: { id: string; nivelAcesso: string };
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  };
}

export interface CriarUsuarioBody {
  nome: string;
  email: string;
  senha: string;
  tipo: 'testador' | 'desenvolvedor' | 'administrador';
  nomeEstudio?: string;
  dataNascimento?: string;
  pais?: string;
  nivelAcesso?: string;
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  return api('/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export async function criarUsuario(body: CriarUsuarioBody) {
  return api('/users', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getPainel(): Promise<{ user: Usuario }> {
  return api('/painel');
}
