import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import PlanTable from '@/features/plans/components/PlanTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { usePlans, useDeletePlan } from '@/features/plans/hooks/usePlans';
import { Plus } from 'lucide-react';

const PlanSkeleton = () => (
  <>
    <style>{`
      @keyframes skeletonEnter {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card
          key={i}
          style={{
            animation: `skeletonEnter 0.4s ease-out ${i * 120}ms both`,
          }}
        >
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pricing skeleton */}
            <div className="text-center py-4 space-y-1">
              <Skeleton className="h-9 w-24 mx-auto" />
              <Skeleton className="h-3 w-14 mx-auto" />
              <Skeleton className="h-3 w-32 mx-auto mt-1" />
            </div>

            {/* Limits skeleton */}
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>

            {/* Features skeleton */}
            <div className="space-y-2 pt-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center gap-2 pt-4">
              <Skeleton className="h-9 flex-1 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

const PlansPage = () => {
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const { data: response, isLoading } = usePlans();
  const deleteMutation = useDeletePlan();

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

      {isLoading ? <PlanSkeleton /> : <PlanTable plans={plans} onDelete={setDeleteUuid} />}

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
