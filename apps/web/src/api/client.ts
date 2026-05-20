const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

function getToken(): string | null {
  return localStorage.getItem('@indietest:token');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro de rede' }));
    throw new ApiError(error.message || `Erro ${response.status}`, response.status);
  }

  return response.json();
}
