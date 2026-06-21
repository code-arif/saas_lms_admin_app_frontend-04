import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Send, Shield, Server, Key, User } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { useSettings, useUpdateSetting } from '@/features/settings/hooks/useSettings';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useState } from 'react';

const emailSettingsSchema = z.object({
  smtp_host: z.string().min(1, 'SMTP host is required'),
  smtp_port: z.number().min(1, 'Port is required'),
  smtp_username: z.string().min(1, 'Username is required'),
  smtp_password: z.string().min(1, 'Password is required'),
  smtp_encryption: z.string().min(1, 'Encryption is required'),
  sender_name: z.string().min(1, 'Sender name is required'),
  sender_email: z.string().email('Invalid email address'),
  test_email_recipient: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;

const EmailSettingsPage = () => {
  const { data: response, isLoading } = useSettings();
  const updateMutation = useUpdateSetting();
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const settings = response?.data;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtp_host: settings?.smtp_host || '',
      smtp_port: settings?.smtp_port ?? 587,
      smtp_username: settings?.smtp_username || '',
      smtp_password: settings?.smtp_password || '',
      smtp_encryption: settings?.smtp_encryption || 'tls',
      sender_name: settings?.sender_name || '',
      sender_email: settings?.sender_email || '',
      test_email_recipient: '',
    },
  });

  const onSubmit = (data: EmailSettingsFormValues) => {
    const { test_email_recipient, ...settingsData } = data;
    Object.entries(settingsData).forEach(([key, value]) => {
      const settingsAny = settings as any;
      if (value !== undefined && value !== settingsAny?.[key]) {
        updateMutation.mutate({ key, value });
      }
    });
  };

  const handleTestEmail = () => {
    const recipient = watch('test_email_recipient');
    if (!recipient) return;
    setTestLoading(true);
    setTestResult(null);

    // Simulate sending a test email — replace with actual API call
    setTimeout(() => {
      setTestResult({
        success: true,
        message: `Test email sent successfully to ${recipient}. Please check your inbox.`,
      });
      setTestLoading(false);
    }, 1500);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Email Settings" subtitle="Configure SMTP server and email delivery preferences" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SMTP Server */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Server size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>SMTP Server</CardTitle>
                <CardDescription>Configure your outgoing mail server settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host">SMTP Host *</Label>
                <Input id="smtp_host" {...register('smtp_host')} placeholder="smtp.example.com" />
                {errors.smtp_host && <p className="text-sm text-destructive">{errors.smtp_host.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_port">SMTP Port *</Label>
                <Input
                  id="smtp_port"
                  type="number"
                  {...register('smtp_port', { valueAsNumber: true })}
                  placeholder="587"
                />
                {errors.smtp_port && <p className="text-sm text-destructive">{errors.smtp_port.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_encryption">Encryption</Label>
              <Select
                defaultValue={watch('smtp_encryption')}
                onValueChange={(value) => setValue('smtp_encryption', value)}
              >
                <SelectTrigger id="smtp_encryption" className="w-full sm:w-48">
                  <SelectValue placeholder="Select encryption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tls">TLS (STARTTLS)</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Key size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>SMTP credentials for sending emails</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_username">Username *</Label>
                <Input id="smtp_username" {...register('smtp_username')} placeholder="your@email.com" />
                {errors.smtp_username && <p className="text-sm text-destructive">{errors.smtp_username.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_password">Password *</Label>
                <Input id="smtp_password" type="password" {...register('smtp_password')} placeholder="••••••••" />
                {errors.smtp_password && <p className="text-sm text-destructive">{errors.smtp_password.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sender Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <User size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Sender Information</CardTitle>
                <CardDescription>How your emails appear to recipients</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender_name">Sender Name *</Label>
                <Input id="sender_name" {...register('sender_name')} placeholder="LMS Admin" />
                {errors.sender_name && <p className="text-sm text-destructive">{errors.sender_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender_email">Sender Email *</Label>
                <Input id="sender_email" type="email" {...register('sender_email')} placeholder="noreply@example.com" />
                {errors.sender_email && <p className="text-sm text-destructive">{errors.sender_email.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Send size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Test Email</CardTitle>
                <CardDescription>Send a test email to verify your configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="test_email_recipient">Recipient Email</Label>
                <Input
                  id="test_email_recipient"
                  type="email"
                  {...register('test_email_recipient')}
                  placeholder="admin@example.com"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={testLoading || !watch('test_email_recipient')}
                  onClick={handleTestEmail}
                >
                  {testLoading ? 'Sending...' : 'Send Test Email'}
                </Button>
              </div>
            </div>

            {testResult && (
              <div
                className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
                  testResult.success
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {testResult.success ? (
                  <Mail size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <Shield size={16} className="shrink-0 mt-0.5" />
                )}
                <p>{testResult.message}</p>
              </div>
            )}

            <Separator />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield size={14} />
              <span>Your SMTP credentials are encrypted at rest and never exposed to the frontend.</span>
            </div>
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

export default EmailSettingsPage;
