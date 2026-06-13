import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  role: 'super_admin' | 'tenant_admin' | 'instructor' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  bio?: string;
  tenant_id?: string;
  tenant_name?: string;
  last_active?: string;
  created_at: string;
  updated_at: string;
}

export interface UserListParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  status?: string;
  bio?: string;
}

export const userService = {
  getAll: async (params?: UserListParams): Promise<PaginatedResponse<User>> => {
    return api.get('/users', { params });
  },

  getByUuid: async (uuid: string): Promise<ApiResponse<User>> => {
    return api.get(`/users/${uuid}`);
  },

  create: async (data: CreateUserData): Promise<ApiResponse<User>> => {
    return api.post('/users', data);
  },

  update: async (uuid: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.put(`/users/${uuid}`, data);
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    return api.delete(`/users/${uuid}`);
  },

  suspend: async (uuid: string): Promise<ApiResponse> => {
    return api.post(`/users/${uuid}/suspend`);
  },

  activate: async (uuid: string): Promise<ApiResponse> => {
    return api.post(`/users/${uuid}/activate`);
  },
};
