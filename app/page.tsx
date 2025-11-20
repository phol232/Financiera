'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardRouter } from '@/components/dashboards/DashboardRouter';

/**
 * Main Dashboard Page
 * Uses DashboardRouter to render role-specific dashboards
 */
export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardRouter />
      </DashboardLayout>
    </AuthGuard>
  );
}
