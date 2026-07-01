export interface AuditLog {
  uuid: string;
  tenant_id: number | null;
  user_id: number | null;
  user_type: string | null;
  user_email: string | null;
  event: string;
  event_category: string;
  auditable: {
    type: string;
    id: number;
  } | null;
  changes: {
    old: Record<string, any> | null;
    new: Record<string, any> | null;
  } | null;
  metadata: Record<string, any>;
  context: {
    ip_address: string | null;
    user_agent: string | null;
    url: string | null;
    method: string | null;
  };
  created_at: string;
}

export interface AuditLogListParams {
  page?: number;
  per_page?: number;
  tenant_id?: number;
  user_id?: number;
  event_category?: string;
  event?: string;
  user_type?: string;
  user_email?: string;
  ip_address?: string;
  method?: string;
  auditable_type?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  order_by?: string;
  direction?: 'asc' | 'desc';
}

export interface AuditCategorySummary {
  category: string;
  count: number;
}

export interface AuditEventSummary {
  event: string;
  count: number;
}

export interface AuditCategoriesResponse {
  categories: string[];
}

export interface AuditCategoryEventsResponse {
  category: string;
  events: string[];
}

export interface AuditCountResponse {
  count: number;
  category: string;
}

export interface AuditSummaryCategoryResponse {
  summary: AuditCategorySummary[];
  total: number;
}

export interface AuditSummaryEventResponse {
  summary: AuditEventSummary[];
  total: number;
}

/** Response type for the paginated audit log list endpoint */
export interface AuditLogListResponse {
  success: boolean;
  message: string;
  data: {
    items: AuditLog[];
  };
  meta: Record<string, unknown>;
  errors: unknown[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  } | null;
}

export const EVENT_CATEGORIES = [
  'auth',
  'security',
  'billing',
  'content',
  'user',
  'tenant',
  'notification',
  'integration',
  'system',
  'ai',
] as const;

export const USER_TYPES = [
  'admin',
  'tenant',
  'instructor',
  'student',
] as const;

export const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
] as const;
