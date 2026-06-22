export interface CourseCategory {
  id: number;
  uuid: string;
  tenant_id: number;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  color: string | null;
  parent_id: number | null;
  parent?: CourseCategory | null;
  children?: CourseCategory[];
  sort_order: number;
  is_active: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface CourseCategoryListParams {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  parent_id?: number | null;
}

export interface CourseCategoryFormData {
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  color: string | null;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
}
