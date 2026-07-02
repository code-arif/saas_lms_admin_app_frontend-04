import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { categoryLabels, formatUserType } from "../utils/auditHelpers";
import { EVENT_CATEGORIES, USER_TYPES, HTTP_METHODS } from "../types/audit.types";
import { Search, X } from "lucide-react";

interface AuditFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  userTypeFilter: string;
  onUserTypeChange: (value: string) => void;
  methodFilter: string;
  onMethodChange: (value: string) => void;
  dateFrom: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  onDateToChange: (date: Date | undefined) => void;
  orderBy: string;
  onOrderByChange: (value: string) => void;
  direction: "asc" | "desc";
  onDirectionChange: (value: "asc" | "desc") => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  filtersOpen: boolean;
  onResetPage: () => void;
}

export const AuditFilters = ({
  searchInput,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  userTypeFilter,
  onUserTypeChange,
  methodFilter,
  onMethodChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  orderBy,
  onOrderByChange,
  direction,
  onDirectionChange,
  hasActiveFilters,
  onClearFilters,
  filtersOpen,
  onResetPage,
}: AuditFiltersProps) => {
  return (
    <div className={cn("space-y-3 p-4 rounded-xl bg-card shadow-sm dark:bg-muted dark:shadow-none", !filtersOpen && "hidden md:block")}>
      {/* Search & quick filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, emails, IPs, URLs..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
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

          <Select value={userTypeFilter} onValueChange={(v) => { onUserTypeChange(v); onResetPage(); }}>
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

          <Select value={methodFilter} onValueChange={(v) => { onMethodChange(v); onResetPage(); }}>
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

      {/* Extended filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <DatePicker
            value={dateFrom}
            onChange={(date) => { onDateFromChange(date); onResetPage(); }}
            placeholder="From date"
          />
          <span className="text-sm text-muted-foreground font-medium">—</span>
          <DatePicker
            value={dateTo}
            onChange={(date) => { onDateToChange(date); onResetPage(); }}
            placeholder="To date"
          />
        </div>

        <Select value={orderBy} onValueChange={(v) => { onOrderByChange(v); onResetPage(); }}>
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

        <Select value={direction} onValueChange={(v) => { onDirectionChange(v as "asc" | "desc"); onResetPage(); }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuditFilters;
