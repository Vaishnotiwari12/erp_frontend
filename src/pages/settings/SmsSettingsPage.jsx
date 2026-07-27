// ====================================================================
// Module: Settings
// Page: SMS Settings
//
// Purpose:
// Configure the SMS gateway and templates.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useState, useEffect } from 'react'
import { MessageSquare, Save } from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { FormSection } from '@/components/FormSection'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useSmsSettings } from '@/hooks/useSettings'

const GATEWAYS = ['Twilio', 'Nexmo', 'MSG91', 'TextLocal', 'Plivo']

export default function SmsSettingsPage() {
  const { settings, isLoading, updateSettings } = useSmsSettings()
  const [form, setForm] = useState(settings)

  useEffect(() => { setForm(settings) }, [settings])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const handleSave = () => updateSettings(form)

  if (isLoading) return <LoadingSkeleton variant="cards" />

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'SMS' }]} />
      <PageHeader
        title="SMS Settings"
        description="Configure the SMS gateway for sending text alerts."
        icon={MessageSquare}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gateway Configuration</CardTitle>
          <CardDescription>SMS provider credentials and sender settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Enable SMS</p>
              <p className="text-xs text-muted-foreground">Turn SMS notifications on or off</p>
            </div>
            <Switch checked={!!form.sms_enabled} onCheckedChange={(v) => set('sms_enabled', v)} />
          </div>

          <FormSection title="Provider" columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">SMS Gateway</Label>
              <select value={form.sms_gateway || ''} onChange={(e) => set('sms_gateway', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {GATEWAYS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sender ID</Label>
              <Input value={form.sender_id || ''} onChange={(e) => set('sender_id', e.target.value)} placeholder="SCHLR" />
            </div>
          </FormSection>

          <FormSection title="Credentials" columns={1}>
            <div className="space-y-1.5">
              <Label className="text-xs">API Key</Label>
              <Input type="password" value={form.api_key || ''} onChange={(e) => set('api_key', e.target.value)} placeholder="Gateway API key" />
            </div>
          </FormSection>

          <FormSection title="Template" columns={1}>
            <div className="space-y-1.5">
              <Label className="text-xs">SMS Template</Label>
              <Textarea value={form.sms_template || ''} onChange={(e) => set('sms_template', e.target.value)} placeholder="Dear {parent_name}…" rows={3} />
              <p className="text-xs text-muted-foreground">Use placeholders: {'{parent_name}, {student_name}, {date}'}</p>
            </div>
          </FormSection>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground">Current Balance</p>
            <p className="text-lg font-semibold">{form.balance ?? 0} credits</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
