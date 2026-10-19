import { api } from './client';

let settingsRequest = null;

export async function getSettingsApi() {
  if (!settingsRequest) {
    settingsRequest = api.get('/settings').then((res) => res.data).finally(() => {
      settingsRequest = null;
    });
  }
  return settingsRequest;
}

export async function updateSettingApi(key, value, description = '') {
  const res = await api.put(`/settings/${key}`, { value, description });
  return res.data;
}
