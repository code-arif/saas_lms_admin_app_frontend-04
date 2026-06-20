import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { courseCategoryService } from '../services/courseCategoryService';
import type { CourseCategoryListParams, CourseCategoryFormData } from '../types/courseCategory.types';

export const useCourseCategories = (params?: CourseCategoryListParams) => {
  return useQuery({
    queryKey: ['courseCategories', params],
    queryFn: () => courseCategoryService.getAll(params),
  });
};

export const useCourseCategoryTree = () => {
  return useQuery({
    queryKey: ['courseCategories', 'tree'],
    queryFn: () => courseCategoryService.getTree(),
  });
};

/** Fetch all categories (no pagination) for parent category dropdown */
export const useCourseCategoryDropdown = () => {
  return useQuery({
    queryKey: ['courseCategories', 'dropdown'],
    queryFn: () => courseCategoryService.getAllForDropdown(),
    staleTime: 5 * 60 * 1000, // 5 min cache — dropdown data doesn't change often
  });
};

export const useCourseCategory = (uuid: string) => {
  return useQuery({
    queryKey: ['courseCategory', uuid],
    queryFn: () => courseCategoryService.getByUuid(uuid),
    enabled: !!uuid,
  });
};

export const useCreateCourseCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseCategoryFormData) => courseCategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseCategories'] });
      toast.success('Course category created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create course category');
    },
  });
};

export const useUpdateCourseCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<CourseCategoryFormData> }) =>
      courseCategoryService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseCategories'] });
      toast.success('Course category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update course category');
    },
  });
};

export const useDeleteCourseCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => courseCategoryService.delete(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseCategories'] });
      toast.success('Course category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete course category');
    },
  });
};

export const useToggleCourseCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => courseCategoryService.toggleActive(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['courseCategories'] });
      toast.success(response.message || 'Course category status toggled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to toggle course category status');
    },
  });
};
