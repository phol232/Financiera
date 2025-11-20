'use client';

import { Widget } from './Widget';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ApprovalRateData {
  period: string;
  approved: number;
  rejected: number;
  rate: number;
}

interface ApprovalRateWidgetProps {
  microfinancieraId: string;
  analystId: string;
}

/**
 * Approval Rate Widget
 * Shows analyst's approval rate for the last 30 days
 * Requirements: 2.1, 2.2, 2.3
 */
export function ApprovalRateWidget({
  microfinancieraId,
  analystId,
}: ApprovalRateWidgetProps) {
  const { data, isLoading, error, refetch } = useQuery<ApprovalRateData>({
    queryKey: ['analyst-stats', microfinancieraId, analystId],
    queryFn: () =>
      apiClient.get<ApprovalRateData>(
        `/api/microfinancieras/${microfinancieraId}/analysts/${analystId}/stats`
      ),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  const isPositiveTrend = data && data.rate >= 50;

  return (
    <Widget
      title="Tasa de Aprobación"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={!data}
      emptyMessage="No hay datos de aprobación disponibles"
      onRetry={() => refetch()}
    >
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{data?.rate.toFixed(1)}%</div>
          {isPositiveTrend ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Últimos 30 días
        </p>

        {data && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Aprobadas</p>
              <p className="text-lg font-semibold text-green-600">
                {data.approved}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rechazadas</p>
              <p className="text-lg font-semibold text-red-600">
                {data.rejected}
              </p>
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
}
