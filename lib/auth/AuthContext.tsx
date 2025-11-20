'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { toast } from 'sonner';
import { clearStatusCache } from '@/components/auth/AuthGuard';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Limpiar intervalo anterior si existe
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
      
      if (user) {
        // Guardar token en localStorage para el cliente API
        try {
          const token = await user.getIdToken();
          localStorage.setItem('token', token);
          
          // Configurar refresh del token cada 50 minutos (los tokens expiran en 1 hora)
          refreshInterval = setInterval(async () => {
            try {
              const newToken = await user.getIdToken(true); // Force refresh
              localStorage.setItem('token', newToken);
            } catch (error) {
              console.error('Error refreshing token:', error);
            }
          }, 50 * 60 * 1000); // 50 minutos
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        localStorage.removeItem('token');
      }
    });

    return () => {
      unsubscribe();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      toast.success('Inicio de sesión exitoso');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      
      // Registrar usuario en el backend (crea como 'pending' y envía email al admin)
      try {
        const microfinancieraId = localStorage.getItem('microfinancieraId');
        const selectedRole = localStorage.getItem('selectedRole');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/notify-registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            email: email,
            displayName: displayName,
            provider: 'email',
            microfinancieraId: microfinancieraId,
            role: selectedRole,
          }),
        });
        
        if (!response.ok) {
          console.error('Error al registrar usuario en backend:', await response.text());
        } else {
          console.log('✅ Usuario registrado en backend correctamente');
        }
      } catch (backendError) {
        console.error('Error al llamar al backend:', backendError);
        // No lanzamos error para que el registro en Firebase sea exitoso
      }
      
      toast.success('Registro exitoso. Tu cuenta está pendiente de aprobación.');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      
      // Registrar usuario en el backend si es su primer login
      try {
        const microfinancieraId = localStorage.getItem('microfinancieraId');
        const selectedRole = localStorage.getItem('selectedRole');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/notify-registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            provider: 'google',
            microfinancieraId: microfinancieraId,
            role: selectedRole,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Usuario de Google verificado en backend:', data.message);
          
          // Mostrar mensaje apropiado según el status
          if (data.message === 'User already approved') {
            toast.success('Inicio de sesión exitoso');
          } else if (data.message === 'User status checked' && data.user?.status === 'pending') {
            toast.info('Tu cuenta está pendiente de aprobación');
          } else {
            toast.success('Cuenta creada. Pendiente de aprobación');
          }
        } else {
          console.error('Error al registrar usuario en backend:', await response.text());
          toast.success('Inicio de sesión con Google exitoso');
        }
      } catch (backendError) {
        console.error('Error al llamar al backend:', backendError);
        toast.success('Inicio de sesión con Google exitoso');
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('microfinancieraId');
      localStorage.removeItem('selectedRole');
      clearStatusCache(); // Limpiar el caché del AuthGuard
      toast.success('Sesión cerrada');
    } catch (error: any) {
      toast.error('Error al cerrar sesión');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión',
    'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
  };
  return errorMessages[errorCode] || 'Error de autenticación';
}

