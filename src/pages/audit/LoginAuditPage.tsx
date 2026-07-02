import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/Button";
import { formatDateParam } from "@/features/audit/utils/auditHelpers";
import { useAuditLogs, useAuditSummaryByCategory } from "@/features/audit/hooks/useAuditLogs";
import type { AuditLog, AuditLogListParams } from "@/features/audit/types/audit.types";
import { AuditSummaryCards } from "@/features/audit/components/AuditSummaryCards";
import { AuditFilters } from "@/features/audit/components/AuditFilters";
import { AuditLogTable } from "@/features/audit/components/AuditLogTable";
import { AuditPagination } from "@/features/audit/components/AuditPagination";
import { AuditDetailDialog } from "@/features/audit/components/AuditDetailDialog";
import { Filter, RefreshCw, Download, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 15;

const LoginAuditPage = () => {
  // Pagination state
  const [page, setPage] = useState(1);

  // Filter state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
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
    if (userTypeFilter !== "all") params.user_type = userTypeFilter;
    if (methodFilter !== "all") params.method = methodFilter;
    if (dateFrom) params.date_from = formatDateParam(dateFrom);
    if (dateTo) params.date_to = formatDateParam(dateTo);

    return params;
  }, [page, debouncedSearch, categoryFilter, userTypeFilter, methodFilter, dateFrom, dateTo, orderBy, direction]);

  // Reset to page 1 when filters change
  const resetPage = useCallback(() => setPage(1), []);

  // Sync debounced search to query state and reset page on change
  useEffect(() => {
    setSearchQuery(debouncedSearch);
    resetPage();
  }, [debouncedSearch, resetPage]);

  // Queries
  const { data: auditData, isLoading, isFetching, refetch } = useAuditLogs(buildParams());
  const { data: summaryData, isLoading: summaryLoading } = useAuditSummaryByCategory(
    dateFrom || dateTo
      ? { date_from: formatDateParam(dateFrom), date_to: formatDateParam(dateTo) }
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

  const clearFilters = () => {
    setSearchInput("");
    setCategoryFilter("all");
    setUserTypeFilter("all");
    setMethodFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setOrderBy("created_at");
    setDirection("desc");
    resetPage();
  };

  const hasActiveFilters =
    !!searchQuery ||
    categoryFilter !== "all" ||
    userTypeFilter !== "all" ||
    methodFilter !== "all" ||
    !!dateFrom ||
    !!dateTo;

  return (
    <div className="space-y-5">
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
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </PageTitle>

      {/* Summary Cards */}
      <AuditSummaryCards summaryTotal={summaryTotal} summary={summary} isLoading={summaryLoading} />

      {/* Filters */}
      <AuditFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        categoryFilter={categoryFilter}
        onCategoryChange={(v) => { setCategoryFilter(v); resetPage(); }}
        userTypeFilter={userTypeFilter}
        onUserTypeChange={setUserTypeFilter}
        methodFilter={methodFilter}
        onMethodChange={setMethodFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        orderBy={orderBy}
        onOrderByChange={setOrderBy}
        direction={direction}
        onDirectionChange={setDirection}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        filtersOpen={filtersOpen}
        onResetPage={resetPage}
      />

      {/* Table */}
      <AuditLogTable
        logs={logs}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onViewDetail={handleViewDetail}
        onClearFilters={clearFilters}
      />

      {/* Pagination */}
      <AuditPagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />

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
