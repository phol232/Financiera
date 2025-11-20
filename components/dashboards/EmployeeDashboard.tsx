'use client';

import { useState } from 'react';
import { PendingAccountsWidget } from './widgets/PendingAccountsWidget';
import { PendingCardsWidget } from './widgets/PendingCardsWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

/**
 * Employee Dashboard Component
 * Shows pending accounts and cards for approval
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export function EmployeeDashboard() {
  // Using hardcoded microfinancieraId for now (consistent with other pages)
  const [microfinancieraId] = useState('mf_demo_001');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard de Empleado</h1>
      </div>
      
      {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Pending Accounts Widget - Requirements: 1.1, 1.2, 1.3, 1.4 */}
        <PendingAccountsWidget microfinancieraId={microfinancieraId} />
        
        {/* Pending Cards Widget - Requirements: 1.1, 1.2, 1.3, 1.4 */}
        <PendingCardsWidget microfinancieraId={microfinancieraId} />
        
        {/* Recent Activity Widget - Requirements: 1.5 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Últimas acciones realizadas
              </p>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground text-center py-4">
                  No hay actividad reciente
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
