import { useState, useMemo } from 'react';
import PageTitle from '@/components/common/PageTitle';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Download, RefreshCw, LogIn } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

interface LoginAuditEntry {
  id: string;
  user_name: string;
  user_email: string;
  role: string;
  ip_address: string;
  device: string;
  browser: string;
  location: string;
  status: 'success' | 'failed' | 'locked';
  timestamp: string;
}

const generateMockData = (): LoginAuditEntry[] => [
  {
    id: '1',
    user_name: 'Admin User',
    user_email: 'admin@lms.com',
    role: 'super_admin',
    ip_address: '192.168.1.100',
    device: 'Windows Desktop',
    browser: 'Chrome 125.0',
    location: 'New York, US',
    status: 'success',
    timestamp: '2026-06-29T08:30:00Z',
  },
  {
    id: '2',
    user_name: 'John Smith',
    user_email: 'john@example.com',
    role: 'tenant_admin',
    ip_address: '203.0.113.45',
    device: 'MacBook Pro',
    browser: 'Safari 18.0',
    location: 'San Francisco, US',
    status: 'success',
    timestamp: '2026-06-29T07:45:00Z',
  },
  {
    id: '3',
    user_name: 'Unknown User',
    user_email: 'unknown@malicious.com',
    role: 'guest',
    ip_address: '198.51.100.23',
    device: 'Linux Server',
    browser: 'Python Requests',
    location: 'Moscow, RU',
    status: 'failed',
    timestamp: '2026-06-29T06:15:00Z',
  },
  {
    id: '4',
    user_name: 'Sarah Williams',
    user_email: 'sarah@example.com',
    role: 'instructor',
    ip_address: '172.16.0.50',
    device: 'iPhone 15',
    browser: 'Safari 18.0',
    location: 'London, UK',
    status: 'success',
    timestamp: '2026-06-28T22:10:00Z',
  },
  {
    id: '5',
    user_name: 'Mike Johnson',
    user_email: 'mike@example.com',
    role: 'learner',
    ip_address: '10.0.0.75',
    device: 'Android Pixel 9',
    browser: 'Chrome Mobile 125.0',
    location: 'Berlin, DE',
    status: 'success',
    timestamp: '2026-06-28T19:30:00Z',
  },
  {
    id: '6',
    user_name: 'Mike Johnson',
    user_email: 'mike@example.com',
    role: 'learner',
    ip_address: '10.0.0.75',
    device: 'Android Pixel 9',
    browser: 'Chrome Mobile 125.0',
    location: 'Berlin, DE',
    status: 'locked',
    timestamp: '2026-06-28T19:25:00Z',
  },
  {
    id: '7',
    user_name: 'Emily Davis',
    user_email: 'emily@example.com',
    role: 'tenant_admin',
    ip_address: '192.168.1.200',
    device: 'Windows Laptop',
    browser: 'Edge 125.0',
    location: 'Toronto, CA',
    status: 'success',
    timestamp: '2026-06-28T16:00:00Z',
  },
  {
    id: '8',
    user_name: 'Bob Wilson',
    user_email: 'bob@example.com',
    role: 'learner',
    ip_address: '203.0.113.88',
    device: 'iPad Air',
    browser: 'Safari 18.0',
    location: 'Sydney, AU',
    status: 'failed',
    timestamp: '2026-06-28T14:20:00Z',
  },
  {
    id: '9',
    user_name: 'Admin User',
    user_email: 'admin@lms.com',
    role: 'super_admin',
    ip_address: '192.168.1.100',
    device: 'Windows Desktop',
    browser: 'Chrome 125.0',
    location: 'New York, US',
    status: 'success',
    timestamp: '2026-06-28T09:00:00Z',
  },
  {
    id: '10',
    user_name: 'Suspicious Actor',
    user_email: 'hacker@bruteforce.net',
    role: 'guest',
    ip_address: '45.33.32.156',
    device: 'Unknown',
    browser: 'Unknown',
    location: 'Beijing, CN',
    status: 'failed',
    timestamp: '2026-06-28T03:15:00Z',
  },
  {
    id: '11',
    user_name: 'Lisa Chen',
    user_email: 'lisa@example.com',
    role: 'instructor',
    ip_address: '172.16.0.100',
    device: 'MacBook Air',
    browser: 'Firefox 128.0',
    location: 'Singapore, SG',
    status: 'success',
    timestamp: '2026-06-27T23:45:00Z',
  },
  {
    id: '12',
    user_name: 'Tom Brown',
    user_email: 'tom@example.com',
    role: 'learner',
    ip_address: '10.0.0.150',
    device: 'Samsung Galaxy S25',
    browser: 'Samsung Internet',
    location: 'Seoul, KR',
    status: 'failed',
    timestamp: '2026-06-27T21:00:00Z',
  },
  {
    id: '13',
    user_name: 'Rachel Green',
    user_email: 'rachel@example.com',
    role: 'tenant_admin',
    ip_address: '192.168.5.50',
    device: 'Windows Desktop',
    browser: 'Chrome 124.0',
    location: 'Chicago, US',
    status: 'success',
    timestamp: '2026-06-27T18:30:00Z',
  },
  {
    id: '14',
    user_name: 'Tom Brown',
    user_email: 'tom@example.com',
    role: 'learner',
    ip_address: '10.0.0.150',
    device: 'Samsung Galaxy S25',
    browser: 'Samsung Internet',
    location: 'Seoul, KR',
    status: 'locked',
    timestamp: '2026-06-27T18:00:00Z',
  },
  {
    id: '15',
    user_name: 'David Park',
    user_email: 'david@example.com',
    role: 'instructor',
    ip_address: '203.0.113.120',
    device: 'Linux Desktop',
    browser: 'Firefox 127.0',
    location: 'Tokyo, JP',
    status: 'success',
    timestamp: '2026-06-27T15:15:00Z',
  },
  {
    id: '16',
    user_name: 'Admin User',
    user_email: 'admin@lms.com',
    role: 'super_admin',
    ip_address: '192.168.1.100',
    device: 'Windows Desktop',
    browser: 'Chrome 125.0',
    location: 'New York, US',
    status: 'success',
    timestamp: '2026-06-27T08:00:00Z',
  },
  {
    id: '17',
    user_name: 'Anonymous',
    user_email: 'anon@protonmail.com',
    role: 'guest',
    ip_address: '185.220.101.42',
    device: 'Tor Browser',
    browser: 'Firefox ESR 115.0',
    location: 'Unknown',
    status: 'failed',
    timestamp: '2026-06-27T05:30:00Z',
  },
  {
    id: '18',
    user_name: 'Sarah Williams',
    user_email: 'sarah@example.com',
    role: 'instructor',
    ip_address: '172.16.0.50',
    device: 'iPhone 15',
    browser: 'Safari 18.0',
    location: 'London, UK',
    status: 'success',
    timestamp: '2026-06-26T20:00:00Z',
  },
];

