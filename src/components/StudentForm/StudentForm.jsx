import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { FormSection } from '@/components/FormSection'
import { fullName } from '@/utils/format'

const CLASS_OPTIONS = [
  '8-A', '8-B', '8-C', '9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B',
  'Year-1', 'Year-2', 'Year-3',
]
const CATEGORY_OPTIONS = ['General', 'OBC', 'SC', 'ST', 'EWS']
const HOUSE_OPTIONS = ['Red House', 'Blue House', 'Green House', 'Yellow House']
const BLOOD_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground">
        {label}{required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

export function StudentForm({ initial, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState(() => ({
    first_name: initial?.name?.first || '',
    last_name: initial?.name?.last || '',
    email: initial?.email || '',
    mobile: initial?.mobile || '',
    admission_no: initial?.admission_no || '',
    class: initial?.class || '',
    section: initial?.section || '',
    school_name: initial?.school_name || '',
    guardian_name: initial?.guardian_name || '',
    gender: initial?.gender || 'male',
    dob: initial?.dob || '',
    address: initial?.address || '',
    category: initial?.category || 'General',
    house: initial?.house || '',
    blood_group: initial?.blood_group || '',
    nationality: initial?.nationality || '',
    status: initial?.status || 'active',
    ...initial,
  }))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e = {}
    if (!form.first_name) e.first_name = 'First name is required'
    if (!form.last_name) e.last_name = 'Last name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.admission_no) e.admission_no = 'Admission number is required'
    if (!form.class) e.class = 'Class is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const payload = {
      ...form,
      name: { first: form.first_name, last: form.last_name },
    }
    try {
      await onSubmit?.(payload)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id="student-form" onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Personal Information" description="Basic identity and contact details" columns={2}>
        <Field label="First Name" required error={errors.first_name}>
          <Input value={form.first_name} onChange={(e) => set('first_name', e.target.value)} placeholder="e.g. Aarav" />
        </Field>
        <Field label="Last Name" required error={errors.last_name}>
          <Input value={form.last_name} onChange={(e) => set('last_name', e.target.value)} placeholder="e.g. Sharma" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="student@school.edu" />
        </Field>
        <Field label="Mobile">
          <Input value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="+1 555-0000" />
        </Field>
        <Field label="Date of Birth">
          <Input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
        </Field>
        <Field label="Gender">
          <RadioGroup value={form.gender} onValueChange={(v) => set('gender', v)} className="flex h-9 items-center gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="male" id="g-male" />
              <Label htmlFor="g-male" className="text-sm font-normal">Male</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="female" id="g-female" />
              <Label htmlFor="g-female" className="text-sm font-normal">Female</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="other" id="g-other" />
              <Label htmlFor="g-other" className="text-sm font-normal">Other</Label>
            </div>
          </RadioGroup>
        </Field>
        <Field label="Blood Group">
          <Select value={form.blood_group} onValueChange={(v) => set('blood_group', v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {BLOOD_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Nationality">
          <Input value={form.nationality} onChange={(e) => set('nationality', e.target.value)} placeholder="e.g. American" />
        </Field>
      </FormSection>

      <FormSection title="Academic Information" description="Enrollment and class placement" columns={2}>
        <Field label="Admission No." required error={errors.admission_no}>
          <Input value={form.admission_no} onChange={(e) => set('admission_no', e.target.value)} placeholder="ADM-1001" />
        </Field>
        <Field label="Class" required error={errors.class}>
          <Select value={form.class} onValueChange={(v) => set('class', v)}>
            <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Section">
          <Select value={form.section} onValueChange={(v) => set('section', v)}>
            <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
            <SelectContent>
              {['A', 'B', 'C'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Institution">
          <Input value={form.school_name} onChange={(e) => set('school_name', e.target.value)} placeholder="School / College name" />
        </Field>
        <Field label="Category">
          <Select value={form.category} onValueChange={(v) => set('category', v)}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="House">
          <Select value={form.house} onValueChange={(v) => set('house', v)}>
            <SelectTrigger><SelectValue placeholder="Select house" /></SelectTrigger>
            <SelectContent>
              {HOUSE_OPTIONS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </FormSection>

      <FormSection title="Guardian & Address" description="Primary contact and residence" columns={2}>
        <Field label="Guardian Name">
          <Input value={form.guardian_name} onChange={(e) => set('guardian_name', e.target.value)} placeholder="Parent / Guardian" />
        </Field>
        <Field label="Status">
          <Select value={form.status} onValueChange={(v) => set('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <Textarea value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Residential address" rows={3} />
          </Field>
        </div>
      </FormSection>

      <button type="submit" className="hidden" aria-hidden="true" disabled={submitting}>
        {submitLabel}
      </button>
    </form>
  )
}

export default StudentForm

export function getStudentName(student) {
  return fullName(student?.name)
}
