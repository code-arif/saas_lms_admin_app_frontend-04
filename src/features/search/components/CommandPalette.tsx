import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command as CommandIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { searchIndex, searchCategories, type SearchItem } from '../searchIndex';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const CommandPalette = ({ open, onClose, initialQuery = '' }: CommandPaletteProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      // Focus input after a small delay so the animation starts
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialQuery]);

  // Filter results
  const filtered = query.trim()
    ? searchIndex.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.keywords?.some((k) => k.toLowerCase().includes(q))
        );
      })
    : searchIndex;

  // Group results by category
  const grouped = filtered.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Compute flat list for keyboard navigation
  const flatResults = filtered;

  const navigateTo = useCallback((href: string) => {
    if (!href) return;
    onClose();
    navigate(href);
  }, [navigate, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          navigateTo(flatResults[selectedIndex].href);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-xl mx-4 bg-background border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, settings, and features..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border bg-muted text-[10px] font-medium text-muted-foreground">
            <CommandIcon size={11} />
            K
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2"
          role="listbox"
        >
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search size={32} className="text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No results for "<span className="font-medium text-foreground">{query}</span>"</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
            </div>
          ) : (
            searchCategories
              .filter((cat) => grouped[cat])
              .map((category) => (
                <div key={category}>
                  <div className="flex items-center gap-2 px-2 py-1.5 mt-1 first:mt-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {category}
                    </span>
                    <div className="flex-1 border-t" />
                    <span className="text-[10px] text-muted-foreground/40">
                      {grouped[category].length}
                    </span>
                  </div>
                  {grouped[category].map((item) => {
                    const idx = flatResults.indexOf(item);
                    const isSelected = idx === selectedIndex;
                    const isDisabled = !item.href;
                    return (
                      <button
                        key={item.href || item.label}
                        data-index={idx}
                        role="option"
                        aria-selected={isSelected}
                        disabled={isDisabled}
                        onClick={() => navigateTo(item.href)}
                        onMouseEnter={() => !isDisabled && setSelectedIndex(idx)}
                        className={cn(
                          'flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-100',
                          isDisabled && 'opacity-50 cursor-not-allowed',
                          isSelected && !isDisabled
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-muted'
                        )}
                      >
                        <div className={cn(
                          'flex items-center justify-center h-7 w-7 rounded-md shrink-0 border',
                          isSelected && !isDisabled
                            ? 'bg-primary/10 border-primary/20 text-primary'
                            : 'bg-muted border-transparent text-muted-foreground'
                        )}>
                          <item.icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                          )}
                        </div>
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0',
                          isSelected && !isDisabled
                            ? 'bg-primary/10 text-primary/70'
                            : 'text-muted-foreground/50'
                        )}>
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2 border-t bg-muted/30">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
            <kbd className="inline-flex items-center justify-center h-4 w-4 rounded border bg-background text-[9px] font-medium">↑</kbd>
            <kbd className="inline-flex items-center justify-center h-4 w-4 rounded border bg-background text-[9px] font-medium">↓</kbd>
            <span>navigate</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
            <kbd className="inline-flex items-center px-1.5 h-4 rounded border bg-background text-[9px] font-medium">↵</kbd>
            <span>open</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
            <kbd className="inline-flex items-center px-1.5 h-4 rounded border bg-background text-[9px] font-medium">esc</kbd>
            <span>close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
