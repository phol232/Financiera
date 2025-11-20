'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, RefreshCw, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function PendingApprovalPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [checking, setChecking] = useState(false);
  const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      checkUserStatus();
    }
  }, [user]);

  const checkUserStatus = async () => {
    if (!user) return;

    setChecking(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserStatus(data.status);
        
        if (data.status === 'approved') {
          toast.success('¡Tu cuenta ha sido aprobada! Redirigiendo...');
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else if (data.status === 'rejected') {
          toast.error('Tu cuenta ha sido rechazada.');
        }
      }
    } catch (error) {
      console.error('Error al verificar status:', error);
      toast.error('Error al verificar el estado de tu cuenta');
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center animate-pulse">
            <Clock className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Cuenta Pendiente de Aprobación</CardTitle>
          <CardDescription className="text-base">
            Tu registro ha sido recibido exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userStatus === 'rejected' ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-4xl">❌</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Cuenta Rechazada
                  </h3>
                  <p className="text-red-700">
                    Lamentablemente, tu solicitud de registro ha sido rechazada por el equipo de administración.
                  </p>
                  <p className="text-red-700 mt-2">
                    Si crees que esto es un error, por favor contacta con el administrador.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      ¿Qué significa esto?
                    </h3>
                    <p className="text-yellow-700">
                      Hemos enviado un correo electrónico al administrador con tu solicitud de registro.
                      El equipo de administración revisará tu información y aprobará tu cuenta lo antes posible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  📧 ¿Qué sucede ahora?
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-800">
                  <li>El administrador recibirá una notificación por correo electrónico</li>
                  <li>Revisará tu información de registro</li>
                  <li>Aprobará o rechazará tu cuenta</li>
                  <li>Recibirás un correo de confirmación con el resultado</li>
                  <li>Una vez aprobada, podrás acceder al sistema completo</li>
                </ol>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  👤 Tu información de registro:
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Nombre:</strong> {user.displayName || 'No proporcionado'}</p>
                  <p><strong>Estado:</strong> <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    ⏳ Pendiente
                  </span></p>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            <Button
              onClick={checkUserStatus}
              disabled={checking}
              variant="outline"
              className="flex-1"
            >
              {checking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Verificar Estado
                </>
              )}
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex-1"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              El proceso de aprobación usualmente toma entre 24-48 horas hábiles.
            </p>
            <p className="mt-2">
              Si tienes preguntas, contacta a: <strong>admin@microfinanciera.com</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

