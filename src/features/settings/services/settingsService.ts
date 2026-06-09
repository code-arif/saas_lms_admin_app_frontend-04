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
}

export const settingsService = {
  get: async (): Promise<ApiResponse<PlatformSettings>> => {
    return api.get('/settings');
  },

  update: async (key: string, value: any): Promise<ApiResponse> => {
    return api.put(`/settings/${key}`, { value });
  },
};
