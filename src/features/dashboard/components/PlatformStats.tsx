import { Building2, DollarSign, Users, GraduationCap } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import { formatCurrency } from '@/utils/formatCurrency';

interface PlatformStatsProps {
  totalTenants: number;
  mrr: number;
  activeSubscriptions: number;
  totalStudents: number;
}

const PlatformStats = ({ totalTenants, mrr, activeSubscriptions, totalStudents }: PlatformStatsProps) => {
  const cards = [
    { title: 'Total Tenants', value: totalTenants, icon: Building2 },
    { title: 'Monthly Revenue', value: formatCurrency(mrr), icon: DollarSign },
    { title: 'Active Subscriptions', value: activeSubscriptions, icon: Users },
    { title: 'Total Students', value: totalStudents, icon: GraduationCap },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default PlatformStats;
