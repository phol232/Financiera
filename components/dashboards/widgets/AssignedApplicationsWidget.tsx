'use client';

import { Widget } from './Widget';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';

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

interface AssignedApplicationsWidgetProps {
  microfinancieraId: string;
  analystId: string;
}

/**
 * Assigned Applications Widget
 * Shows count and list of applications assigned to analyst
 * Requirements: 2.1, 2.2, 2.4
 */
export function AssignedApplicationsWidget({
  microfinancieraId,
  analystId,
}: AssignedApplicationsWidgetProps) {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery<AssignedApplicationsResponse>({
    queryKey: ['applications', microfinancieraId, 'assigned', analystId],
    queryFn: () =>
      apiClient.get<AssignedApplicationsResponse>(
        `/api/microfinancieras/${microfinancieraId}/applications`,
        { assignedUserId: analystId, limit: 5 }
      ),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  const handleApplicationClick = (applicationId: string) => {
    router.push(`/applications?id=${applicationId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  return (
    <Widget
      title="Solicitudes Asignadas"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={!data || data.applications.length === 0}
      emptyMessage="No tienes solicitudes asignadas"
      onRetry={() => refetch()}
    >
      <div className="space-y-4">
        <div className="text-2xl font-bold">{data?.total || 0}</div>
        <p className="text-xs text-muted-foreground">
          Solicitudes asignadas a ti
        </p>

        {data && data.applications.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Últimas 5 solicitudes:
            </p>
            <div className="space-y-2">
              {data.applications.map((application) => (
                <button
                  key={application.id}
                  onClick={() => handleApplicationClick(application.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                >
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
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
