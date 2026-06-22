import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'purple' | 'green' | 'blue' | 'rose' | 'teal' | 'copper';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const TRANSITION_DURATION = 500;

let _transitioning = false;
let _transitionTimeout: ReturnType<typeof setTimeout> | null = null;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'purple',
      setTheme: (theme) => {
        startThemeTransition();
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'app-color-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);

export function startThemeTransition() {
  if (_transitioning) return;
  _transitioning = true;
  const html = document.documentElement;
  // Capture current background before any theme variables change
  html.style.setProperty('--theme-overlay-color', getComputedStyle(document.body).backgroundColor);
  html.classList.add('theme-transitioning');
  if (_transitionTimeout) clearTimeout(_transitionTimeout);
  _transitionTimeout = setTimeout(() => {
    html.classList.remove('theme-transitioning');
    html.style.removeProperty('--theme-overlay-color');
    _transitioning = false;
    _transitionTimeout = null;
  }, TRANSITION_DURATION + 100);
}

export function isThemeTransitioning() {
  return _transitioning;
}
