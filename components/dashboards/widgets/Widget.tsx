'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { ReactNode } from 'react';

interface WidgetProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Base Widget Component
 * Handles loading, error, and empty states for dashboard widgets
 */
export function Widget({
  title,
  children,
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'No hay datos disponibles',
  onRetry,
  className,
}: WidgetProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <WidgetLoading />
        ) : error ? (
          <WidgetError error={error} onRetry={onRetry} />
        ) : isEmpty ? (
          <WidgetEmpty message={emptyMessage} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Loading State Component
 */
function WidgetLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

/**
 * Error State Component
 */
interface WidgetErrorProps {
  error: Error;
  onRetry?: () => void;
}

function WidgetError({ error, onRetry }: WidgetErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-destructive">Error al cargar datos</p>
        <p className="text-xs text-muted-foreground">{error.message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Reintentar
        </Button>
      )}
    </div>
  );
}

/**
 * Empty State Component
 */
interface WidgetEmptyProps {
  message: string;
}

function WidgetEmpty({ message }: WidgetEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-2">
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

/**
 * Widget Skeleton for loading state
 */
export function WidgetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          <div className="h-3 w-full bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
