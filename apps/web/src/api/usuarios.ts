import { api } from './client';
import type { Usuario } from './auth';

export async function getUsuarios(): Promise<{ users: Usuario[] }> {
  return api('/users');
}

export async function getUsuario(id: string): Promise<{ user: Usuario }> {
  return api(`/users/${id}`);
}
