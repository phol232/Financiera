'use client';

import { Widget } from './Widget';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Users, CreditCard, FileText, DollarSign } from 'lucide-react';

interface SystemMetrics {
  activeAccounts: number;
  activeCards: number;
  applicationsInProcess: number;
  totalDisbursed: number;
}

interface SystemMetricsWidgetProps {
  microfinancieraId: string;
}

/**
 * System Metrics Widget
 * Shows system-wide metrics for admin dashboard
 * Requirements: 3.1, 3.2
 */
export function SystemMetricsWidget({ microfinancieraId }: SystemMetricsWidgetProps) {
  const { data, isLoading, error, refetch } = useQuery<SystemMetrics>({
    queryKey: ['system-metrics', microfinancieraId],
    queryFn: () =>
      apiClient.get<SystemMetrics>(
        `/api/microfinancieras/${microfinancieraId}/metrics`
      ),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const metrics = [
    {
      label: 'Cuentas Activas',
      value: data?.activeAccounts || 0,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Tarjetas Activas',
      value: data?.activeCards || 0,
      icon: CreditCard,
      color: 'text-purple-600',
    },
    {
      label: 'Solicitudes en Proceso',
      value: data?.applicationsInProcess || 0,
      icon: FileText,
      color: 'text-orange-600',
    },
    {
      label: 'Total Desembolsado',
      value: data ? formatCurrency(data.totalDisbursed) : 'S/ 0',
      icon: DollarSign,
      color: 'text-green-600',
    },
  ];

  return (
    <Widget
      title="Métricas del Sistema"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={!data}
      emptyMessage="No hay métricas disponibles"
      onRetry={() => refetch()}
      className="md:col-span-2 lg:col-span-4"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card"
            >
              <Icon className={`h-6 w-6 mb-2 ${metric.color}`} />
              <p className="text-2xl font-bold">
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {metric.label}
              </p>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}
