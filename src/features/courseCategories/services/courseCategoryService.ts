import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';
import type { CourseCategory, CourseCategoryListParams, CourseCategoryFormData } from '../types/courseCategory.types';

export const courseCategoryService = {
  getAll: async (params?: CourseCategoryListParams): Promise<PaginatedResponse<CourseCategory>> => {
    return api.get('/course-categories', { params });
  },

  getTree: async (): Promise<ApiResponse<CourseCategory[]>> => {
    return api.get('/course-categories/tree');
  },

  /** Fetch all categories (no pagination) for the parent category dropdown */
  getAllForDropdown: async (): Promise<PaginatedResponse<CourseCategory>> => {
    return api.get('/course-categories', { params: { per_page: 1000, page: 1 } });
  },

  getByUuid: async (uuid: string): Promise<ApiResponse<CourseCategory>> => {
    return api.get(`/course-categories/${uuid}`);
  },

  create: async (data: CourseCategoryFormData): Promise<ApiResponse<CourseCategory>> => {
    return api.post('/course-categories', data);
  },

  update: async (uuid: string, data: Partial<CourseCategoryFormData>): Promise<ApiResponse<CourseCategory>> => {
    return api.put(`/course-categories/${uuid}`, data);
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    return api.delete(`/course-categories/${uuid}`);
  },

  toggleActive: async (uuid: string): Promise<ApiResponse<CourseCategory>> => {
    return api.patch(`/course-categories/${uuid}/toggle-active`);
  },
};
