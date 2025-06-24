'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { queryClient } from '@/lib/query-client';
import { theme } from '@/theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        {children}
        {/* Only show devtools in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools position="bottom" initialIsOpen={false} />
        )}
      </MantineProvider>
    </QueryClientProvider>
  );
}
