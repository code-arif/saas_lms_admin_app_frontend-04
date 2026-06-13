import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface Permission {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  group: string;
  description?: string;
  guard_name: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePermissionData {
  name: string;
  slug: string;
  group: string;
  description?: string;
  guard_name?: string;
}

export interface PermissionListParams {
  page?: number;
  per_page?: number;
  search?: string;
  group?: string;
  guard_name?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export const permissionService = {
  getAll: async (params?: PermissionListParams): Promise<PaginatedResponse<Permission>> => {
    return api.get('/permissions', { params });
  },

  getByUuid: async (uuid: string): Promise<ApiResponse<Permission>> => {
    return api.get(`/permissions/${uuid}`);
  },

  create: async (data: CreatePermissionData): Promise<ApiResponse<Permission>> => {
    return api.post('/permissions', data);
  },

  update: async (uuid: string, data: Partial<Permission>): Promise<ApiResponse<Permission>> => {
    return api.put(`/permissions/${uuid}`, data);
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    return api.delete(`/permissions/${uuid}`);
  },
};
