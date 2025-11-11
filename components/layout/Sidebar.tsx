'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Settings,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'Cuentas', href: '/accounts' },
  { icon: CreditCard, label: 'Tarjetas', href: '/cards' },
  { icon: FileText, label: 'Solicitudes', href: '/applications' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: MessageSquare, label: 'Message', href: '/messages', badge: 2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">MENU</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
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
        })}
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
      <div className="border-t bg-purple-50 p-4">
        <div className="flex items-start gap-2">
          <span className="text-xl">⭐</span>
          <div className="flex-1">
            <p className="text-xs font-medium text-purple-900">PRO</p>
            <p className="text-xs text-purple-700">
              Reminders exits projects, advanced searching and more
            </p>
            <Button size="sm" className="mt-2 w-full bg-blue-600">
              Upgrade Pro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return null; // Header ahora está en DashboardLayout
}

