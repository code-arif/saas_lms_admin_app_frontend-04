import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Outlet />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default RootLayout;
