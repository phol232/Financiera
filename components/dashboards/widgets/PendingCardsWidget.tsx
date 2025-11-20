'use client';

import { Widget } from './Widget';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';

interface Card {
  id: string;
  holderName: string;
  cardType: string;
  createdAt: string;
  status: string;
}

interface PendingCardsResponse {
  cards: Card[];
  total: number;
}

interface PendingCardsWidgetProps {
  microfinancieraId: string;
}

/**
 * Pending Cards Widget
 * Shows count and list of pending cards for employee dashboard
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export function PendingCardsWidget({ microfinancieraId }: PendingCardsWidgetProps) {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery<PendingCardsResponse>({
    queryKey: ['cards', microfinancieraId, 'pending'],
    queryFn: () =>
      apiClient.get<PendingCardsResponse>(
        `/api/microfinancieras/${microfinancieraId}/cards`,
        { status: 'pending', limit: 5 }
      ),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  const handleCardClick = (cardId: string) => {
    router.push(`/cards?id=${cardId}`);
  };

  return (
    <Widget
      title="Tarjetas Pendientes"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={!data || data.cards.length === 0}
      emptyMessage="No hay tarjetas pendientes de aprobación"
      onRetry={() => refetch()}
    >
      <div className="space-y-4">
        <div className="text-2xl font-bold">{data?.total || 0}</div>
        <p className="text-xs text-muted-foreground">
          Tarjetas esperando aprobación
        </p>

        {data && data.cards.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Últimas 5 tarjetas:
            </p>
            <div className="space-y-2">
              {data.cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                >
                  <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {card.holderName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {card.cardType}
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
