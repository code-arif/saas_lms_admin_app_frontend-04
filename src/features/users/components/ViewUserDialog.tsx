import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Mail, Calendar, Shield, User as UserIcon, Activity, Building2, FileText } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import type { User } from '@/features/users/services/userService';

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case 'super_admin': return 'default' as const;
    case 'tenant_admin': return 'success' as const;
    case 'instructor': return 'secondary' as const;
    case 'student': return 'outline' as const;
    default: return 'outline' as const;
  }
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success' as const;
    case 'inactive': return 'secondary' as const;
    case 'suspended': return 'destructive' as const;
    default: return 'outline' as const;
  }
};

const ViewUserDialog = ({ open, onOpenChange, user }: ViewUserDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about this user account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center rounded-full">
                  <UserIcon size={24} className="text-muted-foreground" />
                </div>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{user.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={roleBadgeVariant(user.role)} className="capitalize">
                  {user.role.replace('_', ' ')}
                </Badge>
                <Badge variant={statusBadgeVariant(user.status)} className="capitalize">
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Mail size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Shield size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Activity size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium capitalize">{user.status}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Tenant</p>
                <p className="text-sm font-medium truncate">{user.tenant_name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Activity size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Last Active</p>
                <p className="text-sm font-medium">
                  {user.last_active ? formatDate(user.last_active) : 'Never'}
                </p>
              </div>
            </div>
          </div>

          {user.bio && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bio</p>
                  <p className="text-sm">{user.bio}</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