const ITEMS_PER_PAGE = 8;

const statusVariant = (status: string) => {
  switch (status) {
    case 'success': return 'success' as const;
    case 'failed': return 'destructive' as const;
    case 'locked': return 'warning' as const;
    default: return 'outline' as const;
  }
};

const roleVariant = (role: string) => {
  switch (role) {
    case 'super_admin': return 'default' as const;
    case 'tenant_admin': return 'secondary' as const;
    case 'instructor': return 'outline' as const;
    case 'learner': return 'outline' as const;
    default: return 'outline' as const;
  }
};

const formatRole = (role: string) => {
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const LoginAuditPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const allData = useMemo(() => generateMockData(), []);

  const filtered = statusFilter === 'all'
    ? allData
    : allData.filter((e) => e.status === statusFilter);

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (item: LoginAuditEntry) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <LogIn size={14} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{item.user_name}</p>
            <p className="text-xs text-muted-foreground">{item.user_email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: LoginAuditEntry) => (
        <Badge variant={roleVariant(item.role)} className="capitalize text-xs">
          {formatRole(item.role)}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: LoginAuditEntry) => (
        <Badge variant={statusVariant(item.status)} className="capitalize">
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'ip_address',
      header: 'IP Address',
      render: (item: LoginAuditEntry) => (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
          {item.ip_address}
        </code>
      ),
    },
    {
      key: 'device',
      header: 'Device',
      className: 'hidden md:table-cell',
      render: (item: LoginAuditEntry) => (
        <span className="text-sm text-muted-foreground">{item.device}</span>
      ),
    },
    {
      key: 'browser',
      header: 'Browser',
      className: 'hidden lg:table-cell',
      render: (item: LoginAuditEntry) => (
        <span className="text-sm text-muted-foreground">{item.browser}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      className: 'hidden xl:table-cell',
      render: (item: LoginAuditEntry) => (
        <span className="text-sm text-muted-foreground">{item.location}</span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      className: 'whitespace-nowrap',
      render: (item: LoginAuditEntry) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(item.timestamp)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle
        title="Login Audit"
        subtitle="Monitor and review all login attempts across the platform"
      >
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </PageTitle>

      <DataTable
        columns={columns}
        data={paginatedData}
        searchKey="user_name"
        searchPlaceholder="Search by user name or email..."
        totalCount={totalCount}
        page={page}
        perPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default LoginAuditPage;
