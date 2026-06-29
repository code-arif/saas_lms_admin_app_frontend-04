import { useEffect, useState, useCallback } from 'react';
import { Bell, Search, User, Moon, Sun, Menu, Settings, LogOut, Headphones, Command as CommandIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import CommandPalette from '@/features/search/components/CommandPalette';

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, setTheme } = useTheme();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const navigate = useNavigate();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-3 md:px-8">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex flex-1 max-w-md items-center gap-2 px-3 py-1.5 rounded-md bg-muted border hover:border-muted-foreground/30 transition-colors text-left"
          >
            <Search size={18} className="text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground/60 flex-1 min-w-0">
              Search pages, settings, and features...
            </span>
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border bg-background text-[10px] font-medium text-muted-foreground/50 shrink-0">
              <CommandIcon size={11} />
              K
            </kbd>
          </button>
        </div>

      <div className="flex items-center gap-1 md:gap-4 shrink-0">
        <ThemeSwitcher />

        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun size={18} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon size={18} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link to="/support">
            <Headphones size={18} />
            <span className="sr-only">Support</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-card" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
            <div className="p-4">
              <p className="font-medium text-sm">Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                No new notifications
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 md:pl-4 border-l hover:opacity-80 transition-opacity">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={16} className="md:h-5 md:w-5 text-muted-foreground" />
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-3 cursor-pointer">
                <User size={16} />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-3 cursor-pointer">
                <Settings size={16} />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-3 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    </>
  );
};

export default Header;
