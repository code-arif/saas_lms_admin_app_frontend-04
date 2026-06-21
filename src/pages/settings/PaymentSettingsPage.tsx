import PageTitle from '@/components/common/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { CreditCard, DollarSign, Percent, Shield } from 'lucide-react';
import { useState } from 'react';

const PaymentSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate saving
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Payment Settings" subtitle="Configure payment gateways and billing preferences" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Gateway */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Payment Gateway</CardTitle>
                <CardDescription>Configure your primary payment processor</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gateway">Gateway Provider</Label>
              <Select defaultValue="stripe">
                <SelectTrigger id="gateway" className="w-full sm:w-72">
                  <SelectValue placeholder="Select gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishable_key">Publishable Key</Label>
                <Input id="publishable_key" type="password" placeholder="pk_live_..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret_key">Secret Key</Label>
                <Input id="secret_key" type="password" placeholder="sk_live_..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook_secret">Webhook Secret</Label>
              <Input id="webhook_secret" type="password" placeholder="whsec_..." />
            </div>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <DollarSign size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Billing Preferences</CardTitle>
                <CardDescription>Set default billing behavior</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="inr">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_cycle">Billing Cycle</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger id="billing_cycle">
                    <SelectValue placeholder="Cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice_prefix">Invoice Prefix</Label>
                <Input id="invoice_prefix" placeholder="INV-" defaultValue="INV-" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax & Fees */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Percent size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle>Tax & Fees</CardTitle>
                <CardDescription>Configure tax rates and additional fees</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Default Tax Rate (%)</Label>
                <Input id="tax_rate" type="number" step="0.01" defaultValue="0" className="w-full sm:w-40" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_model">Tax Model</Label>
                <Select defaultValue="inclusive">
                  <SelectTrigger id="tax_model" className="w-full sm:w-48">
                    <SelectValue placeholder="Tax model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inclusive">Inclusive</SelectItem>
                    <SelectItem value="exclusive">Exclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield size={14} />
              <span>All payment data is encrypted in transit and at rest.</span>
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

export default PaymentSettingsPage;
