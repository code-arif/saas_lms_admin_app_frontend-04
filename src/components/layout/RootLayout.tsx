import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import ScrollToTop from '@/components/common/ScrollToTop';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Outlet />
      <Toaster position="top-right" richColors />
      <ScrollToTop />
    </div>
  );
};

export default RootLayout;
