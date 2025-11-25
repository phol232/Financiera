'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteAccountPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Pre-llenar el email si viene en los parámetros
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    if (!reason || reason.trim().length < 10) {
      toast.error('El motivo debe tener al menos 10 caracteres');
      return;
    }

    if (confirmation !== 'DELETE') {
      toast.error('Debes escribir "DELETE" para confirmar');
      return;
    }

    setIsSubmitting(true);

    try {
      // Aquí deberías hacer la llamada al API para solicitar la eliminación
      // Por ahora solo simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Implementar llamada real al API
      // const response = await fetch('/api/delete-account-request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, reason, confirmation }),
      // });

      setIsSuccess(true);
      toast.success('Solicitud enviada exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Solicitud Recibida</CardTitle>
            <CardDescription>
              Tu solicitud de eliminación de cuenta ha sido enviada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>¿Qué sigue?</strong>
              </p>
              <ul className="mt-2 space-y-2 text-sm text-blue-700">
                <li>• Recibirás un email de confirmación en {email}</li>
                <li>• Nuestro equipo revisará tu solicitud</li>
                <li>• La eliminación se procesará en un plazo de 24-48 horas</li>
                <li>• Recibirás una confirmación final cuando se complete</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Si cambias de opinión, contáctanos antes de que se procese la eliminación.
              </p>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Puedes cerrar esta ventana
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header de advertencia */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                ⚠️ Advertencia: Acción Irreversible
              </h2>
              <p className="text-red-700 text-sm">
                Esta es una aplicación de demostración. La eliminación de cuenta es permanente
                y eliminará todos tus datos del sistema.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Eliminar mi Cuenta</CardTitle>
                <CardDescription>
                  Solicita la eliminación permanente de tu cuenta y todos tus datos
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información que se eliminará */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Se eliminarán permanentemente:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    Tu cuenta y perfil personal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    Todas tus tarjetas registradas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    Solicitudes de crédito y préstamos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    Historial de transacciones y pagos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    Documentos y archivos subidos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    Toda información personal almacenada
                  </li>
                </ul>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email de la cuenta *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Ingresa el email asociado a tu cuenta
                </p>
              </div>

              {/* Motivo */}
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Motivo de la eliminación * (mínimo 10 caracteres)
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Por favor cuéntanos por qué deseas eliminar tu cuenta..."
                  required
                  rows={4}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  {reason.length}/10 caracteres mínimos
                </p>
              </div>

              {/* Confirmación */}
              <div className="space-y-2">
                <Label htmlFor="confirmation" className="text-red-700 font-semibold">
                  Para confirmar, escribe "DELETE" en mayúsculas:
                </Label>
                <Input
                  id="confirmation"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="DELETE"
                  required
                  className="w-full border-red-300 focus:border-red-500"
                />
                {confirmation && confirmation !== 'DELETE' && (
                  <p className="text-xs text-red-600">
                    Debe ser exactamente "DELETE" en mayúsculas
                  </p>
                )}
              </div>

              {/* Aviso final */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Esta solicitud será revisada por nuestro equipo.
                  Recibirás un email de confirmación cuando se complete la eliminación.
                  El proceso puede tomar hasta 48 horas.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-1"
                  disabled={isSubmitting || confirmation !== 'DELETE'}
                >
                  {isSubmitting ? 'Enviando...' : 'Eliminar mi Cuenta'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            ¿Tienes dudas? Contacta a{' '}
            <a href="mailto:support@finance.com" className="text-blue-600 hover:underline">
              support@finance.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
