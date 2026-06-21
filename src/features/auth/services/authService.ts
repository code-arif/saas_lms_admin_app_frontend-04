import api from '@/services/api';
import type { LoginCredentials, LoginResponse, ForgotPasswordCredentials, VerifyOtpCredentials, ResetPasswordCredentials } from '../types/auth.types';
import type { ApiResponse } from '@/types/global.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return api.post('/auth/super_admin/login', credentials);
  },

  forgotPassword: async (credentials: ForgotPasswordCredentials): Promise<ApiResponse> => {
    return api.post('/auth/forgot-password', credentials);
  },

  verifyOtp: async (credentials: VerifyOtpCredentials): Promise<ApiResponse> => {
    return api.post('/auth/verify-otp', credentials);
  },

  resetPassword: async (credentials: ResetPasswordCredentials): Promise<ApiResponse> => {
    return api.post('/auth/reset-password', credentials);
  },

  getMe: async (): Promise<ApiResponse> => {
    return api.get('/auth/me');
  },

  logout: async (): Promise<ApiResponse> => {
    return api.post('/auth/logout');
  },
};
