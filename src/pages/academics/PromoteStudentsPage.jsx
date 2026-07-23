// ====================================================================
// Module: Academics
// Page: Promote Students
//
// Purpose:
// Promote students to the next class for a new academic session.
//
// Data Source:
// academics.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ArrowRight, ArrowLeft, Check, CalendarDays, BookOpen, Layers, Target, Eye, Rocket, CircleCheck as CheckCircle2, GraduationCap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { academicsService } from '@/services/academics.service'
import { students as mockStudents, academicClasses, academicSections, PROMOTION_SESSIONS } from '@/services/mockData'
import { fullName, initials, formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 0, label: 'Session', icon: CalendarDays, description: 'Select academic session' },
  { id: 1, label: 'Class', icon: BookOpen, description: 'Choose source class' },
  { id: 2, label: 'Section', icon: Layers, description: 'Choose source section' },
  { id: 3, label: 'Destination', icon: Target, description: 'Choose destination class' },
  { id: 4, label: 'Preview', icon: Eye, description: 'Review and confirm' },
  { id: 5, label: 'Promote', icon: Rocket, description: 'Execute promotion' },
]

const CLASS_OPTIONS = academicClasses.filter((c) => c.status === 'active').map((c) => c.name)

export default function PromoteStudentsPage() {
  const { toast } = useToast()
  const { data: classRows } = useAsyncData(() => academicsService.classes(), [])
  const [step, setStep] = useState(0)
  const [session, setSession] = useState('')
  const [sourceClass, setSourceClass] = useState('')
  const [sourceSection, setSourceSection] = useState('')
  const [destClass, setDestClass] = useState('')
  const [promoted, setPromoted] = useState(false)

  const sectionOptions = useMemo(
    () => academicSections.filter((s) => s.class === sourceClass).map((s) => s.name),
    [sourceClass],
  )

  const eligibleStudents = useMemo(
    () => mockStudents.filter((s) => s.class === sourceClass && (sourceSection ? s.section === sourceSection : true) && s.status === 'active'),
    [sourceClass, sourceSection],
  )

  const canProceed = useMemo(() => {
    if (step === 0) return !!session
    if (step === 1) return !!sourceClass
    if (step === 2) return !!sourceSection
    if (step === 3) return !!destClass
    return true
  }, [step, session, sourceClass, sourceSection, destClass])

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handlePromote = () => {
    setPromoted(true)
    toast({
      title: 'Students promoted successfully',
      description: `${eligibleStudents.length} students promoted from ${sourceClass} ${sourceSection} to ${destClass}.`,
    })
  }

  const reset = () => {
    setStep(0)
    setSession('')
    setSourceClass('')
    setSourceSection('')
    setDestClass('')
    setPromoted(false)
  }

  const stats = useMemo(() => ({
    total: mockStudents.length,
    active: mockStudents.filter((s) => s.status === 'active').length,
    classes: CLASS_OPTIONS.length,
    eligible: eligibleStudents.length,
  }), [eligibleStudents.length])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Academics', to: '/academics/classes' }, { label: 'Promote Students' }]} />
      <PageHeader
        title="Promote Students"
        description="Promote students to the next class for a new academic session."
        icon={Rocket}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Active Students" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Active Classes" value={stats.classes} icon={BookOpen} accent="chart2" />
        <StatCard label="Eligible for Promotion" value={stats.eligible} icon={GraduationCap} accent="chart3" />
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-0 sm:justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isDone = i < step || (promoted && i === 5)
              const isCurrent = i === step && !promoted
              return (
                <div key={s.id} className="flex flex-1 items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      isDone && 'border-success bg-success/10 text-success',
                      isCurrent && 'border-primary bg-primary text-primary-foreground',
                      !isDone && !isCurrent && 'border-border bg-muted text-muted-foreground',
                    )}>
                      {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="hidden sm:block">
                      <p className={cn('text-sm font-medium', isCurrent ? 'text-foreground' : 'text-muted-foreground')}>{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 ? (
                    <div className={cn('mx-2 h-0.5 flex-1 rounded-full transition-colors', i < step ? 'bg-success' : 'bg-border')} />
                  ) : null}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      <Card>
        <CardContent className="p-6">
          {promoted ? (
            <PromotionSuccess
              count={eligibleStudents.length}
              sourceClass={sourceClass}
              sourceSection={sourceSection}
              destClass={destClass}
              session={session}
              onReset={reset}
            />
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-base font-semibold">
                  Step {step + 1} of {STEPS.length}: {STEPS[step].label}
                </h3>
                <p className="text-sm text-muted-foreground">{STEPS[step].description}</p>
              </div>

              {step === 0 ? (
                <OptionGrid>
                  {PROMOTION_SESSIONS.map((s) => (
                    <OptionCard key={s} active={session === s} onClick={() => setSession(s)} icon={CalendarDays} title={s} subtitle="Academic Session" />
                  ))}
                </OptionGrid>
              ) : null}

              {step === 1 ? (
                <OptionGrid>
                  {CLASS_OPTIONS.map((c) => (
                    <OptionCard key={c} active={sourceClass === c} onClick={() => setSourceClass(c)} icon={BookOpen} title={c} subtitle={`${mockStudents.filter((s) => s.class === c).length} students`} />
                  ))}
                </OptionGrid>
              ) : null}

              {step === 2 ? (
                <OptionGrid>
                  {sectionOptions.length ? sectionOptions.map((s) => (
                    <OptionCard key={s} active={sourceSection === s} onClick={() => setSourceSection(s)} icon={Layers} title={`Section ${s}`} subtitle={`${mockStudents.filter((st) => st.class === sourceClass && st.section === s).length} students`} />
                  )) : <p className="text-sm text-muted-foreground">No sections found for {sourceClass}.</p>}
                </OptionGrid>
              ) : null}

              {step === 3 ? (
                <OptionGrid>
                  {CLASS_OPTIONS.filter((c) => c !== sourceClass).map((c) => (
                    <OptionCard key={c} active={destClass === c} onClick={() => setDestClass(c)} icon={Target} title={c} subtitle="Destination class" />
                  ))}
                </OptionGrid>
              ) : null}

              {step === 4 ? (
                <PreviewStep
                  session={session}
                  sourceClass={sourceClass}
                  sourceSection={sourceSection}
                  destClass={destClass}
                  students={eligibleStudents}
                />
              ) : null}

              {step === 5 ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                    <p className="text-sm font-medium">Ready to promote</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {eligibleStudents.length} students from <span className="font-medium text-foreground">{sourceClass} Section {sourceSection}</span> will be promoted to <span className="font-medium text-foreground">{destClass}</span> for the <span className="font-medium text-foreground">{session}</span> session.
                    </p>
                  </div>
                  <Button onClick={handlePromote} disabled={!eligibleStudents.length} size="lg" className="w-full">
                    <Rocket className="mr-2 h-4 w-4" /> Promote {eligibleStudents.length} Students
                  </Button>
                </div>
              ) : null}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t pt-6">
                <Button variant="outline" onClick={back} disabled={step === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                {step < 5 ? (
                  <Button onClick={next} disabled={!canProceed}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function OptionGrid({ children }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function OptionCard({ active, onClick, icon: Icon, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all hover:shadow-sm',
        active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {active ? <Check className="h-5 w-5 text-primary" /> : null}
    </button>
  )
}

function PreviewStep({ session, sourceClass, sourceSection, destClass, students }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Session', value: session, icon: CalendarDays },
          { label: 'Source Class', value: `${sourceClass} · ${sourceSection}`, icon: BookOpen },
          { label: 'Destination', value: destClass, icon: Target },
          { label: 'Students', value: students.length, icon: Users },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <p className="text-xs font-medium">{s.label}</p>
              </div>
              <p className="mt-1 text-sm font-semibold">{s.value}</p>
            </div>
          )
        })}
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Students to be promoted ({students.length})</p>
        <div className="max-h-80 space-y-2 overflow-y-auto scrollbar-thin rounded-lg border p-3">
          {students.length ? students.map((s) => (
            <div key={s._id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials(s.name)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{fullName(s.name)}</p>
                <p className="text-xs text-muted-foreground">{s.admission_no} · {s.email}</p>
              </div>
              <Badge variant="outline" className="font-medium">
                {s.class} → {destClass}
              </Badge>
            </div>
          )) : <p className="py-8 text-center text-sm text-muted-foreground">No eligible students found.</p>}
        </div>
      </div>
    </div>
  )
}

function PromotionSuccess({ count, sourceClass, sourceSection, destClass, session, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Promotion Complete!</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {count} students have been successfully promoted from {sourceClass} Section {sourceSection} to {destClass} for the {session} session.
      </p>
      <Button onClick={onReset} className="mt-6" variant="outline">
        Promote More Students
      </Button>
    </div>
  )
}
