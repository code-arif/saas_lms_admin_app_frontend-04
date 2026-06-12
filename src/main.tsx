import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import App from './App';
import { queryClient } from './config/queryClient';
import './index.css';

// Initialize theme from local storage on load
const savedTheme = localStorage.getItem('app-color-theme');
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme);
    if (parsed?.state?.theme) {
      document.documentElement.setAttribute('data-theme', parsed.state.theme);
    }
  } catch {
    // use default
  }
} else {
  document.documentElement.setAttribute('data-theme', 'purple');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
