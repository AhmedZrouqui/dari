import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

queryClient.setMutationDefaults(['auth'], {
  onError: (error: any) => {
    if (error?.response?.status === 401) {
      queryClient.clear();
      window.location.href = '/auth/login';
    }
  },
});
