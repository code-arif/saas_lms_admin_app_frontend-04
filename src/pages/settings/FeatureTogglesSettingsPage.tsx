import { useState } from 'react';
import { ToggleLeft, BookOpen, Video, MessageSquare, Award, Star, BarChart3, Bot, Globe, Shield, Save, CreditCard, FileText, Headphones } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

/* ─── Types ─── */

type FeatureCategory = 'learning' | 'monetization' | 'communication' | 'advanced';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: FeatureCategory;
  icon: typeof BookOpen;
  plans: string[];
  isNew?: boolean;
  isBeta?: boolean;
}

/* ─── Data ─── */

const categories: { id: FeatureCategory; label: string; description: string; color: string }[] = [
  { id: 'learning', label: 'Learning & Courses', description: 'Course management, classes, assessments, and certifications', color: 'bg-blue-500/10 text-blue-600' },
  { id: 'monetization', label: 'Monetization', description: 'Subscriptions, payments, coupons, and trials', color: 'bg-emerald-500/10 text-emerald-600' },
  { id: 'communication', label: 'Communication', description: 'Notifications, chat, email, and support', color: 'bg-purple-500/10 text-purple-600' },
  { id: 'advanced', label: 'Advanced', description: 'AI, analytics, API, custom domains, and integrations', color: 'bg-amber-500/10 text-amber-600' },
];

const defaultFeatures: FeatureFlag[] = [
  // Learning
  { id: 'f1', name: 'Courses', description: 'Full course management with lessons, modules, and curriculum', enabled: true, category: 'learning', icon: BookOpen, plans: ['Free', 'Pro', 'Enterprise'] },
  { id: 'f2', name: 'Live Classes', description: 'Schedule and conduct real-time virtual classes with video', enabled: true, category: 'learning', icon: Video, plans: ['Pro', 'Enterprise'] },
  { id: 'f3', name: 'Quizzes & Assessments', description: 'Create quizzes, exams, and auto-graded assessments', enabled: true, category: 'learning', icon: FileText, plans: ['Pro', 'Enterprise'] },
  { id: 'f4', name: 'Certificates', description: 'Generate custom certificates upon course completion', enabled: true, category: 'learning', icon: Award, plans: ['Pro', 'Enterprise'], isNew: true },
  { id: 'f5', name: 'Assignments', description: 'Homework submission, grading, and feedback workflow', enabled: false, category: 'learning', icon: FileText, plans: ['Enterprise'] },
  { id: 'f6', name: 'Discussion Forums', description: 'Course-level discussion boards for students and instructors', enabled: true, category: 'learning', icon: MessageSquare, plans: ['Free', 'Pro', 'Enterprise'] },
  { id: 'f7', name: 'Gamification', description: 'Points, badges, leaderboards, and achievement systems', enabled: false, category: 'learning', icon: Star, plans: ['Enterprise'], isBeta: true },
  // Monetization
  { id: 'f8', name: 'Subscriptions', description: 'Recurring billing with plan tiers and trial periods', enabled: true, category: 'monetization', icon: CreditCard, plans: ['Pro', 'Enterprise'] },
  { id: 'f9', name: 'Coupons & Discounts', description: 'Create promotional codes and discount campaigns', enabled: true, category: 'monetization', icon: Star, plans: ['Pro', 'Enterprise'] },
  { id: 'f10', name: 'Free Trials', description: 'Allow new tenants to start with a free trial period', enabled: true, category: 'monetization', icon: Star, plans: ['Free', 'Pro', 'Enterprise'] },
  { id: 'f11', name: 'Payment Gateways', description: 'Support multiple payment processors (Stripe, PayPal, etc.)', enabled: true, category: 'monetization', icon: CreditCard, plans: ['Pro', 'Enterprise'] },
  // Communication
  { id: 'f12', name: 'Email Notifications', description: 'Transactional email alerts for payments, updates, and reminders', enabled: true, category: 'communication', icon: MessageSquare, plans: ['Free', 'Pro', 'Enterprise'] },
  { id: 'f13', name: 'In-App Chat', description: 'Real-time messaging between admins, instructors, and students', enabled: false, category: 'communication', icon: Headphones, plans: ['Enterprise'] },
  { id: 'f14', name: 'Support Ticketing', description: 'Ticket-based support system for tenant issues', enabled: true, category: 'communication', icon: Headphones, plans: ['Pro', 'Enterprise'] },
  { id: 'f15', name: 'Push Notifications', description: 'Mobile and browser push notifications for important events', enabled: false, category: 'communication', icon: Globe, plans: ['Enterprise'], isBeta: true },
  // Advanced
  { id: 'f16', name: 'AI Assistant', description: 'AI-powered content generation, grading, and recommendations', enabled: false, category: 'advanced', icon: Bot, plans: ['Enterprise'], isNew: true },
  { id: 'f17', name: 'Advanced Analytics', description: 'Detailed reports, dashboards, and data export', enabled: true, category: 'advanced', icon: BarChart3, plans: ['Pro', 'Enterprise'] },
  { id: 'f18', name: 'API Access', description: 'REST API for external integrations and custom development', enabled: true, category: 'advanced', icon: Globe, plans: ['Enterprise'] },
  { id: 'f19', name: 'Custom Domains', description: 'Allow tenants to use custom domains for their portals', enabled: false, category: 'advanced', icon: Globe, plans: ['Enterprise'] },
  { id: 'f20', name: 'White-labeling', description: 'Remove LMS branding and add custom branding per tenant', enabled: false, category: 'advanced', icon: Shield, plans: ['Enterprise'] },
  { id: 'f21', name: 'Multi-language', description: 'Support multiple languages and RTL layouts', enabled: true, category: 'advanced', icon: Globe, plans: ['Pro', 'Enterprise'] },
];

