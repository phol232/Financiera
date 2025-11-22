'use client';

import { Widget } from './Widget';
import { useTopAnalysts } from '@/lib/hooks/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface Analyst {
  id: string;
  name: string;
  applicationsReviewed: number;
  approvalRate: number;
}

interface TopAnalystsResponse {
  analysts: Analyst[];
}

interface TopAnalystsWidgetProps {
  microfinancieraId: string;
}

/**
 * Top Analysts Widget
 * Shows table of top performing analysts
 * Requirements: 3.5
 */
export function TopAnalystsWidget({ microfinancieraId }: TopAnalystsWidgetProps) {
  const { data, isLoading, error, refetch } = useTopAnalysts(microfinancieraId, 5);
  const analysts = Array.isArray((data as any)?.analysts) ? (data as any).analysts : [];

  const getRateBadgeVariant = (rate: number) => {
    if (rate >= 70) return 'default';
    if (rate >= 50) return 'secondary';
    return 'destructive';
  };

  return (
    <Widget
      title="Analistas Más Activos"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={analysts.length === 0}
      emptyMessage="No hay datos de analistas disponibles"
      onRetry={() => refetch()}
      className="col-span-1 lg:col-span-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {analysts.map((analyst: any) => (
          <Card key={analyst.id} className="border shadow-sm">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm font-semibold leading-tight">
                  {analyst.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground truncate">{analyst.id}</p>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Revisadas</p>
                <p className="text-lg font-bold">{analyst.applicationsReviewed}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Aprobación</p>
                <Badge variant={getRateBadgeVariant(analyst.approvalRate)}>
                  {analyst.approvalRate.toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Widget>
  );
}
