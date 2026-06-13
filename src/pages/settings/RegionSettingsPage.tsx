import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Clock, DollarSign, CalendarDays, Languages, MapPin } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { useSettings, useUpdateSetting } from '@/features/settings/hooks/useSettings';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const regionSettingsSchema = z.object({
  default_currency: z.string().min(1, 'Currency is required'),
  default_timezone: z.string().min(1, 'Timezone is required'),
  default_language: z.string().min(1, 'Language is required'),
  date_format: z.string().min(1, 'Date format is required'),
  time_format: z.string().min(1, 'Time format is required'),
  trial_days_default: z.number().min(0, 'Must be 0 or more'),
  country_code: z.string().optional(),
  currency_position: z.string().optional(),
  thousand_separator: z.string().optional(),
  decimal_separator: z.string().optional(),
  decimal_places: z.number().min(0).max(4),
});

type RegionSettingsFormValues = z.infer<typeof regionSettingsSchema>;

const timezones = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'America/Vancouver', 'America/Sao_Paulo', 'Europe/London',
  'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Rome', 'Europe/Amsterdam',
  'Europe/Stockholm', 'Europe/Moscow', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Auckland',
];

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar' },
  { value: 'SEK', label: 'SEK - Swedish Krona' },
  { value: 'NOK', label: 'NOK - Norwegian Krone' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
  { value: 'nl', label: 'Dutch' },
  { value: 'sv', label: 'Swedish' },
  { value: 'da', label: 'Danish' },
];

const dateFormats = [
  { value: 'YYYY-MM-DD', label: '2024-12-31 (YYYY-MM-DD)' },
  { value: 'DD/MM/YYYY', label: '31/12/2024 (DD/MM/YYYY)' },
  { value: 'MM/DD/YYYY', label: '12/31/2024 (MM/DD/YYYY)' },
  { value: 'DD.MM.YYYY', label: '31.12.2024 (DD.MM.YYYY)' },
  { value: 'YYYY/MM/DD', label: '2024/12/31 (YYYY/MM/DD)' },
];

const timeFormats = [
  { value: 'HH:mm', label: '14:30 (24-hour)' },
  { value: 'hh:mm A', label: '02:30 PM (12-hour)' },
  { value: 'hh:mm a', label: '02:30 pm (12-hour lowercase)' },
];

const RegionSettingsPage = () => {
  const { data: response, isLoading } = useSettings();
  const updateMutation = useUpdateSetting();

  const settings = response?.data;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegionSettingsFormValues>({
    resolver: zodResolver(regionSettingsSchema),
    defaultValues: {
      default_currency: settings?.default_currency || 'USD',
      default_timezone: settings?.default_timezone || 'UTC',
      default_language: settings?.default_language || 'en',
      date_format: settings?.date_format || 'YYYY-MM-DD',
      time_format: settings?.time_format || 'HH:mm',
      trial_days_default: settings?.trial_days_default ?? 14,
      country_code: settings?.country_code || '',
      currency_position: settings?.currency_position || 'before',
      thousand_separator: settings?.thousand_separator || ',',
      decimal_separator: settings?.decimal_separator || '.',
      decimal_places: settings?.decimal_places ?? 2,
    },
  });

  const onSubmit = (data: RegionSettingsFormValues) => {
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
      <PageTitle title="Region Settings" subtitle="Configure localization, currency, and regional preferences" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Locale */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              <div>
                <CardTitle>Locale</CardTitle>
                <CardDescription>Set the default language and regional preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default_language">Default Language</Label>
                <Select
                  defaultValue={watch('default_language')}
                  onValueChange={(value) => setValue('default_language', value)}
                >
                  <SelectTrigger id="default_language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country_code">Country Code</Label>
                <Input id="country_code" {...register('country_code')} placeholder="US" className="w-full sm:w-32 uppercase" maxLength={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <div>
                <CardTitle>Date & Time</CardTitle>
                <CardDescription>Configure date and time formatting preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default_timezone">Default Timezone</Label>
                <Select
                  defaultValue={watch('default_timezone')}
                  onValueChange={(value) => setValue('default_timezone', value)}
                >
                  <SelectTrigger id="default_timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.default_timezone && <p className="text-sm text-destructive">{errors.default_timezone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_format">Date Format</Label>
                <Select
                  defaultValue={watch('date_format')}
                  onValueChange={(value) => setValue('date_format', value)}
                >
                  <SelectTrigger id="date_format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateFormats.map((df) => (
                      <SelectItem key={df.value} value={df.value}>{df.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_format">Time Format</Label>
                <Select
                  defaultValue={watch('time_format')}
                  onValueChange={(value) => setValue('time_format', value)}
                >
                  <SelectTrigger id="time_format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeFormats.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trial_days_default">Default Trial Days</Label>
                <Input
                  id="trial_days_default"
                  type="number"
                  {...register('trial_days_default', { valueAsNumber: true })}
                  className="w-full sm:w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-primary" />
              <div>
                <CardTitle>Currency</CardTitle>
                <CardDescription>Configure default currency and formatting</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default_currency">Default Currency</Label>
                <Select
                  defaultValue={watch('default_currency')}
                  onValueChange={(value) => setValue('default_currency', value)}
                >
                  <SelectTrigger id="default_currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {currencies.map((cur) => (
                      <SelectItem key={cur.value} value={cur.value}>{cur.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.default_currency && <p className="text-sm text-destructive">{errors.default_currency.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency_position">Currency Position</Label>
                <Select
                  defaultValue={watch('currency_position')}
                  onValueChange={(value) => setValue('currency_position', value)}
                >
                  <SelectTrigger id="currency_position">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">$1,234.56 (Before)</SelectItem>
                    <SelectItem value="after">1,234.56$ (After)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thousand_separator">Thousand Separator</Label>
                <Select
                  defaultValue={watch('thousand_separator')}
                  onValueChange={(value) => setValue('thousand_separator', value)}
                >
                  <SelectTrigger id="thousand_separator">
                    <SelectValue placeholder="Separator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma (,)</SelectItem>
                    <SelectItem value=".">Dot (.)</SelectItem>
                    <SelectItem value=" ">Space ( )</SelectItem>
                    <SelectItem value="'">Apostrophe (')</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="decimal_separator">Decimal Separator</Label>
                <Select
                  defaultValue={watch('decimal_separator')}
                  onValueChange={(value) => setValue('decimal_separator', value)}
                >
                  <SelectTrigger id="decimal_separator">
                    <SelectValue placeholder="Separator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=".">Dot (.)</SelectItem>
                    <SelectItem value=",">Comma (,)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="decimal_places">Decimal Places</Label>
                <Input
                  id="decimal_places"
                  type="number"
                  {...register('decimal_places', { valueAsNumber: true })}
                  className="w-full sm:w-32"
                  min={0}
                  max={4}
                />
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Preview:</p>
              <p className="text-lg font-semibold">
                {watch('currency_position') === 'before' ? '$' : ''}
                {watch('thousand_separator') === ',' ? '1,234' : watch('thousand_separator') === '.' ? '1.234' : '1 234'}
                {watch('decimal_separator')}
                {watch('decimal_places')! > 0 ? '56'.padEnd(watch('decimal_places')!, '0') : ''}
                {watch('currency_position') === 'after' ? ' $' : ''}
              </p>
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

export default RegionSettingsPage;
