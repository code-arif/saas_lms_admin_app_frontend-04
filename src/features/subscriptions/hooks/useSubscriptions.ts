import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';

export const useSubscriptions = (params?: { page?: number; per_page?: number; status?: string }) => {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => subscriptionService.getAll(params),
  });
};
