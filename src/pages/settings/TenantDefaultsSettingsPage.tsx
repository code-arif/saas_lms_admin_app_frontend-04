import { useState } from 'react';
import { Building2, CreditCard, HardDrive, Users, BookOpen, Shield, Save, Globe } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';

/* ─── Component ─── */

const TenantDefaultsSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoApprove, setAutoApprove] = useState(true);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

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
      <PageTitle title="Tenant Defaults" subtitle="Configure default settings applied to all newly created tenants" />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Plan & Subscription Defaults */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Plan & Subscription</CardTitle>
                <CardDescription>Default plan and billing settings for new tenants</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default_plan">Default Plan</Label>
                <Select defaultValue="free">
                  <SelectTrigger id="default_plan" className="w-full sm:w-48">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Plan assigned when a new tenant registers</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trial_days">Trial Period (days)</Label>
                <Input id="trial_days" type="number" defaultValue={14} className="w-full sm:w-32" min={0} />
                <p className="text-xs text-muted-foreground">Set to 0 for no trial period</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_cycle">Default Billing Cycle</Label>
              <Select defaultValue="monthly">
                <SelectTrigger id="billing_cycle" className="w-full sm:w-48">
                  <SelectValue placeholder="Billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly (2 months free)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-approve New Tenants</Label>
                <p className="text-xs text-muted-foreground">Automatically approve registrations without manual review</p>
              </div>
              <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
            </div>
          </CardContent>
        </Card>

        {/* Default Role & Admin */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Role & Admin Defaults</CardTitle>
                <CardDescription>Default permissions and admin settings for new tenants</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default_role">Default Admin Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger id="default_role" className="w-full sm:w-48">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Role assigned to the primary tenant admin</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_admins">Max Admin Accounts</Label>
                <Input id="max_admins" type="number" defaultValue={5} className="w-full sm:w-32" min={1} />
                <p className="text-xs text-muted-foreground">Maximum admin users per tenant</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Send Welcome Email</Label>
                <p className="text-xs text-muted-foreground">Send onboarding instructions to new tenant admins</p>
              </div>
              <Switch checked={sendWelcomeEmail} onCheckedChange={setSendWelcomeEmail} />
            </div>
          </CardContent>
        </Card>

        {/* Storage Quotas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <HardDrive size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Storage Quotas</CardTitle>
                <CardDescription>Default storage limits for tenant content and uploads</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storage_total">Total Storage (GB)</Label>
                <Input id="storage_total" type="number" defaultValue={5} className="w-full sm:w-32" min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage_courses">Course Media (GB)</Label>
                <Input id="storage_courses" type="number" defaultValue={3} className="w-full sm:w-32" min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage_documents">Documents (GB)</Label>
                <Input id="storage_documents" type="number" defaultValue={2} className="w-full sm:w-32" min={0} />
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2 text-sm">
                <Globe size={14} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Total allocated: <span className="font-medium text-foreground">5 GB</span> per tenant.
                  Storage quotas can be overridden per tenant in the tenant detail page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User & Course Limits */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Users size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>User & Course Limits</CardTitle>
                <CardDescription>Default caps on users, courses, and content per tenant</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_users">Max Users</Label>
                <Input id="max_users" type="number" defaultValue={50} className="w-full sm:w-28" min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_courses">Max Courses</Label>
                <Input id="max_courses" type="number" defaultValue={10} className="w-full sm:w-28" min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_classes">Max Live Classes</Label>
                <Input id="max_classes" type="number" defaultValue={5} className="w-full sm:w-28" min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_instructors">Max Instructors</Label>
                <Input id="max_instructors" type="number" defaultValue={3} className="w-full sm:w-28" min={0} />
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">
                Set to <span className="font-medium text-foreground">0</span> for unlimited. These limits apply
                per tenant and can be customized per plan tier or overridden individually.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="default_language">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="default_language" className="w-full sm:w-48">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Default interface language for new tenant portals</p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Access Defaults */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Feature Access</CardTitle>
                <CardDescription>Default feature toggles granted to new tenants</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Course Builder', desc: 'Create and manage courses with full curriculum', defaultOn: true },
              { name: 'Live Classes', desc: 'Schedule and host real-time virtual classes', defaultOn: true },
              { name: 'Quizzes & Assessments', desc: 'Create auto-graded quizzes and exams', defaultOn: true },
              { name: 'Certificates', desc: 'Generate completion certificates for learners', defaultOn: false },
              { name: 'Discussion Forums', desc: 'Enable course discussion boards', defaultOn: true },
              { name: 'API Access', desc: 'REST API for custom integrations', defaultOn: false },
              { name: 'Custom Domain', desc: 'Allow tenant to use a custom domain', defaultOn: false },
              { name: 'White-labeling', desc: 'Remove LMS branding from tenant portal', defaultOn: false },
            ].map((feature, index) => (
              <div key={index}>
                {index > 0 && <Separator className="mb-3" />}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{feature.name}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                  <Switch defaultChecked={feature.defaultOn} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 size={14} />
            <span>Defaults apply to new tenants. Existing tenants are not affected.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline">Reset to Defaults</Button>
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

export default TenantDefaultsSettingsPage;
