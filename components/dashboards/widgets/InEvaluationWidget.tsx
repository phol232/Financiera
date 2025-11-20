'use client';

import { Widget } from './Widget';
import { useApplicationsInEvaluation } from '@/lib/hooks/api';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';

interface Application {
  id: string;
  clientName: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface InEvaluationResponse {
  applications: Application[];
  total: number;
}

interface InEvaluationWidgetProps {
  microfinancieraId: string;
  analystId: string;
}

/**
 * Observed Widget
 * Shows count and list of applications with observations (observed status) by analyst
 * Requirements: 2.1, 2.3
 */
export function InEvaluationWidget({
  microfinancieraId,
  analystId,
}: InEvaluationWidgetProps) {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useApplicationsInEvaluation(
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

  const applicationsData = data as InEvaluationResponse | undefined;

  return (
    <Widget
      title="Observadas"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={!applicationsData || applicationsData.applications.length === 0}
      emptyMessage="No hay solicitudes observadas"
      onRetry={() => refetch()}
    >
      <div className="space-y-4">
        <div className="text-2xl font-bold">{applicationsData?.total || 0}</div>
        <p className="text-xs text-muted-foreground">
          Solicitudes con observaciones
        </p>

        {applicationsData && applicationsData.applications.length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="space-y-2">
              {applicationsData.applications.slice(0, 3).map((application) => (
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
                      {formatCurrency(application.amount)}
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
