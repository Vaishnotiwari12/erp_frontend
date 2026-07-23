// ====================================================================
// Module: Examinations
// Page: Design Marksheet
//
// Purpose:
// Visual builder for the marksheet template with live preview.
//
// Data Source:
// examination.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useState } from 'react'
import { FileBadge, Eye, Save, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { FormSection } from '@/components/FormSection'
import { examinationService } from '@/services/examination.service'
import { useToast } from '@/hooks/use-toast'

const FIELDS = ['Student Name', 'Admission No', 'Class', 'Subjects', 'Marks', 'Total', 'Percentage', 'Grade', 'Division', 'Rank']

export default function DesignMarksheetPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({
    show_logo: true,
    header_text: 'Scholaria ERP - Marksheet',
    show_grades: true,
    show_attendance: true,
    show_remarks: true,
    show_teacher_signature: true,
    show_principal_signature: true,
    fields: FIELDS.slice(),
    paper_size: 'A4',
    orientation: 'landscape',
  })

  const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }))
  const toggleField = (f) => setForm((s) => ({ ...s, fields: s.fields.includes(f) ? s.fields.filter((x) => x !== f) : [...s.fields, x] }))

  const save = async () => {
    await examinationService.updateMarksheetTemplate(form)
    toast({ title: 'Marksheet template saved' })
  }

  const reset = () => {
    setForm({ show_logo: true, header_text: 'Scholaria ERP - Marksheet', show_grades: true, show_attendance: true, show_remarks: true, show_teacher_signature: true, show_principal_signature: true, fields: FIELDS.slice(), paper_size: 'A4', orientation: 'landscape' })
    toast({ title: 'Template reset to default' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Design Marksheet' }]} />
      <PageHeader
        title="Design Marksheet"
        description="Visual builder for the marksheet template with live preview."
        icon={FileBadge}
        actions={
          <>
            <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
            <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Save Template</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold">Template Settings</h3>
          <FormSection columns={1}>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">School Logo</Label><p className="text-xs text-muted-foreground">Display institution logo</p></div>
              <Switch checked={form.show_logo} onCheckedChange={() => toggle('show_logo')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">Grades Column</Label><p className="text-xs text-muted-foreground">Show grades in marks table</p></div>
              <Switch checked={form.show_grades} onCheckedChange={() => toggle('show_grades')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">Attendance</Label><p className="text-xs text-muted-foreground">Show attendance summary</p></div>
              <Switch checked={form.show_attendance} onCheckedChange={() => toggle('show_attendance')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">Remarks</Label><p className="text-xs text-muted-foreground">Show remarks section</p></div>
              <Switch checked={form.show_remarks} onCheckedChange={() => toggle('show_remarks')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">Teacher Signature</Label><p className="text-xs text-muted-foreground">Show class teacher sign-off</p></div>
              <Switch checked={form.show_teacher_signature} onCheckedChange={() => toggle('show_teacher_signature')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">Principal Signature</Label><p className="text-xs text-muted-foreground">Show principal sign-off</p></div>
              <Switch checked={form.show_principal_signature} onCheckedChange={() => toggle('show_principal_signature')} />
            </div>
          </FormSection>
          <div className="space-y-1.5">
            <Label className="text-xs">Header Text</Label>
            <Input value={form.header_text} onChange={(e) => setForm((f) => ({ ...f, header_text: e.target.value }))} />
          </div>
          <FormSection columns={2}>
            <div className="space-y-1.5">
              <Label className="text-xs">Paper Size</Label>
              <select value={form.paper_size} onChange={(e) => setForm((f) => ({ ...f, paper_size: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="A4">A4</option><option value="Letter">Letter</option><option value="Legal">Legal</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Orientation</Label>
              <select value={form.orientation} onChange={(e) => setForm((f) => ({ ...f, orientation: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="portrait">Portrait</option><option value="landscape">Landscape</option>
              </select>
            </div>
          </FormSection>
          <div className="space-y-2">
            <Label className="text-xs">Marksheet Fields</Label>
            <div className="flex flex-wrap gap-2">
              {FIELDS.map((f) => (
                <button key={f} type="button" onClick={() => toggleField(f)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${form.fields.includes(f) ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted text-muted-foreground'}`}>
                  {form.fields.includes(f) ? '✓ ' : ''}{f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Eye className="h-4 w-4" /> Live Preview</div>
          <div className={`mx-auto rounded-xl border bg-white p-6 shadow-sm ${form.orientation === 'landscape' ? 'aspect-[1.414/1]' : 'aspect-[1/1.414]'} max-w-2xl`}>
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-3">
                {form.show_logo ? <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileBadge className="h-5 w-5" /></div> : null}
                <h2 className="flex-1 text-base font-bold">{form.header_text}</h2>
              </div>
              <div className="h-px w-full bg-border" />
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">—</span></div>
                <div><span className="text-muted-foreground">Class:</span> <span className="font-medium">—</span></div>
                <div><span className="text-muted-foreground">Roll:</span> <span className="font-medium">—</span></div>
              </div>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border border-border bg-muted/30">
                    <th className="border border-border px-2 py-1 text-left">Subject</th>
                    <th className="border border-border px-2 py-1">Marks</th>
                    {form.show_grades ? <th className="border border-border px-2 py-1">Grade</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'].map((s) => (
                    <tr key={s} className="border border-border">
                      <td className="border border-border px-2 py-1">{s}</td>
                      <td className="border border-border px-2 py-1 text-center">—</td>
                      {form.show_grades ? <td className="border border-border px-2 py-1 text-center">—</td> : null}
                    </tr>
                  ))}
                  <tr className="border border-border bg-muted/20 font-semibold">
                    <td className="border border-border px-2 py-1">Total</td>
                    <td className="border border-border px-2 py-1 text-center">—</td>
                    {form.show_grades ? <td className="border border-border px-2 py-1 text-center">—</td> : null}
                  </tr>
                </tbody>
              </table>
              {form.show_attendance ? <p className="text-xs"><span className="text-muted-foreground">Attendance:</span> <span className="font-medium">—</span></p> : null}
              {form.show_remarks ? <p className="text-xs"><span className="text-muted-foreground">Remarks:</span> <span className="font-medium">—</span></p> : null}
              <div className="mt-auto flex justify-between pt-4 text-xs">
                {form.show_teacher_signature ? <div className="text-center"><div className="mb-1 h-6 w-24 border-b border-dashed" /><span className="text-muted-foreground">Class Teacher</span></div> : <span />}
                {form.show_principal_signature ? <div className="text-center"><div className="mb-1 h-6 w-24 border-b border-dashed" /><span className="text-muted-foreground">Principal</span></div> : <span />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
