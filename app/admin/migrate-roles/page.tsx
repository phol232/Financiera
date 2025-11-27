'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/lib/api-client';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function MigrateRolesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    updated?: number;
    skipped?: number;
    errors?: number;
    message?: string;
  } | null>(null);

  const handleMigration = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await apiClient.post<{
        success: boolean;
        updated: number;
        skipped: number;
        errors: number;
      }>('/api/users/migrate-roles', {
        microfinancieraId: 'mf_demo_001',
      });

      setResult({
        success: true,
        updated: response.updated,
        skipped: response.skipped,
        errors: response.errors,
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Error al ejecutar la migración',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="max-w-2xl mx-auto py-8">
            <Card>
              <CardHeader>
                <CardTitle>Migración de Roles de Usuario</CardTitle>
                <CardDescription>
                  Esta herramienta actualiza los usuarios existentes para agregar el campo
                  <code className="mx-1 px-2 py-1 bg-gray-100 rounded">primaryRoleId</code>
                  necesario para el control de acceso.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Esta operación actualizará todos los usuarios en la microfinanciera
                    <strong className="ml-1">mf_demo_001</strong> que no tengan el campo
                    <code className="mx-1 px-2 py-1 bg-gray-100 rounded">primaryRoleId</code>.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold">¿Qué hace esta migración?</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                    <li>Busca usuarios sin el campo <code>primaryRoleId</code></li>
                    <li>Determina el rol basándose en <code>roleIds</code> o <code>roles</code></li>
                    <li>Establece <code>primaryRoleId</code> con el rol correcto</li>
                    <li>Actualiza la fecha de modificación</li>
                  </ul>
                </div>

                <Button
                  onClick={handleMigration}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ejecutando migración...
                    </>
                  ) : (
                    'Ejecutar Migración'
                  )}
                </Button>

                {result && (
                  <Alert variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      {result.success ? (
                        <div className="space-y-2">
                          <p className="font-semibold">Migración completada exitosamente</p>
                          <div className="text-sm space-y-1">
                            <p>✅ Usuarios actualizados: <strong>{result.updated}</strong></p>
                            <p>⏭️ Usuarios saltados (ya tenían primaryRoleId): <strong>{result.skipped}</strong></p>
                            {result.errors! > 0 && (
                              <p className="text-red-600">❌ Errores: <strong>{result.errors}</strong></p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p>{result.message}</p>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
