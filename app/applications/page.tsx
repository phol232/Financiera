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
import { useApplications, useAssignApplication, useAnalysts, useCalculateScore, useApproveApplication, useRejectApplication, useCustomerAccounts, useDisburseLoan } from '@/lib/hooks/api';
import { apiClient } from '@/lib/api-client';
import { useEffect, useMemo, useState } from 'react';
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
  const [selectedApplicationState, setSelectedApplicationState] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'assign' | null>(null);
  const [analystId, setAnalystId] = useState('');
  const [analystSearch, setAnalystSearch] = useState('');
  const [openAnalystCombobox, setOpenAnalystCombobox] = useState(false);

  const { data, isLoading } = useApplications(microfinancieraId, filters);
  const assignMutation = useAssignApplication();
  const { data: analystsData } = useAnalysts(microfinancieraId, analystSearch);
  const calculateScoreMutation = useCalculateScore();
  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();
  const disburseLoanMutation = useDisburseLoan();
  
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [evaluationType, setEvaluationType] = useState<'approve' | 'reject' | null>(null);
  const [evaluationComments, setEvaluationComments] = useState('');
  const [scoringDialogOpen, setScoringDialogOpen] = useState(false);
  const [calculatedScoring, setCalculatedScoring] = useState<any>(null);
  const [disbursementDialogOpen, setDisbursementDialogOpen] = useState(false);
  const [selectedDisbursementAccountId, setSelectedDisbursementAccountId] = useState('');
  const [localApplicationOverrides, setLocalApplicationOverrides] = useState<Record<string, { scoring?: any; decision?: any; status?: string; disbursementDetails?: any }>>({});

  const userIdForAccounts = detailDialogOpen && selectedApplicationState?.userId
    ? selectedApplicationState.userId
    : undefined;

  const {
    data: customerAccountsData,
    isLoading: isLoadingCustomerAccounts,
    refetch: refetchCustomerAccounts,
  } = useCustomerAccounts(microfinancieraId, userIdForAccounts);

  const customerAccounts = useMemo(
    () => (customerAccountsData as any)?.accounts || [],
    [customerAccountsData],
  );
  const selectedDisbursementAccount = customerAccounts.find(
    (account: any) => account.id === selectedDisbursementAccountId,
  );

  useEffect(() => {
    if (
      disbursementDialogOpen &&
      customerAccounts.length > 0 &&
      !selectedDisbursementAccountId
    ) {
      setSelectedDisbursementAccountId(customerAccounts[0].id);
    }
  }, [
    customerAccounts,
    disbursementDialogOpen,
    selectedDisbursementAccountId,
  ]);

  useEffect(() => {
    if (!disbursementDialogOpen) {
      setSelectedDisbursementAccountId('');
    }
  }, [disbursementDialogOpen]);

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      'pending': 'Pendiente',
      'in_evaluation': 'En evaluación',
      'in_review': 'En revisión',
      'conditioned': 'Condicionada',
      'approved': 'Aprobada',
      'rejected': 'Rechazada',
      'disbursed': 'Desembolsada',
      'observed': 'Observada',
    };
    return statusLabels[status] || status;
  };

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

  const formatCurrencyValue = (value?: number | string) => {
    if (value === undefined || value === null) {
      return 'S/ 0.00';
    }
    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(numeric)) {
      return 'S/ 0.00';
    }
    return numeric.toLocaleString('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    });
  };

  const applications = (data?.applications || []).filter((app: any) => {
    if (!searchName.trim()) return true;
    const userName = getUserName(app).toLowerCase();
    return userName.includes(searchName.toLowerCase());
  });

  const selectedOverrides = selectedApplicationState
    ? localApplicationOverrides[selectedApplicationState.id]
    : undefined;

  const effectiveApplication = useMemo(() => {
    if (!selectedApplicationState) return null;
    if (!selectedOverrides) return selectedApplicationState;
    return {
      ...selectedApplicationState,
      ...selectedOverrides,
      scoring: selectedOverrides.scoring ?? selectedApplicationState.scoring,
      decision: selectedOverrides.decision ?? selectedApplicationState.decision,
      status: selectedOverrides.status ?? selectedApplicationState.status,
      disbursementDetails:
        selectedOverrides.disbursementDetails ?? selectedApplicationState.disbursementDetails,
    };
  }, [selectedApplicationState, selectedOverrides]);

  const selectedApplication = effectiveApplication ?? selectedApplicationState;

  const currentStatus = effectiveApplication?.status;
  const currentScoring = effectiveApplication?.scoring;
  const currentDecision = effectiveApplication?.decision;
  const disbursementDetails = effectiveApplication?.disbursementDetails;

  const canEvaluateApplication = !!(
    effectiveApplication &&
    currentScoring &&
    currentStatus !== 'approved' &&
    currentStatus !== 'disbursed'
  );

  const canShowDisburseButton = !!(
    effectiveApplication && currentStatus === 'approved'
  );

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
      setSelectedApplicationState(null);
      setActionType(null);
    } catch (error: any) {
      toast.error(error.message || 'Error al asignar la solicitud');
    }
  };

  const openAssignDialog = (app: any) => {
    setSelectedApplicationState(app);
    setActionType('assign');
    setDialogOpen(true);
  };

  const handleCalculateScore = async () => {
    if (!selectedApplication) return;
    const currentApplicationId = selectedApplication.id;

    try {
      toast.loading('Calculando score...');
      const result: any = await calculateScoreMutation.mutateAsync({
        microfinancieraId,
        applicationId: selectedApplication.id,
      });
      toast.dismiss();
      toast.success('Score calculado exitosamente');
      console.log('🔍 Resultado del scoring recibido:', result);
      console.log('👉 Valores crudos de score:', result.scoring?.score, 'totalScore:', result.scoring?.totalScore);
      let normalizedScoring = {
        ...result.scoring,
        score: result.scoring?.score ?? result.scoring?.totalScore ?? 0,
        totalScore: result.scoring?.totalScore ?? result.scoring?.score ?? 0,
      };
      let refreshedDecision = result.decision || selectedApplication.decision;
      try {
        const latestData: any = await apiClient.get(`/api/scoring/${microfinancieraId}/${selectedApplication.id}`);
        if (latestData?.scoring) {
          normalizedScoring = {
            ...latestData.scoring,
            score:
              latestData.scoring.score ??
              latestData.scoring.totalScore ??
              normalizedScoring.score ??
              0,
            totalScore:
              latestData.scoring.totalScore ??
              latestData.scoring.score ??
              normalizedScoring.totalScore ??
              0,
          };
          console.log('📥 Scoring actualizado desde backend:', normalizedScoring);
        }
        if (latestData?.decision) {
          refreshedDecision = latestData.decision;
        }
      } catch (refreshError) {
        console.error('⚠️ No se pudo refrescar el scoring desde backend:', refreshError);
      }
      console.log('✅ Scoring normalizado:', normalizedScoring);
      // Guardar el scoring calculado y mostrar modal
      setCalculatedScoring(normalizedScoring);
      const decisionResult = (refreshedDecision || result.decision)?.result;
      const derivedStatus =
        decisionResult === 'rejected'
          ? 'rejected'
          : decisionResult === 'observed'
            ? 'observed'
            : 'decision';
      const statusToApply =
        !result.decision || selectedApplication.status === 'disbursed'
          ? selectedApplication.status
          : derivedStatus;
      setSelectedApplicationState((prev: any) => {
        if (!prev || prev.id !== currentApplicationId) return prev;

        return {
          ...prev,
          scoring: normalizedScoring,
          decision: refreshedDecision || prev.decision,
          status: statusToApply,
        };
      });
      setLocalApplicationOverrides((prev) => ({
        ...prev,
        [currentApplicationId]: {
          ...(prev[currentApplicationId] || {}),
          scoring: normalizedScoring,
          decision: refreshedDecision || prev[currentApplicationId]?.decision,
          status: statusToApply,
        },
      }));
      setScoringDialogOpen(true);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Error al calcular el score');
    }
  };

  const handleEvaluate = async () => {
    if (!selectedApplication || !evaluationType) return;

    try {
      if (evaluationType === 'approve') {
        await approveMutation.mutateAsync({
          microfinancieraId,
          applicationId: selectedApplication.id,
          comments: evaluationComments,
        });
        toast.success('Solicitud aprobada exitosamente');
        setSelectedApplicationState((prev: any) =>
          prev?.id === selectedApplication.id
            ? { ...prev, status: 'approved' }
            : prev,
        );
        setLocalApplicationOverrides((prev) => ({
          ...prev,
          [selectedApplication.id]: {
            ...(prev[selectedApplication.id] || {}),
            status: 'approved',
          },
        }));
      } else if (evaluationType === 'reject') {
        if (!evaluationComments.trim()) {
          toast.error('El motivo del rechazo es obligatorio');
          return;
        }
        await rejectMutation.mutateAsync({
          microfinancieraId,
          applicationId: selectedApplication.id,
          reason: evaluationComments,
        });
        toast.success('Solicitud rechazada');
        setSelectedApplicationState((prev: any) =>
          prev?.id === selectedApplication.id
            ? { ...prev, status: 'rejected' }
            : prev,
        );
        setLocalApplicationOverrides((prev) => ({
          ...prev,
          [selectedApplication.id]: {
            ...(prev[selectedApplication.id] || {}),
            status: 'rejected',
          },
        }));
      }
      setEvaluationDialogOpen(false);
      setDetailDialogOpen(false);
      setEvaluationComments('');
      setEvaluationType(null);
    } catch (error: any) {
      toast.error(error.message || 'Error al evaluar la solicitud');
    }
  };

  const openEvaluationDialog = (type: 'approve' | 'reject') => {
    setEvaluationType(type);
    setEvaluationDialogOpen(true);
  };

  const openDetailDialog = (app: any) => {
    setSelectedApplicationState(app);
    setDetailDialogOpen(true);
  };

  const openDisbursementDialog = async () => {
    if (!selectedApplication) return;
    if (!selectedApplication.userId) {
      toast.error('No se puede identificar al titular de la solicitud');
      return;
    }

    // Asegurarse de tener las cuentas más recientes
    if (!customerAccounts.length) {
      try {
        const refreshed = await refetchCustomerAccounts();
        const refreshedAccounts = (refreshed.data as any)?.accounts || [];
        if (!refreshedAccounts.length) {
          toast.error('El solicitante no tiene cuentas activas para recibir el crédito');
          return;
        }
      } catch (error) {
        toast.error('No se pudieron cargar las cuentas del cliente');
        return;
      }
    }

    if (
      !selectedApplication.financialInfo?.loanAmount ||
      Number(selectedApplication.financialInfo.loanAmount) <= 0
    ) {
      toast.error('El monto del crédito no es válido para desembolsar');
      return;
    }

    setDisbursementDialogOpen(true);
  };

  const handleDisburseLoan = async () => {
    if (!selectedApplication) return;
    if (!selectedDisbursementAccountId) {
      toast.error('Selecciona una cuenta destino para depositar el crédito');
      return;
    }

    const loanAmount = Number(selectedApplication.financialInfo?.loanAmount) || 0;
    if (loanAmount <= 0) {
      toast.error('El monto del crédito es inválido');
      return;
    }

    const destinationAccount =
      customerAccounts.find(
        (account: any) => account.id === selectedDisbursementAccountId,
      ) || selectedDisbursementAccount;

    try {
      toast.loading('Procesando desembolso...');
      const requestId = selectedApplication.id;

      await disburseLoanMutation.mutateAsync({
        microfinancieraId,
        applicationId: selectedApplication.id,
        accountId: selectedDisbursementAccountId,
        requestId,
        branchId: selectedApplication.routing?.branchId,
      });

      toast.dismiss();
      toast.success('Crédito desembolsado exitosamente');

      setSelectedApplicationState((prev: any) => {
        if (!prev || prev.id !== selectedApplication.id) return prev;
        return {
          ...prev,
          status: 'disbursed',
          disbursementDetails: {
            accountId: selectedDisbursementAccountId,
            accountNumber: destinationAccount?.accountNumber || null,
            bankName: destinationAccount?.bankName || null,
            branchId: selectedApplication.routing?.branchId || 'central',
            amount: loanAmount,
            processedAt: new Date().toISOString(),
          },
        };
      });
      setLocalApplicationOverrides((prev) => ({
        ...prev,
        [selectedApplication.id]: {
          ...(prev[selectedApplication.id] || {}),
          status: 'disbursed',
          disbursementDetails: {
            accountId: selectedDisbursementAccountId,
            accountNumber: destinationAccount?.accountNumber || null,
            bankName: destinationAccount?.bankName || null,
            branchId: selectedApplication.routing?.branchId || 'central',
            amount: loanAmount,
            processedAt: new Date().toISOString(),
          },
        },
      }));

      setDisbursementDialogOpen(false);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Error al desembolsar el crédito');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return 'default';
      case 'pending':
      case 'in_evaluation':
      case 'in_review':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'conditioned':
      case 'observed':
        return 'outline';
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
                          {getStatusLabel(app.status)}
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
                            Score: {app.scoring.score ?? app.scoring.totalScore ?? 'N/A'}
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
                        {app.status === 'pending' && (
                          <PermissionGuard permission="applications:assign">
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
                          </PermissionGuard>
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
                      <Badge variant={getStatusBadgeVariant(currentStatus || selectedApplication.status)}>
                        {getStatusLabel(currentStatus || selectedApplication.status)}
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
                {currentScoring && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Scoring
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Score Total</Label>
                        <p className="font-semibold text-lg">
                          {currentScoring.score ?? currentScoring.totalScore ?? 'N/A'}
                        </p>
                      </div>
                      {currentScoring.band && (
                        <div>
                          <Label className="text-xs text-gray-500">Banda</Label>
                          <p className="font-medium">{currentScoring.band}</p>
                        </div>
                      )}
                      {currentScoring.details && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500 mb-2 block">Detalles del Score</Label>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {currentScoring.details.incomeScore !== undefined && (
                              <div>Ingresos: {currentScoring.details.incomeScore}</div>
                            )}
                            {currentScoring.details.debtToIncomeScore !== undefined && (
                              <div>Deuda/Ingreso: {currentScoring.details.debtToIncomeScore}</div>
                            )}
                            {currentScoring.details.employmentScore !== undefined && (
                              <div>Empleo: {currentScoring.details.employmentScore}</div>
                            )}
                            {currentScoring.details.creditHistoryScore !== undefined && (
                              <div>Historial: {currentScoring.details.creditHistoryScore}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Decision */}
                {currentDecision && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Decisión</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Resultado</Label>
                        <p className="font-medium">{currentDecision.result || 'N/A'}</p>
                      </div>
                      {currentDecision.isAutomatic !== undefined && (
                        <div>
                          <Label className="text-xs text-gray-500">Tipo</Label>
                          <p className="font-medium">{currentDecision.isAutomatic ? 'Automática' : 'Manual'}</p>
                        </div>
                      )}
                      {currentDecision.comments && (
                        <div className="col-span-2">
                          <Label className="text-xs text-gray-500">Comentarios</Label>
                          <p className="font-medium">{currentDecision.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Desembolso */}
                {currentStatus === 'disbursed' && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Detalles del Desembolso
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Monto Desembolsado</Label>
                        <p className="font-medium">
                          {formatCurrencyValue(disbursementDetails?.amount ?? selectedApplication.financialInfo?.loanAmount)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Fecha</Label>
                        <p className="font-medium">
                          {formatDate(disbursementDetails?.processedAt || selectedApplication.disbursedAt)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Cuenta Destino</Label>
                        <p className="font-medium">
                          {disbursementDetails?.accountNumber || 'N/A'}
                        </p>
                        {disbursementDetails?.bankName && (
                          <p className="text-xs text-gray-500">{disbursementDetails.bankName}</p>
                        )}
                      </div>
                      {disbursementDetails?.accountId && (
                        <div>
                          <Label className="text-xs text-gray-500">ID de Cuenta</Label>
                          <p className="font-medium">{disbursementDetails.accountId}</p>
                        </div>
                      )}
                      {disbursementDetails?.branchId && (
                        <div>
                          <Label className="text-xs text-gray-500">Agencia</Label>
                          <p className="font-medium">{disbursementDetails.branchId}</p>
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
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <div className="flex gap-2 flex-wrap flex-1">
                {/* Botón Calcular Score */}
                {selectedApplication && currentStatus !== 'approved' && (
                  <PermissionGuard permission="applications:calculate-score">
                    <Button 
                      size="sm"
                      variant="secondary"
                      onClick={handleCalculateScore}
                      disabled={calculateScoreMutation.isPending}
                    >
                      {calculateScoreMutation.isPending ? 'Calculando...' : 'Calcular Score'}
                    </Button>
                  </PermissionGuard>
                )}

                {/* Botones de Evaluación - Solo si ya tiene scoring y no está aprobada */}
                {canEvaluateApplication && (
                  <PermissionGuard 
                    permission="applications:evaluate" 
                    resourceOwnerId={selectedApplication.assignedUserId}
                  >
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => openEvaluationDialog('approve')}
                    >
                      Aprobar
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => openEvaluationDialog('reject')}
                    >
                      Rechazar
                    </Button>
                  </PermissionGuard>
                )}

                {/* Botón de Desembolso cuando la solicitud ya fue aprobada */}
                {canShowDisburseButton && (
                  <PermissionGuard 
                    permission="applications:evaluate"
                    resourceOwnerId={selectedApplication.assignedUserId}
                  >
                    <Button 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => openDisbursementDialog()}
                    >
                      Desembolsar Crédito
                    </Button>
                  </PermissionGuard>
                )}

                {/* Mensaje cuando ya está desembolsado */}
                {currentStatus === 'disbursed' && (
                  <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold">Crédito desembolsado</p>
                      {disbursementDetails?.accountNumber && (
                        <p className="text-xs text-green-800">
                          Depositado en {disbursementDetails.bankName || 'Cuenta'} • {disbursementDetails.accountNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Scoring */}
        <Dialog open={scoringDialogOpen} onOpenChange={setScoringDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Resultado del Scoring</DialogTitle>
              <DialogDescription>
                Score calculado para la solicitud
              </DialogDescription>
            </DialogHeader>
            {calculatedScoring && (
              <div className="space-y-4">
                {/* Score Principal */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Score Total</p>
                    <p className="text-5xl font-bold text-blue-600">
                      {calculatedScoring.score || calculatedScoring.totalScore || 0}
                    </p>
                    {calculatedScoring.band && (
                      <p className="text-lg mt-2 text-gray-700">
                        Banda: <span className="font-semibold">{calculatedScoring.band}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Detalles del Score */}
                {calculatedScoring.details && (
                  <div className="grid grid-cols-2 gap-4">
                    {calculatedScoring.details.incomeScore !== undefined && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">Score de Ingresos</p>
                        <p className="text-2xl font-bold text-gray-800">{calculatedScoring.details.incomeScore}</p>
                      </div>
                    )}
                    {calculatedScoring.details.debtToIncomeScore !== undefined && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">Ratio Deuda/Ingreso</p>
                        <p className="text-2xl font-bold text-gray-800">{calculatedScoring.details.debtToIncomeScore}</p>
                      </div>
                    )}
                    {calculatedScoring.details.employmentScore !== undefined && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">Score de Empleo</p>
                        <p className="text-2xl font-bold text-gray-800">{calculatedScoring.details.employmentScore}</p>
                      </div>
                    )}
                    {calculatedScoring.details.creditHistoryScore !== undefined && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">Historial Crediticio</p>
                        <p className="text-2xl font-bold text-gray-800">{calculatedScoring.details.creditHistoryScore}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Códigos de Razón */}
                {calculatedScoring.reasonCodes && calculatedScoring.reasonCodes.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800 mb-2">Factores de Riesgo:</p>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                      {calculatedScoring.reasonCodes.map((code: string, index: number) => (
                        <li key={index}>{code}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setScoringDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Desembolso */}
        <Dialog open={disbursementDialogOpen} onOpenChange={setDisbursementDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Desembolsar Crédito</DialogTitle>
              <DialogDescription>
                Selecciona la cuenta del cliente donde se depositará el crédito aprobado.
              </DialogDescription>
            </DialogHeader>
            {isLoadingCustomerAccounts ? (
              <div className="py-6 text-center text-sm text-gray-500">
                Cargando cuentas disponibles...
              </div>
            ) : customerAccounts.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                Este cliente no tiene cuentas activas para recibir el préstamo.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Cuenta destino</Label>
                  <Select
                    value={selectedDisbursementAccountId}
                    onValueChange={setSelectedDisbursementAccountId}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona una cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerAccounts.map((account: any) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.bankName || 'Cuenta'} • {account.accountNumber || account.id.slice(0, 6)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDisbursementAccount && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                    <p className="font-semibold">
                      {selectedDisbursementAccount.bankName || 'Cuenta'} • {selectedDisbursementAccount.accountNumber || selectedDisbursementAccount.id}
                    </p>
                    <p className="text-gray-500">
                      {selectedDisbursementAccount.accountType || 'Cuenta de ahorros'} · Saldo:{' '}
                      {formatCurrencyValue(selectedDisbursementAccount.balance)}
                    </p>
                    <p className="text-gray-500">
                      Titular: {selectedDisbursementAccount.holderFirstName} {selectedDisbursementAccount.holderLastName}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
                  <div className="flex justify-between">
                    <span>Monto a desembolsar</span>
                    <span className="font-semibold">
                      {formatCurrencyValue(selectedApplication?.financialInfo?.loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 mt-1">
                    <span>Plazo seleccionado</span>
                    <span>
                      {selectedApplication?.financialInfo?.loanTermMonths || selectedApplication?.financialInfo?.loanTerm || 'N/A'} meses
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDisbursementDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleDisburseLoan}
                disabled={
                  disburseLoanMutation.isPending ||
                  isLoadingCustomerAccounts ||
                  !selectedDisbursementAccountId ||
                  customerAccounts.length === 0
                }
              >
                {disburseLoanMutation.isPending ? 'Desembolsando...' : 'Confirmar Desembolso'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Evaluación */}
        <Dialog open={evaluationDialogOpen} onOpenChange={setEvaluationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {evaluationType === 'approve' && 'Aprobar Solicitud'}
                {evaluationType === 'reject' && 'Rechazar Solicitud'}
              </DialogTitle>
              <DialogDescription>
                {evaluationType === 'approve' && 'Puedes agregar comentarios opcionales sobre la aprobación'}
                {evaluationType === 'reject' && 'Ingresa el motivo del rechazo (obligatorio)'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="evaluation-comments">
                  {evaluationType === 'approve' && 'Comentarios (opcional)'}
                  {evaluationType === 'reject' && 'Motivo del rechazo *'}
                </Label>
                <Textarea
                  id="evaluation-comments"
                  value={evaluationComments}
                  onChange={(e) => setEvaluationComments(e.target.value)}
                  placeholder={
                    evaluationType === 'approve'
                      ? 'Comentarios adicionales...'
                      : 'Motivo del rechazo...'
                  }
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEvaluationDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleEvaluate}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                {(approveMutation.isPending || rejectMutation.isPending) ? 'Procesando...' : 'Confirmar'}
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
