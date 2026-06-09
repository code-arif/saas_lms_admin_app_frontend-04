import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RevenueAnalytics from '@/features/analytics/components/RevenueAnalytics';
import TenantAnalytics from '@/features/analytics/components/TenantAnalytics';
import PlatformMetrics from '@/features/analytics/components/PlatformMetrics';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('30');
  const { data: response, isLoading } = useAnalytics({ period });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const analytics = response?.data;

  return (
    <div className="space-y-6">
      <PageTitle title="Analytics" subtitle="Platform analytics and insights">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </PageTitle>

      <PlatformMetrics
        mrr={analytics?.mrr || 0}
        arr={analytics?.arr || 0}
        churn_rate={analytics?.churn_rate || 0}
        avg_revenue={analytics?.avg_revenue || 0}
        plan_distribution={analytics?.plan_distribution || []}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueAnalytics data={analytics?.mrr_trend || []} />
        <TenantAnalytics data={analytics?.new_tenants || []} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
