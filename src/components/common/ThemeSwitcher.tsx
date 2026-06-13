import { Palette } from 'lucide-react';
import { useThemeStore, type ThemeMode } from '@/store/themeStore';
import { cn } from '@/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';

const themes: { mode: ThemeMode; label: string; color: string }[] = [
  { mode: 'purple', label: 'Purple', color: '#7c3aed' },
  { mode: 'green', label: 'Green', color: '#16a34a' },
  { mode: 'blue', label: 'Blue', color: '#2563eb' },
  { mode: 'rose', label: 'Rose', color: '#e11d48' },
  { mode: 'teal', label: 'Teal', color: '#0d9488' },
  { mode: 'copper', label: 'Copper', color: '#B29172' },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore();

  const currentTheme = themes.find((t) => t.mode === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette size={20} />
          <span
            className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full ring-1 ring-card"
            style={{ backgroundColor: currentTheme?.color }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.mode}
            onClick={() => setTheme(t.mode)}
            className={cn(
              'flex items-center gap-3 cursor-pointer',
              theme === t.mode && 'font-medium'
            )}
          >
            <span
              className={cn(
                'h-4 w-4 rounded-full border-2 transition-all shrink-0',
                theme === t.mode
                  ? 'border-foreground ring-2 ring-offset-2 ring-offset-background ring-foreground/30'
                  : 'border-transparent'
              )}
              style={{ backgroundColor: t.color }}
            />
            <span>{t.label}</span>
            {theme === t.mode && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
