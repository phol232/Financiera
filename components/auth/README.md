# Access Control Components

This directory contains components and hooks for role-based access control (RBAC).

## Components

### RoleGuard

Protects entire routes/pages based on user roles.

```tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

// Protect a page - only admin and employee can access
export default function AccountsPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'employee']}>
      <div>Accounts content...</div>
    </RoleGuard>
  );
}

// With custom redirect
<RoleGuard 
  allowedRoles={['admin']} 
  redirectTo="/dashboard"
>
  <SettingsPage />
</RoleGuard>

// With custom fallback UI
<RoleGuard 
  allowedRoles={['admin']} 
  fallback={<div>Custom access denied message</div>}
>
  <AdminPanel />
</RoleGuard>
```

### PermissionGuard

Shows/hides UI elements based on specific permissions.

```tsx
import { PermissionGuard } from '@/components/auth/PermissionGuard';

// Show activate button only for admin and employee
<PermissionGuard permission="accounts:activate">
  <Button onClick={handleActivate}>Activar</Button>
</PermissionGuard>

// Show block button only for admin
<PermissionGuard permission="accounts:block">
  <Button onClick={handleBlock}>Bloquear</Button>
</PermissionGuard>

// For analyst - check if they own the resource
<PermissionGuard 
  permission="applications:approve" 
  resourceOwnerId={application.assignedUserId}
>
  <Button onClick={handleApprove}>Aprobar Solicitud</Button>
</PermissionGuard>

// With fallback content
<PermissionGuard 
  permission="accounts:activate"
  fallback={<span className="text-gray-400">No tienes permisos</span>}
>
  <Button>Activar</Button>
</PermissionGuard>
```

## Hooks

### usePermissions

Check permissions programmatically.

```tsx
import { usePermissions } from '@/lib/hooks/usePermissions';
import { useUserData } from '@/lib/hooks/useUserData';

function MyComponent() {
  const { data: userData } = useUserData();
  const { canAccessPage, canPerformAction, hasRole } = usePermissions(userData || null);

  // Check page access
  if (canAccessPage('/settings')) {
    // User can access settings
  }

  // Check action permission
  if (canPerformAction('accounts:activate')) {
    // User can activate accounts
  }

  // Check role
  if (hasRole('admin')) {
    // User is admin
  }

  // Check multiple roles
  if (hasRole(['admin', 'employee'])) {
    // User is admin or employee
  }

  // For analyst - check ownership
  if (canPerformAction('applications:approve', application.assignedUserId)) {
    // Analyst can approve this specific application
  }
}
```

### useUserData

Fetch current user data including role.

```tsx
import { useUserData } from '@/lib/hooks/useUserData';

function MyComponent() {
  const { data: userData, isLoading, error } = useUserData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <div>
      <p>Email: {userData.email}</p>
      <p>Role: {userData.role}</p>
      <p>Status: {userData.status}</p>
    </div>
  );
}
```

## Permission Constants

All permissions are defined in `frontend/lib/constants/permissions.ts`:

### Page Permissions

```typescript
const pagePermissions = {
  '/': ['admin', 'analyst', 'employee'],        // Dashboard - todos
  '/accounts': ['admin', 'employee', 'analyst'], // Todos pueden ver
  '/cards': ['admin', 'employee', 'analyst'],    // Todos pueden ver
  '/applications': ['admin', 'analyst', 'employee'], // Todos pueden ver
  '/settings': ['admin'],                        // Solo admin
};
```

### Action Permissions

```typescript
const actionPermissions = {
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
  'applications:assign': ['admin', 'employee'],
  'applications:evaluate': ['admin', 'analyst'],
  'applications:approve': ['admin', 'analyst'],
  'applications:reject': ['admin', 'analyst'],
  'applications:condition': ['admin', 'analyst'],
  'applications:calculate-score': ['admin', 'analyst'],
};
```

## Role Definitions

- **admin**: Full access to all features and pages
- **employee**: Can activate accounts and cards (change status to "active"), assign applications to analysts
- **analyst**: Can view all pages but only evaluate/approve applications assigned to them (read-only for accounts/cards)
