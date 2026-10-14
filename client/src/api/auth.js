import { api } from './client';

export async function registerApi(data) {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function verifyEmailApi(token) {
  const res = await api.post('/auth/verify-email', { token });
  return res.data;
}

export async function loginApi(credentials) {
  const res = await api.post('/auth/login', credentials);
  return res.data;
}

export async function logoutApi() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function refreshApi() {
  const res = await api.post('/auth/refresh-token');
  return res.data;
}

export async function getMeApi() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function updateProfileApi(profileData) {
  const res = await api.put('/auth/profile', profileData);
  return res.data;
}

export async function uploadProfilePhotoApi(file) {
  const formData = new FormData();
  formData.append('profilePhoto', file);
  const res = await api.post('/auth/profile-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function forgotPasswordApi(email) {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

export async function resetPasswordApi(data) {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
}

export async function getCategoriesApi() {
  const res = await api.get('/categories');
  return res.data;
}
