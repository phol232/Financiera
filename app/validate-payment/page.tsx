'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function ValidatePaymentContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [autoValidated, setAutoValidated] = useState(false);

  // Auto-validar cuando viene desde Stripe
  useEffect(() => {
    const sessionIdFromUrl = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    if (canceled) {
      setError('Pago cancelado. Puedes intentar nuevamente desde la app móvil.');
      return;
    }

    if (sessionIdFromUrl && !autoValidated) {
      setAutoValidated(true);
      handleValidate(sessionIdFromUrl);
    }
  }, [searchParams, autoValidated]);

  const handleValidate = async (sessionId: string) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/validate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: sessionId.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al validar el pago');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error al validar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {loading && !result && !error && (
          <Card className="shadow-xl border-blue-500 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <div className="text-center">
                  <p className="font-semibold text-blue-900 text-lg">Procesando tu pago...</p>
                  <p className="text-sm text-blue-700 mt-2">Esto puede tomar unos segundos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive" className="shadow-xl">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="border-green-500 bg-green-50 shadow-xl">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-xl text-green-900">¡Pago procesado exitosamente!</p>
                  <p className="text-sm text-green-700 mt-2">
                    Tus cuotas han sido marcadas como pagadas. Puedes cerrar esta ventana y volver a la app.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg border border-green-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Total pagado</p>
                      <p className="font-bold text-green-900 text-2xl">PEN {result.totalAmount?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Cuotas procesadas</p>
                      <p className="font-bold text-green-900 text-2xl">{result.transactions?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {result.transactions && result.transactions.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-green-900">Detalle de transacciones:</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {result.transactions.map((tx: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded border border-green-200">
                          <div className="flex justify-between items-start">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">Transacción #{idx + 1}</p>
                              <p className="text-gray-600 text-xs mt-1">ID: {tx.id}</p>
                              <p className="text-gray-600 text-xs">Cuota: {tx.installmentId}</p>
                            </div>
                            <p className="font-bold text-green-700">PEN {tx.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Puedes cerrar esta ventana y volver a la app móvil
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.close()}
                    className="mx-auto"
                  >
                    Cerrar ventana
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default function ValidatePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <Card className="shadow-xl max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-y-3 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-700 ml-3">Cargando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <ValidatePaymentContent />
    </Suspense>
  );
}
