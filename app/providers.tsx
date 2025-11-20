'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth/AuthContext';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos - datos se consideran frescos por más tiempo
            gcTime: 10 * 60 * 1000, // 10 minutos - mantener en caché
            refetchOnWindowFocus: false,
            refetchOnMount: false, // No refetch automático al montar
            refetchOnReconnect: false,
            retry: 1, // Solo 1 reintento en caso de error
            retryDelay: 1000, // 1 segundo entre reintentos
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

