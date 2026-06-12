import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Progress } from '@/components/ui/Progress';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { Building2, Users, BookOpen, GraduationCap, HardDrive, Trash2, Ban } from 'lucide-react';

interface TenantDetailProps {
  tenant: any;
  onSuspend?: () => void;
  onDelete?: () => void;
}

const TenantDetail = ({ tenant, onSuspend, onDelete }: TenantDetailProps) => {
  if (!tenant) return null;

  const storagePercentage = tenant.storage_limit
    ? Math.round((tenant.storage_used / tenant.storage_limit) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Tenant Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tenant Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{tenant.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Slug</p>
              <p className="font-medium">{tenant.slug}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Domain</p>
              <p className="font-medium">{tenant.domain || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={tenant.status === 'active' ? 'success' : tenant.status === 'suspended' ? 'destructive' : 'secondary'}>
                {tenant.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(tenant.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated</p>
              <p className="font-medium">{formatDate(tenant.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      {tenant.subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium">{tenant.subscription.plan_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={tenant.subscription.status === 'active' ? 'success' : 'secondary'}>
                  {tenant.subscription.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">{formatCurrency(tenant.subscription.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <p className="font-medium capitalize">{tenant.subscription.billing_cycle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold">{tenant.students_count || 0}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Students</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold">{tenant.courses_count || 0}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Courses</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold">{tenant.instructors_count || 0}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Instructors</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HardDrive className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold">{tenant.storage_used || 0} MB</p>
                <p className="text-xs md:text-sm text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </div>
          {tenant.storage_limit && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage Usage</span>
                <span>{storagePercentage}%</span>
              </div>
              <Progress value={storagePercentage} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {tenant.status !== 'suspended' && (
              <Button variant="outline" onClick={onSuspend}>
                <Ban className="h-4 w-4 mr-2" />
                Suspend Tenant
              </Button>
            )}
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Tenant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDetail;
