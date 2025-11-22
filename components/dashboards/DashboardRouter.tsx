'use client';

import { useUserData } from '@/lib/hooks/useUserData';
import { EmployeeDashboard } from './EmployeeDashboard';
import { AnalystDashboard } from './AnalystDashboard';
import { AdminDashboard } from './AdminDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Dashboard Router Component
 * Detects user role and renders the appropriate dashboard
 * Handles loading and error states
 */
export function DashboardRouter() {
  const { data: userData, isLoading, error, refetch } = useUserData();
  const storedRole = typeof window !== 'undefined' ? (localStorage.getItem('selectedRole') as any) : null;
  const effectiveRole = userData?.role || storedRole;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Error al cargar el dashboard</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No se pudo obtener la información del usuario. Por favor, intenta nuevamente.
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No user data or invalid role
  if (!userData || !effectiveRole) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Rol no asignado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu cuenta no tiene un rol asignado. Por favor, contacta al administrador.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is approved
  if (userData.status !== 'approved') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Cuenta pendiente de aprobación</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu cuenta está siendo revisada por un administrador. Te notificaremos cuando sea aprobada.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render dashboard based on role
  switch (effectiveRole) {
    case 'employee':
      return <EmployeeDashboard />;
    case 'analyst':
      return <AnalystDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Rol inválido</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  El rol asignado ({userData.role}) no es válido. Por favor, contacta al administrador.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
  }
}
