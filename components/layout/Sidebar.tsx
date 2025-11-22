'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Settings,
  MessageSquare,
  LogOut,
  Package,
  Users as UsersIcon,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthContext';
import { useUserData } from '@/lib/hooks/useUserData';
import { UserRole } from '@/lib/constants/permissions';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

/**
 * Navigation menu items by role
 * Each role sees different menu options based on their permissions
 */
const navigationByRole: Record<UserRole, MenuItem[]> = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: FileText, label: 'Cuentas', href: '/accounts' },
    { icon: CreditCard, label: 'Tarjetas', href: '/cards' },
    { icon: FileText, label: 'Solicitudes', href: '/applications' },
    { icon: Package, label: 'Productos', href: '/products' },
    { icon: UsersIcon, label: 'Usuarios', href: '/users' },
    { icon: UserCog, label: 'Workers', href: '/workers' },
    { icon: Settings, label: 'Configuración', href: '/settings' },
  ],
  employee: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: FileText, label: 'Cuentas', href: '/accounts' },
    { icon: CreditCard, label: 'Tarjetas', href: '/cards' },
    { icon: FileText, label: 'Solicitudes', href: '/applications' },
  ],
  analyst: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: FileText, label: 'Mis Solicitudes', href: '/applications' },
    { icon: FileText, label: 'Todas las Cuentas', href: '/accounts' },
    { icon: CreditCard, label: 'Todas las Tarjetas', href: '/cards' },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { data: userData, isLoading } = useUserData();
  const [localRole, setLocalRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('selectedRole') : null;
    if (storedRole && (['admin', 'analyst', 'employee'] as UserRole[]).includes(storedRole as UserRole)) {
      setLocalRole(storedRole as UserRole);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  // Get menu items based on user role
  const roleForMenu = userData?.role || localRole || null;
  const menuItems = roleForMenu ? navigationByRole[roleForMenu] : [];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">MENU</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : (
          menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })
        )}
      </nav>
      <div className="border-t p-4">
        <Link
          href="/support"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span className="text-xl">😊</span>
          <span>Support</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </button>
      </div>
      
    </div>
  );
}

export function Header() {
  return null; // Header ahora está en DashboardLayout
}
