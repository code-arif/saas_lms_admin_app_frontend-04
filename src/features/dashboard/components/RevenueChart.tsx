import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  data: Array<{ month: string; amount: number }>;
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    amount: item.amount / 100,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Earnings</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue overview</p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              formatter={(value) => [`$${Number(value)}`, 'Revenue']}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar
              dataKey="amount"
              fill="hsl(var(--theme-accent))"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
