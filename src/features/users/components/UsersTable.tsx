import { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Eye, Trash2, Ban, CheckCircle, Search } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import type { User } from '@/features/users/services/userService';

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilterRole?: (role: string) => void;
  onView?: (user: User) => void;
  onSuspend?: (uuid: string) => void;
  onActivate?: (uuid: string) => void;
  onDelete?: (uuid: string) => void;
}

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case 'super_admin': return 'default' as const;
    case 'tenant_admin': return 'success' as const;
    case 'instructor': return 'secondary' as const;
    case 'student': return 'outline' as const;
    default: return 'outline' as const;
  }
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success' as const;
    case 'inactive': return 'secondary' as const;
    case 'suspended': return 'destructive' as const;
    default: return 'outline' as const;
  }
};

const UsersTable = ({
  users,
  isLoading,
  totalCount = 0,
  page = 1,
  perPage = 15,
  onPageChange,
  onSearch,
  onFilterRole,
  onView,
  onSuspend,
  onActivate,
  onDelete,
}: UsersTableProps) => {
  const [roleFilter, setRoleFilter] = useState('all');

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (item: User) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            {item.avatar ? (
              <img src={item.avatar} alt={item.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                {item.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground truncate">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: User) => (
        <Badge variant={roleBadgeVariant(item.role)} className="capitalize">
          {item.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: User) => (
        <Badge variant={statusBadgeVariant(item.status)} className="capitalize">
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'tenant_name',
      header: 'Tenant',
      render: (item: User) => (
        <span className="text-sm text-muted-foreground">
          {item.tenant_name || 'Platform'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (item: User) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[140px]',
      render: (item: User) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(item)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {item.status === 'suspended' ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onActivate?.(item.uuid)}
              title="Activate user"
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSuspend?.(item.uuid)}
              title="Suspend user"
            >
              <Ban className="h-4 w-4 text-yellow-500" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(item.uuid)}
            title="Delete user"
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
            placeholder="Search users..."
            className="pl-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value);
            onFilterRole?.(value);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={users}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersTable;
