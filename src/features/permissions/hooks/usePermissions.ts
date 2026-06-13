import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { permissionService, type PermissionListParams, type CreatePermissionData, type Permission } from '../services/permissionService';

export const usePermissions = (params?: PermissionListParams) => {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: () => permissionService.getAll(params),
  });
};

export const usePermission = (uuid: string) => {
  return useQuery({
    queryKey: ['permission', uuid],
    queryFn: () => permissionService.getByUuid(uuid),
    enabled: !!uuid,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionData) => permissionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permission created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create permission');
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<Permission> }) => permissionService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permission updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update permission');
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => permissionService.delete(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permission deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete permission');
    },
  });
};
