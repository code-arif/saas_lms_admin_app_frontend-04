import { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/common/DataTable";
import TenantStatusBadge from "./TenantStatusBadge";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { formatDate } from "@/utils/formatDate";
import { Eye, Trash2, Ban, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface Tenant {
  uuid: string;
  name: string;
  slug: string;
  status: string;
  plan?: string;
  students_count?: number;
  created_at: string;
}

interface TenantTableProps {
  tenants: Tenant[];
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilterStatus?: (status: string) => void;
  onSuspend?: (uuid: string) => void;
  onDelete?: (uuid: string) => void;
}

const TenantTable = ({
  tenants,
  isLoading,
  totalCount = 0,
  page = 1,
  perPage = 15,
  onPageChange,
  onSearch,
  onFilterStatus,
  onSuspend,
  onDelete,
}: TenantTableProps) => {
  const [statusFilter, setStatusFilter] = useState("all");

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: Tenant) => (
        <Link
          to={`/tenants/${item.uuid}`}
          className="font-medium hover:underline"
        >
          {item.name}
        </Link>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (item: Tenant) => item.plan || "No plan",
    },
    {
      key: "status",
      header: "Status",
      render: (item: Tenant) => <TenantStatusBadge status={item.status} />,
    },
    {
      key: "students_count",
      header: "Students",
      render: (item: Tenant) => item.students_count || 0,
    },
    {
      key: "created_at",
      header: "Created",
      render: (item: Tenant) => formatDate(item.created_at),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[150px]",
      render: (item: Tenant) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/tenants/${item.uuid}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {item.status !== "suspended" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSuspend?.(item.uuid)}
            >
              <Ban className="h-4 w-4 text-yellow-500" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(item.uuid)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            onFilterStatus?.(value);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={tenants}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TenantTable;
