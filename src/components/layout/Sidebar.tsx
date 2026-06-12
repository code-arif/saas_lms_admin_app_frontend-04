import { useState } from 'react';
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
  GraduationCap,
  FolderOpen,
  Bot,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store/uiStore';

const classItems = [
  { label: 'All Classes' },
  { label: 'Previous Classes' },
  { label: 'Running Classes' },
];

const Sidebar = () => {
  const { sidebarCollapsed: collapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const [classesOpen, setClassesOpen] = useState(true);

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

  const extraItems = [
    { label: 'Learners', icon: GraduationCap },
    { label: 'Assets', icon: FolderOpen },
    { label: 'Manage AI', icon: Bot },
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
          'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 overflow-y-auto',
          collapsed ? 'w-20' : 'w-64',
          collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
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

          {/* Divider */}
          {!collapsed && <div className="border-t my-3" />}

          {/* Extra buttons */}
          {extraItems.map((item) => {
            const href = item.label === 'Learners' ? '/learners' : undefined;
            const isActive = href ? location.pathname === href : false;
            return href ? (
              <Link
                key={item.label}
                to={href}
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
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ) : (
              <button
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* Classes dropdown */}
          {!collapsed ? (
            <div>
              <button
                onClick={() => setClassesOpen(!classesOpen)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="shrink-0" />
                  <span>Classes</span>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    'transition-transform duration-200',
                    classesOpen ? 'rotate-0' : '-rotate-90'
                  )}
                />
              </button>
              {classesOpen && (
                <div className="ml-8 mt-1 space-y-0.5">
                  {classItems.map((item) => (
                    <button
                      key={item.label}
                      className="flex items-center gap-2 px-3 py-1.5 w-full rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              className="flex items-center justify-center px-3 py-2 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <BookOpen size={20} className="shrink-0" />
            </button>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
