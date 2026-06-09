import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface Campaign {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  coupon_uuid: string;
  coupon_code: string;
  badge?: string;
  start_date: string;
  end_date: string;
  auto_apply: boolean;
  is_active: boolean;
  status: 'active' | 'scheduled' | 'ended' | 'paused';
  created_at: string;
}

export const campaignService = {
  getAll: async (params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Campaign>> => {
    return api.get('/admin/billing/campaigns', { params });
  },

  create: async (data: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
    return api.post('/admin/billing/campaigns', data);
  },

  update: async (uuid: string, data: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
    return api.put(`/admin/billing/campaigns/${uuid}`, data);
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    return api.delete(`/admin/billing/campaigns/${uuid}`);
  },
};
