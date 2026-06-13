import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CampaignTable from '@/features/campaigns/components/CampaignTable';
import CampaignForm from '@/features/campaigns/components/CampaignForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from '@/features/campaigns/hooks/useCampaigns';
import { Plus } from 'lucide-react';

const CampaignsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editUuid, setEditUuid] = useState<string | null>(null);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);

  const { data: response, isLoading } = useCampaigns({ per_page: 50 });
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const campaigns = response?.data || [];
  const editingCampaign = editUuid ? campaigns.find((c: any) => c.uuid === editUuid) : null;

  return (
    <div className="space-y-6">
      <PageTitle title="Campaigns" subtitle="Manage marketing campaigns">
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </PageTitle>

      <CampaignTable
        campaigns={campaigns}
        onEdit={(uuid) => { setEditUuid(uuid); setShowForm(true); }}
        onDelete={setDeleteUuid}
      />

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditUuid(null); }}>
        <DialogContent className="max-w-full sm:max-w-2xl mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle>{editUuid ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
          </DialogHeader>
          <CampaignForm
            initialData={editingCampaign}
            onSubmit={(data) => {
              if (editUuid) {
                updateMutation.mutate(
                  { uuid: editUuid, data },
                  { onSuccess: () => { setShowForm(false); setEditUuid(null); } }
                );
              } else {
                createMutation.mutate(data, { onSuccess: () => setShowForm(false) });
              }
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
        title="Delete Campaign"
        description="Are you sure you want to delete this campaign?"
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

export default CampaignsPage;
