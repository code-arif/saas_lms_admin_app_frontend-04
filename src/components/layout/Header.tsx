import { Bell, Search, User, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-4 md:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
        <div className="flex w-full max-w-md items-center gap-2 px-3 py-1.5 rounded-md bg-muted border">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tenants, plans, coupons..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun size={18} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon size={18} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-card" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <p className="font-medium text-sm">Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                No new notifications
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={20} className="text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
