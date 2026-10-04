const TOKEN_KEY = 'hedi_access_token';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const token = getAccessToken();

  if (!baseUrl) {
    return {
      ok: false,
      status: 0,
      json: async () => ({ error: 'API URL is not configured' }),
    } as Response;
  }

  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}
