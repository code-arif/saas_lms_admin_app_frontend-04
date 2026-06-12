import { useThemeStore, type ThemeMode } from '@/store/themeStore';
import { cn } from '@/utils/cn';

const themes: { mode: ThemeMode; label: string; color: string }[] = [
  { mode: 'purple', label: 'Purple', color: '#7c3aed' },
  { mode: 'green', label: 'Green', color: '#16a34a' },
  { mode: 'blue', label: 'Blue', color: '#2563eb' },
  { mode: 'rose', label: 'Rose', color: '#e11d48' },
  { mode: 'teal', label: 'Teal', color: '#0d9488' },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-1.5 px-2">
      {themes.map((t) => (
        <button
          key={t.mode}
          onClick={() => setTheme(t.mode)}
          title={t.label}
          className={cn(
            'h-6 w-6 rounded-full border-2 transition-all duration-200 hover:scale-110',
            theme === t.mode
              ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-offset-card ring-foreground/30'
              : 'border-transparent hover:border-foreground/30'
          )}
          style={{ backgroundColor: t.color }}
        >
          <span className="sr-only">{t.label}</span>
        </button>
      ))}
    </div>
  );
};
