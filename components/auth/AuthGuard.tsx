'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Loader2 } from 'lucide-react';

// Cache para el status del usuario (en memoria, se resetea al recargar la página)
let statusCache: { status: 'pending' | 'approved' | 'rejected' | null; uid: string | null } = {
  status: null,
  uid: null,
};

// Función para limpiar el cache (exportada para usar en logout)
export function clearStatusCache() {
  statusCache = {
    status: null,
    uid: null,
  };
  console.log('🧹 Cache de status limpiado');
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user) {
      checkUserStatus();
    }
  }, [user, loading, router]);

  const checkUserStatus = async () => {
    if (!user) return;

    // No verificar status si ya estamos en la página de pending-approval
    if (pathname === '/pending-approval') {
      setCheckingStatus(false);
      return;
    }

    // Si ya verificamos el status de este usuario, usar el cache
    if (statusCache.uid === user.uid && statusCache.status) {
      console.log('✅ Usando status en cache:', statusCache.status);
      
      if (statusCache.status === 'pending' || statusCache.status === 'rejected') {
        router.push('/pending-approval');
      }
      
      setCheckingStatus(false);
      return;
    }

    // Verificar status por primera vez
    console.log('🔍 Verificando status del usuario por primera vez...');
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar en cache
        statusCache = {
          status: data.status,
          uid: user.uid,
        };
        
        console.log('✅ Status verificado y guardado en cache:', data.status);
        
        // Si el usuario está pendiente o rechazado, redirigir a la página de aprobación
        if (data.status === 'pending' || data.status === 'rejected') {
          router.push('/pending-approval');
        }
      } else {
        // Si hay error 404, es probable que sea un usuario nuevo sin registro en backend
        if (response.status === 404) {
          console.log('⚠️ Usuario no encontrado en backend, redirigiendo a pending-approval');
          router.push('/pending-approval');
        } else {
          console.error('Error al verificar status del usuario:', response.status);
          // En otros errores, asumir aprobado para no bloquear
          statusCache = {
            status: 'approved',
            uid: user.uid,
          };
        }
      }
    } catch (error) {
      console.error('Error al verificar status:', error);
      // En caso de error de red, asumir aprobado para no bloquear usuarios legítimos
      statusCache = {
        status: 'approved',
        uid: user.uid,
      };
    } finally {
      setCheckingStatus(false);
    }
  };

  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

