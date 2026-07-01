import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/auditService';
import type { AuditLogListParams } from '../types/audit.types';

export const useAuditLogs = (params?: AuditLogListParams) => {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditService.list(params),
  });
};

export const useAuditLog = (uuid: string) => {
  return useQuery({
    queryKey: ['audit-log', uuid],
    queryFn: () => auditService.getByUuid(uuid),
    enabled: !!uuid,
  });
};

export const useAuditCategories = () => {
  return useQuery({
    queryKey: ['audit-categories'],
    queryFn: () => auditService.getCategories(),
    staleTime: 5 * 60 * 1000, // Categories don't change often
  });
};

export const useAuditCategoryEvents = (category: string) => {
  return useQuery({
    queryKey: ['audit-category-events', category],
    queryFn: () => auditService.getCategoryEvents(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAuditSummaryByCategory = (params?: { date_from?: string; date_to?: string }) => {
  return useQuery({
    queryKey: ['audit-summary-category', params],
    queryFn: () => auditService.getSummaryByCategory(params),
  });
};

export const useAuditSummaryByEvent = (params?: { category?: string; date_from?: string; date_to?: string }) => {
  return useQuery({
    queryKey: ['audit-summary-event', params],
    queryFn: () => auditService.getSummaryByEvent(params),
  });
};

export const useAuditCount = (category?: string) => {
  return useQuery({
    queryKey: ['audit-count', category],
    queryFn: () => auditService.getCount(category),
  });
};

export const useAuditLogsByUser = (userId: number, params?: AuditLogListParams) => {
  return useQuery({
    queryKey: ['audit-logs-user', userId, params],
    queryFn: () => auditService.getByUser(userId, params),
    enabled: !!userId,
  });
};

export const useAuditLogsByTenant = (tenantId: number, params?: AuditLogListParams) => {
  return useQuery({
    queryKey: ['audit-logs-tenant', tenantId, params],
    queryFn: () => auditService.getByTenant(tenantId, params),
    enabled: !!tenantId,
  });
};

export const useAuditLogsByCategory = (category: string, params?: AuditLogListParams) => {
  return useQuery({
    queryKey: ['audit-logs-category', category, params],
    queryFn: () => auditService.getByCategory(category, params),
    enabled: !!category,
  });
};
