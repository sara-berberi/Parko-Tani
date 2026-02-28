import { api } from './client';

export type AuthResponse = {
  user: { id: string; email: string; role: string; name: string };
  accessToken: string;
  refreshToken: string;
};

export async function signup(payload: { name: string; email: string; password: string }) {
  const { data } = await api.post<AuthResponse>('/auth/signup', payload);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function refresh(refreshToken: string) {
  const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
  return data;
}
