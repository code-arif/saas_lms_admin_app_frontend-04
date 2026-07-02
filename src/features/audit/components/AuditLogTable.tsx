import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { cn } from "@/utils/cn";
import { formatDateTime } from "@/utils/formatDate";
import { Badge } from "@/components/ui/Badge";
import {
  eventCategoryColor,
  eventIconComponent,
  categoryLabels,
  userTypeVariant,
  formatUserType,
  methodColor,
} from "../utils/auditHelpers";
import type { AuditLog } from "../types/audit.types";
import {
  Search,
  Eye,
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

const EventIcon = ({ category }: { category: string | null | undefined }) => {
  const name = eventIconComponent(category);
  const Icon = iconMap[name] || Info;
  return <Icon className="h-3.5 w-3.5" />;
};

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onViewDetail: (log: AuditLog) => void;
  onClearFilters: () => void;
}

export const AuditLogTable = ({ logs, isLoading, hasActiveFilters, onViewDetail, onClearFilters }: AuditLogTableProps) => {
  const columns: Column<AuditLog>[] = [
    {
      key: "event",
      header: "Event",
      render: (item: AuditLog) => (
        <div className="flex items-center gap-2">
          <span className={cn("shrink-0 p-1 rounded", eventCategoryColor(item.event_category))}>
            <EventIcon category={item.event_category} />
          </span>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate max-w-[200px]" title={item.event}>
              {item.event}
            </p>
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", eventCategoryColor(item.event_category))}>
              {categoryLabels[item.event_category] || item.event_category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "user",
      header: "Actor",
      render: (item: AuditLog) => (
        <div className="min-w-0 max-w-[180px]">
          <p className="text-sm truncate" title={item.user_email || undefined}>
            {item.user_email || <span className="text-muted-foreground italic">System</span>}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant={userTypeVariant(item.user_type)} className="text-[10px] px-1 py-0">
              {formatUserType(item.user_type)}
            </Badge>
            {item.user_id && (
              <span className="text-[10px] text-muted-foreground font-mono">#{item.user_id}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "context",
      header: "Context",
      render: (item: AuditLog) => (
        <div className="min-w-0 max-w-[160px]">
          {item.context?.ip_address ? (
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono block truncate">
              {item.context.ip_address}
            </code>
          ) : (
            <span className="text-xs text-muted-foreground italic">N/A</span>
          )}
          {item.context?.method && (
            <span className={cn("text-xs font-mono font-medium ml-1.5", methodColor(item.context.method))}>
              {item.context.method}
            </span>
          )}
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "url",
      header: "URL",
      render: (item: AuditLog) => (
        <div className="min-w-0 max-w-[220px]">
          <p className="text-xs text-muted-foreground truncate" title={item.context?.url || undefined}>
            {item.context?.url || <span className="italic">N/A</span>}
          </p>
        </div>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "auditable",
      header: "Entity",
      render: (item: AuditLog) => (
        <div className="min-w-0 max-w-[140px]">
          {item.auditable ? (
            <>
              <p className="text-xs truncate text-muted-foreground" title={item.auditable.type}>
                {(item.auditable.type ?? "").split("\\").pop()}
              </p>
              <code className="text-[10px] bg-muted px-1 py-0.5 rounded font-mono">#{item.auditable.id}</code>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic">—</span>
          )}
        </div>
      ),
      className: "hidden xl:table-cell",
    },
    {
      key: "created_at",
      header: "Timestamp",
      render: (item: AuditLog) => (
        <div className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDateTime(item.created_at)}
        </div>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "actions",
      header: "",
      render: (item: AuditLog) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => { e.stopPropagation(); onViewDetail(item); }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="rounded bg-card shadow-sm dark:bg-muted dark:shadow-none overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Search className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-muted-foreground font-medium">No audit logs found</p>
                  <p className="text-sm text-muted-foreground/70">
                    {hasActiveFilters
                      ? "Try adjusting your filters or date range"
                      : "Audit logs will appear here once events are recorded"}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((item) => (
              <TableRow
                key={item.uuid}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onViewDetail(item)}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.render!(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;
