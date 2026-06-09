export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  role: 'super_admin' | 'tenant_admin' | 'instructor' | 'student';
  avatar?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}
