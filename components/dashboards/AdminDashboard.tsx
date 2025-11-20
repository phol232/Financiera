'use client';

import { useState } from 'react';
import {
  SystemMetricsWidget,
  TrendChartWidget,
  TopAnalystsWidget,
  StatusDistributionWidget,
} from './widgets';

/**
 * Admin Dashboard Component
 * Shows system-wide metrics and analytics
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */
export function AdminDashboard() {
  // Using hardcoded microfinancieraId for now (consistent with other pages)
  const [microfinancieraId] = useState('mf_demo_001');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard de Administrador</h1>
      </div>
      
      {/* Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* System Metrics Widget - Requirements: 3.1, 3.2, 3.3 */}
        <SystemMetricsWidget microfinancieraId={microfinancieraId} />
        
        {/* Trend Chart Widget - Requirements: 3.4, 5.5 */}
        <TrendChartWidget microfinancieraId={microfinancieraId} />
        
        {/* Top Analysts Widget - Requirements: 3.5 */}
        <TopAnalystsWidget microfinancieraId={microfinancieraId} />
        
        {/* Status Distribution Widget - Requirements: 3.5 */}
        <StatusDistributionWidget microfinancieraId={microfinancieraId} />
      </div>
    </div>
  );
}
