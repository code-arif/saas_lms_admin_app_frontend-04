import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Plus } from 'lucide-react';
import PermissionTable from '@/features/permissions/components/PermissionTable';
import PermissionForm from '@/features/permissions/components/PermissionForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { usePermissions, useCreatePermission, useUpdatePermission, useDeletePermission } from '@/features/permissions/hooks/usePermissions';
import type { Permission } from '@/features/permissions/services/permissionService';

const PermissionsPage = () => {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);

  const { data: response, isLoading } = usePermissions({ page, per_page: 50 });
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const deleteMutation = useDeletePermission();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const permissions = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <PageTitle title="Permissions" subtitle="Manage all system permissions">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Permission
        </Button>
      </PageTitle>

      <PermissionTable
        permissions={permissions}
        isLoading={isLoading}
        totalCount={meta?.total || 0}
        page={page}
        perPage={50}
        onPageChange={setPage}
        onEdit={setEditingPermission}
        onDelete={setDeleteUuid}
      />

      {/* Create Permission Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
            <DialogDescription>
              Create a new permission that can be assigned to roles.
            </DialogDescription>
          </DialogHeader>
          <PermissionForm
            onSubmit={(data) => {
              createMutation.mutate(data, {
                onSuccess: () => setCreateOpen(false),
              });
            }}
            onCancel={() => setCreateOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog open={!!editingPermission} onOpenChange={(open) => !open && setEditingPermission(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update the permission details.
            </DialogDescription>
          </DialogHeader>
          <PermissionForm
            initialData={editingPermission}
            onSubmit={(data) => {
              if (editingPermission) {
                updateMutation.mutate(
                  { uuid: editingPermission.uuid, data },
                  { onSuccess: () => setEditingPermission(null) }
                );
              }
            }}
            onCancel={() => setEditingPermission(null)}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
        title="Delete Permission"
        description="Are you sure you want to delete this permission? This action cannot be undone. Roles with this permission assigned may lose it."
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

export default PermissionsPage;
