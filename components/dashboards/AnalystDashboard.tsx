'use client';

import { useState } from 'react';
import { AssignedApplicationsWidget } from './widgets/AssignedApplicationsWidget';
import { ApprovalRateWidget } from './widgets/ApprovalRateWidget';
import { InEvaluationWidget } from './widgets/InEvaluationWidget';
import { PendingActionsWidget } from './widgets/PendingActionsWidget';
import { useUserData } from '@/lib/hooks/useUserData';
import { Loader2 } from 'lucide-react';

/**
 * Analyst Dashboard Component
 * Shows assigned applications, approval rate, and evaluation metrics
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
export function AnalystDashboard() {
  // Using hardcoded microfinancieraId for now (consistent with other pages)
  const [microfinancieraId] = useState('mf_demo_001');
  
  // Get current user data to extract analystId
  const { data: userData, isLoading: isLoadingUser } = useUserData();

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userData?.uid) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  const analystId = userData.uid;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Analista</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bienvenido, {userData.displayName || userData.email}
          </p>
        </div>
      </div>
      
      {/* Responsive grid: 1 column on mobile, 2 on tablet, 3-4 on desktop */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Assigned Applications Widget - Requirements: 2.1, 2.2, 2.4 */}
        <AssignedApplicationsWidget 
          microfinancieraId={microfinancieraId}
          analystId={analystId}
        />
        
        {/* Approval Rate Widget - Requirements: 2.1, 2.2, 2.3 */}
        <ApprovalRateWidget 
          microfinancieraId={microfinancieraId}
          analystId={analystId}
        />
        
        {/* In Evaluation Widget - Requirements: 2.1, 2.3 */}
        <InEvaluationWidget 
          microfinancieraId={microfinancieraId}
          analystId={analystId}
        />
        
        {/* Pending Actions Widget - Requirements: 2.1, 2.4 */}
        <PendingActionsWidget 
          microfinancieraId={microfinancieraId}
          analystId={analystId}
        />
      </div>
    </div>
  );
}
