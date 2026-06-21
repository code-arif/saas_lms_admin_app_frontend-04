import { useState } from 'react';
import { Key, Webhook, AppWindow, Copy, Check, Trash2, Plus, ExternalLink, Shield } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';


/* ─── Types ─── */

interface ApiKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  created: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
  permissions: string[];
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'disabled' | 'failing';
  secret: string;
  createdAt: string;
}

interface OAuthApp {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  created: string;
  status: 'active' | 'disabled';
}

/* ─── Mock data ─── */

const mockApiKeys: ApiKey[] = [
  { id: '1', name: 'Production API Key', key: 'sk_live_3f8a2b1c9d7e4f5a', maskedKey: 'sk_live_3f8a******', created: '2024-12-01', lastUsed: '2025-06-20', status: 'active', permissions: ['read', 'write'] },
  { id: '2', name: 'Staging API Key', key: 'sk_test_1a2b3c4d5e6f7g8h', maskedKey: 'sk_test_1a2b******', created: '2025-01-15', lastUsed: '2025-06-19', status: 'active', permissions: ['read'] },
  { id: '3', name: 'Mobile App Key', key: 'sk_mobile_9i8u7y6t5r4e3w2q', maskedKey: 'sk_mobile_9i8u******', created: '2025-03-10', lastUsed: null, status: 'revoked', permissions: ['read', 'write'] },
];

const mockWebhooks: WebhookEndpoint[] = [
  { id: 'w1', url: 'https://api.example.com/webhooks/payment', events: ['payment.completed', 'payment.failed'], status: 'active', secret: 'whsec_abc123def456', createdAt: '2024-11-20' },
  { id: 'w2', url: 'https://api.example.com/webhooks/tenant', events: ['tenant.created', 'tenant.deleted'], status: 'active', secret: 'whsec_789ghi012jkl', createdAt: '2025-02-10' },
  { id: 'w3', url: 'https://old-system.example.com/hook', events: ['subscription.renewed'], status: 'failing', secret: 'whsec_345mno678pqr', createdAt: '2024-09-05' },
];

const mockOAuthApps: OAuthApp[] = [
  { id: 'o1', name: 'LMS Mobile App', clientId: 'client_a1b2c3d4', clientSecret: 'secret_e5f6g7h8', redirectUri: 'https://app.example.com/auth/callback', scopes: ['users:read', 'courses:read', 'enrollments:write'], created: '2025-01-10', status: 'active' },
  { id: 'o2', name: 'Analytics Dashboard', clientId: 'client_i9j0k1l2', clientSecret: 'secret_m3n4o5p6', redirectUri: 'https://analytics.example.com/oauth/callback', scopes: ['analytics:read', 'users:read'], created: '2025-03-22', status: 'active' },
];

const availableEvents = [
  'tenant.created', 'tenant.deleted', 'tenant.suspended',
  'payment.completed', 'payment.failed', 'payment.refunded',
  'subscription.created', 'subscription.renewed', 'subscription.cancelled',
  'user.created', 'user.deleted',
  'course.published', 'course.completed',
];

/* ─── Component ─── */

const IntegrationsSettingsPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(mockWebhooks);
  const [oauthApps] = useState<OAuthApp[]>(mockOAuthApps);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);

  return (
    <div className="space-y-6">
      <PageTitle title="Integrations" subtitle="Manage API keys, webhook endpoints, and OAuth applications" />

      {/* ─── API Keys ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Key size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage authentication keys for external services</CardDescription>
            </div>
            <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" />
                  New Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>Generate a new API key for programmatic access.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="new_key_name">Key Name</Label>
                    <Input id="new_key_name" placeholder="e.g. Production Server" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex gap-3">
                      {['read', 'write', 'admin'].map((perm) => (
                        <label key={perm} className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newKeyPermissions.includes(perm)}
                            onChange={() => setNewKeyPermissions(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm])}
                            className="rounded border-input"
                          />
                          {perm.charAt(0).toUpperCase() + perm.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>Cancel</Button>
                  <Button disabled={!newKeyName.trim()}>Generate Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No API keys yet. Create one to get started.</p>
          ) : (
            apiKeys.map((apiKey, index) => (
              <div key={apiKey.id}>
                {index > 0 && <Separator className="mb-3" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{apiKey.name}</span>
                      <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                        {apiKey.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {apiKey.status === 'active' ? apiKey.maskedKey : apiKey.key}
                      </code>
                      {apiKey.status === 'active' && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(apiKey.key);
                            setCopiedKey(apiKey.id);
                            setTimeout(() => setCopiedKey(null), 2000);
                          }}
                          className="p-1 rounded hover:bg-muted transition-colors"
                          title="Copy key"
                        >
                          {copiedKey === apiKey.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-muted-foreground" />}
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>Created {apiKey.created}</span>
                      {apiKey.lastUsed && <span>Last used {apiKey.lastUsed}</span>}
                    </div>
                  </div>
                  {apiKey.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => setApiKeys(prev => prev.map(k => k.id === apiKey.id ? { ...k, status: 'revoked' as const } : k))}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* ─── Webhook Endpoints ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Webhook size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>Configure endpoints to receive real-time event notifications</CardDescription>
            </div>
            <Dialog open={showNewWebhookDialog} onOpenChange={setShowNewWebhookDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" />
                  Add Endpoint
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Webhook Endpoint</DialogTitle>
                  <DialogDescription>Register a URL to receive event payloads via HTTP POST.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url">Payload URL</Label>
                    <Input id="webhook_url" placeholder="https://api.example.com/webhook" />
                  </div>
                  <div className="space-y-2">
                    <Label>Subscribe to Events</Label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 max-h-40 overflow-y-auto">
                      {availableEvents.map((event) => (
                        <label key={event} className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="checkbox" className="rounded border-input" />
                          {event}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewWebhookDialog(false)}>Cancel</Button>
                  <Button>Add Endpoint</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {webhooks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No webhook endpoints configured.</p>
          ) : (
            webhooks.map((hook, index) => (
              <div key={hook.id}>
                {index > 0 && <Separator className="mb-3" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded truncate max-w-[400px]">{hook.url}</code>
                      <Badge
                        variant={hook.status === 'active' ? 'default' : hook.status === 'failing' ? 'destructive' : 'secondary'}
                        className="text-[10px] px-1.5 py-0 shrink-0"
                      >
                        {hook.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-[10px] font-mono px-1.5">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>Secret: <code className="font-mono">{hook.secret}</code></span>
                      <span>Created {hook.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ExternalLink size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* ─── OAuth Apps ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <AppWindow size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>OAuth Applications</CardTitle>
              <CardDescription>Manage third-party app integrations using OAuth 2.0</CardDescription>
            </div>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              New App
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {oauthApps.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No OAuth applications registered.</p>
          ) : (
            oauthApps.map((app, index) => (
              <div key={app.id}>
                {index > 0 && <Separator className="mb-3" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{app.name}</span>
                      <Badge variant={app.status === 'active' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                        {app.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div>
                        <span className="text-muted-foreground">Client ID: </span>
                        <code className="font-mono bg-muted px-1 rounded">{app.clientId}</code>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Client Secret: </span>
                        <code className="font-mono bg-muted px-1 rounded">{app.clientSecret}</code>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground">Redirect URI: </span>
                        <code className="font-mono text-foreground">{app.redirectUri}</code>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {app.scopes.map((scope) => (
                        <Badge key={scope} variant="outline" className="text-[10px] font-mono px-1.5">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Created {app.created}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0">
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield size={14} />
        <span>All API keys and secrets are encrypted at rest and only shown once upon creation.</span>
      </div>
    </div>
  );
};

export default IntegrationsSettingsPage;
