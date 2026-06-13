import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Plus, Shield } from 'lucide-react';
import RoleTable from '@/features/roles/components/RoleTable';
import RoleForm from '@/features/roles/components/RoleForm';
import PermissionAssigner from '@/features/roles/components/PermissionAssigner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '@/features/roles/hooks/useRoles';
import type { Role } from '@/features/roles/services/roleService';

const RolesPage = () => {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);

  const { data: response, isLoading } = useRoles({ page, per_page: 15 });
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const roles = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <PageTitle title="Roles" subtitle="Manage user roles and permissions">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </PageTitle>

      <RoleTable
        roles={roles}
        isLoading={isLoading}
        totalCount={meta?.total || 0}
        page={page}
        perPage={15}
        onPageChange={setPage}
        onEdit={setEditingRole}
        onDelete={setDeleteUuid}
      />

      {/* Create Role Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>
              Create a new role to assign to users.
            </DialogDescription>
          </DialogHeader>
          <RoleForm
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

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role details and manage its permissions.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="details" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">
                Details
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <Shield className="h-4 w-4 mr-1.5" />
                Permissions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <RoleForm
                initialData={editingRole}
                onSubmit={(data) => {
                  if (editingRole) {
                    updateMutation.mutate(
                      { uuid: editingRole.uuid, data },
                      { onSuccess: () => setEditingRole(null) }
                    );
                  }
                }}
                onCancel={() => setEditingRole(null)}
                isLoading={updateMutation.isPending}
              />
            </TabsContent>
            <TabsContent value="permissions" className="mt-4">
              {editingRole && <PermissionAssigner roleUuid={editingRole.uuid} />}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone. Users assigned to this role may be affected."
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

export default RolesPage;
