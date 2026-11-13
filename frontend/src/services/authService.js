import { api } from '../lib/apiClient';

const AUTH_BASE = '/api/auth';

export const OTP_TYPES = {
  SIGN_UP: 'sign-up',
  FORGET_PASSWORD: 'forget-password',
};

export function login(email, password) {
  return api.post(`${AUTH_BASE}/login`, { email, password });
}

export function googleLogin(code) {
  return api.post(`${AUTH_BASE}/google`, { code });
}

export function register(payload) {
  return api.post(`${AUTH_BASE}/register`, payload);
}

export function logout() {
  return api.post(`${AUTH_BASE}/logout`, {});
}

export function fetchSession() {
  return api.get(`${AUTH_BASE}/me`);
}

export function verifyOtp(email, otp_code, type = OTP_TYPES.SIGN_UP) {
  return api.post(`${AUTH_BASE}/otp/verify`, { email, otp_code, type });
}

export function resendOtp(email, type = OTP_TYPES.SIGN_UP) {
  return api.post(`${AUTH_BASE}/otp/resend`, { email, type });
}

export function forgetPassword(email) {
  return api.post(`${AUTH_BASE}/forget-password`, { email });
}

export function resetPassword(email, password, confirm_password) {
  return api.patch(`${AUTH_BASE}/password/reset`, {
    email,
    password,
    confirm_password,
  });
}
