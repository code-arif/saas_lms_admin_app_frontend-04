import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials } from '../types/auth.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.success) {
        const { token, user } = response.data;

        if (user.role !== 'super_admin') {
          toast.error('Only super administrators can access this panel');
          return;
        }

        loginStore(token, user);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    },
  });

  const logout = () => {
    logoutStore();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    logout,
  };
};
