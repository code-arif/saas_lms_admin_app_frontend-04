import { useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { startThemeTransition } from './store/themeStore';

function App() {
  const lastRealClass = useRef('');

  useEffect(() => {
    const html = document.documentElement;
    lastRealClass.current = html.className.replace(/\btheme-transitioning\b/g, '').trim();

    const observer = new MutationObserver(() => {
      const currentClass = html.className;
      const currentWithoutTransition = currentClass.replace(/\btheme-transitioning\b/g, '').trim();
      // Only trigger transition if the non-transitioning part of the class changed
      if (lastRealClass.current !== currentWithoutTransition) {
        lastRealClass.current = currentWithoutTransition;
        startThemeTransition();
      }
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
