import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2, Lock, Globe } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import type { Permission } from '@/features/permissions/services/permissionService';

interface PermissionTableProps {
  permissions: Permission[];
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onEdit?: (permission: Permission) => void;
  onDelete?: (uuid: string) => void;
}

const PermissionTable = ({
  permissions,
  isLoading,
  totalCount = 0,
  page = 1,
  perPage = 15,
  onPageChange,
  onEdit,
  onDelete,
}: PermissionTableProps) => {
  const columns = [
    {
      key: 'name',
      header: 'Permission',
      render: (item: Permission) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground truncate">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: Permission) => (
        <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
          {item.description || '—'}
        </span>
      ),
    },
    {
      key: 'group',
      header: 'Group',
      render: (item: Permission) => (
        <Badge variant="secondary" className="capitalize">
          <Globe className="h-3 w-3 mr-1" />
          {item.group}
        </Badge>
      ),
    },
    {
      key: 'guard_name',
      header: 'Guard',
      render: (item: Permission) => (
        <span className="text-sm text-muted-foreground capitalize">{item.guard_name}</span>
      ),
    },
    {
      key: 'is_system',
      header: 'Type',
      render: (item: Permission) => (
        <Badge variant={item.is_system ? 'default' : 'outline'}>
          {item.is_system ? 'System' : 'Custom'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (item: Permission) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[100px]',
      render: (item: Permission) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(item)}
            title="Edit permission"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {!item.is_system && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(item.uuid)}
              title="Delete permission"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={permissions}
      totalCount={totalCount}
      page={page}
      perPage={perPage}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
};

export default PermissionTable;
