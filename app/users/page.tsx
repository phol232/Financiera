'use client';

import { useMemo, useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users as UsersIcon } from 'lucide-react';
import { useAdminUsers } from '@/lib/hooks/api';
import { formatDate } from '@/lib/utils/date';

export default function UsersPage() {
  const [microfinancieraId] = useState('mf_demo_001');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data, isLoading } = useAdminUsers(
    microfinancieraId,
    statusFilter === 'all' ? undefined : statusFilter
  );
  const users = useMemo(() => (data as any)?.users || [], [data]);

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Usuarios</h1>
                  <p className="text-gray-600">Listado completo de usuarios registrados</p>
                </div>
              </div>
              <div className="w-40">
                <Label className="sr-only">Estado</Label>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="approved">Aprobados</SelectItem>
                    <SelectItem value="rejected">Rechazados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios por microfinanciera</CardTitle>
                <CardDescription>Solo visible para administradores</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando usuarios...
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No se encontraron usuarios con el filtro seleccionado.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user: any) => (
                      <div
                        key={user.uid}
                        className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-bold text-lg text-gray-900">
                              {user.displayName || user.email?.split('@')[0] || 'Sin nombre'}
                            </h3>
                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                          </div>
                          <Badge
                            variant={
                              user.status === 'approved'
                                ? 'default'
                                : user.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {user.status}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="p-2 rounded-lg bg-white/50 border border-gray-200">
                            <p className="text-xs text-gray-600 font-medium">Rol</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{user.role}</p>
                          </div>

                          <div className="p-2 rounded-lg bg-white/50 border border-gray-200">
                            <p className="text-xs text-gray-600 font-medium">Creado</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(user.createdAt)}</p>
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
