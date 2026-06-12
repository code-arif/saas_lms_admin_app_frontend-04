import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'purple' | 'green' | 'blue' | 'rose' | 'teal';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const TRANSITION_DURATION = 400;

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
  document.documentElement.classList.add('theme-transitioning');
  if (_transitionTimeout) clearTimeout(_transitionTimeout);
  _transitionTimeout = setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
    _transitioning = false;
    _transitionTimeout = null;
  }, TRANSITION_DURATION + 50);
}

export function isThemeTransitioning() {
  return _transitioning;
}
