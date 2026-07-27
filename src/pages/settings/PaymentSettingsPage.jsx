// ====================================================================
// Module: Settings
// Page: Payment Settings
//
// Purpose:
// Configure the payment gateway for fee collection.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useState, useEffect } from 'react'
import { CreditCard, Save } from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { FormSection } from '@/components/FormSection'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { usePaymentSettings } from '@/hooks/useSettings'

const GATEWAYS = ['Stripe', 'Razorpay', 'PayPal']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY']

export default function PaymentSettingsPage() {
  const { settings, isLoading, updateSettings } = usePaymentSettings()
  const [form, setForm] = useState(settings)

  useEffect(() => { setForm(settings) }, [settings])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const handleSave = () => updateSettings(form)

  if (isLoading) return <LoadingSkeleton variant="cards" />

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Payment' }]} />
      <PageHeader
        title="Payment Settings"
        description="Configure the payment gateway for online fee collection."
        icon={CreditCard}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gateway Configuration</CardTitle>
          <CardDescription>Payment provider credentials and options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Enable Online Payments</p>
              <p className="text-xs text-muted-foreground">Allow parents to pay fees online</p>
            </div>
            <Switch checked={!!form.payment_enabled} onCheckedChange={(v) => set('payment_enabled', v)} />
          </div>

          <FormSection title="Provider" columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">Payment Gateway</Label>
              <select value={form.payment_gateway || ''} onChange={(e) => set('payment_gateway', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {GATEWAYS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Currency</Label>
              <select value={form.currency || ''} onChange={(e) => set('currency', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </FormSection>

          <FormSection title="Credentials" columns={1}>
            <div className="space-y-1.5">
              <Label className="text-xs">API Key (Publishable)</Label>
              <Input value={form.api_key || ''} onChange={(e) => set('api_key', e.target.value)} placeholder="pk_test_…" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Secret Key</Label>
              <Input type="password" value={form.secret_key || ''} onChange={(e) => set('secret_key', e.target.value)} placeholder="sk_test_…" />
            </div>
          </FormSection>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Sandbox Mode</p>
              <p className="text-xs text-muted-foreground">Use test environment (no real charges)</p>
            </div>
            <Switch checked={!!form.sandbox_mode} onCheckedChange={(v) => set('sandbox_mode', v)} />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
