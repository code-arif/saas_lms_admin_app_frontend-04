import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TenantGrowthChartProps {
  data: Array<{ month: string; count: number }>;
}

const TenantGrowthChart = ({ data }: TenantGrowthChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Growth</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            />
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`hsl(var(--theme-accent))`} stopOpacity={0.3} />
                <stop offset="100%" stopColor={`hsl(var(--theme-accent))`} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="count"
              stroke={`hsl(var(--theme-accent))`}
              strokeWidth={3}
              dot={{ fill: `hsl(var(--theme-accent))`, strokeWidth: 2, stroke: 'hsl(var(--card))', r: 5 }}
              activeDot={{ r: 7, fill: `hsl(var(--theme-accent))`, stroke: 'hsl(var(--card))', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TenantGrowthChart;
