import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isUp?: boolean;
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, isUp, className }: StatCardProps) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <div className="flex items-center text-xs mt-2">
                {isUp ? (
                  <span className="text-green-500 flex items-center gap-0.5">
                    <ArrowUpRight size={12} /> {trend}
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-0.5">
                    <ArrowDownRight size={12} /> {trend}
                  </span>
                )}
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
