'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAccounts, useApproveAccount, useRejectAccount, useChangeAccountStatus } from '@/lib/hooks/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { User, Mail, MapPin, Search, Phone, Calendar, Building, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { getAccountGradient, getDarkTextColor } from '@/lib/utils/colors';
import { formatDate } from '@/lib/utils/date';

export default function AccountsPage() {
  const [microfinancieraId] = useState('mf_demo_001');
  const [filters, setFilters] = useState({
    status: 'all',
    zone: '',
    accountType: 'all',
  });
  const [searchName, setSearchName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'block' | 'activate' | 'close' | null>(null);
  const [reason, setReason] = useState('');

  const { data, isLoading } = useAccounts(microfinancieraId, filters);
  const approveMutation = useApproveAccount();
  const rejectMutation = useRejectAccount();
  const changeStatusMutation = useChangeAccountStatus();

  const getAccountOwnerName = (account: any) => {
    // Priorizar campos holder (son los más confiables)
    if (account.holderFirstName && account.holderLastName) {
      return `${account.holderFirstName.trim()} ${account.holderLastName.trim()}`;
    }
    if (account.holderFirstName) {
      return account.holderFirstName.trim();
    }
    // Luego displayName
    if (account.displayName && account.displayName !== 'Usuario' && account.displayName !== 'N/A') {
      return account.displayName;
    }
    // Si hay firstName y lastName, combinarlos
    if (account.firstName && account.lastName) {
      return `${account.firstName.trim()} ${account.lastName.trim()}`;
    }
    // Si solo hay firstName
    if (account.firstName) {
      return account.firstName.trim();
    }
    // Si solo hay lastName
    if (account.lastName) {
      return account.lastName.trim();
    }
    // Intentar otros campos
    if (account.name && account.name !== 'Usuario' && account.name !== 'N/A') {
      return account.name;
    }
    if (account.legalName && account.legalName !== 'Usuario' && account.legalName !== 'N/A') {
      return account.legalName;
    }
    if (account.fullName && account.fullName !== 'Usuario' && account.fullName !== 'N/A') {
      return account.fullName;
    }
    // Usar email como último recurso
    if (account.email || account.holderEmail) {
      const email = account.email || account.holderEmail;
      return email.split('@')[0]; // Mostrar solo la parte antes del @
    }
    return 'Usuario';
  };

  const getAccountTypeName = (accountType: string | undefined): string => {
    if (!accountType) return 'Cuenta';
    
    const typeMap: Record<string, string> = {
      'savings': 'Ahorros',
      'checking': 'Corriente',
      'fixedDeposit': 'Depósito a Plazo',
      'microCredit': 'Microcrédito',
      'personal': 'Personal',
      'business': 'Empresarial',
    };
    
    return typeMap[accountType] || accountType.charAt(0).toUpperCase() + accountType.slice(1);
  };

  const accounts = ((data as any)?.accounts || []).filter((account: any) => {
    if (!searchName.trim()) return true;
    const searchLower = searchName.toLowerCase();
    const accountName = getAccountOwnerName(account).toLowerCase();
    const accountEmail = (account.email || account.holderEmail || '').toLowerCase();
    const holderFirstName = (account.holderFirstName || account.firstName || '').toLowerCase();
    const holderLastName = (account.holderLastName || account.lastName || '').toLowerCase();
    
    return accountName.includes(searchLower) || 
           accountEmail.includes(searchLower) ||
           holderFirstName.includes(searchLower) ||
           holderLastName.includes(searchLower);
  });

  const openDetailDialog = (account: any) => {
    setSelectedAccount(account);
    setDetailDialogOpen(true);
  };

  const handleAction = async () => {
    if (!selectedAccount) return;

    try {
      switch (actionType) {
        case 'approve':
          await approveMutation.mutateAsync({
            microfinancieraId,
            accountId: selectedAccount.id,
          });
          toast.success('Cuenta aprobada exitosamente');
          break;
        case 'reject':
          if (!reason.trim()) {
            toast.error('El motivo es obligatorio');
            return;
          }
          await rejectMutation.mutateAsync({
            microfinancieraId,
            accountId: selectedAccount.id,
            reason,
          });
          toast.success('Cuenta rechazada exitosamente');
          break;
        case 'block':
          if (!reason.trim()) {
            toast.error('El motivo es obligatorio');
            return;
          }
          await changeStatusMutation.mutateAsync({
            microfinancieraId,
            accountId: selectedAccount.id,
            status: 'blocked',
            reason,
          });
          toast.success('Cuenta bloqueada exitosamente');
          break;
        case 'activate':
          await changeStatusMutation.mutateAsync({
            microfinancieraId,
            accountId: selectedAccount.id,
            status: 'active',
          });
          toast.success('Cuenta activada exitosamente');
          break;
        case 'close':
          if (!reason.trim()) {
            toast.error('El motivo es obligatorio');
            return;
          }
          await changeStatusMutation.mutateAsync({
            microfinancieraId,
            accountId: selectedAccount.id,
            status: 'closed',
            reason,
          });
          toast.success('Cuenta cerrada exitosamente');
          break;
      }
      setDialogOpen(false);
      setReason('');
      setSelectedAccount(null);
      setActionType(null);
    } catch (error: any) {
      toast.error(error.message || 'Error al realizar la acción');
    }
  };

  const openDialog = (account: any, action: typeof actionType) => {
    setSelectedAccount(account);
    setActionType(action);
    setDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'blocked':
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
            <CardTitle>Gestión de Cuentas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre del cliente"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="blocked">Bloqueada</SelectItem>
                  <SelectItem value="closed">Cerrada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Filtrar por zona"
                value={filters.zone}
                onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
                className="w-48"
              />
              <Select value={filters.accountType} onValueChange={(value) => setFilters({ ...filters, accountType: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="savings">Ahorros</SelectItem>
                  <SelectItem value="checking">Corriente</SelectItem>
                  <SelectItem value="fixedDeposit">Depósito a Plazo</SelectItem>
                  <SelectItem value="microCredit">Microcrédito</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isLoading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {accounts.map((account: any) => {
                  const gradient = getAccountGradient(account.accountType);
                  const textColor = getDarkTextColor(gradient);
                  
                  return (
                    <div
                      key={account.id}
                      className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2"
                      style={{
                        background: gradient,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                          <User className="h-6 w-6" style={{ color: textColor }} />
                        </div>
                        <Badge variant={getStatusBadgeVariant(account.status)} className="bg-white/80 text-black">
                          {account.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            className="text-xs font-semibold"
                            style={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.4)',
                              color: textColor,
                              border: `1px solid ${textColor}`
                            }}
                          >
                            {getAccountTypeName(account.accountType)}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-lg" style={{ color: textColor }}>
                          {getAccountOwnerName(account)}
                        </h3>
                        {(account.holderDni || account.docNumber || account.dni) && (
                          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: textColor }}>
                            <User className="h-4 w-4" />
                            <span>DNI: {account.holderDni || account.docNumber || account.dni}</span>
                          </div>
                        )}
                        {account.balance !== undefined && (
                          <div className="p-2 rounded-lg mt-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                            <p className="text-xs opacity-80" style={{ color: textColor }}>Balance</p>
                            <p className="text-lg font-bold" style={{ color: textColor }}>
                              {account.currency === 'PEN' ? 'S/' : account.currency === 'USD' ? '$' : account.currency || 'S/'} {account.balance.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs" style={{ color: textColor }}>
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{account.email || account.holderEmail}</span>
                        </div>
                        {account.zone && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: textColor }}>
                            <MapPin className="h-3 w-3" />
                            <span>{account.zone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full bg-white/90 hover:bg-white text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailDialog(account);
                          }}
                        >
                          Ver Detalle
                        </Button>
                        <div className="flex gap-2">
                          {account.status === 'pending' && (
                            <PermissionGuard permission="accounts:activate">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDialog(account, 'approve');
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
                                  openDialog(account, 'reject');
                                }}
                              >
                                Rechazar
                              </Button>
                            </PermissionGuard>
                          )}
                          {account.status === 'active' && (
                            <>
                              <PermissionGuard permission="accounts:block">
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDialog(account, 'block');
                                  }}
                                >
                                  Bloquear
                                </Button>
                              </PermissionGuard>
                              <PermissionGuard permission="accounts:close">
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDialog(account, 'close');
                                  }}
                                >
                                  Cerrar
                                </Button>
                              </PermissionGuard>
                            </>
                          )}
                          {account.status === 'blocked' && (
                            <>
                              <PermissionGuard permission="accounts:activate">
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDialog(account, 'activate');
                                  }}
                                >
                                  Activar
                                </Button>
                              </PermissionGuard>
                              <PermissionGuard permission="accounts:close">
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDialog(account, 'close');
                                  }}
                                >
                                  Cerrar
                                </Button>
                              </PermissionGuard>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {accounts.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">No hay cuentas disponibles</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' && 'Aprobar Cuenta'}
                {actionType === 'reject' && 'Rechazar Cuenta'}
                {actionType === 'block' && 'Bloquear Cuenta'}
                {actionType === 'activate' && 'Activar Cuenta'}
                {actionType === 'close' && 'Cerrar Cuenta'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve' && '¿Estás seguro de que deseas aprobar esta cuenta?'}
                {actionType === 'reject' && 'Ingresa el motivo del rechazo'}
                {actionType === 'block' && 'Ingresa el motivo del bloqueo'}
                {actionType === 'activate' && '¿Estás seguro de que deseas activar esta cuenta?'}
                {actionType === 'close' && 'Ingresa el motivo del cierre'}
              </DialogDescription>
            </DialogHeader>
            {(actionType === 'reject' || actionType === 'block' || actionType === 'close') && (
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
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAction}>
                {actionType === 'approve' && 'Aprobar'}
                {actionType === 'reject' && 'Rechazar'}
                {actionType === 'block' && 'Bloquear'}
                {actionType === 'activate' && 'Activar'}
                {actionType === 'close' && 'Cerrar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Detalle de Cuenta */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle de Cuenta</DialogTitle>
              <DialogDescription>
                Información completa de la cuenta
              </DialogDescription>
            </DialogHeader>
            {selectedAccount && (
              <div className="space-y-6 mt-4">
                {/* Información General */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">ID de Cuenta</Label>
                    <p className="font-semibold">{selectedAccount.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Estado</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusBadgeVariant(selectedAccount.status)}>
                        {selectedAccount.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información del Usuario */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Información del Usuario
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Nombre Completo</Label>
                      <p className="font-medium">{getAccountOwnerName(selectedAccount)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedAccount.email || selectedAccount.holderEmail || 'N/A'}
                      </p>
                    </div>
                    {(selectedAccount.holderFirstName || selectedAccount.firstName) && (
                      <div>
                        <Label className="text-xs text-gray-500">Nombre</Label>
                        <p className="font-medium">{selectedAccount.holderFirstName || selectedAccount.firstName}</p>
                      </div>
                    )}
                    {(selectedAccount.holderLastName || selectedAccount.lastName) && (
                      <div>
                        <Label className="text-xs text-gray-500">Apellido</Label>
                        <p className="font-medium">{selectedAccount.holderLastName || selectedAccount.lastName}</p>
                      </div>
                    )}
                    {(selectedAccount.holderPhone || selectedAccount.phone) && (
                      <div>
                        <Label className="text-xs text-gray-500">Teléfono</Label>
                        <p className="font-medium flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedAccount.holderPhone || selectedAccount.phone}
                        </p>
                      </div>
                    )}
                    {(selectedAccount.holderDni || selectedAccount.docNumber) && (
                      <div>
                        <Label className="text-xs text-gray-500">DNI</Label>
                        <p className="font-medium">{selectedAccount.holderDni || selectedAccount.docNumber}</p>
                      </div>
                    )}
                    {selectedAccount.docType && (
                      <div>
                        <Label className="text-xs text-gray-500">Tipo de Documento</Label>
                        <p className="font-medium">{selectedAccount.docType}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información de Ubicación */}
                {(selectedAccount.holderAddress || selectedAccount.zone) && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ubicación
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedAccount.holderAddress && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500">Dirección</Label>
                          <p className="font-medium">{selectedAccount.holderAddress}</p>
                        </div>
                      )}
                      {selectedAccount.holderDistrict && (
                        <div>
                          <Label className="text-xs text-gray-500">Distrito</Label>
                          <p className="font-medium">{selectedAccount.holderDistrict}</p>
                        </div>
                      )}
                      {selectedAccount.holderProvince && (
                        <div>
                          <Label className="text-xs text-gray-500">Provincia</Label>
                          <p className="font-medium">{selectedAccount.holderProvince}</p>
                        </div>
                      )}
                      {selectedAccount.holderDepartment && (
                        <div>
                          <Label className="text-xs text-gray-500">Departamento</Label>
                          <p className="font-medium">{selectedAccount.holderDepartment}</p>
                        </div>
                      )}
                      {selectedAccount.zone && (
                        <div>
                          <Label className="text-xs text-gray-500">Zona</Label>
                          <p className="font-medium">{selectedAccount.zone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información Laboral */}
                {(selectedAccount.employmentType || selectedAccount.employerName || selectedAccount.position || selectedAccount.monthlyIncome) && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Información Laboral
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedAccount.employmentType && (
                        <div>
                          <Label className="text-xs text-gray-500">Tipo de Empleo</Label>
                          <p className="font-medium">{selectedAccount.employmentType}</p>
                        </div>
                      )}
                      {selectedAccount.employerName && (
                        <div>
                          <Label className="text-xs text-gray-500">Empresa</Label>
                          <p className="font-medium">{selectedAccount.employerName}</p>
                        </div>
                      )}
                      {selectedAccount.position && (
                        <div>
                          <Label className="text-xs text-gray-500">Cargo</Label>
                          <p className="font-medium">{selectedAccount.position}</p>
                        </div>
                      )}
                      {selectedAccount.monthlyIncome && (
                        <div>
                          <Label className="text-xs text-gray-500">Ingreso Mensual</Label>
                          <p className="font-medium">S/ {selectedAccount.monthlyIncome.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información de la Cuenta */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Información de la Cuenta
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAccount.accountType && (
                      <div>
                        <Label className="text-xs text-gray-500">Tipo de Cuenta</Label>
                        <p className="font-medium capitalize">{selectedAccount.accountType}</p>
                      </div>
                    )}
                    {selectedAccount.accountNumber && (
                      <div>
                        <Label className="text-xs text-gray-500">Número de Cuenta</Label>
                        <p className="font-medium font-mono">{selectedAccount.accountNumber}</p>
                      </div>
                    )}
                    {selectedAccount.cci && (
                      <div>
                        <Label className="text-xs text-gray-500">CCI</Label>
                        <p className="font-medium font-mono">{selectedAccount.cci}</p>
                      </div>
                    )}
                    {selectedAccount.balance !== undefined && (
                      <div>
                        <Label className="text-xs text-gray-500">Balance</Label>
                        <p className="font-semibold text-lg">
                          {selectedAccount.currency === 'USD' ? '$' : 'S/'} {selectedAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                    {selectedAccount.interestRate && (
                      <div>
                        <Label className="text-xs text-gray-500">Tasa de Interés</Label>
                        <p className="font-medium">{selectedAccount.interestRate}%</p>
                      </div>
                    )}
                    {selectedAccount.initialDeposit && (
                      <div>
                        <Label className="text-xs text-gray-500">Depósito Inicial</Label>
                        <p className="font-medium">S/ {selectedAccount.initialDeposit.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    )}
                    {selectedAccount.hasBankAccount !== undefined && (
                      <div className="flex items-center gap-2">
                        {selectedAccount.hasBankAccount ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Label className="text-xs">Tiene Cuenta Bancaria</Label>
                      </div>
                    )}
                    {selectedAccount.bankName && (
                      <div>
                        <Label className="text-xs text-gray-500">Banco</Label>
                        <p className="font-medium">{selectedAccount.bankName}</p>
                      </div>
                    )}
                    {selectedAccount.hasCreditHistory !== undefined && (
                      <div className="flex items-center gap-2">
                        {selectedAccount.hasCreditHistory ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Label className="text-xs">Historial Crediticio</Label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comentarios Adicionales */}
                {selectedAccount.additionalComments && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Comentarios Adicionales</h3>
                    <p className="text-sm text-gray-700">{selectedAccount.additionalComments}</p>
                  </div>
                )}

                {/* Motivo de Rechazo/Cierre */}
                {selectedAccount.rejectionReason && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Motivo de Rechazo</h3>
                    <p className="text-sm text-gray-700">{selectedAccount.rejectionReason}</p>
                  </div>
                )}

                {/* Fechas */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fechas
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAccount.createdAt && formatDate(selectedAccount.createdAt) !== 'N/A' && (
                      <div>
                        <Label className="text-xs text-gray-500">Fecha de Creación</Label>
                        <p className="font-medium">
                          {formatDate(selectedAccount.createdAt)}
                        </p>
                      </div>
                    )}
                    {selectedAccount.updatedAt && formatDate(selectedAccount.updatedAt) !== 'N/A' && (
                      <div>
                        <Label className="text-xs text-gray-500">Última Actualización</Label>
                        <p className="font-medium">
                          {formatDate(selectedAccount.updatedAt)}
                        </p>
                      </div>
                    )}
                    {selectedAccount.lastUpdated && formatDate(selectedAccount.lastUpdated) !== 'N/A' && (
                      <div>
                        <Label className="text-xs text-gray-500">Última Actualización</Label>
                        <p className="font-medium">
                          {formatDate(selectedAccount.lastUpdated)}
                        </p>
                      </div>
                    )}
                    {selectedAccount.activatedAt && formatDate(selectedAccount.activatedAt) !== 'N/A' && (
                      <div>
                        <Label className="text-xs text-gray-500">Fecha de Activación</Label>
                        <p className="font-medium">
                          {formatDate(selectedAccount.activatedAt)}
                        </p>
                      </div>
                    )}
                    {selectedAccount.blockedAt && formatDate(selectedAccount.blockedAt) !== 'N/A' && (
                      <div>
                        <Label className="text-xs text-gray-500">Fecha de Bloqueo</Label>
                        <p className="font-medium">
                          {formatDate(selectedAccount.blockedAt)}
                        </p>
                      </div>
                    )}
                    {selectedAccount.closedAt && formatDate(selectedAccount.closedAt) !== 'N/A' && (
                      <div>
                        <Label className="text-xs text-gray-500">Fecha de Cierre</Label>
                        <p className="font-medium">
                          {formatDate(selectedAccount.closedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                Cerrar
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
