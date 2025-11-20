'use client';

import { Widget } from './Widget';
import { useApplicationTrends } from '@/lib/hooks/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendChartWidgetProps {
  microfinancieraId: string;
}

/**
 * Trend Chart Widget
 * Shows line chart of approved vs rejected applications over time
 * Requirements: 3.4, 5.5
 */
export function TrendChartWidget({ microfinancieraId }: TrendChartWidgetProps) {
  const { data, isLoading, error, refetch } = useApplicationTrends(microfinancieraId);

  return (
    <Widget
      title="Tendencia de Solicitudes"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={!data || !(data as any).data || (data as any).data.length === 0}
      emptyMessage="No hay datos de tendencias disponibles"
      onRetry={() => refetch()}
      className="md:col-span-2 lg:col-span-3"
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={(data as any)?.data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '10px',
              }}
            />
            <Line
              type="monotone"
              dataKey="approved"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              name="Aprobadas"
              dot={{ fill: 'hsl(var(--chart-1))' }}
            />
            <Line
              type="monotone"
              dataKey="rejected"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Rechazadas"
              dot={{ fill: 'hsl(var(--chart-2))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
}
