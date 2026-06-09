import api from '@/services/api';
import type { ApiResponse } from '@/types/global.types';

export interface Plan {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  monthly_price: number;
  yearly_price: number;
  limits: {
    students: number;
    instructors: number;
    courses: number;
    storage: number;
  };
  features: string[];
  trial_days: number;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const planService = {
  getAll: async (): Promise<ApiResponse<Plan[]>> => {
    return api.get('/billing/plans');
  },

  create: async (data: Partial<Plan>): Promise<ApiResponse<Plan>> => {
    return api.post('/admin/billing/plans', data);
  },

  update: async (uuid: string, data: Partial<Plan>): Promise<ApiResponse<Plan>> => {
    return api.put(`/admin/billing/plans/${uuid}`, data);
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    return api.delete(`/admin/billing/plans/${uuid}`);
  },
};
