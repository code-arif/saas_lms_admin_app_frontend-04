import { useState } from 'react';
import { HardDrive, Cloud, Image, FileText, Shield, Upload, Save, Server } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';

/* ─── Types ─── */

type StorageDriver = 'local' | 's3' | 'gcs' | 'wasabi' | 'digitalocean';

interface StorageConfig {
  driver: StorageDriver;
  local: { path: string; baseUrl: string };
  s3: { key: string; secret: string; bucket: string; region: string; endpoint: string };
  gcs: { projectId: string; bucket: string; keyFile: string };
  customEndpoint: string;
}

interface CdnConfig {
  enabled: boolean;
  url: string;
  provider: string;
  pullZone: string;
}

interface UploadConfig {
  maxFileSizeMb: number;
  maxImageSizeMb: number;
  maxVideoSizeMb: number;
  allowedExtensions: string[];
  imageExtensions: string[];
  documentExtensions: string[];
  videoExtensions: string[];
  enableCompression: boolean;
  compressionQuality: number;
}

/* ─── Component ─── */

const driverOptions: { value: StorageDriver; label: string; description: string }[] = [
  { value: 'local', label: 'Local Storage', description: 'Store files on the application server' },
  { value: 's3', label: 'Amazon S3', description: 'AWS Simple Storage Service' },
  { value: 'gcs', label: 'Google Cloud Storage', description: 'Google Cloud object storage' },
  { value: 'wasabi', label: 'Wasabi', description: 'Hot cloud storage at a fraction of the cost' },
  { value: 'digitalocean', label: 'DigitalOcean Spaces', description: 'S3-compatible object storage' },
];

const cdnProviders = ['Cloudflare', 'CloudFront', 'Fastly', 'KeyCDN', 'BunnyCDN', 'Custom'];

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'];
const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'];

const StorageSettingsPage = () => {
  const [driver, setDriver] = useState<StorageDriver>('s3');
  const [cdnEnabled, setCdnEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Storage & CDN" subtitle="Configure file storage, CDN delivery, and upload restrictions" />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Storage Driver */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <HardDrive size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Storage Driver</CardTitle>
                <CardDescription>Select and configure your file storage backend</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Storage Provider</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {driverOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDriver(opt.value)}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      driver === opt.value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      driver === opt.value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Cloud size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Driver-specific configs */}
            {driver === 'local' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local_path">Storage Path</Label>
                  <Input id="local_path" defaultValue="/var/www/lms/storage" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local_base_url">Base URL</Label>
                  <Input id="local_base_url" defaultValue="https://admin.example.com/storage" className="font-mono" />
                </div>
              </div>
            )}

            {(driver === 's3' || driver === 'wasabi' || driver === 'digitalocean') && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="s3_key">Access Key ID</Label>
                    <Input id="s3_key" type="password" placeholder="AKIA**********" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s3_secret">Secret Access Key</Label>
                    <Input id="s3_secret" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="s3_bucket">Bucket Name</Label>
                    <Input id="s3_bucket" placeholder="lms-uploads" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s3_region">Region</Label>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger id="s3_region">
                        <SelectValue placeholder="Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                        <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s3_endpoint">Custom Endpoint</Label>
                    <Input id="s3_endpoint" placeholder="https://s3.amazonaws.com" className="font-mono" />
                  </div>
                </div>
              </>
            )}

            {driver === 'gcs' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gcs_project">Project ID</Label>
                  <Input id="gcs_project" placeholder="my-lms-project" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gcs_bucket">Bucket Name</Label>
                  <Input id="gcs_bucket" placeholder="lms-uploads" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gcs_keyfile">Key File Path</Label>
                  <Input id="gcs_keyfile" placeholder="/path/to/service-account.json" className="font-mono" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CDN Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Server size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>CDN Configuration</CardTitle>
                <CardDescription>Accelerate content delivery with a CDN</CardDescription>
              </div>
              <Switch checked={cdnEnabled} onCheckedChange={setCdnEnabled} />
            </div>
          </CardHeader>
          {cdnEnabled && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cdn_provider">CDN Provider</Label>
                  <Select defaultValue="Cloudflare">
                    <SelectTrigger id="cdn_provider">
                      <SelectValue placeholder="Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {cdnProviders.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cdn_url">CDN URL</Label>
                  <Input id="cdn_url" placeholder="https://cdn.example.com" className="font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cdn_pullzone">Pull Zone / Distribution ID</Label>
                <Input id="cdn_pullzone" placeholder="Z2ABCD3EF4GHIJ" className="font-mono" />
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                <Shield size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  When a CDN is enabled, all public file URLs will be served through the CDN endpoint instead of directly from storage.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Upload Limits */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Upload size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Upload Limits</CardTitle>
                <CardDescription>Set maximum file sizes and allowed file types</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_file_size">Max File Size (MB)</Label>
                <Input id="max_file_size" type="number" defaultValue={50} className="w-full sm:w-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_image_size">Max Image Size (MB)</Label>
                <Input id="max_image_size" type="number" defaultValue={10} className="w-full sm:w-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_video_size">Max Video Size (MB)</Label>
                <Input id="max_video_size" type="number" defaultValue={500} className="w-full sm:w-32" />
              </div>
            </div>

            <Separator />

            {/* Allowed File Types */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Image size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Image Types</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Enabled</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {imageExtensions.map((ext) => (
                  <Badge key={ext} variant="secondary" className="text-[10px] font-mono px-1.5">{ext}</Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Document Types</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Enabled</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {documentExtensions.map((ext) => (
                  <Badge key={ext} variant="secondary" className="text-[10px] font-mono px-1.5">{ext}</Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cloud size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Video Types</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Enabled</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {videoExtensions.map((ext) => (
                  <Badge key={ext} variant="secondary" className="text-[10px] font-mono px-1.5">{ext}</Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Compression */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Image Compression</Label>
                <p className="text-xs text-muted-foreground">Automatically compress images on upload to reduce file size</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="compression_quality">Compression Quality (%)</Label>
                <Input id="compression_quality" type="number" defaultValue={80} className="w-full sm:w-32" min={1} max={100} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield size={14} />
            <span>Storage configuration changes take effect immediately.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline">Test Connection</Button>
            {saved && <span className="text-sm text-emerald-600 font-medium animate-in fade-in">Settings saved</span>}
            <Button type="submit" disabled={saving}>
              <Save size={16} className="mr-1.5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StorageSettingsPage;
