import api from '@/services/api';
import type { LoginCredentials, LoginResponse } from '../types/auth.types';
import type { ApiResponse } from '@/types/global.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return api.post('/auth/super_admin/login', credentials);
  },

  getMe: async (): Promise<ApiResponse> => {
    return api.get('/auth/me');
  },

  logout: async (): Promise<ApiResponse> => {
    return api.post('/auth/logout');
  },
};
