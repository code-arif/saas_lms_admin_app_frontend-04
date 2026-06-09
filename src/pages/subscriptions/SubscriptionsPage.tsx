import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import SubscriptionTable from '@/features/subscriptions/components/SubscriptionTable';
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions';

const SubscriptionsPage = () => {
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useSubscriptions({
    page,
    per_page: 15,
  });

  const subscriptions = response?.data || [];

  return (
    <div className="space-y-6">
      <PageTitle
        title="Subscriptions"
        subtitle="Manage all subscriptions across tenants"
      />

      <SubscriptionTable
        subscriptions={subscriptions}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SubscriptionsPage;
