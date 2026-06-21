import { useState } from 'react';
import { Bell, Mail, Smartphone, Shield, Save } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Switch } from '@/components/ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

/* ─── Types ─── */

interface NotificationRule {
  id: string;
  event: string;
  description: string;
  email: boolean;
  inApp: boolean;
  push: boolean;
  category: NotificationCategory;
}

type NotificationCategory = 'billing' | 'system' | 'user' | 'learning';

interface NotificationCategoryInfo {
  id: NotificationCategory;
  label: string;
  description: string;
  color: string;
}

/* ─── Data ─── */

const categories: NotificationCategoryInfo[] = [
  { id: 'billing', label: 'Billing & Account', description: 'Subscriptions, payments, invoices, and account changes', color: 'bg-blue-500/10 text-blue-600' },
  { id: 'system', label: 'System Alerts', description: 'Maintenance, security, performance, and error alerts', color: 'bg-amber-500/10 text-amber-600' },
  { id: 'user', label: 'User Activity', description: 'Registrations, role changes, and user management', color: 'bg-emerald-500/10 text-emerald-600' },
  { id: 'learning', label: 'Course & Learning', description: 'Course publications, completions, and enrollments', color: 'bg-purple-500/10 text-purple-600' },
];

const defaultRules: NotificationRule[] = [
  // Billing
  { id: 'n1', event: 'payment.completed', description: 'When a payment is successfully processed', email: true, inApp: true, push: false, category: 'billing' },
  { id: 'n2', event: 'payment.failed', description: 'When a payment attempt fails', email: true, inApp: true, push: true, category: 'billing' },
  { id: 'n3', event: 'subscription.renewed', description: 'When a subscription is automatically renewed', email: true, inApp: true, push: false, category: 'billing' },
  { id: 'n4', event: 'subscription.cancelled', description: 'When a tenant cancels their subscription', email: true, inApp: true, push: true, category: 'billing' },
  { id: 'n5', event: 'subscription.trial_ending', description: 'When a trial period is about to expire', email: true, inApp: true, push: false, category: 'billing' },
  // System
  { id: 'n6', event: 'maintenance.scheduled', description: 'When scheduled maintenance is planned', email: true, inApp: true, push: false, category: 'system' },
  { id: 'n7', event: 'system.error', description: 'When a critical system error occurs', email: true, inApp: true, push: true, category: 'system' },
  { id: 'n8', event: 'backup.completed', description: 'When an automated backup finishes', email: false, inApp: true, push: false, category: 'system' },
  { id: 'n9', event: 'backup.failed', description: 'When an automated backup fails', email: true, inApp: true, push: true, category: 'system' },
  { id: 'n10', event: 'usage.threshold', description: 'When usage exceeds configured thresholds', email: true, inApp: true, push: false, category: 'system' },
  // User
  { id: 'n11', event: 'tenant.registered', description: 'When a new tenant signs up', email: true, inApp: true, push: false, category: 'user' },
  { id: 'n12', event: 'tenant.suspended', description: 'When a tenant account is suspended', email: true, inApp: true, push: true, category: 'user' },
  { id: 'n13', event: 'user.role_changed', description: 'When a user\'s role or permissions change', email: true, inApp: true, push: false, category: 'user' },
  { id: 'n14', event: 'admin.login.new_device', description: 'When an admin logs in from a new device', email: true, inApp: true, push: false, category: 'user' },
  // Learning
  { id: 'n15', event: 'course.published', description: 'When a course is published to the platform', email: false, inApp: true, push: false, category: 'learning' },
  { id: 'n16', event: 'course.completed', description: 'When a learner completes a course', email: false, inApp: false, push: false, category: 'learning' },
  { id: 'n17', event: 'enrollment.bulk', description: 'When bulk enrollment is processed', email: true, inApp: true, push: false, category: 'learning' },
  { id: 'n18', event: 'certificate.issued', description: 'When a certificate is generated', email: true, inApp: true, push: false, category: 'learning' },
];

/* ─── Component ─── */

