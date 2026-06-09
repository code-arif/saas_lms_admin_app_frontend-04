import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface Tenant {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  plan?: string;
  students_count?: number;
  courses_count?: number;
  instructors_count?: number;
  storage_used?: number;
  storage_limit?: number;
  created_at: string;
  updated_at: string;
}

export interface TenantDetail extends Tenant {
  subscription?: {
    uuid: string;
    plan_name: string;
    status: string;
    amount: number;
    billing_cycle: string;
    next_billing_date: string;
  };
  recent_activity?: Array<{
    id: string;
    action: string;
    description: string;
    created_at: string;
  }>;
}

export interface TenantListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  plan?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export const tenantService = {
  getAll: async (params?: TenantListParams): Promise<PaginatedResponse<Tenant>> => {
    return api.get('/tenants', { params });
  },

  getByUuid: async (uuid: string): Promise<ApiResponse<TenantDetail>> => {
    return api.get(`/tenants/${uuid}`);
  },

  create: async (data: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    return api.post('/tenants', data);
  },

  update: async (uuid: string, data: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    return api.put(`/tenants/${uuid}`, data);
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    return api.delete(`/tenants/${uuid}`);
  },

  suspend: async (uuid: string): Promise<ApiResponse> => {
    return api.post(`/tenants/${uuid}/suspend`);
  },
};
