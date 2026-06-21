import { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, Search, Filter, RefreshCw, Save, Shield, Clock, Terminal } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

/* ─── Types ─── */

interface ServiceStatus {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: string;
  responseTime: string;
  lastChecked: string;
}

interface LogEntry {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  source: string;
  timestamp: string;
  details?: string;
}

interface ErrorTrackingConfig {
  provider: string;
  dsn: string;
  environment: string;
  sampleRate: number;
}

/* ─── Mock Data ─── */

const services: ServiceStatus[] = [
  { id: 'srv1', name: 'Web Server', status: 'healthy', uptime: '99.98%', responseTime: '45ms', lastChecked: 'Just now' },
  { id: 'srv2', name: 'Database', status: 'healthy', uptime: '99.99%', responseTime: '12ms', lastChecked: 'Just now' },
  { id: 'srv3', name: 'Redis Cache', status: 'healthy', uptime: '100%', responseTime: '2ms', lastChecked: 'Just now' },
  { id: 'srv4', name: 'Queue Worker', status: 'degraded', uptime: '95.2%', responseTime: '230ms', lastChecked: '2 min ago' },
  { id: 'srv5', name: 'Storage / CDN', status: 'healthy', uptime: '99.97%', responseTime: '85ms', lastChecked: 'Just now' },
  { id: 'srv6', name: 'Email Service', status: 'down', uptime: '88.4%', responseTime: '—', lastChecked: '5 min ago' },
];

const logEntries: LogEntry[] = [
  { id: 'l1', level: 'error', message: 'Failed to process payment for subscription #SUB-2025-0421', source: 'payments', timestamp: '2025-06-21 14:32:18', details: 'Stripe API returned 402: card_declined. Retry attempt 2/3 failed.' },
  { id: 'l2', level: 'error', message: 'Email delivery failed to smtp.example.com: Connection timed out', source: 'email', timestamp: '2025-06-21 14:28:05', details: 'SMTP connection timeout after 30 seconds. Server: smtp.example.com:587.' },
  { id: 'l3', level: 'warn', message: 'Database query exceeded threshold (2.3s) on tenants table', source: 'database', timestamp: '2025-06-21 14:15:42', details: 'Slow query: SELECT * FROM tenants ORDER BY created_at DESC LIMIT 1000. Consider adding index.' },
  { id: 'l4', level: 'warn', message: 'High memory usage on queue-worker-3: 87% of 4GB', source: 'infra', timestamp: '2025-06-21 14:10:00', details: 'Memory: 3.48GB / 4GB. PID 2341 (php-fpm) using 420MB.' },
  { id: 'l5', level: 'info', message: 'New tenant registered: Acme Corporation', source: 'tenants', timestamp: '2025-06-21 13:45:12' },
  { id: 'l6', level: 'info', message: 'Backup completed successfully (1.2GB in 34s)', source: 'backup', timestamp: '2025-06-21 13:00:00' },
  { id: 'l7', level: 'debug', message: 'Cache flush triggered for tenant_1234_courses', source: 'cache', timestamp: '2025-06-21 12:30:00' },
  { id: 'l8', level: 'warn', message: 'Rate limit approaching for API key sk_live_3f8a***', source: 'api', timestamp: '2025-06-21 12:15:33', details: '1,850 / 2,000 requests in current window. Resets in 4 minutes.' },
  { id: 'l9', level: 'info', message: 'Course "Advanced React" published by instructor@example.com', source: 'courses', timestamp: '2025-06-21 11:50:00' },
  { id: 'l10', level: 'error', message: 'SSL certificate for admin.example.com expires in 7 days', source: 'infra', timestamp: '2025-06-21 11:00:00', details: 'Certificate: admin.example.com. Issuer: Let\'s Encrypt. Expires: 2025-06-28.' },
];

/* ─── Component ─── */

const LogsSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');
  const [logLevel, setLogLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorTrackingEnabled, setErrorTrackingEnabled] = useState(true);
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);

  const filteredLogs = logEntries.filter(entry => {
    if (logLevel !== 'all' && entry.level !== logLevel) return false;
    if (searchQuery && !entry.message.toLowerCase().includes(searchQuery.toLowerCase()) && !entry.source.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const statusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'degraded': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'down': return <XCircle size={16} className="text-destructive" />;
    }
  };

  const statusBadge = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500/10 text-emerald-600';
      case 'degraded': return 'bg-amber-500/10 text-amber-600';
      case 'down': return 'bg-destructive/10 text-destructive';
    }
  };

  const logLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'bg-destructive/10 text-destructive';
      case 'warn': return 'bg-amber-500/10 text-amber-600';
      case 'info': return 'bg-blue-500/10 text-blue-600';
      case 'debug': return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Logs & Monitoring" subtitle="System health overview, error tracking, and application logs" />

      {/* System Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Activity size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time status of all platform services</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{services.filter(s => s.status === 'healthy').length} healthy</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>{services.filter(s => s.status === 'degraded').length} degraded</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                <span>{services.filter(s => s.status === 'down').length} down</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  {statusIcon(service.status)}
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Uptime: {service.uptime} · Response: {service.responseTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${statusBadge(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{service.lastChecked}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Logs + Error Tracking + Performance */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="logs">
            <Terminal size={14} className="mr-1.5" />
            Application Logs
          </TabsTrigger>
          <TabsTrigger value="errors">
            <AlertTriangle size={14} className="mr-1.5" />
            Error Tracking
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Activity size={14} className="mr-1.5" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* ─── Application Logs Tab ─── */}
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Terminal size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle>Application Logs</CardTitle>
                  <CardDescription>Recent system events and error messages</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw size={14} className="mr-1" />
                  Refresh
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue="all" onValueChange={setLogLevel}>
                  <SelectTrigger className="w-full sm:w-36">
                    <Filter size={14} className="mr-1" />
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No logs match your filters.</p>
              ) : (
                <div className="divide-y">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="px-6 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[9px] px-1 py-0 font-mono ${logLevelBadge(log.level)}`}>
                              {log.level.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
                            <Badge variant="secondary" className="text-[9px] px-1 py-0">{log.source}</Badge>
                          </div>
                          <p className="text-sm mt-1">{log.message}</p>
                          {log.details && (
                            <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Error Tracking Tab ─── */}
        <TabsContent value="errors" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle>Error Tracking</CardTitle>
                  <CardDescription>Configure error reporting and monitoring services</CardDescription>
                </div>
                <Switch checked={errorTrackingEnabled} onCheckedChange={setErrorTrackingEnabled} />
              </div>
            </CardHeader>
            {errorTrackingEnabled && (
              <CardContent className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="error_provider">Error Tracking Provider</Label>
                    <Select defaultValue="sentry">
                      <SelectTrigger id="error_provider" className="w-full sm:w-48">
                        <SelectValue placeholder="Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sentry">Sentry</SelectItem>
                        <SelectItem value="rollbar">Rollbar</SelectItem>
                        <SelectItem value="bugsnag">Bugsnag</SelectItem>
                        <SelectItem value="datadog">Datadog</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error_environment">Environment</Label>
                    <Select defaultValue="production">
                      <SelectTrigger id="error_environment" className="w-full sm:w-48">
                        <SelectValue placeholder="Environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="error_dsn">DSN / API Key</Label>
                  <Input id="error_dsn" type="password" placeholder="https://key@o123.ingest.sentry.io/project" className="font-mono" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sample_rate">Sample Rate (%)</Label>
                    <Input id="sample_rate" type="number" defaultValue={100} className="w-full sm:w-32" min={0} max={100} />
                    <p className="text-xs text-muted-foreground">Percentage of errors to capture. Lower in high-traffic environments.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error_retention">Retention Period</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="error_retention" className="w-full sm:w-48">
                        <SelectValue placeholder="Retention" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">Capture Console Logs</p>
                    <p className="text-xs text-muted-foreground">Include browser console logs with error reports</p>
                  </div>
                  <Switch defaultChecked />
                </label>
                <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                  <Shield size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Error tracking helps identify and resolve issues before they impact users. Sensitive data is automatically scrubbed before transmission.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* ─── Performance Tab ─── */}
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Activity size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle>Performance Monitoring</CardTitle>
                  <CardDescription>Configure performance tracking and alert thresholds</CardDescription>
                </div>
                <Switch checked={monitoringEnabled} onCheckedChange={setMonitoringEnabled} />
              </div>
            </CardHeader>
            {monitoringEnabled && (
              <CardContent className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="perf_provider">Monitoring Provider</Label>
                    <Select defaultValue="datadog">
                      <SelectTrigger id="perf_provider" className="w-full sm:w-48">
                        <SelectValue placeholder="Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="datadog">Datadog</SelectItem>
                        <SelectItem value="newrelic">New Relic</SelectItem>
                        <SelectItem value="grafana">Grafana Cloud</SelectItem>
                        <SelectItem value="prometheus">Prometheus + Grafana</SelectItem>
                        <SelectItem value="custom">Custom Endpoint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perf_endpoint">API Endpoint</Label>
                    <Input id="perf_endpoint" placeholder="https://api.datadoghq.com/api/v1/series" className="font-mono" />
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-3">Alert Thresholds</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="threshold_latency">Latency Threshold (ms)</Label>
                      <Input id="threshold_latency" type="number" defaultValue={500} className="w-full sm:w-32" />
                      <p className="text-xs text-muted-foreground">Alert when avg response time exceeds</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threshold_error_rate">Error Rate Threshold (%)</Label>
                      <Input id="threshold_error_rate" type="number" defaultValue={1} className="w-full sm:w-32" step="0.1" />
                      <p className="text-xs text-muted-foreground">Alert when error rate exceeds</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threshold_cpu">CPU Usage Threshold (%)</Label>
                      <Input id="threshold_cpu" type="number" defaultValue={80} className="w-full sm:w-32" />
                      <p className="text-xs text-muted-foreground">Alert when CPU usage exceeds</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">APM (Application Performance Monitoring)</p>
                    <p className="text-xs text-muted-foreground">Track detailed transaction traces and database query performance</p>
                  </div>
                  <Switch defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">Real User Monitoring (RUM)</p>
                    <p className="text-xs text-muted-foreground">Collect performance data from actual user browsers</p>
                  </div>
                  <Switch defaultChecked />
                </label>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} />
          <span>Logs are retained for 30 days. System health checks run every 60 seconds.</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600 font-medium animate-in fade-in">Settings saved</span>}
          <form onSubmit={handleSave}>
            <Button type="submit" disabled={saving}>
              <Save size={16} className="mr-1.5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogsSettingsPage;
