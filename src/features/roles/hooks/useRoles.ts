import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { roleService, type RoleListParams, type CreateRoleData, type Role } from '../services/roleService';

export const useRoles = (params?: RoleListParams) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => roleService.getAll(params),
  });
};

export const useRole = (uuid: string) => {
  return useQuery({
    queryKey: ['role', uuid],
    queryFn: () => roleService.getByUuid(uuid),
    enabled: !!uuid,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleData) => roleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create role');
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<Role> }) => roleService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update role');
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => roleService.delete(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete role');
    },
  });
};

export const useRolePermissions = (uuid: string) => {
  return useQuery({
    queryKey: ['role-permissions', uuid],
    queryFn: () => roleService.getPermissions(uuid),
    enabled: !!uuid,
  });
};

export const useAssignRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, permissionUuids }: { uuid: string; permissionUuids: string[] }) =>
      roleService.assignPermissions(uuid, permissionUuids),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions', variables.uuid] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Permissions updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign permissions');
    },
  });
};
