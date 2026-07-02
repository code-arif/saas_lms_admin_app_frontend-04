import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import { eventCategoryColor, categoryLabels, eventIconComponent } from "../utils/auditHelpers";
import type { AuditCategorySummary } from "../types/audit.types";
import {
  Fingerprint,
  ShieldAlert,
  Activity,
  FileCode,
  User,
  Globe,
  AlertTriangle,
  Monitor,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Fingerprint,
  ShieldAlert,
  Activity,
  FileCode,
  User,
  Globe,
  AlertTriangle,
  Monitor,
  Info,
};

const SummaryCard = ({
  label,
  count,
  color,
  iconName,
}: {
  label: string;
  count: number;
  color: string;
  iconName: string;
}) => {
  const Icon = iconMap[iconName] || Info;
  return (
    <div className="flex items-center gap-3 p-3 rounded bg-card shadow-sm dark:bg-muted dark:shadow-none hover:shadow-md transition-shadow duration-200 cursor-default">
      <div className={cn("p-2 rounded-full", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-lg font-bold tabular-nums">{count.toLocaleString()}</p>
      </div>
    </div>
  );
};

interface AuditSummaryCardsProps {
  summaryTotal: number;
  summary: AuditCategorySummary[];
  isLoading: boolean;
}

export const AuditSummaryCards = ({ summaryTotal, summary, isLoading }: AuditSummaryCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[72px] rounded bg-card shadow-sm dark:bg-muted dark:shadow-none p-3">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <SummaryCard
        label="Total Events"
        count={summaryTotal}
        color="bg-primary/10 text-primary"
        iconName="Activity"
      />
      {summary.slice(0, 4).map((s) => (
        <SummaryCard
          key={s.category}
          label={categoryLabels[s.category] || s.category}
          count={s.count}
          color={eventCategoryColor(s.category).split(" ").slice(0, 2).join(" ")}
          iconName={eventIconComponent(s.category)}
        />
      ))}
    </div>
  );
};

export default AuditSummaryCards;
