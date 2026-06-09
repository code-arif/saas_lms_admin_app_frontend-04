import type { User, ApiResponse } from '@/types/global.types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginData {
  token: string;
  user: User;
}

export type LoginResponse = ApiResponse<LoginData>;
