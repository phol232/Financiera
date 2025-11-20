'use client';

import { Widget } from './Widget';
import { useTopAnalysts } from '@/lib/hooks/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
      isEmpty={!data || !(data as any).analysts || (data as any).analysts.length === 0}
      emptyMessage="No hay datos de analistas disponibles"
      onRetry={() => refetch()}
      className="md:col-span-2 lg:col-span-2"
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Analista</TableHead>
              <TableHead className="text-right">Revisadas</TableHead>
              <TableHead className="text-right">Tasa Aprobación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data as any)?.analysts.map((analyst: any) => (
              <TableRow key={analyst.id}>
                <TableCell className="font-medium">{analyst.name}</TableCell>
                <TableCell className="text-right">
                  {analyst.applicationsReviewed}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={getRateBadgeVariant(analyst.approvalRate)}>
                    {analyst.approvalRate.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Widget>
  );
}
