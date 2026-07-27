// ====================================================================
// Module: Settings
// Page: General Settings
//
// Purpose:
// Configure school-wide general information (name, contact, branding).
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useState, useEffect } from 'react'
import { Settings, Save, RotateCcw } from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { FormSection } from '@/components/FormSection'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useGeneralSettings } from '@/hooks/useSettings'

const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const TIMEZONES = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Dubai', 'Asia/Tokyo']

export default function GeneralSettingsPage() {
  const { settings, isLoading, updateSettings } = useGeneralSettings()
  const [form, setForm] = useState(settings)

  useEffect(() => { setForm(settings) }, [settings])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = () => updateSettings(form)
  const handleReset = () => setForm(settings)

  if (isLoading) return <LoadingSkeleton variant="cards" />

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'General' }]} />
      <PageHeader
        title="General Settings"
        description="Manage your school's basic information and branding."
        icon={Settings}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">School Information</CardTitle>
          <CardDescription>Basic details about your institution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormSection title="Identity" columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">School Name <span className="text-destructive">*</span></Label>
              <Input value={form.school_name || ''} onChange={(e) => set('school_name', e.target.value)} placeholder="e.g. Scholaria International" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">School Code</Label>
              <Input value={form.school_code || ''} onChange={(e) => set('school_code', e.target.value)} placeholder="e.g. SIS-2024" />
            </div>
          </FormSection>

          <FormSection title="Contact" columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} placeholder="info@school.edu" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Website</Label>
              <Input value={form.website || ''} onChange={(e) => set('website', e.target.value)} placeholder="https://school.edu" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Academic Year</Label>
              <Input value={form.academic_year || ''} onChange={(e) => set('academic_year', e.target.value)} placeholder="2024-2025" />
            </div>
          </FormSection>

          <FormSection title="Address" columns={1}>
            <div className="space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Textarea value={form.address || ''} onChange={(e) => set('address', e.target.value)} placeholder="Full postal address" rows={3} />
            </div>
          </FormSection>

          <FormSection title="Branding" columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">Logo URL</Label>
              <Input value={form.logo_url || ''} onChange={(e) => set('logo_url', e.target.value)} placeholder="https://school.edu/logo.png" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Favicon URL</Label>
              <Input value={form.favicon_url || ''} onChange={(e) => set('favicon_url', e.target.value)} placeholder="https://school.edu/favicon.ico" />
            </div>
          </FormSection>

          <FormSection title="Localization" columns={3}>
            <div className="space-y-1.5">
              <Label className="text-xs">Date Format</Label>
              <select value={form.date_format || ''} onChange={(e) => set('date_format', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {DATE_FORMATS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Timezone</Label>
              <select value={form.timezone || ''} onChange={(e) => set('timezone', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Language</Label>
              <Input value={form.language || ''} onChange={(e) => set('language', e.target.value)} placeholder="en" />
            </div>
          </FormSection>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={handleReset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
