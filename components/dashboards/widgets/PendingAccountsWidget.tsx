'use client';

import { Widget } from './Widget';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';

interface Account {
  id: string;
  holderName: string;
  accountType: string;
  createdAt: string;
  status: string;
}

interface PendingAccountsResponse {
  accounts: Account[];
  total: number;
}

interface PendingAccountsWidgetProps {
  microfinancieraId: string;
}

/**
 * Pending Accounts Widget
 * Shows count and list of pending accounts for employee dashboard
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export function PendingAccountsWidget({ microfinancieraId }: PendingAccountsWidgetProps) {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery<PendingAccountsResponse>({
    queryKey: ['accounts', microfinancieraId, 'pending'],
    queryFn: () =>
      apiClient.get<PendingAccountsResponse>(
        `/api/microfinancieras/${microfinancieraId}/accounts`,
        { status: 'pending', limit: 5 }
      ),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  const handleAccountClick = (accountId: string) => {
    router.push(`/accounts?id=${accountId}`);
  };

  return (
    <Widget
      title="Cuentas Pendientes"
      isLoading={isLoading}
      error={error as Error}
      isEmpty={!data || data.accounts.length === 0}
      emptyMessage="No hay cuentas pendientes de aprobación"
      onRetry={() => refetch()}
    >
      <div className="space-y-4">
        <div className="text-2xl font-bold">{data?.total || 0}</div>
        <p className="text-xs text-muted-foreground">
          Cuentas esperando aprobación
        </p>

        {data && data.accounts.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Últimas 5 cuentas:
            </p>
            <div className="space-y-2">
              {data.accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleAccountClick(account.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                >
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {account.holderName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account.accountType}
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
