import { useState } from 'react'
import { IdCard, Eye, Save, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { examinationService } from '@/services/examination.service'
import { useToast } from '@/hooks/use-toast'

const FIELDS = ['Student Name', 'Admission No', 'Class', 'Section', 'Roll No', 'Exam Center', 'Subjects', 'Dates']

export default function DesignAdmitCardPage() {
  const { toast } = useToast()
  const { data } = useAsyncData(() => examinationService.getAdmitCardTemplate(), [])
  const [form, setForm] = useState({
    show_logo: true,
    header_text: 'Scholaria ERP - Admit Card',
    show_qr: true,
    show_barcode: true,
    watermark: 'SCHOLARIA',
    show_principal_signature: true,
    show_controller_signature: true,
    fields: FIELDS.slice(),
    paper_size: 'A4',
    orientation: 'portrait',
  })

  const toggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }))
  const toggleField = (f) => setForm((s) => ({ ...s, fields: s.fields.includes(f) ? s.fields.filter((x) => x !== f) : [...s.fields, f] }))

  const save = async () => {
    await examinationService.updateAdmitCardTemplate(form)
    toast({ title: 'Admit card template saved' })
  }

  const reset = () => {
    setForm({ show_logo: true, header_text: 'Scholaria ERP - Admit Card', show_qr: true, show_barcode: true, watermark: 'SCHOLARIA', show_principal_signature: true, show_controller_signature: true, fields: FIELDS.slice(), paper_size: 'A4', orientation: 'portrait' })
    toast({ title: 'Template reset to default' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Design Admit Card' }]} />
      <PageHeader
        title="Design Admit Card"
        description="Visual builder for the admit card template with live preview."
        icon={IdCard}
        actions={
          <>
            <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
            <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Save Template</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Builder controls */}
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold">Template Settings</h3>
          <FormSection columns={1}>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">School Logo</Label><p className="text-xs text-muted-foreground">Display institution logo</p></div>
              <Switch checked={form.show_logo} onCheckedChange={() => toggle('show_logo')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">QR Code</Label><p className="text-xs text-muted-foreground">Embed verification QR</p></div>
              <Switch checked={form.show_qr} onCheckedChange={() => toggle('show_qr')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">Barcode</Label><p className="text-xs text-muted-foreground">Roll number barcode</p></div>
              <Switch checked={form.show_barcode} onCheckedChange={() => toggle('show_barcode')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">Principal Signature</Label><p className="text-xs text-muted-foreground">Show principal sign-off</p></div>
              <Switch checked={form.show_principal_signature} onCheckedChange={() => toggle('show_principal_signature')} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><Label className="text-sm font-medium">Controller Signature</Label><p className="text-xs text-muted-foreground">Show controller sign-off</p></div>
              <Switch checked={form.show_controller_signature} onCheckedChange={() => toggle('show_controller_signature')} />
            </div>
          </FormSection>
          <div className="space-y-1.5">
            <Label className="text-xs">Header Text</Label>
            <Input value={form.header_text} onChange={(e) => setForm((f) => ({ ...f, header_text: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Watermark</Label>
            <Input value={form.watermark} onChange={(e) => setForm((f) => ({ ...f, watermark: e.target.value }))} />
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
            <Label className="text-xs">Student Detail Fields</Label>
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

        {/* Live preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Eye className="h-4 w-4" /> Live Preview</div>
          <div className={`mx-auto rounded-xl border bg-white p-6 shadow-sm ${form.orientation === 'landscape' ? 'aspect-[1.414/1]' : 'aspect-[1/1.414]'} max-w-md`}>
            <div className="relative h-full">
              {form.watermark ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold text-black/[0.04]">{form.watermark}</div> : null}
              <div className="relative flex flex-col items-center gap-3">
                {form.show_logo ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><IdCard className="h-6 w-6" /></div>
                ) : null}
                <h2 className="text-center text-base font-bold">{form.header_text}</h2>
                <div className="h-px w-full bg-border" />
                <div className="grid w-full grid-cols-2 gap-y-2 text-xs">
                  {form.fields.map((f) => (
                    <div key={f} className="flex justify-between border-b border-dashed pb-1">
                      <span className="text-muted-foreground">{f}:</span><span className="font-medium">—</span>
                    </div>
                  ))}
                </div>
                <div className="flex w-full items-end justify-between pt-3">
                  {form.show_qr ? <div className="h-14 w-14 rounded border-2 border-dashed border-muted-foreground/40" /> : <span />}
                  {form.show_barcode ? <div className="flex h-8 items-end gap-0.5">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="w-0.5 bg-foreground" style={{ height: `${10 + (i % 4) * 6}px` }} />)}</div> : <span />}
                </div>
                <div className="flex w-full justify-between pt-4 text-xs">
                  {form.show_principal_signature ? <div className="text-center"><div className="mb-1 h-8 w-24 border-b border-dashed" /><span className="text-muted-foreground">Principal</span></div> : <span />}
                  {form.show_controller_signature ? <div className="text-center"><div className="mb-1 h-8 w-24 border-b border-dashed" /><span className="text-muted-foreground">Controller</span></div> : <span />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
