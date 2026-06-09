import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = (params?: { period?: string; start_date?: string; end_date?: string }) => {
  return useQuery({
    queryKey: ['analytics', params],
    queryFn: () => analyticsService.getAnalytics(params),
  });
};
