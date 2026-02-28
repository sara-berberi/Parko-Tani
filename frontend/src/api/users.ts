import { api } from './client';

export async function registerDeviceToken(token: string, platform: string) {
  const { data } = await api.post('/users/device-token', { token, platform });
  return data;
}
