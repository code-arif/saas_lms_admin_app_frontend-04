import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface Role {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  guard_name: string;
  permissions_count: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleData {
  name: string;
  slug: string;
  description?: string;
  guard_name?: string;
}

export interface RoleListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export const roleService = {
  getAll: async (params?: RoleListParams): Promise<PaginatedResponse<Role>> => {
    return api.get('/roles', { params });
  },

  getByUuid: async (uuid: string): Promise<ApiResponse<Role>> => {
    return api.get(`/roles/${uuid}`);
  },

  create: async (data: CreateRoleData): Promise<ApiResponse<Role>> => {
    return api.post('/roles', data);
  },

  update: async (uuid: string, data: Partial<Role>): Promise<ApiResponse<Role>> => {
    return api.put(`/roles/${uuid}`, data);
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    return api.delete(`/roles/${uuid}`);
  },

  getPermissions: async (uuid: string): Promise<ApiResponse<string[]>> => {
    return api.get(`/roles/${uuid}/permissions`);
  },

  assignPermissions: async (uuid: string, permissionUuids: string[]): Promise<ApiResponse> => {
    return api.post(`/roles/${uuid}/permissions`, { permission_uuids: permissionUuids });
  },
};
