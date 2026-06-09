import { useParams, useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PlanForm from '@/features/plans/components/PlanForm';
import { usePlans, useCreatePlan, useUpdatePlan } from '@/features/plans/hooks/usePlans';

const PlanFormPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const isEditing = !!uuid;

  const { data: plansResponse, isLoading: plansLoading } = usePlans();
  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();

  const existingPlan = isEditing
    ? plansResponse?.data?.find((p: any) => p.uuid === uuid)
    : undefined;

  const handleSubmit = (data: any) => {
    if (isEditing && uuid) {
      updateMutation.mutate(
        { uuid, data },
        { onSuccess: () => navigate('/plans') }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => navigate('/plans') });
    }
  };

  if (isEditing && plansLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title={isEditing ? 'Edit Plan' : 'Create Plan'}
        subtitle={isEditing ? `Editing ${existingPlan?.name || ''}` : 'Create a new subscription plan'}
      />

      <PlanForm
        initialData={existingPlan}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default PlanFormPage;
