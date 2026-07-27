// ====================================================================
// Module: Settings
// Page: Captcha Settings
//
// Purpose:
// Configure the captcha provider for login forms.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useState, useEffect } from 'react'
import { Shield, Save } from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { FormSection } from '@/components/FormSection'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useCaptchaSettings } from '@/hooks/useSettings'

const PROVIDERS = ['Google reCAPTCHA', 'hCaptcha']
const THEMES = ['light', 'dark']

export default function CaptchaSettingsPage() {
  const { settings, isLoading, updateSettings } = useCaptchaSettings()
  const [form, setForm] = useState(settings)

  useEffect(() => { setForm(settings) }, [settings])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const handleSave = () => updateSettings(form)

  if (isLoading) return <LoadingSkeleton variant="cards" />

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Captcha' }]} />
      <PageHeader
        title="Captcha Settings"
        description="Configure captcha protection for public forms."
        icon={Shield}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Captcha Configuration</CardTitle>
          <CardDescription>Protect login and admission forms from bots.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Enable Captcha</p>
              <p className="text-xs text-muted-foreground">Require captcha verification on forms</p>
            </div>
            <Switch checked={!!form.captcha_enabled} onCheckedChange={(v) => set('captcha_enabled', v)} />
          </div>

          <FormSection title="Provider" columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">Captcha Provider</Label>
              <select value={form.captcha_provider || ''} onChange={(e) => set('captcha_provider', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Theme</Label>
              <select value={form.theme || 'light'} onChange={(e) => set('theme', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </FormSection>

          <FormSection title="Keys" columns={1}>
            <div className="space-y-1.5">
              <Label className="text-xs">Site Key</Label>
              <Input value={form.site_key || ''} onChange={(e) => set('site_key', e.target.value)} placeholder="Public site key" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Secret Key</Label>
              <Input type="password" value={form.secret_key || ''} onChange={(e) => set('secret_key', e.target.value)} placeholder="Private secret key" />
            </div>
          </FormSection>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
