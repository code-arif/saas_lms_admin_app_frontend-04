import { useState } from 'react';
import { Shield, Lock, Globe, Fingerprint, Users, FileText, Trash2, Plus, Download, Save } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

/* ─── Types ─── */

interface WhitelistedIp {
  id: string;
  address: string;
  description: string;
  createdBy: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'inactive';
}

interface ActiveSession {
  id: string;
  user: string;
  email: string;
  ip: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  createdAt: string;
  current: boolean;
}

/* ─── Mock Data ─── */

const mockWhitelistedIps: WhitelistedIp[] = [
  { id: 'ip1', address: '203.0.113.0/24', description: 'Office network', createdBy: 'admin@example.com', createdAt: '2025-01-15', lastUsed: '2025-06-21', status: 'active' },
  { id: 'ip2', address: '198.51.100.42', description: 'CEO home office', createdBy: 'admin@example.com', createdAt: '2025-02-20', lastUsed: '2025-06-19', status: 'active' },
  { id: 'ip3', address: '192.0.2.0/28', description: 'VPN subnet', createdBy: 'superadmin@example.com', createdAt: '2025-03-10', lastUsed: '2025-06-18', status: 'active' },
  { id: 'ip4', address: '10.0.0.0/8', description: 'Internal dev network', createdBy: 'admin@example.com', createdAt: '2024-11-05', lastUsed: null, status: 'inactive' },
];

const mockSessions: ActiveSession[] = [
  { id: 's1', user: 'You', email: 'admin@example.com', ip: '203.0.113.42', device: 'Windows Desktop', browser: 'Chrome 125', location: 'New York, US', lastActive: 'Just now', createdAt: '2025-06-21 09:15', current: true },
  { id: 's2', user: 'You', email: 'admin@example.com', ip: '198.51.100.7', device: 'iPhone 15', browser: 'Safari 18', location: 'New York, US', lastActive: '2 hours ago', createdAt: '2025-06-20 14:30', current: false },
  { id: 's3', user: 'Sarah Johnson', email: 'sarah@example.com', ip: '203.0.113.88', device: 'MacBook Pro', browser: 'Firefox 127', location: 'San Francisco, US', lastActive: '1 day ago', createdAt: '2025-06-19 11:00', current: false },
  { id: 's4', user: 'Mike Chen', email: 'mike@example.com', ip: '198.51.100.55', device: 'Linux Workstation', browser: 'Chrome 124', location: 'Tokyo, JP', lastActive: '3 days ago', createdAt: '2025-06-17 08:45', current: false },
];

const gdprReasons = [
  'Access their personal data',
  'Rectify inaccurate data',
  'Erase personal data (right to be forgotten)',
  'Restrict processing of their data',
  'Port their data to another service',
  'Object to processing for marketing',
];

/* ─── Component ─── */

const SecuritySettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [whitelistedIps] = useState<WhitelistedIp[]>(mockWhitelistedIps);
  const [sessions] = useState<ActiveSession[]>(mockSessions);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(true);
  const [require2fa, setRequire2fa] = useState(false);

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
      <PageTitle title="Security & Compliance" subtitle="Manage password policies, access controls, and data compliance" />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Password Policy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password strength requirements and expiration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_length">Minimum Length</Label>
                <Input id="min_length" type="number" defaultValue={8} className="w-full sm:w-32" min={6} max={128} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_length">Maximum Length</Label>
                <Input id="max_length" type="number" defaultValue={64} className="w-full sm:w-32" min={6} max={128} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_expiry">Password Expiry (days)</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="password_expiry" className="w-full sm:w-40">
                    <SelectValue placeholder="Expiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Never expires</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Complexity Requirements</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">Require Uppercase</p>
                    <p className="text-xs text-muted-foreground">At least one uppercase letter (A-Z)</p>
                  </div>
                  <Switch defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">Require Lowercase</p>
                    <p className="text-xs text-muted-foreground">At least one lowercase letter (a-z)</p>
                  </div>
                  <Switch defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">Require Numbers</p>
                    <p className="text-xs text-muted-foreground">At least one numeric digit (0-9)</p>
                  </div>
                  <Switch defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">Require Special Characters</p>
                    <p className="text-xs text-muted-foreground">At least one symbol (!@#$%^&*)</p>
                  </div>
                  <Switch defaultChecked />
                </label>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="history_count">Password History</Label>
                <Select defaultValue="5">
                  <SelectTrigger id="history_count" className="w-full sm:w-48">
                    <SelectValue placeholder="History" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No history</SelectItem>
                    <SelectItem value="3">Remember last 3 passwords</SelectItem>
                    <SelectItem value="5">Remember last 5 passwords</SelectItem>
                    <SelectItem value="10">Remember last 10 passwords</SelectItem>
                    <SelectItem value="24">Remember last 24 passwords</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Prevents reuse of recent passwords</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lockout_attempts">Lockout After Failed Attempts</Label>
                <Input id="lockout_attempts" type="number" defaultValue={5} className="w-full sm:w-32" min={1} max={20} />
                <p className="text-xs text-muted-foreground">Account locks temporarily after failed attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Fingerprint size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Enforce additional security for admin accounts</CardDescription>
              </div>
              <Switch checked={require2fa} onCheckedChange={setRequire2fa} />
            </div>
          </CardHeader>
          {require2fa && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="2fa_method">Default 2FA Method</Label>
                  <Select defaultValue="authenticator">
                    <SelectTrigger id="2fa_method" className="w-full sm:w-48">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="authenticator">Authenticator App (TOTP)</SelectItem>
                      <SelectItem value="sms">SMS Code</SelectItem>
                      <SelectItem value="email">Email Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="2fa_enforcement">Enforcement Scope</Label>
                  <Select defaultValue="all_admins">
                    <SelectTrigger id="2fa_enforcement" className="w-full sm:w-48">
                      <SelectValue placeholder="Scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_admins">All admin users</SelectItem>
                      <SelectItem value="super_admin">Super admins only</SelectItem>
                      <SelectItem value="optional">Optional (recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">Grace Period</p>
                  <p className="text-xs text-muted-foreground">Allow users time to set up 2FA before enforcement</p>
                </div>
                <Switch defaultChecked />
              </label>
            </CardContent>
          )}
        </Card>

        {/* IP Whitelisting */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Globe size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>IP Whitelisting</CardTitle>
                <CardDescription>Restrict admin panel access to trusted IP addresses</CardDescription>
              </div>
              <Switch checked={ipWhitelistEnabled} onCheckedChange={setIpWhitelistEnabled} />
            </div>
          </CardHeader>
          {ipWhitelistEnabled && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {whitelistedIps.filter(ip => ip.status === 'active').length} active IP rules configured
                </p>
                <Button size="sm" variant="outline">
                  <Plus size={14} className="mr-1" />
                  Add IP
                </Button>
              </div>
              <div className="space-y-2">
                {whitelistedIps.map((ip, index) => (
                  <div key={ip.id}>
                    {index > 0 && <Separator className="mb-2" />}
                    <div className="flex items-center justify-between gap-3 py-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">{ip.address}</code>
                          <Badge variant={ip.status === 'active' ? 'default' : 'secondary'} className="text-[9px] px-1 py-0">
                            {ip.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{ip.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                          {ip.status === 'active' ? 'Disable' : 'Enable'}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-sm">
                <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-600">
                  Warning: Make sure your own IP is whitelisted before enabling. If you lock yourself out, contact your hosting provider.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Users size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>View and manage active user sessions</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 size={14} className="mr-1" />
                Revoke All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-start justify-between gap-3 px-6 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{session.user}</span>
                      {session.current && (
                        <Badge variant="default" className="text-[9px] px-1 py-0">Current</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{session.email}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                      <span>IP: <code className="font-mono">{session.ip}</code></span>
                      <span>{session.device}</span>
                      <span>{session.browser}</span>
                      <span>{session.location}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Active: {session.lastActive} · Created: {session.createdAt}
                    </p>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0">
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GDPR & Compliance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>GDPR & Compliance</CardTitle>
                <CardDescription>Manage data privacy requests and compliance tools</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Download size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Data Export</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Export all personal data for a specific user in JSON format.</p>
                <div className="flex gap-2">
                  <Input placeholder="user@example.com" className="flex-1" />
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Trash2 size={16} className="text-destructive" />
                  <span className="text-sm font-medium">Data Deletion</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Permanently delete all personal data for a user (right to be forgotten).</p>
                <div className="flex gap-2">
                  <Input placeholder="user@example.com" className="flex-1" />
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium">Pending Data Requests</span>
                  <p className="text-xs text-muted-foreground">Requests from users to exercise their GDPR rights</p>
                </div>
                <Badge variant="secondary">3 pending</Badge>
              </div>
              <div className="space-y-2">
                {gdprReasons.slice(0, 3).map((reason, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">user{index + 1}@example.com</span>
                        {' '}requested to{' '}
                        <span className="text-muted-foreground">{reason.toLowerCase()}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Received {index + 1} day{index > 0 ? 's' : ''} ago</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="outline" size="sm">Review</Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">Dismiss</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Data Retention Period</Label>
                <p className="text-xs text-muted-foreground">Automatically delete inactive user data after this period</p>
              </div>
              <Select defaultValue="365">
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Retention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="730">2 years</SelectItem>
                  <SelectItem value="1095">3 years</SelectItem>
                  <SelectItem value="0">Indefinitely</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div>
                <p className="text-sm font-medium">Anonymize Deleted Data</p>
                <p className="text-xs text-muted-foreground">Replace personal data with anonymized placeholders instead of hard deletion</p>
              </div>
              <Switch defaultChecked />
            </label>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield size={14} />
            <span>Security changes take effect immediately. Audit logs track all modifications.</span>
          </div>
          <div className="flex items-center gap-3">
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

export default SecuritySettingsPage;
