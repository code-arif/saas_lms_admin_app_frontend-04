import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';

const DashboardLayout = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        <Header />

        <main className="flex-1 p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