const NotificationSettingsPage = () => {
  const [rules, setRules] = useState<NotificationRule[]>(defaultRules);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [saved, setSaved] = useState(false);

  const toggleChannel = (ruleId: string, channel: 'email' | 'inApp' | 'push') => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, [channel]: !rule[channel] } : rule
    ));
  };

  const toggleCategory = (category: NotificationCategory, channel: 'email' | 'inApp' | 'push', value: boolean) => {
    setRules(prev => prev.map(rule =>
      rule.category === category ? { ...rule, [channel]: value } : rule
    ));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const filteredRules = activeTab === 'all'
    ? rules
    : rules.filter(r => r.category === activeTab);

  return (
    <div className="space-y-6">
      <PageTitle title="Notification Settings" subtitle="Control which notifications are sent and how they are delivered" />

      {/* ─── Channels Overview ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Mail size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-xs text-muted-foreground">
              {rules.filter(r => r.email).length} of {rules.length} enabled
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Bell size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">In-App</p>
            <p className="text-xs text-muted-foreground">
              {rules.filter(r => r.inApp).length} of {rules.length} enabled
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Smartphone size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Push</p>
            <p className="text-xs text-muted-foreground">
              {rules.filter(r => r.push).length} of {rules.length} enabled
            </p>
          </div>
        </div>
      </div>

      {/* ─── Notification Rules ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bell size={18} className="text-primary" />
            </div>
            <div>
              <CardTitle>Notification Rules</CardTitle>
              <CardDescription>Configure which events trigger notifications and how they are delivered</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-2">
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                {categories.map(cat => (
                  <TabsTrigger key={cat.id} value={cat.id}>{cat.label}</TabsTrigger>
                ))}
              </TabsList>
            </div>

            {['all', ...categories.map(c => c.id)].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="m-0">
                {tabValue !== 'all' && (
                  <div className="px-6 pt-4 pb-2">
                    {(() => {
                      const cat = categories.find(c => c.id === tabValue)!;
                      const catRules = rules.filter(r => r.category === tabValue);
                      return (
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge variant="outline" className={cat.color}>{cat.label}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={catRules.every(r => r.email)}
                                onChange={(e) => toggleCategory(tabValue as NotificationCategory, 'email', e.target.checked)}
                                className="rounded border-input"
                              />
                              Email all
                            </label>
                            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={catRules.every(r => r.inApp)}
                                onChange={(e) => toggleCategory(tabValue as NotificationCategory, 'inApp', e.target.checked)}
                                className="rounded border-input"
                              />
                              In-App all
                            </label>
                            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={catRules.every(r => r.push)}
                                onChange={(e) => toggleCategory(tabValue as NotificationCategory, 'push', e.target.checked)}
                                className="rounded border-input"
                              />
                              Push all
                            </label>
                          </div>
                        </div>
                      );
                    })()}
                    <Separator className="mt-3" />
                  </div>
                )}

                {tabValue === 'all' && (
                  <div className="px-6 pt-4 pb-2">
                    <div className="grid grid-cols-[1fr_60px_60px_60px] gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                      <span>Event</span>
                      <span className="text-center">Email</span>
                      <span className="text-center">In-App</span>
                      <span className="text-center">Push</span>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                )}

                <div className="divide-y">
                  {filteredRules.map((rule) => {
                    const cat = categories.find(c => c.id === rule.category)!;
                    return (
                      <div key={rule.id} className="px-6 py-3 hover:bg-muted/30 transition-colors">
                        <div className="grid grid-cols-[1fr_60px_60px_60px] gap-4 items-center">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono text-muted-foreground">{rule.event}</code>
                              <Badge variant="outline" className={`text-[9px] px-1 py-0 ${cat.color}`}>
                                {cat.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              checked={rule.email}
                              onCheckedChange={() => toggleChannel(rule.id, 'email')}
                            />
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              checked={rule.inApp}
                              onCheckedChange={() => toggleChannel(rule.id, 'inApp')}
                            />
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              checked={rule.push}
                              onCheckedChange={() => toggleChannel(rule.id, 'push')}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredRules.length === 0 && (
                  <p className="text-sm text-muted-foreground py-8 text-center">No notification rules in this category.</p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield size={14} />
          <span>Notification delivery is subject to your email and push provider configurations.</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-emerald-600 font-medium animate-in fade-in">Settings saved</span>
          )}
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} className="mr-1.5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
