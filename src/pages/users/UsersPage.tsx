import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import UsersTable from '@/features/users/components/UsersTable';
import CreateUserDialog from '@/features/users/components/CreateUserDialog';
import ViewUserDialog from '@/features/users/components/ViewUserDialog';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/AlertDialog';
import { useUsers, useDeleteUser, useSuspendUser, useActivateUser } from '@/features/users/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import type { User } from '@/features/users/services/userService';

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [suspendUuid, setSuspendUuid] = useState<string | null>(null);
  const [activateUuid, setActivateUuid] = useState<string | null>(null);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data: response, isLoading } = useUsers({
    page,
    per_page: 15,
    search: debouncedSearch,
    role: roleFilter === 'all' ? undefined : roleFilter,
  });

  const deleteMutation = useDeleteUser();
  const suspendMutation = useSuspendUser();
  const activateMutation = useActivateUser();

  const users = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <PageTitle title="Users" subtitle="Manage all platform users and their roles">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </PageTitle>

      <UsersTable
        users={users}
        isLoading={isLoading}
        totalCount={meta?.total || 0}
        page={page}
        perPage={15}
        onPageChange={setPage}
        onSearch={setSearch}
        onFilterRole={setRoleFilter}
        onView={setViewUser}
        onSuspend={setSuspendUuid}
        onActivate={setActivateUuid}
        onDelete={setDeleteUuid}
      />

      {/* Create User Modal */}
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {/* View User Modal */}
      <ViewUserDialog
        open={!!viewUser}
        onOpenChange={(open) => !open && setViewUser(null)}
        user={viewUser}
      />

      {/* Suspend Confirmation */}
      <AlertDialog open={!!suspendUuid} onOpenChange={(open) => !open && setSuspendUuid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend this user? They will lose access to the platform immediately.
              You can reactivate them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={suspendMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (suspendUuid) {
                  suspendMutation.mutate(suspendUuid, {
                    onSuccess: () => setSuspendUuid(null),
                  });
                }
              }}
              disabled={suspendMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {suspendMutation.isPending ? 'Suspending...' : 'Suspend User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Confirmation */}
      <AlertDialog open={!!activateUuid} onOpenChange={(open) => !open && setActivateUuid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate this user? They will regain access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={activateMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (activateUuid) {
                  activateMutation.mutate(activateUuid, {
                    onSuccess: () => setActivateUuid(null),
                  });
                }
              }}
              disabled={activateMutation.isPending}
            >
              {activateMutation.isPending ? 'Activating...' : 'Activate User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will permanently remove all data associated with this user."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteUuid) {
            deleteMutation.mutate(deleteUuid, {
              onSuccess: () => setDeleteUuid(null),
            });
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default UsersPage;
