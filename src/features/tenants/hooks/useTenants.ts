import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tenantService, type TenantListParams } from '../services/tenantService';

export const useTenants = (params?: TenantListParams) => {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => tenantService.getAll(params),
  });
};

export const useTenant = (uuid: string) => {
  return useQuery({
    queryKey: ['tenant', uuid],
    queryFn: () => tenantService.getByUuid(uuid),
    enabled: !!uuid,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => tenantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create tenant');
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: any }) => tenantService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update tenant');
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => tenantService.delete(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete tenant');
    },
  });
};

export const useSuspendTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => tenantService.suspend(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant suspended successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to suspend tenant');
    },
  });
};
