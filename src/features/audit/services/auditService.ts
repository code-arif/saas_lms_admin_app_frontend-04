import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';
import type {
  AuditLog,
  AuditLogListParams,
  AuditLogListResponse,
  AuditCategoriesResponse,
  AuditCategoryEventsResponse,
  AuditCountResponse,
  AuditSummaryCategoryResponse,
  AuditSummaryEventResponse,
} from '../types/audit.types';

export const auditService = {
  /** 1. List audit logs with powerful filtering */
  list: async (params?: AuditLogListParams): Promise<AuditLogListResponse> => {
    return api.get('/audit', { params });
  },

  /** 2. Get a single audit log by UUID */
  getByUuid: async (uuid: string): Promise<ApiResponse<AuditLog>> => {
    return api.get(`/audit/${uuid}`);
  },

  /** 3. List all event categories */
  getCategories: async (): Promise<ApiResponse<AuditCategoriesResponse>> => {
    return api.get('/audit/categories');
  },

  /** 4. List events for a specific category */
  getCategoryEvents: async (category: string): Promise<ApiResponse<AuditCategoryEventsResponse>> => {
    return api.get(`/audit/categories/${category}/events`);
  },

  /** 5. Summary by category (aggregated counts) */
  getSummaryByCategory: async (params?: { date_from?: string; date_to?: string }): Promise<ApiResponse<AuditSummaryCategoryResponse>> => {
    return api.get('/audit/summary/category', { params });
  },

  /** 6. Summary by event (aggregated counts) */
  getSummaryByEvent: async (params?: { category?: string; date_from?: string; date_to?: string }): Promise<ApiResponse<AuditSummaryEventResponse>> => {
    return api.get('/audit/summary/event', { params });
  },

  /** 7. Total count of audit logs */
  getCount: async (category?: string): Promise<ApiResponse<AuditCountResponse>> => {
    return api.get('/audit/count', { params: category ? { category } : undefined });
  },

  /** 8. Logs by user */
  getByUser: async (userId: number, params?: AuditLogListParams): Promise<PaginatedResponse<AuditLog[]>> => {
    return api.get(`/audit/user/${userId}`, { params });
  },

  /** 9. Logs by tenant */
  getByTenant: async (tenantId: number, params?: AuditLogListParams): Promise<PaginatedResponse<AuditLog[]>> => {
    return api.get(`/audit/tenant/${tenantId}`, { params });
  },

  /** 10. Logs by category */
  getByCategory: async (category: string, params?: AuditLogListParams): Promise<PaginatedResponse<AuditLog[]>> => {
    return api.get(`/audit/category/${category}`, { params });
  },

  /** 11. Logs by auditable entity */
  getByAuditable: async (auditableType: string, auditableId: number, params?: { per_page?: number }): Promise<PaginatedResponse<AuditLog[]>> => {
    return api.get(`/audit/auditable/${encodeURIComponent(auditableType)}/${auditableId}`, { params });
  },
};
