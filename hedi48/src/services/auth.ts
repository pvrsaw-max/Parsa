import { apiRequest, setAccessToken, clearAccessToken } from './api';

export async function login(email: string, password: string) {
  const response = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.token) setAccessToken(data.token);
  return data;
}

export async function register(payload: {email:string; password:string; name?:string}) {
  const response = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.json();
}

export function logout() {
  clearAccessToken();
}
