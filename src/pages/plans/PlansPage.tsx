import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PlanTable from '@/features/plans/components/PlanTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { usePlans, useDeletePlan } from '@/features/plans/hooks/usePlans';
import { Plus } from 'lucide-react';

const PlansPage = () => {
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const { data: response, isLoading } = usePlans();
  const deleteMutation = useDeletePlan();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const plans = response?.data || [];

  return (
    <div className="space-y-6">
      <PageTitle title="Plans" subtitle="Manage subscription plans">
        <Link to="/plans/create">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </Link>
      </PageTitle>

      <PlanTable plans={plans} onDelete={setDeleteUuid} />

      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
        title="Delete Plan"
        description="Are you sure you want to delete this plan? This action cannot be undone."
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

export default PlansPage;
