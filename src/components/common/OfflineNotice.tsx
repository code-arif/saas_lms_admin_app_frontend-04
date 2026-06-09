import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

const OfflineNotice = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-destructive-foreground shadow-lg animate-in slide-in-from-bottom-5">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">You are currently offline</span>
    </div>
  );
};

export default OfflineNotice;
