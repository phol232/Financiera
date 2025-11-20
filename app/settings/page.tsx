'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
                <p className="text-gray-600">Administra los parámetros y configuraciones del sistema</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <CardTitle>Acceso Restringido</CardTitle>
                </div>
                <CardDescription>
                  Esta página está disponible solo para administradores del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Aquí podrás configurar:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Parámetros del sistema de scoring</li>
                    <li>Configuración de productos de crédito</li>
                    <li>Gestión de usuarios y roles</li>
                    <li>Configuración de notificaciones</li>
                    <li>Parámetros de aprobación automática</li>
                    <li>Configuración de zonas y regiones</li>
                  </ul>
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> Las funcionalidades de configuración se implementarán en futuras versiones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
