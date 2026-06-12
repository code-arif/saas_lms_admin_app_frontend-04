import { Plus, Tag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import PlatformStats from '@/features/dashboard/components/PlatformStats';
import RevenueChart from '@/features/dashboard/components/RevenueChart';
import TenantGrowthChart from '@/features/dashboard/components/TenantGrowthChart';
import RecentTenants from '@/features/dashboard/components/RecentTenants';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

const DashboardPage = () => {
  const { data: response, isLoading } = useDashboard();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const stats = response?.data;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-banner-from)), hsl(var(--theme-banner-via)), hsl(var(--theme-banner-to)))` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDYpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWJpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: `hsl(var(--theme-banner-to) / 0.15)` }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-white space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" style={{ color: `hsl(var(--theme-banner-to))` }} />
              <span className="text-sm font-medium tracking-wide uppercase" style={{ color: `hsl(var(--theme-banner-to) / 0.85)` }}>Platform Overview</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="max-w-xl text-sm md:text-base" style={{ color: `hsl(var(--theme-banner-to) / 0.85)` }}>
              Monitor your platform health, track revenue growth, and manage tenants at a glance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/plans/create">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </Link>
            <Link to="/coupons">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                <Tag className="h-4 w-4 mr-2" />
                Manage Coupons
              </Button>
            </Link>
          </div>
        </div>
      </div>

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
