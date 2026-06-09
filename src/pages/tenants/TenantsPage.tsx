import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import TenantTable from '@/features/tenants/components/TenantTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SuspendDialog from '@/features/tenants/components/SuspendDialog';
import { useTenants, useDeleteTenant, useSuspendTenant } from '@/features/tenants/hooks/useTenants';
import { useDebounce } from '@/hooks/useDebounce';

const TenantsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [suspendUuid, setSuspendUuid] = useState<string | null>(null);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data: response, isLoading } = useTenants({
    page,
    per_page: 15,
    search: debouncedSearch,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const suspendMutation = useSuspendTenant();
  const deleteMutation = useDeleteTenant();

  const tenants = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Tenants"
        subtitle="Manage all tenants on the platform"
      />

      <TenantTable
        tenants={tenants}
        isLoading={isLoading}
        totalCount={meta?.total || 0}
        page={page}
        perPage={15}
        onPageChange={setPage}
        onSearch={setSearch}
        onFilterStatus={setStatusFilter}
        onSuspend={setSuspendUuid}
        onDelete={setDeleteUuid}
      />

      <SuspendDialog
        open={!!suspendUuid}
        onOpenChange={(open) => !open && setSuspendUuid(null)}
        onConfirm={() => {
          if (suspendUuid) {
            suspendMutation.mutate(suspendUuid, {
              onSuccess: () => setSuspendUuid(null),
            });
          }
        }}
        isLoading={suspendMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
        title="Delete Tenant"
        description="Are you sure you want to delete this tenant? This action cannot be undone and will permanently remove all data associated with this tenant."
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

export default TenantsPage;
