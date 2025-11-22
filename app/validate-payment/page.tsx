'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, Search, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function ValidatePaymentPage() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
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
      setSessionId(sessionIdFromUrl);
      setAutoValidated(true);
      handleValidate(sessionIdFromUrl);
    }
  }, [searchParams, autoValidated]);

  const handleValidate = async (sid?: string) => {
    const idToValidate = sid || sessionId;
    
    if (!idToValidate.trim()) {
      setError('Por favor ingresa un Session ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/validate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: idToValidate.trim() }),
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

  const handleSearch = async () => {
    if (!searchTime.trim()) {
      setError('Por favor ingresa una fecha y hora');
      return;
    }

    setSearchLoading(true);
    setError('');
    setSessions([]);

    try {
      // Convertir la fecha/hora a timestamp
      const date = new Date(searchTime);
      const startTime = Math.floor(date.getTime() / 1000) - 300; // 5 minutos antes
      const endTime = Math.floor(date.getTime() / 1000) + 300; // 5 minutos después

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/search-sessions?startTime=${startTime}&endTime=${endTime}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar sesiones');
      }

      setSessions(data.sessions || []);
      
      if (data.sessions.length === 0) {
        setError('No se encontraron sesiones en ese rango de tiempo');
      }
    } catch (err: any) {
      setError(err.message || 'Error al buscar sesiones');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al login
          </Link>
        </div>

        {loading && autoValidated && !result && !error && (
          <Card className="shadow-xl mb-6 border-blue-500 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Procesando tu pago...</p>
                  <p className="text-sm text-blue-700">Esto puede tomar unos segundos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Validar Pago de Stripe</CardTitle>
          <CardDescription>
            {autoValidated ? 'Validando tu pago automáticamente' : 'Busca y valida pagos de Stripe manualmente'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="direct" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="direct">Por Session ID</TabsTrigger>
              <TabsTrigger value="search">Buscar por Fecha</TabsTrigger>
            </TabsList>

            <TabsContent value="direct" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID de Stripe</Label>
                <Input
                  id="sessionId"
                  placeholder="cs_test_..."
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  Ingresa el Session ID completo de Stripe
                </p>
              </div>

              <Button 
                onClick={() => handleValidate()} 
                disabled={loading || !sessionId.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  'Validar Pago'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchTime">Fecha y Hora del Pago</Label>
                <Input
                  id="searchTime"
                  type="datetime-local"
                  value={searchTime}
                  onChange={(e) => setSearchTime(e.target.value)}
                  disabled={searchLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Buscaremos pagos ±5 minutos de esta hora
                </p>
              </div>

              <Button 
                onClick={handleSearch} 
                disabled={searchLoading || !searchTime.trim()}
                className="w-full"
              >
                {searchLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Sesiones
                  </>
                )}
              </Button>

              {sessions.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="font-medium">Sesiones encontradas:</p>
                  {sessions.map((session) => (
                    <Card key={session.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 text-sm">
                          <p className="font-mono text-xs">{session.id}</p>
                          <p>Monto: {session.currency.toUpperCase()} {session.amount}</p>
                          <p>Estado: <span className={session.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>{session.paymentStatus}</span></p>
                          <p className="text-muted-foreground">{new Date(session.created).toLocaleString()}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleValidate(session.id)}
                          disabled={session.paymentStatus !== 'paid'}
                        >
                          Validar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-4 space-y-4">
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-lg text-green-900">¡Pago procesado exitosamente!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Tus cuotas han sido marcadas como pagadas. Puedes cerrar esta ventana y volver a la app.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Total pagado</p>
                          <p className="font-bold text-green-900 text-lg">PEN {result.totalAmount?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cuotas procesadas</p>
                          <p className="font-bold text-green-900 text-lg">{result.transactions?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    {result.transactions && result.transactions.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium text-green-900 text-sm">Detalle de transacciones:</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {result.transactions.map((tx: any, idx: number) => (
                            <div key={idx} className="bg-white p-3 rounded border border-green-200 text-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">Transacción #{idx + 1}</p>
                                  <p className="text-gray-600 mt-1">ID: {tx.id}</p>
                                  <p className="text-gray-600">Cuota: {tx.installmentId}</p>
                                </div>
                                <p className="font-bold text-green-700">PEN {tx.amount}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
              
              {autoValidated && (
                <div className="text-center">
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
              )}
            </div>
          )}
        </CardContent>
      </Card>

        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">¿Cómo obtener el Session ID?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Opción 1: Desde Stripe Dashboard</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                <li>Ve a <a href="https://dashboard.stripe.com/test/payments" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Stripe Dashboard → Payments</a></li>
                <li>Busca el pago por fecha/hora</li>
                <li>Click en el pago</li>
                <li>Copia el "Checkout Session ID" (empieza con cs_test_...)</li>
              </ol>
            </div>
            
            <div>
              <p className="font-medium">Opción 2: Desde los logs del backend</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                <li>Revisa los logs de Vercel o tu servidor</li>
                <li>Busca las llamadas a /api/stripe/create-checkout-session</li>
                <li>El sessionId está en la respuesta</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
