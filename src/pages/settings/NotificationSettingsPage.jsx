// ====================================================================
// Module: Settings
// Page: Notification Settings
//
// Purpose:
// Configure which notifications the system sends.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useState, useEffect } from 'react'
import { Bell, Save } from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useNotificationSettings } from '@/hooks/useSettings'

const FIELDS = [
  { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive alerts via email' },
  { key: 'sms_notifications', label: 'SMS Notifications', desc: 'Receive alerts via SMS' },
  { key: 'push_notifications', label: 'Push Notifications', desc: 'Real-time browser push' },
  { key: 'admission_alerts', label: 'Admission Alerts', desc: 'New admission submissions' },
  { key: 'fee_payment_alerts', label: 'Fee Payment Alerts', desc: 'Successful fee payments' },
  { key: 'attendance_alerts', label: 'Attendance Alerts', desc: 'Student absence notifications' },
  { key: 'exam_result_alerts', label: 'Exam Result Alerts', desc: 'Results published notifications' },
  { key: 'library_alerts', label: 'Library Alerts', desc: 'Book due and overdue reminders' },
]

export default function NotificationSettingsPage() {
  const { settings, isLoading, updateSettings } = useNotificationSettings()
  const [form, setForm] = useState(settings)

  useEffect(() => { setForm(settings) }, [settings])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const handleSave = () => updateSettings(form)

  if (isLoading) return <LoadingSkeleton variant="cards" />

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Notifications' }]} />
      <PageHeader
        title="Notification Settings"
        description="Choose which notifications the system sends."
        icon={Bell}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
          <CardDescription>Toggle individual notification channels and alert types.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <Switch checked={!!form[f.key]} onCheckedChange={(v) => set(f.key, v)} />
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
