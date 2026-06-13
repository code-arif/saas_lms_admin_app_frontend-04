import { useState, type ComponentType } from 'react';
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
  Shield,
  UserCog,
  KeyRound,
  UserCheck,
  Wallet,
  Globe,
  Cpu,
  SlidersHorizontal,
  Cloud,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store/uiStore';

const classItems = [
  { label: 'All Classes' },
  { label: 'Previous Classes' },
  { label: 'Running Classes' },
];

const userManagementItems: { label: string; icon: ComponentType<{ size?: number; className?: string }>; href?: string }[] = [
  { label: 'Users', icon: UserCheck, href: '/users' },
  { label: 'Role', icon: KeyRound, href: '/roles' },
  { label: 'Permissions', icon: Shield, href: '/permissions' },
];

const settingsItems: { label: string; icon: ComponentType<{ size?: number; className?: string }>; href?: string }[] = [
  { label: 'Profile Settings', icon: UserCog, href: '/profile' },
  { label: 'Payment Settings', icon: Wallet, href: '/settings/payment' },
  { label: 'General Settings', icon: SlidersHorizontal, href: '/settings/general' },
  { label: 'Region Settings', icon: Globe, href: '/settings/region' },
  { label: 'System Settings', icon: Cpu, href: '/settings/system' },
  { label: 'Environment Settings', icon: Cloud, href: '/settings/environment' },
];

const Sidebar = () => {
  const { sidebarCollapsed: collapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const [classesOpen, setClassesOpen] = useState(true);
  const [userMgmtOpen, setUserMgmtOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Tenants', icon: Building2, href: '/tenants' },
    { label: 'Plans', icon: CreditCard, href: '/plans' },
    { label: 'Subscriptions', icon: Users, href: '/subscriptions' },
    { label: 'Coupons', icon: Tag, href: '/coupons' },
    { label: 'Campaigns', icon: Megaphone, href: '/campaigns' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  ];

  const extraItems = [
    { label: 'Learners', icon: GraduationCap },
    { label: 'Assets', icon: FolderOpen },
    { label: 'Manage AI', icon: Bot },
  ];

  const renderDropdown = (
    label: string,
    DropdownIcon: ComponentType<{ size?: number; className?: string }>,
    isOpen: boolean,
    onToggle: () => void,
    items: { label: string; icon?: ComponentType<{ size?: number; className?: string }>; href?: string }[]
  ) => {
    if (!collapsed) {
      return (
        <div>
          <button
            onClick={onToggle}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-3">
              <DropdownIcon size={20} className="shrink-0" />
              <span>{label}</span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                'transition-transform duration-200',
                isOpen ? 'rotate-0' : '-rotate-90'
              )}
            />
          </button>
          {isOpen && (
            <div className="ml-8 mt-1 space-y-0.5">
              {items.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 768 && !collapsed) {
                        toggleSidebar();
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 w-full rounded-md text-sm transition-colors',
                      location.pathname === item.href
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.icon ? (
                      <item.icon size={14} className="shrink-0" />
                    ) : (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-1.5 w-full rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {item.icon ? (
                      <item.icon size={14} className="shrink-0" />
                    ) : (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                    )}
                    <span>{item.label}</span>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <button className="flex items-center justify-center px-3 py-2 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <DropdownIcon size={20} className="shrink-0" />
      </button>
    );
  };

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
          'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 flex flex-col',
          collapsed ? 'w-20' : 'w-64',
          collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b shrink-0">
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

        {/* Scrollable nav area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Main nav items */}
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
            {renderDropdown('Classes', BookOpen, classesOpen, () => setClassesOpen(!classesOpen), classItems)}

            {/* User Management dropdown */}
            {renderDropdown('User Management', UserCog, userMgmtOpen, () => setUserMgmtOpen(!userMgmtOpen), userManagementItems)}
          </nav>

          {/* Bottom section - Settings pinned to bottom */}
          <div className="border-t shrink-0 p-4 space-y-2">
            {renderDropdown('Settings', Settings, settingsOpen, () => setSettingsOpen(!settingsOpen), settingsItems)}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
