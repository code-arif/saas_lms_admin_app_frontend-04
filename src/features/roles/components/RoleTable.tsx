import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2, Shield } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import type { Role } from '@/features/roles/services/roleService';

interface RoleTableProps {
  roles: Role[];
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onEdit?: (role: Role) => void;
  onDelete?: (uuid: string) => void;
}

const RoleTable = ({
  roles,
  isLoading,
  totalCount = 0,
  page = 1,
  perPage = 15,
  onPageChange,
  onEdit,
  onDelete,
}: RoleTableProps) => {
  const columns = [
    {
      key: 'name',
      header: 'Role',
      render: (item: Role) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="h-4 w-4 text-primary" />
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
      render: (item: Role) => (
        <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
          {item.description || '—'}
        </span>
      ),
    },
    {
      key: 'guard_name',
      header: 'Guard',
      render: (item: Role) => (
        <Badge variant="secondary" className="capitalize">
          {item.guard_name}
        </Badge>
      ),
    },
    {
      key: 'permissions_count',
      header: 'Permissions',
      render: (item: Role) => (
        <span className="text-sm font-medium">{item.permissions_count}</span>
      ),
    },
    {
      key: 'is_system',
      header: 'Type',
      render: (item: Role) => (
        <Badge variant={item.is_system ? 'default' : 'outline'}>
          {item.is_system ? 'System' : 'Custom'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (item: Role) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[100px]',
      render: (item: Role) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(item)}
            title="Edit role"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {!item.is_system && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(item.uuid)}
              title="Delete role"
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
      data={roles}
      totalCount={totalCount}
      page={page}
      perPage={perPage}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
};

export default RoleTable;
