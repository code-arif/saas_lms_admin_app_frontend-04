import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#f59e0b'];

interface PlatformMetricsProps {
  mrr: number;
  arr: number;
  churn_rate: number;
  avg_revenue: number;
  plan_distribution: Array<{ name: string; value: number }>;
}

const PlatformMetrics = ({ mrr, arr, churn_rate, avg_revenue, plan_distribution }: PlatformMetricsProps) => {
  const metrics = [
    { title: 'MRR', value: formatCurrency(mrr), icon: DollarSign, color: 'text-green-500' },
    { title: 'ARR', value: formatCurrency(arr), icon: TrendingUp, color: 'text-blue-500' },
    { title: 'Churn Rate', value: `${churn_rate.toFixed(1)}%`, icon: TrendingDown, color: 'text-red-500' },
    { title: 'Avg Revenue', value: formatCurrency(avg_revenue), icon: BarChart3, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plan_distribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={plan_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {plan_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlatformMetrics;
