'use client';

'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Shield, Bell, Palette, Zap } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [security, setSecurity] = useState({
    mfa: true,
    sessionTimeout: 30,
    lockOnFailure: true,
  });

  const [notifications, setNotifications] = useState({
    approvals: true,
    alerts: true,
    weeklyDigest: false,
  });

  const [branding, setBranding] = useState({
    name: 'Microfinanciera Demo',
    color: '#0F62FE',
    tagline: 'Finanzas simples para todos',
  });

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold">Centro de configuración</h1>
                <p className="text-gray-600">
                  Ajusta seguridad, notificaciones y branding del portal
                </p>
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <CardTitle>Seguridad</CardTitle>
                    <CardDescription>Políticas de acceso y sesiones</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={security.mfa}
                      onChange={(e) => setSecurity({ ...security, mfa: e.target.checked })}
                    />
                    <span>Requerir MFA para administradores</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={security.lockOnFailure}
                      onChange={(e) => setSecurity({ ...security, lockOnFailure: e.target.checked })}
                    />
                    <span>Bloquear después de 5 intentos fallidos</span>
                  </label>
                  <div className="space-y-2">
                    <Label>Tiempo de sesión (minutos)</Label>
                    <Input
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) =>
                        setSecurity({ ...security, sessionTimeout: Number(e.target.value) })
                      }
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Guardar políticas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <CardTitle>Notificaciones</CardTitle>
                    <CardDescription>Alertas para el equipo y usuarios</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notifications.approvals}
                      onChange={(e) =>
                        setNotifications({ ...notifications, approvals: e.target.checked })
                      }
                    />
                    <span>Enviar correo cuando haya usuarios pendientes</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notifications.alerts}
                      onChange={(e) =>
                        setNotifications({ ...notifications, alerts: e.target.checked })
                      }
                    />
                    <span>Alertas por cambios críticos (productos, scoring)</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notifications.weeklyDigest}
                      onChange={(e) =>
                        setNotifications({ ...notifications, weeklyDigest: e.target.checked })
                      }
                    />
                    <span>Resumen semanal al correo de administración</span>
                  </label>
                  <Button variant="outline" size="sm">
                    Guardar notificaciones
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex items-start gap-3">
                  <Palette className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <CardTitle>Branding</CardTitle>
                    <CardDescription>Identidad visual del portal</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre comercial</Label>
                      <Input
                        value={branding.name}
                        onChange={(e) => setBranding({ ...branding, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color primario</Label>
                      <Input
                        type="color"
                        value={branding.color}
                        onChange={(e) => setBranding({ ...branding, color: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Textarea
                      value={branding.tagline}
                      onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Guardar branding
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-emerald-600 mt-1" />
                  <div>
                    <CardTitle>Operación</CardTitle>
                    <CardDescription>Controles rápidos del portal</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Ajusta horarios, bloqueos y mantenimiento de forma manual.
                  </p>
                  <Button variant="default" size="sm" className="w-full">
                    Activar modo mantenimiento
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Reiniciar sesiones activas
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    Exportar bitácora de auditoría
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
