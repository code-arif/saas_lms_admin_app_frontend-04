import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Cloud, Globe, Database, RefreshCw, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface EnvVar {
  key: string;
  value: string;
  masked: boolean;
  updated: boolean;
}

const initialEnvVars: EnvVar[] = [
  { key: 'APP_ENV', value: 'production', masked: false, updated: false },
  { key: 'APP_URL', value: 'https://admin.example.com', masked: false, updated: false },
  { key: 'DB_HOST', value: 'prod-db.example.com', masked: false, updated: false },
  { key: 'DB_NAME', value: 'lms_production', masked: false, updated: false },
  { key: 'REDIS_HOST', value: 'redis.internal', masked: false, updated: false },
  { key: 'AWS_ACCESS_KEY_ID', value: 'AKIA**********', masked: true, updated: false },
  { key: 'AWS_SECRET_ACCESS_KEY', value: '****', masked: true, updated: false },
  { key: 'SENTRY_DSN', value: 'https://****@sentry.io/****', masked: true, updated: false },
];

const EnvironmentSettingsPage = () => {
  const [envVars, setEnvVars] = useState<EnvVar[]>(initialEnvVars);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMask = (index: number) => {
    setEnvVars(prev =>
      prev.map((v, i) => (i === index ? { ...v, masked: !v.masked } : v))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setEnvVars(prev =>
        prev.map(v => ({ ...v, updated: true }))
      );
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Environment Settings" subtitle="Manage environment variables and deployment configuration" />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Environment Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Cloud size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Environment Overview</CardTitle>
                <CardDescription>Current deployment environment information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                <Globe size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Environment</p>
                  <p className="text-sm font-medium">Production</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                <Database size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Version</p>
                  <p className="text-sm font-medium">v2.4.1</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                <RefreshCw size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Deployed</p>
                  <p className="text-sm font-medium">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>Manage your application environment variables</CardDescription>
              </div>
              <Badge variant="secondary">{envVars.length} variables</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {envVars.map((env, index) => (
              <div key={env.key}>
                {index > 0 && <Separator className="mb-3" />}
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={`env-${index}`} className="text-xs font-mono text-muted-foreground">
                      {env.key}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id={`env-${index}`}
                        type={env.masked ? 'password' : 'text'}
                        value={env.value}
                        onChange={(e) =>
                          setEnvVars(prev =>
                            prev.map((v, i) =>
                              i === index ? { ...v, value: e.target.value, updated: false } : v
                            )
                          )
                        }
                        className="pr-20 font-mono text-sm"
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleMask(index)}
                          className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        >
                          {env.masked ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {env.updated && (
                    <CheckCircle size={16} className="text-green-500 shrink-0 mt-5" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Deployment Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <RefreshCw size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Deployment Settings</CardTitle>
                <CardDescription>Configure deployment automation preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deploy_branch">Deploy Branch</Label>
                <Input id="deploy_branch" defaultValue="main" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="build_command">Build Command</Label>
                <Input id="build_command" defaultValue="npm run build" className="font-mono" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">Reset</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnvironmentSettingsPage;
