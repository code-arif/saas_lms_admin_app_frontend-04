import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';

const settingsSchema = z.object({
  platform_name: z.string().min(1, 'Platform name is required'),
  platform_description: z.string().optional(),
  support_email: z.string().email('Invalid email'),
  default_currency: z.string().min(1, 'Currency is required'),
  default_timezone: z.string().min(1, 'Timezone is required'),
  maintenance_mode: z.boolean(),
  registration_enabled: z.boolean(),
  trial_days_default: z.number().min(0),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface PlatformSettingsProps {
  settings: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const PlatformSettings = ({ settings, onSubmit, isLoading }: PlatformSettingsProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      platform_name: settings?.platform_name || '',
      platform_description: settings?.platform_description || '',
      support_email: settings?.support_email || '',
      default_currency: settings?.default_currency || 'USD',
      default_timezone: settings?.default_timezone || 'UTC',
      maintenance_mode: settings?.maintenance_mode || false,
      registration_enabled: settings?.registration_enabled ?? true,
      trial_days_default: settings?.trial_days_default || 14,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure your platform's general settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform_name">Platform Name</Label>
              <Input id="platform_name" {...register('platform_name')} />
              {errors.platform_name && <p className="text-sm text-destructive">{errors.platform_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="support_email">Support Email</Label>
              <Input id="support_email" type="email" {...register('support_email')} />
              {errors.support_email && <p className="text-sm text-destructive">{errors.support_email.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform_description">Description</Label>
            <Textarea id="platform_description" {...register('platform_description')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default_currency">Default Currency</Label>
              <Input id="default_currency" {...register('default_currency')} />
              {errors.default_currency && <p className="text-sm text-destructive">{errors.default_currency.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_timezone">Default Timezone</Label>
              <Input id="default_timezone" {...register('default_timezone')} />
              {errors.default_timezone && <p className="text-sm text-destructive">{errors.default_timezone.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial_days_default">Default Trial Days</Label>
            <Input id="trial_days_default" type="number" {...register('trial_days_default', { valueAsNumber: true })} className="w-32" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="registration_enabled"
              checked={watch('registration_enabled')}
              onCheckedChange={(checked: boolean) => setValue('registration_enabled', checked === true)}
            />
            <Label htmlFor="registration_enabled">Enable Tenant Registration</Label>
          </div>
          <Separator />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="maintenance_mode"
              checked={watch('maintenance_mode')}
              onCheckedChange={(checked: boolean) => setValue('maintenance_mode', checked === true)}
            />
            <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
          </div>
          {watch('maintenance_mode') && (
            <p className="text-sm text-destructive">
              Warning: Maintenance mode will prevent all tenants from accessing their dashboards.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};

export default PlatformSettings;
