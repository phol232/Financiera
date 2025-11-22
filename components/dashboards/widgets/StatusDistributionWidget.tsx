'use client';

import { Widget } from './Widget';
import { useStatusDistribution } from '@/lib/hooks/api';
import { Badge } from '@/components/ui/badge';

interface StatusCount {
  status: string;
  count: number;
  percentage: number;
}

interface StatusDistributionResponse {
  distribution: StatusCount[];
  total: number;
}

interface StatusDistributionWidgetProps {
  microfinancieraId: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_evaluation: 'En evaluación',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  conditioned: 'Condicionada',
  disbursed: 'Desembolsada',
  observed: 'Observada',
  in_review: 'En revisión',
  closed: 'Cerrada',
  cancelled: 'Cancelada',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  in_evaluation: 'bg-blue-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  conditioned: 'bg-orange-500',
  disbursed: 'bg-purple-500',
};

/**
 * Status Distribution Widget
 * Shows distribution of application statuses
 * Requirements: 3.5
 */
export function StatusDistributionWidget({
  microfinancieraId,
}: StatusDistributionWidgetProps) {
  const { data, isLoading, error, refetch } = useStatusDistribution(microfinancieraId);
  const distribution = Array.isArray((data as any)?.distribution)
    ? (data as any).distribution
    : [];
  const total = typeof (data as any)?.total === 'number' ? (data as any).total : 0;

  return (
    <Widget
      title="Distribución de Estados"
      isLoading={isLoading}
    error={error as Error}
    isEmpty={distribution.length === 0}
    emptyMessage="No hay datos de distribución disponibles"
    onRetry={() => refetch()}
    className="col-span-1"
  >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Total de solicitudes: <span className="font-semibold">{total}</span>
        </div>

        <div className="space-y-3">
          {distribution.map((item: any) => (
            <div key={item.status} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {statusLabels[item.status] || item.status}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.count}</span>
                  <Badge variant="outline">{item.percentage.toFixed(1)}%</Badge>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${statusColors[item.status] || 'bg-gray-500'} transition-all`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}
