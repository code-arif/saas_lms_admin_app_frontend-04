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

export interface ForgotPasswordCredentials {
  email: string;
}

export interface VerifyOtpCredentials {
  email: string;
  otp: string;
}

export interface ResetPasswordCredentials {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}
