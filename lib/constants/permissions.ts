/**
 * Role-based access control constants
 * Defines page and action permissions for each role
 */

export type UserRole = 'admin' | 'analyst' | 'employee';

/**
 * Page access permissions
 * Defines which roles can access each page
 */
export const pagePermissions: Record<string, UserRole[]> = {
  '/': ['admin', 'analyst', 'employee'],        // Dashboard - todos
  '/accounts': ['admin', 'employee', 'analyst'], // Todos pueden ver
  '/cards': ['admin', 'employee', 'analyst'],    // Todos pueden ver
  '/applications': ['admin', 'analyst', 'employee'], // Todos pueden ver
  '/settings': ['admin'],                        // Solo admin
  '/products': ['admin'],
  '/users': ['admin'],
  '/workers': ['admin'],
};

/**
 * Action permissions
 * Defines which roles can perform specific actions
 */
export const actionPermissions: Record<string, UserRole[]> = {
  // Accounts
  'accounts:view': ['admin', 'employee', 'analyst'],
  'accounts:activate': ['admin', 'employee'], // Cambiar status a "active"
  'accounts:block': ['admin'],
  'accounts:close': ['admin'],
  
  // Cards
  'cards:view': ['admin', 'employee', 'analyst'],
  'cards:activate': ['admin', 'employee'], // Cambiar status a "active"
  'cards:suspend': ['admin'],
  'cards:close': ['admin'],
  
  // Applications
  'applications:view': ['admin', 'analyst', 'employee'],
  'applications:assign': ['admin', 'employee'], // Employee asigna a analysts
  'applications:evaluate': ['admin', 'analyst'], // Solo analyst evalúa
  'applications:approve': ['admin', 'analyst'],
  'applications:reject': ['admin', 'analyst'],
  'applications:condition': ['admin', 'analyst'],
  'applications:calculate-score': ['admin', 'analyst'],

  // Products (solo admin)
  'products:view': ['admin'],
  'products:create': ['admin'],
  'products:update': ['admin'],

  // Users (solo admin)
  'users:view': ['admin'],
};
