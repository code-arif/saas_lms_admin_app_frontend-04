import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

interface Subscription {
  uuid: string;
  tenant_name: string;
  plan_name: string;
  status: string;
  amount: number;
  billing_cycle: string;
  next_billing_date: string;
  created_at: string;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success' as const;
    case 'trial': return 'default' as const;
    case 'suspended': return 'destructive' as const;
    case 'past_due': return 'warning' as const;
    case 'cancelled': return 'secondary' as const;
    default: return 'outline' as const;
  }
};

const SubscriptionTable = ({ subscriptions, isLoading }: SubscriptionTableProps) => {
  const columns = [
    {
      key: 'tenant_name',
      header: 'Tenant',
      render: (item: Subscription) => <span className="font-medium">{item.tenant_name}</span>,
    },
    {
      key: 'plan_name',
      header: 'Plan',
      render: (item: Subscription) => item.plan_name,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Subscription) => <Badge variant={statusVariant(item.status)}>{item.status}</Badge>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item: Subscription) => formatCurrency(item.amount),
    },
    {
      key: 'billing_cycle',
      header: 'Cycle',
      render: (item: Subscription) => <span className="capitalize">{item.billing_cycle}</span>,
    },
    {
      key: 'next_billing_date',
      header: 'Next Billing',
      render: (item: Subscription) => formatDate(item.next_billing_date),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={subscriptions}
      isLoading={isLoading}
    />
  );
};

export default SubscriptionTable;
