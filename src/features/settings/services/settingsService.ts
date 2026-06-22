import api from '@/services/api';
import type { ApiResponse } from '@/types/global.types';

export interface PlatformSettings {
  platform_name: string;
  platform_description: string;
  support_email: string;
  default_currency: string;
  default_timezone: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  trial_days_default: number;
  // Extended settings
  platform_tagline?: string;
  support_phone?: string;
  website_url?: string;
  favicon_url?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_encryption?: string;
  sender_name?: string;
  sender_email?: string;
  default_language?: string;
  date_format?: string;
  time_format?: string;
  country_code?: string;
  currency_position?: string;
  thousand_separator?: string;
  decimal_separator?: string;
  decimal_places?: number;
  maintenance_message?: string;
  session_timeout_minutes?: number;
  max_login_attempts?: number;
  password_min_length?: number;
  require_2fa?: boolean;
  allow_tenant_custom_domain?: boolean;
  max_tenants_per_admin?: number;
  enable_audit_log?: boolean;
  log_retention_days?: number;
  api_rate_limit_per_minute?: number;
  enable_auto_backup?: boolean;
  backup_frequency?: string;
}

export const settingsService = {
  get: async (): Promise<ApiResponse<PlatformSettings>> => {
    return api.get('/settings');
  },

  update: async (key: string, value: any): Promise<ApiResponse> => {
    return api.put(`/settings/${key}`, { value });
  },
};
