// ====================================================================
// Module: Settings
// Page: Front CMS Settings
//
// Purpose:
// Configure the public-facing front CMS site content.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useState, useEffect } from 'react'
import { Globe, Save } from 'lucide-react'
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
import { useFrontCmsSettings } from '@/hooks/useSettings'

export default function FrontCmsSettingsPage() {
  const { settings, isLoading, updateSettings } = useFrontCmsSettings()
  const [form, setForm] = useState(settings)

  useEffect(() => { setForm(settings) }, [settings])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const handleSave = () => updateSettings(form)

  if (isLoading) return <LoadingSkeleton variant="cards" />

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Front CMS' }]} />
      <PageHeader
        title="Front CMS Settings"
        description="Configure the public-facing website content and social links."
        icon={Globe}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Site Content</CardTitle>
          <CardDescription>Branding and text shown on the public site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormSection title="Branding" columns={1}>
            <div className="space-y-1.5">
              <Label className="text-xs">Site Title</Label>
              <Input value={form.site_title || ''} onChange={(e) => set('site_title', e.target.value)} placeholder="School name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tagline</Label>
              <Input value={form.tagline || ''} onChange={(e) => set('tagline', e.target.value)} placeholder="Empowering minds…" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Footer Text</Label>
              <Textarea value={form.footer_text || ''} onChange={(e) => set('footer_text', e.target.value)} placeholder="© 2025 School…" rows={2} />
            </div>
          </FormSection>

          <FormSection title="Social Links" columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">Facebook</Label>
              <Input value={form.social_facebook || ''} onChange={(e) => set('social_facebook', e.target.value)} placeholder="https://facebook.com/…" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Twitter</Label>
              <Input value={form.social_twitter || ''} onChange={(e) => set('social_twitter', e.target.value)} placeholder="https://twitter.com/…" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Instagram</Label>
              <Input value={form.social_instagram || ''} onChange={(e) => set('social_instagram', e.target.value)} placeholder="https://instagram.com/…" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">YouTube</Label>
              <Input value={form.social_youtube || ''} onChange={(e) => set('social_youtube', e.target.value)} placeholder="https://youtube.com/…" />
            </div>
          </FormSection>

          <FormSection title="Contact" columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">Contact Email</Label>
              <Input type="email" value={form.contact_email || ''} onChange={(e) => set('contact_email', e.target.value)} placeholder="contact@school.edu" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Contact Phone</Label>
              <Input value={form.contact_phone || ''} onChange={(e) => set('contact_phone', e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </FormSection>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">Take the public site offline for maintenance</p>
            </div>
            <Switch checked={!!form.maintenance_mode} onCheckedChange={(v) => set('maintenance_mode', v)} />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
