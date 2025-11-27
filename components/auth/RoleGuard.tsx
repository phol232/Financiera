'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/constants/permissions';
import { useUserData } from '@/lib/hooks/useUserData';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback,
  redirectTo = '/'
}: RoleGuardProps) {
  const router = useRouter();
  const { data: userData, isLoading, error } = useUserData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al verificar permisos</h2>
          <p className="text-gray-600 mb-4">
            No se pudo verificar tu nivel de acceso. Por favor, intenta nuevamente.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has required role
  const hasPermission = userData?.role && allowedRoles.includes(userData.role);

  if (!hasPermission) {
    // Use custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default access denied UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <ShieldAlert className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta página.
          </p>
          <Button 
            onClick={() => router.push(redirectTo)}
            className="w-full"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // User has permission, render children
  return <>{children}</>;
}
