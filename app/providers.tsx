'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth/AuthContext';

// Rutas que NO necesitan AuthProvider (completamente públicas sin autenticación)
const NO_AUTH_ROUTES = ['/privacy-policy', '/delete-account'];

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isNoAuthRoute = NO_AUTH_ROUTES.includes(pathname);

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
      {isNoAuthRoute ? (
        // Para rutas completamente públicas (sin auth), no usar AuthProvider
        <>
          {children}
          <Toaster />
        </>
      ) : (
        // Para todas las demás rutas (incluyendo login/register), usar AuthProvider
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      )}
    </QueryClientProvider>
  );
}

