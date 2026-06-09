import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { Edit, Trash2, Zap } from 'lucide-react';

interface Campaign {
  uuid: string;
  name: string;
  badge?: string;
  coupon_code: string;
  start_date: string;
  end_date: string;
  auto_apply: boolean;
  status: string;
}

interface CampaignTableProps {
  campaigns: Campaign[];
  isLoading?: boolean;
  onEdit?: (uuid: string) => void;
  onDelete?: (uuid: string) => void;
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success' as const;
    case 'scheduled': return 'default' as const;
    case 'ended': return 'secondary' as const;
    case 'paused': return 'warning' as const;
    default: return 'outline' as const;
  }
};

const CampaignTable = ({ campaigns, isLoading, onEdit, onDelete }: CampaignTableProps) => {
  const columns = [
    {
      key: 'name',
      header: 'Campaign',
      render: (item: Campaign) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.name}</span>
          {item.badge && <Badge variant="outline">{item.badge}</Badge>}
        </div>
      ),
    },
    {
      key: 'coupon_code',
      header: 'Coupon',
      render: (item: Campaign) => <code className="font-mono text-sm bg-muted px-2 py-1 rounded">{item.coupon_code}</code>,
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (item: Campaign) => (
        <span className="text-sm">{formatDate(item.start_date)} - {formatDate(item.end_date)}</span>
      ),
    },
    {
      key: 'auto_apply',
      header: 'Auto-Apply',
      render: (item: Campaign) => (
        <div className="flex items-center gap-1">
          <Zap className={`h-4 w-4 ${item.auto_apply ? 'text-yellow-500' : 'text-muted-foreground'}`} />
          <span className="text-sm">{item.auto_apply ? 'Yes' : 'No'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Campaign) => <Badge variant={statusVariant(item.status)}>{item.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[100px]',
      render: (item: Campaign) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit?.(item.uuid)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete?.(item.uuid)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      isLoading={isLoading}
    />
  );
};

export default CampaignTable;
