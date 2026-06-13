import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Mail, Image, Link as LinkIcon, Palette } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { useSettings, useUpdateSetting } from '@/features/settings/hooks/useSettings';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useState } from 'react';

const generalSettingsSchema = z.object({
  platform_name: z.string().min(1, 'Platform name is required'),
  platform_tagline: z.string().optional(),
  platform_description: z.string().optional(),
  support_email: z.string().email('Invalid email address'),
  support_phone: z.string().optional(),
  website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  favicon_url: z.string().optional(),
  logo_url: z.string().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

const GeneralSettingsPage = () => {
  const { data: response, isLoading } = useSettings();
  const updateMutation = useUpdateSetting();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const settings = response?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      platform_name: settings?.platform_name || '',
      platform_tagline: settings?.platform_tagline || '',
      platform_description: settings?.platform_description || '',
      support_email: settings?.support_email || '',
      support_phone: settings?.support_phone || '',
      website_url: settings?.website_url || '',
      favicon_url: settings?.favicon_url || '',
      logo_url: settings?.logo_url || '',
      primary_color: settings?.primary_color || '#6366f1',
      secondary_color: settings?.secondary_color || '#10b981',
    },
  });

  const onSubmit = (data: GeneralSettingsFormValues) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== (settings as any)?.[key]) {
        updateMutation.mutate({ key, value });
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title="General Settings" subtitle="Configure your platform's branding and contact information" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Branding */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette size={20} className="text-primary" />
              <div>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Customize your platform's appearance and identity</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform_name">Platform Name *</Label>
                <Input id="platform_name" {...register('platform_name')} placeholder="My LMS Platform" />
                {errors.platform_name && <p className="text-sm text-destructive">{errors.platform_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform_tagline">Tagline</Label>
                <Input id="platform_tagline" {...register('platform_tagline')} placeholder="Learn without limits" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform_description">Description</Label>
              <Textarea
                id="platform_description"
                {...register('platform_description')}
                placeholder="Describe your platform..."
                rows={3}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="logo_url"
                      {...register('logo_url')}
                      placeholder="https://example.com/logo.png"
                      onChange={(e) => setLogoPreview(e.target.value)}
                    />
                  </div>
                  <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview || settings?.logo_url ? (
                      <img src={logoPreview || settings?.logo_url} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <Image size={16} className="text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon_url">Favicon URL</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="favicon_url"
                      {...register('favicon_url')}
                      placeholder="https://example.com/favicon.ico"
                      onChange={(e) => setFaviconPreview(e.target.value)}
                    />
                  </div>
                  <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {faviconPreview || settings?.favicon_url ? (
                      <img src={faviconPreview || settings?.favicon_url} alt="Favicon" className="h-full w-full object-contain" />
                    ) : (
                      <Image size={16} className="text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input id="primary_color" {...register('primary_color')} type="color" className="w-16 p-1 h-10" />
                  <Input {...register('primary_color')} placeholder="#6366f1" className="flex-1 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input id="secondary_color" {...register('secondary_color')} type="color" className="w-16 p-1 h-10" />
                  <Input {...register('secondary_color')} placeholder="#10b981" className="flex-1 font-mono" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-primary" />
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How users can reach your support team</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="support_email">Support Email *</Label>
                <Input id="support_email" type="email" {...register('support_email')} placeholder="support@example.com" />
                {errors.support_email && <p className="text-sm text-destructive">{errors.support_email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="support_phone">Support Phone</Label>
                <Input id="support_phone" {...register('support_phone')} placeholder="+1 (555) 123-4567" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="website_url" {...register('website_url')} placeholder="https://example.com" className="pl-9" />
              </div>
              {errors.website_url && <p className="text-sm text-destructive">{errors.website_url.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              <div>
                <CardTitle>SEO & Metadata</CardTitle>
                <CardDescription>Control how your platform appears in search results</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Default Meta Title</Label>
              <Input id="meta_title" placeholder="LMS Admin - Learn Management System" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Default Meta Description</Label>
              <Textarea id="meta_description" placeholder="A powerful learning management platform..." rows={2} />
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

export default GeneralSettingsPage;
