'use client';

import { Widget } from './Widget';
import { useStatusDistribution } from '@/lib/hooks/api';
import { Badge } from '@/components/ui/badge';
import { Users, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

interface CustomerSegmentationWidgetProps {
  microfinancieraId: string;
}

type Segment = {
  name: string;
  percentage: number;
  count: number;
  colorClass: string;
  icon: React.ReactNode;
  description: string;
};

export function CustomerSegmentationWidget({ microfinancieraId }: CustomerSegmentationWidgetProps) {
  const { data, isLoading, error, refetch } = useStatusDistribution(microfinancieraId);
  const distribution = Array.isArray((data as any)?.distribution) ? (data as any).distribution : [];
  const total = typeof (data as any)?.total === 'number' ? (data as any).total : 0;

  const getCount = (statuses: string[]) =>
    distribution
      .filter((item: any) => statuses.includes(item.status))
      .reduce((sum: number, item: any) => sum + (item.count || 0), 0);

  const goodCount = getCount(['disbursed', 'approved', 'delivered', 'active']);
  const watchCount = getCount(['pending', 'requested', 'observed', 'in_review']);
  const riskCount = getCount(['rejected', 'cancelled', 'closed']);

  const segments: Segment[] = [
    {
      name: 'Buen cliente',
      count: goodCount,
      percentage: total > 0 ? (goodCount / total) * 100 : 0,
      colorClass: 'bg-emerald-100 text-emerald-700',
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
      description: 'Historial positivo, ya desembolsados o activos.',
    },
    {
      name: 'En observación',
      count: watchCount,
      percentage: total > 0 ? (watchCount / total) * 100 : 0,
      colorClass: 'bg-amber-100 text-amber-700',
      icon: <Users className="h-5 w-5 text-amber-600" />,
      description: 'Pendientes, solicitadas u observadas; requieren seguimiento.',
    },
    {
      name: 'Riesgo alto',
      count: riskCount,
      percentage: total > 0 ? (riskCount / total) * 100 : 0,
      colorClass: 'bg-red-100 text-red-700',
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      description: 'Rechazadas o cerradas, evaluar reoferta con cautela.',
    },
  ];

  return (
    <Widget
      title="Segmentación de Clientes"
      isLoading={isLoading}
    error={error as Error}
    isEmpty={total === 0}
    emptyMessage="Aún no hay datos para segmentar clientes"
    onRetry={() => refetch()}
    className="col-span-1"
  >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Total clientes analizados</span>
          <Badge variant="outline">
            <Activity className="h-3 w-3 mr-1" />
            {total}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {segments.map((segment) => (
            <div key={segment.name} className="rounded-lg border p-3 space-y-3">
              <div className="flex items-center gap-2">
                {segment.icon}
                <div>
                  <p className="text-sm font-semibold">{segment.name}</p>
                  <p className="text-xs text-muted-foreground">{segment.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{segment.count}</p>
                <Badge className={segment.colorClass}>{segment.percentage.toFixed(1)}%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${segment.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}
