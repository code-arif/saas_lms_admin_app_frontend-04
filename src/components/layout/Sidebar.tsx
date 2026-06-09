import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Tag,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useUIStore } from '@/store/uiStore';

const Sidebar = () => {
  const { sidebarCollapsed: collapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Tenants', icon: Building2, href: '/tenants' },
    { label: 'Plans', icon: CreditCard, href: '/plans' },
    { label: 'Subscriptions', icon: Users, href: '/subscriptions' },
    { label: 'Coupons', icon: Tag, href: '/coupons' },
    { label: 'Campaigns', icon: Megaphone, href: '/campaigns' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden',
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={toggleSidebar}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          'max-md:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && (
            <span className="text-xl font-bold">LMS Admin</span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-muted"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <X size={20} className="md:hidden" />
            )}
            {!collapsed && (
              <ChevronLeft size={20} className="hidden md:block" />
            )}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/dashboard' &&
                location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 768 && !collapsed) {
                    toggleSidebar();
                  }
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 w-full px-4">
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors'
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
