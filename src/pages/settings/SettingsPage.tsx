import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PlatformSettings from '@/features/settings/components/PlatformSettings';
import { useSettings, useUpdateSetting } from '@/features/settings/hooks/useSettings';

const SettingsPage = () => {
  const { data: response, isLoading } = useSettings();
  const updateMutation = useUpdateSetting();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const settings = response?.data;

  const handleSubmit = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      updateMutation.mutate({ key, value });
    });
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Settings" subtitle="Manage platform settings" />

      <PlatformSettings
        settings={settings}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
};

export default SettingsPage;
