import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={cn('h-8 w-8 animate-spin text-primary', className)} />
    </div>
  );
};

export default LoadingSpinner;
