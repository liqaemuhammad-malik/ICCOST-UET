import { api } from './client';

export async function getSettingsApi() {
  const res = await api.get('/settings');
  return res.data;
}

export async function updateSettingApi(key, value, description = '') {
  const res = await api.put(`/settings/${key}`, { value, description });
  return res.data;
}
