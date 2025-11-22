'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useCards,
  useApproveCard,
  useRejectCard,
  useSuspendCard,
  useReactivateCard,
  useCloseCard,
} from '@/lib/hooks/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { getCardGradient, getDarkTextColor } from '@/lib/utils/colors';

export default function CardsPage() {
  const [microfinancieraId] = useState('mf_demo_001');
  const [filters, setFilters] = useState({
    status: 'all',
    cardType: 'all',
  });
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | 'reactivate' | 'close' | null>(null);
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');

  const { data, isLoading } = useCards(microfinancieraId, filters);
  const approveMutation = useApproveCard();
  const rejectMutation = useRejectCard();
  const suspendMutation = useSuspendCard();
  const reactivateMutation = useReactivateCard();
  const closeMutation = useCloseCard();

  const cards = data?.cards || [];

  const handleAction = async () => {
    if (!selectedCard) return;

    try {
      switch (actionType) {
        case 'approve':
          await approveMutation.mutateAsync({
            microfinancieraId,
            cardId: selectedCard.id,
          });
          toast.success('Tarjeta aprobada exitosamente');
          break;
        case 'reject':
          if (!reason.trim()) {
            toast.error('El motivo es obligatorio');
            return;
          }
          await rejectMutation.mutateAsync({
            microfinancieraId,
            cardId: selectedCard.id,
            reason,
            evidence,
          });
          toast.success('Tarjeta rechazada exitosamente');
          break;
        case 'suspend':
          if (!reason.trim()) {
            toast.error('El motivo es obligatorio');
            return;
          }
          await suspendMutation.mutateAsync({
            microfinancieraId,
            cardId: selectedCard.id,
            reason,
            evidence,
          });
          toast.success('Tarjeta suspendida exitosamente');
          break;
        case 'reactivate':
          await reactivateMutation.mutateAsync({
            microfinancieraId,
            cardId: selectedCard.id,
          });
          toast.success('Tarjeta reactivada exitosamente');
          break;
        case 'close':
          if (!reason.trim()) {
            toast.error('El motivo es obligatorio');
            return;
          }
          await closeMutation.mutateAsync({
            microfinancieraId,
            cardId: selectedCard.id,
            reason,
            evidence,
          });
          toast.success('Tarjeta cerrada exitosamente');
          break;
      }
      setDialogOpen(false);
      setReason('');
      setEvidence('');
      setSelectedCard(null);
      setActionType(null);
    } catch (error: any) {
      toast.error(error.message || 'Error al realizar la acción');
    }
  };

  const openDialog = (card: any, action: typeof actionType) => {
    setSelectedCard(card);
    setActionType(action);
    setDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      case 'closed':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin', 'employee', 'analyst']}>
        <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Tarjetas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="suspended">Suspendida</SelectItem>
                  <SelectItem value="closed">Cerrada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.cardType} onValueChange={(value) => setFilters({ ...filters, cardType: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="debit">Débito</SelectItem>
                  <SelectItem value="credit">Crédito</SelectItem>
                  <SelectItem value="prepaid">Prepago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isLoading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cards.map((card: any) => {
                  const gradient = getCardGradient(card.cardType, card.cardBrand);
                  const textColor = getDarkTextColor(gradient);
                  
                  return (
                    <div
                      key={card.id}
                      className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2"
                      style={{
                        background: gradient,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                      onClick={() => {
                        if (card.status === 'pending') {
                          openDialog(card, 'approve');
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                          <CreditCard className="h-6 w-6" style={{ color: textColor }} />
                        </div>
                        <Badge variant={getStatusBadgeVariant(card.status)} className="bg-white/80 text-black">
                          {card.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <h3 className="font-bold text-lg" style={{ color: textColor }}>
                          {card.cardType ? card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1) : 'Tarjeta'}
                          {card.cardBrand && ` ${card.cardBrand}`}
                        </h3>
                        {(card.name || card.holderFirstName || card.holderLastName || card.displayName) && (
                          <p className="text-base font-semibold" style={{ color: textColor }}>
                            {card.name || 
                             (card.holderFirstName && card.holderLastName 
                               ? `${card.holderFirstName} ${card.holderLastName}`.trim()
                               : card.holderFirstName || card.holderLastName || card.displayName)}
                          </p>
                        )}
                        {(card.dni || card.holderDni || card.documentNumber) && (
                          <p className="text-sm" style={{ color: textColor }}>
                            DNI: {card.dni || card.holderDni || card.documentNumber}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {(['pending', 'requested'] as string[]).includes(card.status) && (
                          <PermissionGuard permission="cards:activate">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog(card, 'approve');
                              }}
                            >
                              Aprobar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog(card, 'reject');
                              }}
                            >
                              Rechazar
                            </Button>
                          </PermissionGuard>
                        )}
                        {(['rejected', 'observed'] as string[]).includes(card.status) && (
                          <PermissionGuard permission="cards:activate">
                            <Button
                              size="sm"
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog(card, 'approve');
                              }}
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog(card, 'close');
                              }}
                            >
                              Cerrar
                            </Button>
                          </PermissionGuard>
                        )}
                        {card.status === 'active' && (
                          <>
                            <PermissionGuard permission="cards:suspend">
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDialog(card, 'suspend');
                                }}
                              >
                                Suspender
                              </Button>
                            </PermissionGuard>
                            <PermissionGuard permission="cards:close">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDialog(card, 'close');
                                }}
                              >
                                Cerrar
                              </Button>
                            </PermissionGuard>
                          </>
                        )}
                        {card.status === 'suspended' && (
                          <>
                            <PermissionGuard permission="cards:activate">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDialog(card, 'reactivate');
                                }}
                              >
                                Reactivar
                              </Button>
                            </PermissionGuard>
                            <PermissionGuard permission="cards:close">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDialog(card, 'close');
                                }}
                              >
                                Cerrar
                              </Button>
                            </PermissionGuard>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {cards.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">No hay tarjetas disponibles</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' && 'Aprobar Tarjeta'}
                {actionType === 'reject' && 'Rechazar Tarjeta'}
                {actionType === 'suspend' && 'Suspender Tarjeta'}
                {actionType === 'reactivate' && 'Reactivar Tarjeta'}
                {actionType === 'close' && 'Cerrar Tarjeta'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve' && '¿Estás seguro de que deseas aprobar esta tarjeta?'}
                {actionType === 'reject' && 'Ingresa el motivo del rechazo'}
                {actionType === 'suspend' && 'Ingresa el motivo de la suspensión'}
                {actionType === 'reactivate' && '¿Estás seguro de que deseas reactivar esta tarjeta?'}
                {actionType === 'close' && 'Ingresa el motivo del cierre'}
              </DialogDescription>
            </DialogHeader>
            {(actionType === 'reject' || actionType === 'suspend' || actionType === 'close') && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Motivo *</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ingresa el motivo..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="evidence">Evidencia (opcional)</Label>
                  <Input
                    id="evidence"
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    placeholder="URL o referencia a evidencia"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAction}>
                {actionType === 'approve' && 'Aprobar'}
                {actionType === 'reject' && 'Rechazar'}
                {actionType === 'suspend' && 'Suspender'}
                {actionType === 'reactivate' && 'Reactivar'}
                {actionType === 'close' && 'Cerrar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      </DashboardLayout>
    </RoleGuard>
    </AuthGuard>
  );
}
