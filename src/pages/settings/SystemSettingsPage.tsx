import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Users, Wrench, Lock, Bell, AlertTriangle, Database } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { useSettings, useUpdateSetting } from '@/features/settings/hooks/useSettings';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';

const systemSettingsSchema = z.object({
  registration_enabled: z.boolean(),
  maintenance_mode: z.boolean(),
  maintenance_message: z.string().optional(),
  session_timeout_minutes: z.number().min(1, 'Must be at least 1 minute'),
  max_login_attempts: z.number().min(1, 'Must be at least 1'),
  password_min_length: z.number().min(6, 'Must be at least 6 characters'),
  require_2fa: z.boolean(),
  allow_tenant_custom_domain: z.boolean(),
  max_tenants_per_admin: z.number().min(0),
  enable_audit_log: z.boolean(),
  log_retention_days: z.number().min(1, 'Must be at least 1 day'),
  api_rate_limit_per_minute: z.number().min(1),
  enable_auto_backup: z.boolean(),
  backup_frequency: z.string().optional(),
});

type SystemSettingsFormValues = z.infer<typeof systemSettingsSchema>;

const SystemSettingsPage = () => {
  const { data: response, isLoading } = useSettings();
  const updateMutation = useUpdateSetting();

  const settings = response?.data;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      registration_enabled: settings?.registration_enabled ?? true,
      maintenance_mode: settings?.maintenance_mode ?? false,
      maintenance_message: settings?.maintenance_message || '',
      session_timeout_minutes: settings?.session_timeout_minutes ?? 60,
      max_login_attempts: settings?.max_login_attempts ?? 5,
      password_min_length: settings?.password_min_length ?? 8,
      require_2fa: settings?.require_2fa ?? false,
      allow_tenant_custom_domain: settings?.allow_tenant_custom_domain ?? false,
      max_tenants_per_admin: settings?.max_tenants_per_admin ?? 50,
      enable_audit_log: settings?.enable_audit_log ?? true,
      log_retention_days: settings?.log_retention_days ?? 90,
      api_rate_limit_per_minute: settings?.api_rate_limit_per_minute ?? 60,
      enable_auto_backup: settings?.enable_auto_backup ?? false,
      backup_frequency: settings?.backup_frequency || 'daily',
    },
  });

  const onSubmit = (data: SystemSettingsFormValues) => {
    Object.entries(data).forEach(([key, value]) => {
      const settingsAny = settings as any;
      if (value !== undefined && value !== settingsAny?.[key]) {
        updateMutation.mutate({ key, value });
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const maintenanceMode = watch('maintenance_mode');

  return (
    <div className="space-y-6">
      <PageTitle title="System Settings" subtitle="Manage system-wide configurations and security preferences" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Registration & Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Users size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Registration & Access</CardTitle>
                <CardDescription>Control tenant registration and access policies</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="registration_enabled">Enable Tenant Registration</Label>
                <p className="text-xs text-muted-foreground">Allow new tenants to sign up for the platform</p>
              </div>
              <Checkbox
                id="registration_enabled"
                checked={watch('registration_enabled')}
                onCheckedChange={(checked: boolean) => setValue('registration_enabled', checked === true)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow_tenant_custom_domain">Custom Domains</Label>
                <p className="text-xs text-muted-foreground">Allow tenants to use custom domains</p>
              </div>
              <Checkbox
                id="allow_tenant_custom_domain"
                checked={watch('allow_tenant_custom_domain')}
                onCheckedChange={(checked: boolean) => setValue('allow_tenant_custom_domain', checked === true)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_tenants_per_admin">Max Tenants Per Admin</Label>
                <Input
                  id="max_tenants_per_admin"
                  type="number"
                  {...register('max_tenants_per_admin', { valueAsNumber: true })}
                  className="w-full sm:w-40"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Configure authentication and security policies</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session_timeout_minutes">Session Timeout (minutes)</Label>
                <Input
                  id="session_timeout_minutes"
                  type="number"
                  {...register('session_timeout_minutes', { valueAsNumber: true })}
                  className="w-full sm:w-32"
                />
                {errors.session_timeout_minutes && <p className="text-sm text-destructive">{errors.session_timeout_minutes.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                <Input
                  id="max_login_attempts"
                  type="number"
                  {...register('max_login_attempts', { valueAsNumber: true })}
                  className="w-full sm:w-32"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_min_length">Min Password Length</Label>
                <Input
                  id="password_min_length"
                  type="number"
                  {...register('password_min_length', { valueAsNumber: true })}
                  className="w-full sm:w-32"
                />
                {errors.password_min_length && <p className="text-sm text-destructive">{errors.password_min_length.message}</p>}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require_2fa">Require Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Enforce 2FA for all admin accounts</p>
              </div>
              <Checkbox
                id="require_2fa"
                checked={watch('require_2fa')}
                onCheckedChange={(checked: boolean) => setValue('require_2fa', checked === true)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card className={maintenanceMode ? 'border-destructive/50' : ''}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className={`h-9 w-9 rounded-lg ${maintenanceMode ? 'bg-destructive/10' : 'bg-primary/10'} flex items-center justify-center shrink-0`}>
                <Wrench size={18} className={maintenanceMode ? 'text-destructive' : 'text-primary'} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Maintenance</CardTitle>
                  {maintenanceMode && <Badge variant="destructive">Active</Badge>}
                </div>
                <CardDescription>Control maintenance mode and system availability</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">Prevent all tenant access to the platform</p>
              </div>
              <Checkbox
                id="maintenance_mode"
                checked={maintenanceMode}
                onCheckedChange={(checked: boolean) => setValue('maintenance_mode', checked === true)}
              />
            </div>
            {maintenanceMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="maintenance_message">Maintenance Message</Label>
                  <Input
                    id="maintenance_message"
                    {...register('maintenance_message')}
                    placeholder="We're currently undergoing scheduled maintenance..."
                  />
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                  <AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" />
                  <p className="text-destructive">
                    Warning: Maintenance mode will prevent all tenants and their users from accessing their dashboards.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Audit & Logging */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Audit & Logging</CardTitle>
                <CardDescription>Configure audit trail and log retention</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_audit_log">Enable Audit Log</Label>
                <p className="text-xs text-muted-foreground">Track all administrative actions</p>
              </div>
              <Checkbox
                id="enable_audit_log"
                checked={watch('enable_audit_log')}
                onCheckedChange={(checked: boolean) => setValue('enable_audit_log', checked === true)}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="log_retention_days">Log Retention (days)</Label>
                <Input
                  id="log_retention_days"
                  type="number"
                  {...register('log_retention_days', { valueAsNumber: true })}
                  className="w-full sm:w-40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_rate_limit_per_minute">API Rate Limit (requests/min)</Label>
                <Input
                  id="api_rate_limit_per_minute"
                  type="number"
                  {...register('api_rate_limit_per_minute', { valueAsNumber: true })}
                  className="w-full sm:w-40"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Database size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Backup</CardTitle>
                <CardDescription>Configure automatic backup settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_auto_backup">Enable Automatic Backup</Label>
                <p className="text-xs text-muted-foreground">Automatically backup system data</p>
              </div>
              <Checkbox
                id="enable_auto_backup"
                checked={watch('enable_auto_backup')}
                onCheckedChange={(checked: boolean) => setValue('enable_auto_backup', checked === true)}
              />
            </div>
            {watch('enable_auto_backup') && (
              <div className="space-y-2">
                <Label htmlFor="backup_frequency">Backup Frequency</Label>
                <Select
                  defaultValue={watch('backup_frequency')}
                  onValueChange={(value) => setValue('backup_frequency', value)}
                >
                  <SelectTrigger id="backup_frequency" className="w-full sm:w-48">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">Reset</Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettingsPage;
