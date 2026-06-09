import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TenantDetail from '@/features/tenants/components/TenantDetail';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SuspendDialog from '@/features/tenants/components/SuspendDialog';
import { useTenant, useDeleteTenant, useSuspendTenant } from '@/features/tenants/hooks/useTenants';
import { useState } from 'react';

const TenantDetailPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [showSuspend, setShowSuspend] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { data: response, isLoading } = useTenant(uuid || '');
  const suspendMutation = useSuspendTenant();
  const deleteMutation = useDeleteTenant();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const tenant = response?.data;

  return (
    <div className="space-y-6">
      <PageTitle
        title={tenant?.name || 'Tenant Details'}
        subtitle={`Viewing details for ${tenant?.slug || ''}`}
      />

      <TenantDetail
        tenant={tenant}
        onSuspend={() => setShowSuspend(true)}
        onDelete={() => setShowDelete(true)}
      />

      <SuspendDialog
        open={showSuspend}
        onOpenChange={setShowSuspend}
        onConfirm={() => {
          if (uuid) {
            suspendMutation.mutate(uuid, {
              onSuccess: () => setShowSuspend(false),
            });
          }
        }}
        isLoading={suspendMutation.isPending}
      />

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete Tenant"
        description="Are you sure you want to delete this tenant? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (uuid) {
            deleteMutation.mutate(uuid, {
              onSuccess: () => navigate('/tenants'),
            });
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default TenantDetailPage;
