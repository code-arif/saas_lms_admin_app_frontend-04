import { Building2, DollarSign, Users, GraduationCap, Plus, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import PlatformStats from '@/features/dashboard/components/PlatformStats';
import RevenueChart from '@/features/dashboard/components/RevenueChart';
import TenantGrowthChart from '@/features/dashboard/components/TenantGrowthChart';
import RecentTenants from '@/features/dashboard/components/RecentTenants';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#a855f7'];

const DashboardPage = () => {
  const { data: response, isLoading } = useDashboard();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const stats = response?.data;

  return (
    <div className="space-y-8">
      <PageTitle
        title="Dashboard"
        subtitle="Platform overview and key metrics"
      >
        <Link to="/plans/create">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </Link>
        <Link to="/coupons">
          <Button size="sm" variant="outline">
            <Tag className="h-4 w-4 mr-2" />
            Manage Coupons
          </Button>
        </Link>
      </PageTitle>

      <PlatformStats
        totalTenants={stats?.total_tenants || 0}
        mrr={stats?.mrr || 0}
        activeSubscriptions={stats?.active_subscriptions || 0}
        totalStudents={stats?.total_students || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <RevenueChart data={stats?.monthly_revenue || []} />
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {stats?.subscription_breakdown && stats.subscription_breakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.subscription_breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                    >
                      {stats.subscription_breakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No subscription data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <TenantGrowthChart data={stats?.tenant_growth || []} />
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentTenants tenants={stats?.recent_tenants || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
