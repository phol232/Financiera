'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCog } from 'lucide-react';
import { useWorkers } from '@/lib/hooks/api';

export default function WorkersPage() {
  const [microfinancieraId] = useState('mf_demo_001');
  const { data, isLoading } = useWorkers(microfinancieraId);
  const workers = (data as any)?.workers || [];

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <UserCog className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Trabajadores</h1>
                <p className="text-gray-600">Personal activo en la microfinanciera</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Listado completo</CardTitle>
                <CardDescription>Solo visible para administradores</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando trabajadores...
                  </div>
                ) : workers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay workers activos.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workers.map((worker: any) => (
                      <div
                        key={worker.id}
                        className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-bold text-lg text-gray-900">
                              {worker.displayName || worker.email || 'Sin nombre'}
                            </h3>
                            <p className="text-xs text-gray-600 truncate">{worker.email || 'N/A'}</p>
                          </div>
                          <Badge variant={worker.isActive ? 'default' : 'secondary'}>
                            {worker.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="p-2 rounded-lg bg-white/50 border border-gray-200">
                            <p className="text-xs text-gray-600 font-medium">Roles</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {(worker.roleIds && worker.roleIds.join(', ')) || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
