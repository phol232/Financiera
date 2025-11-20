'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useMicrofinancieras } from '@/lib/hooks/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, Loader2, Briefcase, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { data: microfinancierasData, isLoading: loadingMicrofinancieras } = useMicrofinancieras();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: '',
    microfinancieraId: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const microfinancieras = (microfinancierasData as any)?.microfinancieras || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.displayName) {
      newErrors.displayName = 'El nombre es requerido';
    }

    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }

    if (!formData.microfinancieraId) {
      newErrors.microfinancieraId = 'La microfinanciera es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Guardar microfinanciera y rol seleccionados
      localStorage.setItem('microfinancieraId', formData.microfinancieraId);
      localStorage.setItem('selectedRole', formData.role);
      
      await register(formData.email, formData.password, formData.displayName);
      
      // Redirigir a la página de aprobación pendiente
      router.push('/pending-approval');
    } catch (error) {
      // Error ya manejado en el contexto
      console.error('Error en registro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para acceder al portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="microfinanciera">Microfinanciera</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                <Select
                  value={formData.microfinancieraId}
                  onValueChange={(value) => setFormData({ ...formData, microfinancieraId: value })}
                  disabled={loading || loadingMicrofinancieras}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder={loadingMicrofinancieras ? "Cargando..." : "Selecciona tu microfinanciera"} />
                  </SelectTrigger>
                  <SelectContent>
                    {microfinancieras.map((mf: any) => (
                      <SelectItem key={mf.id} value={mf.id}>
                        {mf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.microfinancieraId && (
                <p className="text-sm text-red-500">{errors.microfinancieraId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
              {errors.displayName && (
                <p className="text-sm text-red-500">{errors.displayName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analyst">Analista</SelectItem>
                    <SelectItem value="employee">Empleado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrarse'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

