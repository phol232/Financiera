'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useApplications, useAssignApplication, useAnalysts } from '@/lib/hooks/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { FileText, DollarSign, MapPin, Package, User, Mail, Phone, Calendar, Briefcase, Building, CreditCard, CheckCircle, XCircle, AlertCircle, Search, Check, ChevronsUpDown } from 'lucide-react';
import { getApplicationGradient, getDarkTextColor } from '@/lib/utils/colors';
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils';

export default function ApplicationsPage() {
  const [microfinancieraId] = useState('mf_demo_001');
  const [filters, setFilters] = useState({
    status: 'all',
    zone: '',
    productId: '',
  });
  const [searchName, setSearchName] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'assign' | null>(null);
  const [analystId, setAnalystId] = useState('');
  const [analystSearch, setAnalystSearch] = useState('');
  const [openAnalystCombobox, setOpenAnalystCombobox] = useState(false);

  const { data, isLoading } = useApplications(microfinancieraId, filters);
  const assignMutation = useAssignApplication();
  const { data: analystsData } = useAnalysts(microfinancieraId, analystSearch);

  const getUserName = (app: any) => {
    if (app.personalInfo?.firstName && app.personalInfo?.lastName) {
      return `${app.personalInfo.firstName} ${app.personalInfo.lastName}`;
    }
    if (app.personalInfo?.firstName) {
      return app.personalInfo.firstName;
    }
    if (app.contactInfo?.email) {
      return app.contactInfo.email;
    }
    return 'Usuario';
  };

  const applications = (data?.applications || []).filter((app: any) => {
    if (!searchName.trim()) return true;
    const userName = getUserName(app).toLowerCase();
    return userName.includes(searchName.toLowerCase());
  });

  const handleAssign = async () => {
    if (!selectedApplication || !analystId.trim()) {
      toast.error('Selecciona un analista');
      return;
    }

    try {
      await assignMutation.mutateAsync({
        microfinancieraId,
        applicationId: selectedApplication.id,
        analystId,
      });
      toast.success('Solicitud asignada exitosamente');
      setDialogOpen(false);
      setAnalystId('');
      setSelectedApplication(null);
      setActionType(null);
    } catch (error: any) {
      toast.error(error.message || 'Error al asignar la solicitud');
    }
  };

  const openAssignDialog = (app: any) => {
    setSelectedApplication(app);
    setActionType('assign');
    setDialogOpen(true);
  };

  const openDetailDialog = (app: any) => {
    setSelectedApplication(app);
    setDetailDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return 'default';
      case 'pending':
      case 'in_evaluation':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'conditioned':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Crédito</CardTitle>
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
                  <SelectItem value="in_evaluation">En evaluación</SelectItem>
                  <SelectItem value="conditioned">Condicionada</SelectItem>
                  <SelectItem value="approved">Aprobada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                  <SelectItem value="disbursed">Desembolsada</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Filtrar por zona"
                value={filters.zone}
                onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
                className="w-48"
              />
              <Input
                placeholder="Filtrar por producto ID"
                value={filters.productId}
                onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
                className="w-48"
              />
            </div>
            {isLoading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {applications.map((app: any) => {
                  // Obtener el código del producto desde el objeto product o productId
                  const productCode = app.product?.code || app.productCode || app.productId;
                  const gradient = getApplicationGradient(productCode);
                  const textColor = getDarkTextColor(gradient);
                  
                  return (
                    <div
                      key={app.id}
                      className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2"
                      style={{
                        background: gradient,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                          <FileText className="h-6 w-6" style={{ color: textColor }} />
                        </div>
                        <Badge variant={getStatusBadgeVariant(app.status)} className="bg-white/80 text-black">
                          {app.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <h3 className="font-bold text-lg" style={{ color: textColor }}>
                          {getUserName(app)}
                        </h3>
                        <p className="text-xs opacity-80" style={{ color: textColor }}>
                          Solicitud #{app.id.slice(0, 8)}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: textColor }}>
                          <DollarSign className="h-4 w-4" />
                          <span>S/ {app.financialInfo?.loanAmount?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || app.amount?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                        </div>
                        {app.zone && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: textColor }}>
                            <MapPin className="h-3 w-3" />
                            <span>{app.zone}</span>
                          </div>
                        )}
                        {(app.product?.name || app.productId) && (
                          <div className="flex items-center gap-2 text-xs" style={{ color: textColor }}>
                            <Package className="h-3 w-3" />
                            <span>{app.product?.name || app.productId}</span>
                          </div>
                        )}
                        {app.scoring && (
                          <div className="mt-2 p-2 rounded bg-white/30">
                            <p className="text-xs font-semibold" style={{ color: textColor }}>
                              Score: {app.scoring.score || app.scoring.totalScore || 'N/A'}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-white/90 hover:bg-white text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailDialog(app);
                          }}
                        >
                          Ver Detalle
                        </Button>
                        {(!app.assignedUserId || app.status === 'pending') && (
                          <Button 
                            size="sm" 
                            className="bg-white/90 hover:bg-white text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssignDialog(app);
                            }}
                          >
                            Asignar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {applications.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">No hay solicitudes disponibles</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar Analista</DialogTitle>
              <DialogDescription>
                Busca y selecciona el analista que revisará esta solicitud
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Buscar Analista *</Label>
                <div className="relative mt-1">
                  <Input
                    placeholder="Escribe para buscar por nombre, email o DNI..."
                    value={analystSearch}
                    onChange={(e) => setAnalystSearch(e.target.value)}
                    className="w-full"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                
                {/* Mostrar analista seleccionado */}
                {analystId && analystsData?.analysts?.find((a: any) => a.userId === analystId) && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">
                          {analystsData.analysts.find((a: any) => a.userId === analystId)?.displayName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {analystsData.analysts.find((a: any) => a.userId === analystId)?.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAnalystId('');
                        setAnalystSearch('');
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Resultados de búsqueda */}
                {analystSearch && analystSearch.trim().length > 0 && !analystId && (
                  <div className="mt-2 border rounded-md max-h-60 overflow-y-auto">
                    {analystsData?.analysts && analystsData.analysts.length > 0 ? (
                      <div className="divide-y">
                        {analystsData.analysts.map((analyst: any) => (
                          <button
                            key={analyst.userId}
                            className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setAnalystId(analyst.userId);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{analyst.displayName}</span>
                              <span className="text-xs text-gray-500">
                                {analyst.email} {analyst.dni && `• DNI: ${analyst.dni}`}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        {analystSearch.length < 2 
                          ? 'Escribe al menos 2 caracteres para buscar...'
                          : 'No se encontraron analistas'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAssign} disabled={!analystId}>
                Asignar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Detalle de Solicitud */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle de Solicitud</DialogTitle>
              <DialogDescription>
                Información completa de la solicitud de crédito
              </DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6 mt-4">
                {/* Información General */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">ID de Solicitud</Label>
                    <p className="font-semibold">{selectedApplication.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Estado</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusBadgeVariant(selectedApplication.status)}>
                        {selectedApplication.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información Personal */}
                {selectedApplication.personalInfo && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Nombres</Label>
                        <p className="font-medium">{selectedApplication.personalInfo.firstName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Apellidos</Label>
                        <p className="font-medium">{selectedApplication.personalInfo.lastName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Tipo de Documento</Label>
                        <p className="font-medium">{selectedApplication.personalInfo.documentType || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Número de Documento</Label>
                        <p className="font-medium">{selectedApplication.personalInfo.documentNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Fecha de Nacimiento</Label>
                        <p className="font-medium">{selectedApplication.personalInfo.birthDate || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Nacionalidad</Label>
                        <p className="font-medium">{selectedApplication.personalInfo.nationality || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Estado Civil</Label>
                        <p className="font-medium">{selectedApplication.personalInfo.maritalStatus || 'N/A'}</p>
                      </div>
                      {selectedApplication.personalInfo.dependents !== undefined && (
                        <div>
                          <Label className="text-xs text-gray-500">Dependientes</Label>
                          <p className="font-medium">{selectedApplication.personalInfo.dependents}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información de Contacto */}
                {selectedApplication.contactInfo && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Información de Contacto
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label className="text-xs text-gray-500">Dirección</Label>
                        <p className="font-medium">{selectedApplication.contactInfo.address || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Distrito</Label>
                        <p className="font-medium">{selectedApplication.contactInfo.district || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Provincia</Label>
                        <p className="font-medium">{selectedApplication.contactInfo.province || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Departamento</Label>
                        <p className="font-medium">{selectedApplication.contactInfo.department || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Teléfono Móvil</Label>
                        <p className="font-medium flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedApplication.contactInfo.mobilePhone || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Email</Label>
                        <p className="font-medium flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedApplication.contactInfo.email || 'N/A'}
                        </p>
                      </div>
                      {selectedApplication.contactInfo.homeReference && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500">Referencia de Domicilio</Label>
                          <p className="font-medium">{selectedApplication.contactInfo.homeReference}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información Laboral */}
                {selectedApplication.employmentInfo && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Información Laboral
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Tipo de Empleo</Label>
                        <p className="font-medium">{selectedApplication.employmentInfo.employmentType || 'N/A'}</p>
                      </div>
                      {selectedApplication.employmentInfo.employerName && (
                        <div>
                          <Label className="text-xs text-gray-500">Empresa</Label>
                          <p className="font-medium flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {selectedApplication.employmentInfo.employerName}
                          </p>
                        </div>
                      )}
                      {selectedApplication.employmentInfo.position && (
                        <div>
                          <Label className="text-xs text-gray-500">Cargo</Label>
                          <p className="font-medium">{selectedApplication.employmentInfo.position}</p>
                        </div>
                      )}
                      {(selectedApplication.employmentInfo.yearsEmployed !== undefined || selectedApplication.employmentInfo.monthsEmployed !== undefined) && (
                        <div>
                          <Label className="text-xs text-gray-500">Tiempo en el Trabajo</Label>
                          <p className="font-medium">
                            {selectedApplication.employmentInfo.yearsEmployed || 0} años, {selectedApplication.employmentInfo.monthsEmployed || 0} meses
                          </p>
                        </div>
                      )}
                      {selectedApplication.employmentInfo.contractType && (
                        <div>
                          <Label className="text-xs text-gray-500">Tipo de Contrato</Label>
                          <p className="font-medium">{selectedApplication.employmentInfo.contractType}</p>
                        </div>
                      )}
                      {selectedApplication.employmentInfo.workPhone && (
                        <div>
                          <Label className="text-xs text-gray-500">Teléfono del Trabajo</Label>
                          <p className="font-medium">{selectedApplication.employmentInfo.workPhone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información Financiera */}
                {selectedApplication.financialInfo && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Información Financiera
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Ingreso Mensual</Label>
                        <p className="font-semibold text-lg">S/ {selectedApplication.financialInfo.monthlyIncome?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                      </div>
                      {selectedApplication.financialInfo.otherIncome && (
                        <div>
                          <Label className="text-xs text-gray-500">Otros Ingresos</Label>
                          <p className="font-medium">S/ {selectedApplication.financialInfo.otherIncome.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          {selectedApplication.financialInfo.otherIncomeSource && (
                            <p className="text-xs text-gray-500">{selectedApplication.financialInfo.otherIncomeSource}</p>
                          )}
                        </div>
                      )}
                      {selectedApplication.financialInfo.monthlyExpenses !== undefined && (
                        <div>
                          <Label className="text-xs text-gray-500">Gastos Mensuales</Label>
                          <p className="font-medium">S/ {selectedApplication.financialInfo.monthlyExpenses.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                      )}
                      {selectedApplication.financialInfo.currentDebts !== undefined && (
                        <div>
                          <Label className="text-xs text-gray-500">Deudas Actuales</Label>
                          <p className="font-medium">S/ {selectedApplication.financialInfo.currentDebts.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          {selectedApplication.financialInfo.currentDebtsEntity && (
                            <p className="text-xs text-gray-500">{selectedApplication.financialInfo.currentDebtsEntity}</p>
                          )}
                        </div>
                      )}
                      <div>
                        <Label className="text-xs text-gray-500">Monto Solicitado</Label>
                        <p className="font-semibold text-lg">S/ {selectedApplication.financialInfo.loanAmount?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Plazo (meses)</Label>
                        <p className="font-medium">{selectedApplication.financialInfo.loanTermMonths || 'N/A'}</p>
                      </div>
                      {selectedApplication.financialInfo.loanPurpose && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500">Propósito del Crédito</Label>
                          <p className="font-medium">{selectedApplication.financialInfo.loanPurpose}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información Adicional */}
                {selectedApplication.additionalInfo && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Información Adicional
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        {selectedApplication.additionalInfo.hasCreditHistory ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Label className="text-xs">Historial Crediticio</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedApplication.additionalInfo.hasBankAccount ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Label className="text-xs">Cuenta Bancaria</Label>
                      </div>
                      {selectedApplication.additionalInfo.bankName && (
                        <div>
                          <Label className="text-xs text-gray-500">Banco</Label>
                          <p className="font-medium">{selectedApplication.additionalInfo.bankName}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {selectedApplication.additionalInfo.hasGuarantee ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Label className="text-xs">Garantía</Label>
                      </div>
                      {selectedApplication.additionalInfo.guaranteeDescription && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500">Descripción de Garantía</Label>
                          <p className="font-medium">{selectedApplication.additionalInfo.guaranteeDescription}</p>
                        </div>
                      )}
                      {selectedApplication.additionalInfo.additionalComments && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500">Comentarios Adicionales</Label>
                          <p className="font-medium">{selectedApplication.additionalInfo.additionalComments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Producto */}
                {selectedApplication.product && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Producto de Crédito
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Código</Label>
                        <p className="font-medium">{selectedApplication.product.code || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Nombre</Label>
                        <p className="font-medium">{selectedApplication.product.name || 'N/A'}</p>
                      </div>
                      {selectedApplication.product.rateNominal && (
                        <div>
                          <Label className="text-xs text-gray-500">Tasa Nominal</Label>
                          <p className="font-medium">{selectedApplication.product.rateNominal}%</p>
                        </div>
                      )}
                      {(selectedApplication.product.termMin || selectedApplication.product.termMax) && (
                        <div>
                          <Label className="text-xs text-gray-500">Plazo</Label>
                          <p className="font-medium">
                            {selectedApplication.product.termMin || 0} - {selectedApplication.product.termMax || 0} meses
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Scoring */}
                {selectedApplication.scoring && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Scoring
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Score Total</Label>
                        <p className="font-semibold text-lg">{selectedApplication.scoring.score || selectedApplication.scoring.totalScore || 'N/A'}</p>
                      </div>
                      {selectedApplication.scoring.band && (
                        <div>
                          <Label className="text-xs text-gray-500">Banda</Label>
                          <p className="font-medium">{selectedApplication.scoring.band}</p>
                        </div>
                      )}
                      {selectedApplication.scoring.details && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500 mb-2 block">Detalles del Score</Label>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {selectedApplication.scoring.details.incomeScore !== undefined && (
                              <div>Ingresos: {selectedApplication.scoring.details.incomeScore}</div>
                            )}
                            {selectedApplication.scoring.details.debtToIncomeScore !== undefined && (
                              <div>Deuda/Ingreso: {selectedApplication.scoring.details.debtToIncomeScore}</div>
                            )}
                            {selectedApplication.scoring.details.employmentScore !== undefined && (
                              <div>Empleo: {selectedApplication.scoring.details.employmentScore}</div>
                            )}
                            {selectedApplication.scoring.details.creditHistoryScore !== undefined && (
                              <div>Historial: {selectedApplication.scoring.details.creditHistoryScore}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Decision */}
                {selectedApplication.decision && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Decisión</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Resultado</Label>
                        <p className="font-medium">{selectedApplication.decision.result || 'N/A'}</p>
                      </div>
                      {selectedApplication.decision.isAutomatic !== undefined && (
                        <div>
                          <Label className="text-xs text-gray-500">Tipo</Label>
                          <p className="font-medium">{selectedApplication.decision.isAutomatic ? 'Automática' : 'Manual'}</p>
                        </div>
                      )}
                      {selectedApplication.decision.comments && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500">Comentarios</Label>
                          <p className="font-medium">{selectedApplication.decision.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fechas */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedApplication.createdAt && (
                      <div>
                        <Label className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Fecha de Creación
                        </Label>
                        <p className="font-medium">
                          {formatDate(selectedApplication.createdAt)}
                        </p>
                      </div>
                    )}
                    {selectedApplication.updatedAt && (
                      <div>
                        <Label className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Última Actualización
                        </Label>
                        <p className="font-medium">
                          {formatDate(selectedApplication.updatedAt)}
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
    </AuthGuard>
  );
}
