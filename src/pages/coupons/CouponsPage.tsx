import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CouponTable from '@/features/coupons/components/CouponTable';
import CouponForm from '@/features/coupons/components/CouponForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useCoupons, useCreateCoupon, useDeleteCoupon } from '@/features/coupons/hooks/useCoupons';
import { Plus } from 'lucide-react';

const CouponsPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);

  const { data: response, isLoading } = useCoupons({ per_page: 50 });
  const createMutation = useCreateCoupon();
  const deleteMutation = useDeleteCoupon();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const coupons = response?.data || [];

  return (
    <div className="space-y-6">
      <PageTitle title="Coupons" subtitle="Manage discount coupons">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </PageTitle>

      <CouponTable coupons={coupons} onDelete={setDeleteUuid} />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-full sm:max-w-2xl mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle>Create Coupon</DialogTitle>
          </DialogHeader>
          <CouponForm
            onSubmit={(data) => {
              createMutation.mutate(data, { onSuccess: () => setShowCreate(false) });
            }}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
        title="Delete Coupon"
        description="Are you sure you want to delete this coupon?"
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteUuid) {
            deleteMutation.mutate(deleteUuid, { onSuccess: () => setDeleteUuid(null) });
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CouponsPage;
