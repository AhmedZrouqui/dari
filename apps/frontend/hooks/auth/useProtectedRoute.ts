import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useProtectedRoute = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're done loading and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  return {
    isLoading,
    isAuthenticated,
    user,
  };
};
