import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface Subscription {
  id: string;
  uuid: string;
  tenant_id: string;
  tenant_name: string;
  plan_name: string;
  status: 'active' | 'trial' | 'suspended' | 'cancelled' | 'past_due';
  amount: number;
  billing_cycle: 'monthly' | 'yearly';
  next_billing_date: string;
  created_at: string;
}

export const subscriptionService = {
  getAll: async (params?: { page?: number; per_page?: number; status?: string }): Promise<PaginatedResponse<Subscription>> => {
    return api.get('/billing/subscription', { params });
  },
};
