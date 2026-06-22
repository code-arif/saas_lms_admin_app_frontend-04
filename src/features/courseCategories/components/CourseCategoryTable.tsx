import { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import { Search, Edit, Trash2, Layers, Folder } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import type { CourseCategory } from '../types/courseCategory.types';

interface CourseCategoryTableProps {
  categories: CourseCategory[];
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilterActive?: (value: string) => void;
  onEdit?: (category: CourseCategory) => void;
  onDelete?: (uuid: string) => void;
  onToggle?: (uuid: string) => void;
  togglingUuid?: string | null;
}

const CourseCategoryTable = ({
  categories,
  isLoading,
  totalCount = 0,
  page = 1,
  perPage = 15,
  onPageChange,
  onSearch,
  onFilterActive,
  onEdit,
  onDelete,
  onToggle,
  togglingUuid,
}: CourseCategoryTableProps) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: CourseCategory) => (
        <div className="flex items-center gap-3">
          {item.icon_url ? (
            <img
              src={item.icon_url}
              alt=""
              className="h-5 w-5 shrink-0 rounded"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted"
              style={item.color ? { backgroundColor: item.color + '20', color: item.color } : undefined}
            >
              <Folder className="h-3.5 w-3.5" />
            </div>
          )}
          <div className="flex items-center gap-2">
            {item.parent_id && (
              <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="font-medium">{item.name}</span>
            <code className="text-xs text-muted-foreground ml-1 hidden lg:inline">
              {item.slug}
            </code>
          </div>
        </div>
      ),
    },
    {
      key: 'parent',
      header: 'Parent',
      className: 'w-[150px]',
      render: (item: CourseCategory) => (
        <span className="text-sm text-muted-foreground">
          {item.parent?.name || '—'}
        </span>
      ),
    },
    {
      key: 'children',
      header: 'Subcategories',
      className: 'w-[110px] text-center',
      render: (item: CourseCategory) => {
        const count = item.children?.length || 0;
        return (
          <span className="text-sm">
            {count > 0 ? (
              <Badge variant="outline" className="font-mono">
                {count}
              </Badge>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </span>
        );
      },
    },
    {
      key: 'sort_order',
      header: 'Order',
      className: 'w-[70px] text-center',
    },
    {
      key: 'is_active',
      header: 'Status',
      className: 'w-[115px]',
      render: (item: CourseCategory) => {
        const isToggling = togglingUuid === item.uuid;
        return (
          <button
            onClick={() => onToggle?.(item.uuid)}
            disabled={!!togglingUuid}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              item.is_active
                ? 'border-green-500/30 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-500 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50'
                : 'border-muted-foreground/20 bg-muted/50 text-muted-foreground hover:bg-muted hover:border-muted-foreground/40 dark:hover:bg-muted/80'
            )}
          >
            {isToggling ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  item.is_active ? 'bg-green-500' : 'bg-muted-foreground/50'
                )}
              />
            )}
            {item.is_active ? 'Active' : 'Inactive'}
          </button>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      className: 'w-[150px]',
      render: (item: CourseCategory) => (
        <span className="text-sm text-muted-foreground" title={formatDateTime(item.created_at)}>
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      key: 'updated_at',
      header: 'Updated',
      className: 'w-[150px]',
      render: (item: CourseCategory) => (
        <span className="text-sm text-muted-foreground" title={formatDateTime(item.updated_at)}>
          {item.updated_at ? formatDate(item.updated_at) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[100px]',
      render: (item: CourseCategory) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit?.(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete?.(item.uuid)}>
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
            placeholder="Search categories..."
            className="pl-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <Select
          value={activeFilter}
          onValueChange={(value) => {
            setActiveFilter(value);
            onFilterActive?.(value);
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {/* Search & Filter skeleton */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Skeleton className="h-10 flex-1 max-w-full sm:max-w-sm rounded-md" />
            <Skeleton className="h-10 w-full sm:w-[160px] rounded-md" />
          </div>

          {/* Table skeleton */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[150px]">Parent</TableHead>
                  <TableHead className="w-[110px] text-center">Subcategories</TableHead>
                  <TableHead className="w-[70px] text-center">Order</TableHead>
                  <TableHead className="w-[115px]">Status</TableHead>
                  <TableHead className="w-[150px]">Created</TableHead>
                  <TableHead className="w-[150px]">Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 shrink-0 rounded" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Skeleton className="h-5 w-8 rounded-md" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-6 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          totalCount={totalCount}
          page={page}
          perPage={perPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default CourseCategoryTable;
