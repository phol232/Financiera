'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
                <h1 className="text-2xl font-bold">Workers</h1>
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Correo</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workers.map((worker: any) => (
                          <TableRow key={worker.id}>
                            <TableCell className="font-semibold">
                              {worker.displayName || worker.email || 'Sin nombre'}
                            </TableCell>
                            <TableCell>{worker.email || 'N/A'}</TableCell>
                            <TableCell>{(worker.roleIds && worker.roleIds.join(', ')) || 'N/A'}</TableCell>
                            <TableCell>{worker.isActive ? 'Activo' : 'Inactivo'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