/* ─── Category Icons ─── */

const categoryIcons: Record<FeatureCategory, typeof BookOpen> = {
  learning: BookOpen,
  monetization: CreditCard,
  communication: MessageSquare,
  advanced: Bot,
};

/* ─── Component ─── */

const FeatureTogglesSettingsPage = () => {
  const [features, setFeatures] = useState<FeatureFlag[]>(defaultFeatures);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const toggleCategory = (category: FeatureCategory, value: boolean) => {
    setFeatures(prev => prev.map(f =>
      f.category === category ? { ...f, enabled: value } : f
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

  const filteredFeatures = activeTab === 'all'
    ? features
    : features.filter(f => f.category === activeTab);

  const enabledCount = features.filter(f => f.enabled).length;

  return (
    <div className="space-y-6">
      <PageTitle title="Feature Toggles" subtitle="Globally enable or disable platform features. Changes apply to all tenants." />

      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ToggleLeft size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{enabledCount} of {features.length} features enabled</p>
            <div className="w-48 h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(enabledCount / features.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          {activeTab === 'all' ? (
            categories.map(cat => {
              const catFeatures = features.filter(f => f.category === cat.id);
              const allEnabled = catFeatures.every(f => f.enabled);
              return (
                <Button
                  key={cat.id}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategory(cat.id, !allEnabled)}
                  className="text-xs"
                >
                  {allEnabled ? 'Disable' : 'Enable'} {cat.label.split(' ')[0]}
                </Button>
              );
            })
          ) : (
            (() => {
              const catFeatures = features.filter(f => f.category === activeTab);
              const allEnabled = catFeatures.every(f => f.enabled);
              return (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategory(activeTab as FeatureCategory, !allEnabled)}
                  className="text-xs"
                >
                  {allEnabled ? 'Disable all' : 'Enable all'}
                </Button>
              );
            })()
          )}
        </div>
      </div>

      {/* Feature Toggles */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList>
              <TabsTrigger value="all">
                All Features
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1">{features.length}</Badge>
              </TabsTrigger>
              {categories.map(cat => {
                const catCount = features.filter(f => f.category === cat.id).length;
                return (
                  <TabsTrigger key={cat.id} value={cat.id}>
                    {cat.label}
                    <Badge variant="secondary" className="ml-1.5 text-[10px] px-1">{catCount}</Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </CardHeader>
          <CardContent className="p-0">
            {['all', ...categories.map(c => c.id)].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="m-0">
                {tabValue !== 'all' && (
                  <div className="px-6 pt-4 pb-2 border-b">
                    {(() => {
                      const cat = categories.find(c => c.id === tabValue)!;
                      const CatIcon = categoryIcons[tabValue as FeatureCategory];
                      return (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <CatIcon size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{cat.label}</p>
                            <p className="text-xs text-muted-foreground">{cat.description}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {filteredFeatures.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No features in this category.</p>
                ) : (
                  <div className="divide-y">
                    {filteredFeatures.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div key={feature.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                feature.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                              }`}>
                                <Icon size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium">{feature.name}</span>
                                  {feature.isNew && (
                                    <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">NEW</Badge>
                                  )}
                                  {feature.isBeta && (
                                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 text-amber-600 border-amber-500/20 bg-amber-500/10">BETA</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="text-[10px] text-muted-foreground">Available on:</span>
                                  {feature.plans.map(plan => (
                                    <Badge key={plan} variant="secondary" className="text-[9px] px-1 py-0">
                                      {plan}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 pt-1">
                              <span className={`text-xs ${feature.enabled ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}`}>
                                {feature.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                              <Switch
                                checked={feature.enabled}
                                onCheckedChange={() => toggleFeature(feature.id)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe size={14} />
          <span>Feature changes are global. Use plan settings to restrict features per plan tier.</span>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline">Reset to Defaults</Button>
          {saved && <span className="text-sm text-emerald-600 font-medium animate-in fade-in">Changes saved</span>}
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} className="mr-1.5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureTogglesSettingsPage;
