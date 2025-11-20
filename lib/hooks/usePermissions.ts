import { useCallback } from 'react';
import { actionPermissions, pagePermissions, UserRole } from '@/lib/constants/permissions';

interface UserData {
  role?: UserRole;
  uid?: string;
}

/**
 * Hook to check user permissions
 * Provides utilities to verify if the current user has access to pages or actions
 */
export function usePermissions(user: UserData | null) {
  /**
   * Check if user has permission to access a specific page
   */
  const canAccessPage = useCallback((path: string): boolean => {
    if (!user?.role) return false;
    
    const allowedRoles = pagePermissions[path];
    if (!allowedRoles) return true; // If page not in permissions, allow by default
    
    return allowedRoles.includes(user.role);
  }, [user?.role]);

  /**
   * Check if user has permission to perform a specific action
   */
  const canPerformAction = useCallback((action: string, resourceOwnerId?: string): boolean => {
    if (!user?.role) return false;
    
    const allowedRoles = actionPermissions[action];
    if (!allowedRoles) return false; // If action not defined, deny by default
    
    const hasRolePermission = allowedRoles.includes(user.role);
    
    // For analyst role, check if they own the resource (for applications)
    if (user.role === 'analyst' && action.startsWith('applications:') && resourceOwnerId) {
      // Analyst can only act on their assigned applications
      return hasRolePermission && resourceOwnerId === user.uid;
    }
    
    return hasRolePermission;
  }, [user?.role, user?.uid]);

  /**
   * Check if user has any of the specified roles
   */
  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user?.role) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user?.role]);

  return {
    canAccessPage,
    canPerformAction,
    hasRole,
    role: user?.role,
  };
}
