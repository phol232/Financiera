'use client';

import { ReactNode } from 'react';
import { useUserData } from '@/lib/hooks/useUserData';
import { usePermissions } from '@/lib/hooks/usePermissions';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
  resourceOwnerId?: string;
}

/**
 * PermissionGuard HOC
 * Shows/hides UI elements based on user permissions
 * 
 * @param permission - The permission to check (e.g., 'accounts:approve')
 * @param children - Content to render if user has permission
 * @param fallback - Optional content to render if user doesn't have permission
 * @param resourceOwnerId - Optional resource owner ID for ownership checks (e.g., analyst assigned to application)
 */
export function PermissionGuard({ 
  permission, 
  children, 
  fallback,
  resourceOwnerId 
}: PermissionGuardProps) {
  const { data: userData } = useUserData();
  const { canPerformAction } = usePermissions(userData || null);

  const hasPermission = canPerformAction(permission, resourceOwnerId);

  if (!hasPermission) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
