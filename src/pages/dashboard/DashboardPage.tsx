import { Link } from 'react-router-dom';
import { Plus, Tag, Sparkles, Building2, DollarSign, Users, GraduationCap, ChevronRight, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import RevenueChart from '@/features/dashboard/components/RevenueChart';
import RecentTenants from '@/features/dashboard/components/RecentTenants';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

// ─── Skeleton ───────────────────────────────────────────────────────────────

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <style>{`
      @keyframes skeletonEnter {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>

    {/* Hero Banner Skeleton */}
    <div
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-muted/50"
      style={{ animation: 'skeletonEnter 0.4s ease-out 0ms both' }}
    >
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>
    </div>

    {/* 4 KPI Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} style={{ animation: `skeletonEnter 0.4s ease-out ${120 + i * 80}ms both` }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
            <Skeleton className="h-3 w-28 mt-3" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Main Content Row Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ animation: 'skeletonEnter 0.4s ease-out 480ms both' }}>
      {/* Chart area */}
      <div className="lg:col-span-7">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="h-[300px] flex items-end gap-2 px-6 pb-8">
            {Array.from({ length: 12 }).map((_, j) => (
              <Skeleton
                key={j}
                className="flex-1 rounded-t-md"
                style={{ height: `${Math.max(15, Math.random() * 80 + 20)}%` }}
              />
            ))}
          </CardContent>
        </Card>
      </div>
      {/* Side panel */}
      <div className="lg:col-span-5">
        <Card className="h-full">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Bottom Table Skeleton */}
    <div style={{ animation: 'skeletonEnter 0.4s ease-out 600ms both' }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 pb-2 border-b border-border/50">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="flex gap-4 py-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

// ─── KPI Stat Card ──────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

const KpiCard = ({ title, value, icon: Icon, trend, trendUp, delay = 0 }: KpiCardProps) => (
  <Card
    className="group hover:shadow-md transition-all duration-300"
    style={{ animation: `skeletonEnter 0.4s ease-out ${delay}ms both` }}
  >
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--theme-accent) / 0.2), hsl(var(--theme-accent) / 0.08))',
            color: 'hsl(var(--theme-accent))',
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3 text-xs">
          <span className={cn(
            'inline-flex items-center gap-0.5 font-medium',
            trendUp ? 'text-emerald-500' : 'text-red-500'
          )}>
            {trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {trend}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// ─── Ranked List Item ────────────────────────────────────────────────────────

interface RankedListItemProps {
  rank: number;
  label: string;
  value: number;
  total: number;
  color: string;
}

const RankedListItem = ({ rank, label, value, total, color }: RankedListItemProps) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
      <span className="text-xs font-bold text-muted-foreground w-5 text-center">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium capitalize truncate">{label}</span>
          <span className="text-sm font-semibold ml-2">{value}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/60">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { data: response, isLoading } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = response?.data;

  // Compute trends
  const lastMonthRevenue = stats?.monthly_revenue?.[stats.monthly_revenue.length - 1]?.amount || 0;
  const prevMonthRevenue = stats?.monthly_revenue?.[stats.monthly_revenue.length - 2]?.amount || 0;
  const revenueTrend = prevMonthRevenue ? (((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1) : undefined;
  const revenueIsUp = revenueTrend ? parseFloat(revenueTrend) >= 0 : undefined;

  const lastMonthTenants = stats?.tenant_growth?.[stats.tenant_growth.length - 1]?.count || 0;
  const prevMonthTenants = stats?.tenant_growth?.[stats.tenant_growth.length - 2]?.count || 0;
  const tenantTrend = prevMonthTenants ? (((lastMonthTenants - prevMonthTenants) / prevMonthTenants) * 100).toFixed(1) : undefined;
  const tenantIsUp = tenantTrend ? parseFloat(tenantTrend) >= 0 : undefined;

  // Subscription breakdown for ranked list
  const breakdown = stats?.subscription_breakdown || [];
  const totalSubs = breakdown.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes skeletonEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Hero Welcome Card ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ background: `linear-gradient(135deg, hsl(var(--theme-banner-from)), hsl(var(--theme-banner-via)), hsl(var(--theme-banner-to)))` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDYpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" style={{ backgroundColor: `hsl(var(--theme-accent) / 0.12)` }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl translate-y-1/2" style={{ backgroundColor: `hsl(var(--theme-banner-to) / 0.15)` }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-white space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: `hsl(var(--theme-banner-to))` }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: `hsl(var(--theme-banner-to) / 0.85)` }}>
                Welcome Back
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Platform Dashboard</h1>
            <p className="max-w-lg text-sm" style={{ color: `hsl(var(--theme-banner-to) / 0.85)` }}>
              Track your platform's performance, manage subscriptions, and stay on top of key metrics.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <Link to="/plans/create">
              <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-sm">
                <Plus className="h-4 w-4" />
                Create Plan
              </Button>
            </Link>
            <Link to="/coupons">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/15 hover:text-white">
                <Tag className="h-4 w-4" />
                Coupons
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4 KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Current Month"
          value={formatCurrency(stats?.mrr || 0)}
          icon={DollarSign}
          trend={revenueTrend ? `${revenueTrend}%` : undefined}
          trendUp={revenueIsUp}
          delay={0}
        />
        <KpiCard
          title="Total Tenants"
          value={stats?.total_tenants || 0}
          icon={Building2}
          trend={tenantTrend ? `${tenantTrend}%` : undefined}
          trendUp={tenantIsUp}
          delay={80}
        />
        <KpiCard
          title="Active Subscriptions"
          value={stats?.active_subscriptions || 0}
          icon={Users}
          delay={160}
        />
        <KpiCard
          title="Total Students"
          value={stats?.total_students || 0}
          icon={GraduationCap}
          delay={240}
        />
      </div>

      {/* ── Chart + Ranked List Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-7">
          <RevenueChart data={stats?.monthly_revenue || []} />
        </div>

        {/* Ranked List - Subscription Breakdown */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Subscription Status</CardTitle>
                <Badge variant="outline" className="text-xs font-normal">
                  {totalSubs} total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {breakdown.length > 0 ? (
                <div className="space-y-0">
                  {breakdown
                    .sort((a, b) => b.count - a.count)
                    .map((item, index) => (
                      <RankedListItem
                        key={item.status}
                        rank={index + 1}
                        label={item.status}
                        value={item.count}
                        total={totalSubs}
                        color={COLORS[index % COLORS.length]}
                      />
                    ))}
                  {/* Quick summary at bottom */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Active rate
                    </span>
                    <span className="font-semibold text-foreground">
                      {totalSubs > 0
                        ? `${Math.round((breakdown.find((s) => s.status === 'active')?.count || 0) / totalSubs * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                  No subscription data
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Full-width Recent Tenants Table ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Tenants</CardTitle>
            <Link
              to="/tenants"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
            >
              View all
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <RecentTenants tenants={stats?.recent_tenants || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
