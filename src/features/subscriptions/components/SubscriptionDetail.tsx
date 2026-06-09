import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

interface SubscriptionDetailProps {
  subscription: any;
}

const SubscriptionDetail = ({ subscription }: SubscriptionDetailProps) => {
  if (!subscription) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tenant</p>
            <p className="font-medium">{subscription.tenant_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-medium">{subscription.plan_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={subscription.status === 'active' ? 'success' : 'secondary'}>
              {subscription.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">{formatCurrency(subscription.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Billing Cycle</p>
            <p className="font-medium capitalize">{subscription.billing_cycle}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Billing</p>
            <p className="font-medium">{formatDate(subscription.next_billing_date)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionDetail;
