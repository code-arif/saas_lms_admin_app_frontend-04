import PageTitle from '@/components/common/PageTitle';
import SupportChat from '@/features/support/components/SupportChat';

const SupportPage = () => {
  return (
    <div className="space-y-4">
      <PageTitle
        title="Tenant Support"
        subtitle="Manage and respond to tenant support requests"
      />
      <SupportChat />
    </div>
  );
};

export default SupportPage;
