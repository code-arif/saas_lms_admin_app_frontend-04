import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Plus, Eye, Trash2, GraduationCap } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

interface Learner {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  courses_enrolled: number;
  courses_completed: number;
  last_active: string;
  joined_at: string;
}

const mockLearners: Learner[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'active',
    courses_enrolled: 5,
    courses_completed: 3,
    last_active: '2026-06-10T14:30:00Z',
    joined_at: '2026-01-15T08:00:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'active',
    courses_enrolled: 3,
    courses_completed: 1,
    last_active: '2026-06-09T09:15:00Z',
    joined_at: '2026-02-20T10:00:00Z',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    status: 'inactive',
    courses_enrolled: 2,
    courses_completed: 0,
    last_active: '2026-05-01T11:00:00Z',
    joined_at: '2026-03-10T12:00:00Z',
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    status: 'active',
    courses_enrolled: 8,
    courses_completed: 6,
    last_active: '2026-06-11T16:45:00Z',
    joined_at: '2025-11-05T09:00:00Z',
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    status: 'suspended',
    courses_enrolled: 1,
    courses_completed: 0,
    last_active: '2026-04-20T08:30:00Z',
    joined_at: '2026-04-01T14:00:00Z',
  },
  {
    id: '6',
    name: 'Frank Brown',
    email: 'frank@example.com',
    status: 'active',
    courses_enrolled: 4,
    courses_completed: 2,
    last_active: '2026-06-08T13:00:00Z',
    joined_at: '2026-01-25T11:00:00Z',
  },
  {
    id: '7',
    name: 'Grace Lee',
    email: 'grace@example.com',
    status: 'active',
    courses_enrolled: 6,
    courses_completed: 4,
    last_active: '2026-06-12T10:00:00Z',
    joined_at: '2025-12-01T08:00:00Z',
  },
  {
    id: '8',
    name: 'Henry Taylor',
    email: 'henry@example.com',
    status: 'inactive',
    courses_enrolled: 2,
    courses_completed: 1,
    last_active: '2026-03-15T15:00:00Z',
    joined_at: '2026-02-10T09:00:00Z',
  },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success' as const;
    case 'inactive': return 'secondary' as const;
    case 'suspended': return 'destructive' as const;
    default: return 'outline' as const;
  }
};

const LearnersPage = () => {
  const [learners, setLearners] = useState<Learner[]>(mockLearners);
  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'active' as Learner['status'],
  });

  const handleAddLearner = () => {
    const newLearner: Learner = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      status: formData.status,
      courses_enrolled: 0,
      courses_completed: 0,
      last_active: new Date().toISOString(),
      joined_at: new Date().toISOString(),
    };
    setLearners((prev) => [newLearner, ...prev]);
    setAddOpen(false);
    setFormData({ name: '', email: '', status: 'active' });
  };

  const openAddDialog = () => {
    setFormData({ name: '', email: '', status: 'active' });
    setAddOpen(true);
  };

  const columns = [
    {
      key: 'name',
      header: 'Learner',
      render: (item: Learner) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <GraduationCap size={16} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Learner) => (
        <Badge variant={statusVariant(item.status)} className="capitalize">
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'courses_enrolled',
      header: 'Enrolled',
      render: (item: Learner) => (
        <span className="font-medium">{item.courses_enrolled}</span>
      ),
    },
    {
      key: 'courses_completed',
      header: 'Completed',
      render: (item: Learner) => (
        <span className="font-medium">{item.courses_completed}</span>
      ),
    },
    {
      key: 'last_active',
      header: 'Last Active',
      render: (item: Learner) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(item.last_active)}
        </span>
      ),
    },
    {
      key: 'joined_at',
      header: 'Joined',
      render: (item: Learner) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(item.joined_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-[100px]',
      render: (item: Learner) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Learners" subtitle="Manage all learners on the platform">
        <Button size="sm" onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Learner
        </Button>
      </PageTitle>

      {/* Add Learner Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Learner</DialogTitle>
            <DialogDescription>
              Create a new learner account on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="learner-name">Full Name</Label>
              <Input
                id="learner-name"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learner-email">Email</Label>
              <Input
                id="learner-email"
                type="email"
                placeholder="e.g., john@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as Learner['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddLearner}
                disabled={!formData.name || !formData.email}
              >
                Add Learner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={learners}
        searchKey="name"
        searchPlaceholder="Search learners..."
        totalCount={learners.length}
        page={1}
        perPage={15}
      />
    </div>
  );
};

export default LearnersPage;
