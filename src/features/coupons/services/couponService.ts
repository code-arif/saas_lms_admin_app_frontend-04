import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface Coupon {
  id: string;
  uuid: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  applicable_plans: string[];
  created_at: string;
}

export const couponService = {
  getAll: async (params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Coupon>> => {
    return api.get('/admin/billing/coupons', { params });
  },

  create: async (data: Partial<Coupon>): Promise<ApiResponse<Coupon>> => {
    return api.post('/admin/billing/coupons', data);
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    return api.delete(`/admin/billing/coupons/${uuid}`);
  },
};
