import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DatePicker } from "@/components/ui/DatePicker";
import PageTitle from "@/components/common/PageTitle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/Select";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/Table";
import { Separator } from "@/components/ui/Separator";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search, RefreshCw, Download, ChevronLeft, ChevronRight, Filter, X, Eye, Calendar, Clock, Globe, Monitor, FileCode, User, Fingerprint, Tag, AlertTriangle, CheckCircle2, ShieldAlert, Info, Activity, Loader2, ArrowUpDown,} from "lucide-react";
import { formatDateTime } from "@/utils/formatDate";
import { useAuditLogs, useAuditSummaryByCategory} from "@/features/audit/hooks/useAuditLogs";
import { EVENT_CATEGORIES, USER_TYPES, HTTP_METHODS} from "@/features/audit/types/audit.types";
import type {AuditLog,AuditLogListParams} from "@/features/audit/types/audit.types";
import { cn } from "@/utils/cn";

const ITEMS_PER_PAGE = 15;

/** Format a Date to YYYY-MM-DD string for the API */
const formatDateParam = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const eventCategoryColor = (category: string | null | undefined) => {
  switch (category) {
    case "auth":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "security":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "billing":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "content":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "user":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "tenant":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
    case "notification":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
    case "integration":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
    case "system":
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
    case "ai":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const eventIcon = (category: string | null | undefined) => {
  switch (category) {
    case "auth":
      return <Fingerprint className="h-3.5 w-3.5" />;
    case "security":
      return <ShieldAlert className="h-3.5 w-3.5" />;
    case "billing":
      return <Activity className="h-3.5 w-3.5" />;
    case "content":
      return <FileCode className="h-3.5 w-3.5" />;
    case "user":
      return <User className="h-3.5 w-3.5" />;
    case "tenant":
      return <Globe className="h-3.5 w-3.5" />;
    case "notification":
      return <AlertTriangle className="h-3.5 w-3.5" />;
    case "integration":
      return <Monitor className="h-3.5 w-3.5" />;
    case "system":
      return <Activity className="h-3.5 w-3.5" />;
    case "ai":
      return <Activity className="h-3.5 w-3.5" />;
    default:
      return <Info className="h-3.5 w-3.5" />;
  }
};

const methodColor = (method: string | null | undefined) => {
  switch ((method || "").toUpperCase()) {
    case "GET":
      return "text-green-600 dark:text-green-400";
    case "POST":
      return "text-blue-600 dark:text-blue-400";
    case "PUT":
    case "PATCH":
      return "text-amber-600 dark:text-amber-400";
    case "DELETE":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-muted-foreground";
  }
};

const userTypeVariant = (type: string | null) => {
  switch (type) {
    case "admin":
      return "default" as const;
    case "tenant":
      return "secondary" as const;
    case "instructor":
      return "outline" as const;
    case "student":
      return "outline" as const;
    default:
      return "outline" as const;
  }
};

const formatUserType = (type: string | null) => {
  if (!type) return "N/A";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const categoryLabels: Record<string, string> = {
  auth: "Authentication",
  security: "Security",
  billing: "Billing",
  content: "Content",
  user: "User Management",
  tenant: "Tenant",
  notification: "Notification",
  integration: "Integration",
  system: "System",
  ai: "AI Services",
};

// Audit Log Detail Dialog

interface AuditDetailDialogProps {
  log: AuditLog | null;
  open: boolean;
  onClose: () => void;
}

const AuditDetailDialog = ({ log, open, onClose }: AuditDetailDialogProps) => {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-xs font-medium",
                eventCategoryColor(log.event_category),
              )}
            >
              {log.event}
            </span>
          </DialogTitle>
          <DialogDescription>
            Audit log details — UUID:{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
              {log.uuid}
            </code>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                Event Category
              </p>
              <Badge
                variant="outline"
                className={cn(
                  "font-normal",
                  eventCategoryColor(log.event_category),
                )}
              >
                {categoryLabels[log.event_category] || log.event_category}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                Timestamp
              </p>
              <p className="text-sm flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {formatDateTime(log.created_at)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Actor Info */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Actor
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p>
                  {log.user_email || (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Type</p>
                {log.user_type ? (
                  <Badge
                    variant={userTypeVariant(log.user_type)}
                    className="text-xs"
                  >
                    {formatUserType(log.user_type)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground italic">N/A</span>
                )}
              </div>
              {log.user_id && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">User ID</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    {log.user_id}
                  </code>
                </div>
              )}
              {log.tenant_id && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tenant ID</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    {log.tenant_id}
                  </code>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* HTTP Context */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              HTTP Context
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">IP Address</p>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  {log.context?.ip_address || (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </code>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">HTTP Method</p>
                {log.context?.method ? (
                  <span
                    className={cn(
                      "text-sm font-mono font-medium",
                      methodColor(log.context.method),
                    )}
                  >
                    {log.context.method}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">N/A</span>
                )}
              </div>
              {log.context?.url && (
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">URL</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono break-all block">
                    {log.context.url}
                  </code>
                </div>
              )}
              {log.context?.user_agent && (
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">User Agent</p>
                  <p className="text-xs text-muted-foreground break-all">
                    {log.context.user_agent}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Auditable Entity */}
          {log.auditable && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Affected Entity
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      {log.auditable.type || "N/A"}
                    </code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ID</p>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      {log.auditable.id}
                    </code>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Changes */}
          {log.changes && (log.changes.old || log.changes.new) && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  Changes
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {log.changes.old && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        Previous Value
                      </p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32">
                        {JSON.stringify(log.changes.old, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.changes.new && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        New Value
                      </p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32">
                        {JSON.stringify(log.changes.new, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Metadata
                </h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-40">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Summary Card ──────────────────────────────────────────────────────

const SummaryCard = ({
  label,
  count,
  color,
  icon: Icon,
}: {
  label: string;
  count: number;
  color: string;
  icon: React.ElementType;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
    <div className={cn("p-2 rounded-full", color)}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground truncate">{label}</p>
      <p className="text-lg font-bold tabular-nums">{count.toLocaleString()}</p>
    </div>
  </div>
);

// Main Page

const LoginAuditPage = () => {
  // Pagination state
  const [page, setPage] = useState(1);

  // Filter state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [orderBy, setOrderBy] = useState("created_at");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  // Detail dialog
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Filter panel toggle (mobile)
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Build API params
  const buildParams = useCallback((): AuditLogListParams => {
    const params: AuditLogListParams = {
      page,
      per_page: ITEMS_PER_PAGE,
      order_by: orderBy,
      direction,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (categoryFilter !== "all") params.event_category = categoryFilter;
    if (eventFilter !== "all") params.event = eventFilter;
    if (userTypeFilter !== "all") params.user_type = userTypeFilter;
    if (methodFilter !== "all") params.method = methodFilter;
    if (dateFrom) params.date_from = formatDateParam(dateFrom);
    if (dateTo) params.date_to = formatDateParam(dateTo);

    return params;
  }, [
    page,
    debouncedSearch,
    categoryFilter,
    eventFilter,
    userTypeFilter,
    methodFilter,
    dateFrom,
    dateTo,
    orderBy,
    direction,
  ]);

  // Reset to page 1 when filters change
  const resetPage = useCallback(() => setPage(1), []);

  // Sync debounced search to query state and reset page on change
  useEffect(() => {
    setSearchQuery(debouncedSearch);
    resetPage();
  }, [debouncedSearch, resetPage]);

  // Queries
  const {
    data: auditData,
    isLoading,
    isFetching,
    refetch,
  } = useAuditLogs(buildParams());
  const { data: summaryData, isLoading: summaryLoading } =
    useAuditSummaryByCategory(
      dateFrom || dateTo
        ? {
            date_from: formatDateParam(dateFrom),
            date_to: formatDateParam(dateTo),
          }
        : undefined,
    );

  const logs: AuditLog[] = auditData?.data?.items ?? [];
  const totalCount = auditData?.pagination?.total ?? 0;
  const totalPages = auditData?.pagination?.last_page ?? 1;
  const summary = summaryData?.data?.summary ?? [];
  const summaryTotal = summaryData?.data?.total ?? 0;

  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setEventFilter("all");
    resetPage();
  };

  const clearFilters = () => {
    setSearchInput("");
    setCategoryFilter("all");
    setEventFilter("all");
    setUserTypeFilter("all");
    setMethodFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setOrderBy("created_at");
    setDirection("desc");
    resetPage();
  };

  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== "all" ||
    eventFilter !== "all" ||
    userTypeFilter !== "all" ||
    methodFilter !== "all" ||
    dateFrom ||
    dateTo;

  const columns = [
    {
      key: "event",
      header: "Event",
      render: (item: AuditLog) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "shrink-0 p-1 rounded",
              eventCategoryColor(item.event_category),
            )}
          >
            {eventIcon(item.event_category)}
          </span>
          <div className="min-w-0">
            <p
              className="font-medium text-sm truncate max-w-[200px]"
              title={item.event}
            >
              {item.event}
            </p>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded font-medium",
                eventCategoryColor(item.event_category),
              )}
            >
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
            {item.user_email || (
              <span className="text-muted-foreground italic">System</span>
            )}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge
              variant={userTypeVariant(item.user_type)}
              className="text-[10px] px-1 py-0"
            >
              {formatUserType(item.user_type)}
            </Badge>
            {item.user_id && (
              <span className="text-[10px] text-muted-foreground font-mono">
                #{item.user_id}
              </span>
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
            <span
              className={cn(
                "text-xs font-mono font-medium ml-1.5",
                methodColor(item.context.method),
              )}
            >
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
          <p
            className="text-xs text-muted-foreground truncate"
            title={item.context?.url || undefined}
          >
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
              <p
                className="text-xs truncate text-muted-foreground"
                title={item.auditable.type}
              >
                {(item.auditable.type ?? "").split("\\").pop()}
              </p>
              <code className="text-[10px] bg-muted px-1 py-0.5 rounded font-mono">
                #{item.auditable.id}
              </code>
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
          onClick={() => handleViewDetail(item)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageTitle
        title="Audit Logs"
        subtitle="Comprehensive audit trail of all platform activities and events"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </PageTitle>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[72px] rounded-lg border bg-card p-3">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-6 w-12" />
            </div>
          ))
        ) : (
          <>
            <SummaryCard
              label="Total Events"
              count={summaryTotal}
              color="bg-primary/10 text-primary"
              icon={Activity}
            />
            {summary.slice(0, 4).map((s) => (
              <SummaryCard
                key={s.category}
                label={categoryLabels[s.category] || s.category}
                count={s.count}
                color={eventCategoryColor(s.category)
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")}
                icon={() => eventIcon(s.category)}
              />
            ))}
          </>
        )}
      </div>

      {/* Filters */}
      <div
        className={cn(
          "space-y-3 p-4 rounded-lg border bg-card",
          !filtersOpen && "hidden md:block",
        )}
      >
        {/* Search & quick filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, emails, IPs, URLs..."
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat] || cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={userTypeFilter}
              onValueChange={(v) => {
                setUserTypeFilter(v);
                resetPage();
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {USER_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {formatUserType(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={methodFilter}
              onValueChange={(v) => {
                setMethodFilter(v);
                resetPage();
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {HTTP_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Extended filters (hidden by default, toggle with "More Filters") */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <DatePicker
              value={dateFrom}
              onChange={(date) => {
                setDateFrom(date);
                resetPage();
              }}
              placeholder="From date"
            />
            <span className="text-sm text-muted-foreground font-medium">—</span>
            <DatePicker
              value={dateTo}
              onChange={(date) => {
                setDateTo(date);
                resetPage();
              }}
              placeholder="To date"
            />
          </div>

          <Select
            value={orderBy}
            onValueChange={(v) => {
              setOrderBy(v);
              resetPage();
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Timestamp</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="event_category">Category</SelectItem>
              <SelectItem value="user_email">Email</SelectItem>
              <SelectItem value="ip_address">IP Address</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={direction}
            onValueChange={(v) => {
              setDirection(v as "asc" | "desc");
              resetPage();
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
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
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground font-medium">
                      No audit logs found
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      {hasActiveFilters
                        ? "Try adjusting your filters or date range"
                        : "Audit logs will appear here once events are recorded"}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                      >
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
                  onClick={() => handleViewDetail(item)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(page * ITEMS_PER_PAGE, totalCount)} of{" "}
            {totalCount.toLocaleString()} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <AuditDetailDialog
        log={selectedLog}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
};

export default LoginAuditPage;
