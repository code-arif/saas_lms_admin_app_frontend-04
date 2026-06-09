import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatDate';

interface Tenant {
  uuid: string;
  name: string;
  plan: string;
  status: string;
  created_at: string;
}

interface RecentTenantsProps {
  tenants: Tenant[];
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success' as const;
    case 'trial': return 'default' as const;
    case 'suspended': return 'destructive' as const;
    case 'cancelled': return 'secondary' as const;
    default: return 'outline' as const;
  }
};

const RecentTenants = ({ tenants }: RecentTenantsProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No tenants yet.
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant) => (
                <TableRow key={tenant.uuid}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.plan || 'No plan'}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(tenant.status)}>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(tenant.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentTenants;
