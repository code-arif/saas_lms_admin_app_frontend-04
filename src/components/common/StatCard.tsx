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
  gradient?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, isUp, className, gradient }: StatCardProps) => {
  return (
    <Card className={cn('overflow-hidden relative group', className)}>
      {gradient && (
        <>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-accent) / 0.05), hsl(var(--theme-accent) / 0.03), transparent)` }}
          />
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{ background: `linear-gradient(to right, hsl(var(--theme-banner-from)), hsl(var(--theme-banner-via)), hsl(var(--theme-banner-to)))` }}
          />
        </>
      )}
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <div className="flex items-center text-xs mt-2">
                {isUp ? (
                  <span className="flex items-center gap-0.5" style={{ color: `hsl(var(--theme-accent))` }}>
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
          <div
            className={cn(
              'h-12 w-12 rounded-lg flex items-center justify-center transition-colors duration-300',
              gradient ? '' : 'bg-muted text-muted-foreground'
            )}
            style={gradient ? {
              background: `linear-gradient(to bottom right, hsl(var(--theme-accent) / 0.2), hsl(var(--theme-accent) / 0.15))`,
              color: `hsl(var(--theme-accent))`,
            } : undefined}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
