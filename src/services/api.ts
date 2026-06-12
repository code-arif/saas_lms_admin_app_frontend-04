import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: 'https://backend.test/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin-auth-storage');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface CustomAxiosInstance {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
  interceptors: AxiosInstance['interceptors'];
  defaults: AxiosInstance['defaults'];
}

export default api as unknown as CustomAxiosInstance;
