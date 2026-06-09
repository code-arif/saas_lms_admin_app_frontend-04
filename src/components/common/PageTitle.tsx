import { cn } from '@/utils/cn';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

const PageTitle = ({ title, subtitle, className, children }: PageTitleProps) => {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8', className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default PageTitle;
