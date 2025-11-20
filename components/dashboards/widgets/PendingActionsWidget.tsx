'use client';

import { Widget } from './Widget';
import { useAssignedApplications } from '@/lib/hooks/api';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

interface Application {
  id: string;
  clientName: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface AssignedApplicationsResponse {
  applications: Application[];
  total: number;
}

interface PendingActionsWidgetProps {
  microfinancieraId: string;
  analystId: string;
}

/**
 * Pending Actions Widget
 * Shows applications that require immediate action from analyst
 * Requirements: 2.1, 2.4
 */
export function PendingActionsWidget({
  microfinancieraId,
  analystId,
}: PendingActionsWidgetProps) {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useAssignedApplications(
    microfinancieraId,
    analystId
  );

  const handleApplicationClick = (applicationId: string) => {
    router.push(`/applications?id=${applicationId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const applicationsData = data as AssignedApplicationsResponse | undefined;

  // Filter applications that need action (assigned but not yet in evaluation or completed)
  const pendingActions = applicationsData?.applications.filter(
    (app) => app.status === 'assigned' || app.status === 'pending_review'
  ) || [];

  return (
    <Widget
      title="Acciones Pendientes"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={pendingActions.length === 0}
      emptyMessage="No hay acciones pendientes"
      onRetry={() => refetch()}
    >
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{pendingActions.length}</div>
          {pendingActions.length > 0 && (
            <AlertCircle className="h-4 w-4 text-orange-500" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Solicitudes que requieren tu atención
        </p>

        {pendingActions.length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="space-y-2">
              {pendingActions.slice(0, 3).map((application) => (
                <button
                  key={application.id}
                  onClick={() => handleApplicationClick(application.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors text-left"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 text-orange-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {application.clientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(application.amount)} • {application.status}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
}
