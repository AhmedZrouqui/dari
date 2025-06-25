import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error: unknown) => {
        // Only retry if it's not an auth error (401/403)
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 401 || status === 403) {
            return false;
          }
        }
        // For other errors, retry up to 2 times (3 attempts total)
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// This part seems to be for a global error handler, which is a great idea.
// However, handling redirects should ideally be done in the ApiClient interceptor
// or within component boundaries to avoid direct window manipulation here.
// For now, let's keep it but make it type-safe.
queryClient.setMutationDefaults(['auth'], {
  onError: (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      queryClient.clear();
      // This is a side-effect that is better handled elsewhere, but the type-safety is now correct.
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  },
});
