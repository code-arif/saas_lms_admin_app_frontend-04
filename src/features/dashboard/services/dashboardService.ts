import api from '@/services/api';
import type { ApiResponse } from '@/types/global.types';

export interface DashboardStats {
  total_tenants: number;
  mrr: number;
  active_subscriptions: number;
  total_students: number;
  monthly_revenue: Array<{ month: string; amount: number }>;
  tenant_growth: Array<{ month: string; count: number }>;
  recent_tenants: Array<{
    uuid: string;
    name: string;
    plan: string;
    status: string;
    created_at: string;
  }>;
  subscription_breakdown: Array<{ status: string; count: number }>;
}

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return api.get('/admin/dashboard/stats');
  },
};
