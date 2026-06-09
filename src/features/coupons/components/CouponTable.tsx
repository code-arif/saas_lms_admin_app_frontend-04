import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Coupon {
  uuid: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
}

interface CouponTableProps {
  coupons: Coupon[];
  isLoading?: boolean;
  onDelete?: (uuid: string) => void;
}

const CouponTable = ({ coupons, isLoading, onDelete }: CouponTableProps) => {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (item: Coupon) => (
        <div className="flex items-center gap-2">
          <code className="font-mono font-medium bg-muted px-2 py-1 rounded">{item.code}</code>
          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.code)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      key: 'discount',
      header: 'Discount',
      render: (item: Coupon) => (
        <span>
          {item.discount_type === 'percentage' ? `${item.discount_value}%` : `$${(item.discount_value / 100).toFixed(2)}`}
        </span>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (item: Coupon) => (
        <span>{item.used_count}{item.max_uses ? ` / ${item.max_uses}` : ''}</span>
      ),
    },
    {
      key: 'expires_at',
      header: 'Expires',
      render: (item: Coupon) => item.expires_at ? formatDate(item.expires_at) : 'Never',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (item: Coupon) => (
        <Badge variant={item.is_active ? 'success' : 'secondary'}>
          {item.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[80px]',
      render: (item: Coupon) => (
        <Button variant="ghost" size="icon" onClick={() => onDelete?.(item.uuid)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={coupons}
      isLoading={isLoading}
    />
  );
};

export default CouponTable;
