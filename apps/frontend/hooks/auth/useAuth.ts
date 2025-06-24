import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth/auth.store';
import { clearAuthCookies } from '@/lib/api';
import api from '@/lib/api';
import { SanitizedUser } from '@/common/types/user.type';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, setUser, logout: logoutStore, isHydrated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await api.get<SanitizedUser>('/users/me');
      return data;
    },
    enabled: isHydrated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logout = async () => {
    await clearAuthCookies();
    logoutStore();
    window.location.href = '/auth/login';
  };

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return {
    user: user || data,
    isLoading: !isHydrated || isLoading,
    isAuthenticated: !!(user || data),
    logout,
  };
};
