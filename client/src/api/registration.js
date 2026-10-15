import { api } from './client';

export async function getRegistrationConfigApi() {
  const res = await api.get('/registrations/config');
  return res.data;
}

export async function calculateFeeApi(data) {
  const res = await api.post('/registrations/calculate-fee', data);
  return res.data;
}

export async function getMyRegistrationApi() {
  const res = await api.get('/registrations/my');
  return res.data;
}

export async function createOrUpdateRegistrationApi(data) {
  const res = await api.post('/registrations', data);
  return res.data;
}

export async function submitPaymentApi(formData) {
  const res = await api.post('/registrations/payment', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function downloadMyDelegateSlipApi() {
  const res = await api.get('/registrations/my/delegate-slip', {
    responseType: 'blob',
  });
  return res.data;
}

export async function downloadDelegateSlipByIdApi(id) {
  const res = await api.get(`/registrations/admin/${id}/delegate-slip`, {
    responseType: 'blob',
  });
  return res.data;
}

export async function getNotificationsApi() {
  const res = await api.get('/registrations/notifications');
  return res.data;
}

export async function markNotificationReadApi(id) {
  const res = await api.patch(`/registrations/notifications/${id}/read`);
  return res.data;
}

export async function verifyPassApi(identifier) {
  const res = await api.get(`/registrations/verify-pass/${encodeURIComponent(identifier)}`);
  return res.data;
}

// Admin API methods
export async function adminGetAllRegistrationsApi(params = {}) {
  const res = await api.get('/registrations/admin/all', { params });
  return res.data;
}

export async function adminGetRegistrationDetailsApi(id) {
  const res = await api.get(`/registrations/admin/${id}`);
  return res.data;
}

export async function adminReviewPaymentApi(id, data) {
  const res = await api.post(`/registrations/admin/${id}/review-payment`, data);
  return res.data;
}

export async function adminReviewRegistrationApi(id, data) {
  const res = await api.post(`/registrations/admin/${id}/review-registration`, data);
  return res.data;
}

export async function adminGetFeeSettingsApi() {
  const res = await api.get('/registrations/admin/fee-settings');
  return res.data;
}

export async function adminUpdateFeeSettingsApi(data) {
  const res = await api.put('/registrations/admin/fee-settings', data);
  return res.data;
}
