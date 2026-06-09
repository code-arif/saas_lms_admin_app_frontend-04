import { Badge } from '@/components/ui/Badge';

interface TenantStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { variant: 'success' | 'default' | 'destructive' | 'secondary' | 'warning' | 'outline'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  trial: { variant: 'default', label: 'Trial' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  cancelled: { variant: 'secondary', label: 'Cancelled' },
};

const TenantStatusBadge = ({ status }: TenantStatusBadgeProps) => {
  const config = statusConfig[status] || { variant: 'outline' as const, label: status };

  return (
    <Badge variant={config.variant}>{config.label}</Badge>
  );
};

export default TenantStatusBadge;
