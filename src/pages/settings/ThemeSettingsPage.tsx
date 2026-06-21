import { useState } from 'react';
import { Palette, Monitor, FileCode, Layout, Cookie, Shield, Save, Globe } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Separator } from '@/components/ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

/* ─── Component ─── */

const ThemeSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCustomCss, setShowCustomCss] = useState(false);
  const [showCustomJs, setShowCustomJs] = useState(false);
  const [cookieConsentEnabled, setCookieConsentEnabled] = useState(true);

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
      <PageTitle title="Theme & White-labeling" subtitle="Customize the platform appearance, login page, and branding" />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Login Page Customization */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Monitor size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Login Page</CardTitle>
                <CardDescription>Customize the appearance of your login and authentication pages</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="login_logo">Login Page Logo URL</Label>
                <Input id="login_logo" placeholder="https://example.com/logo-white.png" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login_background">Background Image URL</Label>
                <Input id="login_background" placeholder="https://example.com/bg.jpg" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="login_title">Login Page Title</Label>
                <Input id="login_title" defaultValue="Sign in to LMS Admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login_subtitle">Login Page Subtitle</Label>
                <Input id="login_subtitle" defaultValue="Enter your credentials to access the dashboard" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="login_primary_color">Primary Button Color</Label>
                <div className="flex gap-2">
                  <Input id="login_primary_color" type="color" defaultValue="#6366f1" className="w-16 p-1 h-10" />
                  <Input defaultValue="#6366f1" className="flex-1 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login_bg_color">Page Background Color</Label>
                <div className="flex gap-2">
                  <Input id="login_bg_color" type="color" defaultValue="#0f172a" className="w-16 p-1 h-10" />
                  <Input defaultValue="#0f172a" className="flex-1 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login_text_color">Text Color</Label>
                <div className="flex gap-2">
                  <Input id="login_text_color" type="color" defaultValue="#ffffff" className="w-16 p-1 h-10" />
                  <Input defaultValue="#ffffff" className="flex-1 font-mono" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Social Login</Label>
                <p className="text-xs text-muted-foreground">Display Google, GitHub, and other social login buttons</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show "Remember Me"</Label>
                <p className="text-xs text-muted-foreground">Display the remember me checkbox on the login form</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Branding & Identity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Palette size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Branding & Identity</CardTitle>
                <CardDescription>Override platform branding across the admin dashboard</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="app_name">App Display Name</Label>
                <Input id="app_name" defaultValue="LMS Admin" placeholder="My LMS Platform" />
                <p className="text-xs text-muted-foreground">Overrides the default application name in the sidebar header</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon_url">Favicon URL</Label>
                <Input id="favicon_url" placeholder="https://example.com/favicon.ico" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="custom_domain">Custom Admin Domain</Label>
              <Input id="custom_domain" placeholder="admin.myplatform.com" className="font-mono" />
              <p className="text-xs text-muted-foreground">Serve the admin panel from a custom domain. Requires DNS configuration.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sidebar_logo">Sidebar Logo URL</Label>
              <Input id="sidebar_logo" placeholder="https://example.com/logo-sidebar.png" />
            </div>
          </CardContent>
        </Card>

        {/* Custom CSS / JS */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileCode size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Custom CSS & JavaScript</CardTitle>
                <CardDescription>Inject custom styles and scripts into the admin panel</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="css">
              <TabsList>
                <TabsTrigger value="css">
                  <FileCode size={14} className="mr-1.5" />
                  Custom CSS
                </TabsTrigger>
                <TabsTrigger value="js">
                  <FileCode size={14} className="mr-1.5" />
                  Custom JavaScript
                </TabsTrigger>
              </TabsList>
              <TabsContent value="css" className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom_css">Inject Custom CSS</Label>
                  <Switch checked={showCustomCss} onCheckedChange={setShowCustomCss} />
                </div>
                {showCustomCss && (
                  <>
                    <Textarea
                      id="custom_css"
                      placeholder="/* Custom styles for the admin panel */\n\n.sidebar { background: #1e293b; }\n.header { border-bottom: 1px solid #e2e8f0; }"
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                      <Shield size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-muted-foreground text-xs">
                        CSS is injected into the admin panel only. Use with caution — invalid CSS may break the UI.
                        A preview is shown below.
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>
              <TabsContent value="js" className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom_js">Inject Custom JavaScript</Label>
                  <Switch checked={showCustomJs} onCheckedChange={setShowCustomJs} />
                </div>
                {showCustomJs && (
                  <>
                    <Textarea
                      id="custom_js"
                      placeholder="// Custom JavaScript for the admin panel\n\nconsole.log('Admin panel loaded!');\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  // Your custom logic here\n});"
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                      <Shield size={16} className="text-destructive shrink-0 mt-0.5" />
                      <p className="text-destructive text-xs">
                        Security warning: Custom JavaScript runs with full access to the admin panel.
                        Only inject code from trusted sources.
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Customization */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Layout size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Footer</CardTitle>
                <CardDescription>Customize the footer text, links, and copyright notice</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="footer_text">Footer Text</Label>
              <Input id="footer_text" defaultValue="© 2026 LMS Admin. All rights reserved." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer_links">Footer Links (one per line, format: label|url)</Label>
              <Textarea
                id="footer_links"
                placeholder="Privacy Policy|/privacy&#10;Terms of Service|/terms&#10;Support|/support"
                rows={4}
                className="font-mono text-sm"
                defaultValue="Privacy Policy|/privacy&#10;Terms of Service|/terms"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Powered By</Label>
                <p className="text-xs text-muted-foreground">Display the "Powered by LMS Admin" badge in the footer</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Cookie Consent / GDPR */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Cookie size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Cookie Consent & GDPR</CardTitle>
                <CardDescription>Configure cookie consent banners for compliance</CardDescription>
              </div>
              <Switch checked={cookieConsentEnabled} onCheckedChange={setCookieConsentEnabled} />
            </div>
          </CardHeader>
          {cookieConsentEnabled && (
            <CardContent className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cookie_banner_title">Banner Title</Label>
                  <Input id="cookie_banner_title" defaultValue="We value your privacy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookie_policy_link">Privacy Policy URL</Label>
                  <Input id="cookie_policy_link" defaultValue="/privacy" className="font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookie_banner_message">Banner Message</Label>
                <Textarea
                  id="cookie_banner_message"
                  placeholder="We use cookies to enhance your experience..."
                  rows={3}
                  defaultValue="We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cookie_consent_mode">Consent Mode</Label>
                  <Select defaultValue="opt_in">
                    <SelectTrigger id="cookie_consent_mode">
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opt_in">Opt-in (explicit consent required)</SelectItem>
                      <SelectItem value="opt_out">Opt-out (implied consent)</SelectItem>
                      <SelectItem value="necessary">Essential only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookie_position">Banner Position</Label>
                  <Select defaultValue="bottom">
                    <SelectTrigger id="cookie_position">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom">Bottom bar</SelectItem>
                      <SelectItem value="bottom_left">Bottom-left corner</SelectItem>
                      <SelectItem value="bottom_right">Bottom-right corner</SelectItem>
                      <SelectItem value="modal">Center modal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe size={14} />
            <span>Theme changes are applied immediately to the admin panel. Some changes may require a page refresh.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline">Preview Changes</Button>
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

export default ThemeSettingsPage;
