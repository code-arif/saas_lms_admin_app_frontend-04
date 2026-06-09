import api from '@/services/api';
import type { ApiResponse } from '@/types/global.types';

export interface AnalyticsData {
  mrr: number;
  arr: number;
  churn_rate: number;
  avg_revenue: number;
  mrr_trend: Array<{ month: string; amount: number }>;
  new_tenants: Array<{ month: string; count: number }>;
  plan_distribution: Array<{ name: string; value: number }>;
}

export const analyticsService = {
  getAnalytics: async (params?: { period?: string; start_date?: string; end_date?: string }): Promise<ApiResponse<AnalyticsData>> => {
    return api.get('/admin/analytics', { params });
  },
};
