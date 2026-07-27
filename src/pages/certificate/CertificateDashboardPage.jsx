// ====================================================================
// Module: Certificate
// Page: Certificate Dashboard
//
// Purpose:
// Overview of student certificates, generated certificates, and
// student/staff ID cards across the school.
//
// Data Source:
// certificate.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import {
  Award,
  FileBadge,
  IdCard,
  CreditCard,
  FileText,
  User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useCertificateStats } from '@/hooks/useCertificate'
import { formatRelativeTime } from '@/utils/format'

const ACTIVITY_ICONS = {
  certificate: FileText,
  id_card: IdCard,
  staff_id_card: CreditCard,
}

export default function CertificateDashboardPage() {
  const { stats, isLoading } = useCertificateStats()

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Certificate' }, { label: 'Dashboard' }]} />
      <PageHeader
        title="Certificate Dashboard"
        description="Overview of student certificates, generated certificates, and ID cards."
        icon={Award}
      />

      {/* KPI cards — at-a-glance snapshot of the certificate module. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Student Certificates" value={stats?.total_student_certificates ?? '—'} icon={FileText} accent="primary" />
        <StatCard label="Generated Certificates" value={stats?.total_generated_certificates ?? '—'} icon={FileBadge} accent="chart2" />
        <StatCard label="Student ID Cards" value={stats?.total_student_id_cards ?? '—'} icon={IdCard} accent="success" />
        <StatCard label="Generated Student ID Cards" value={stats?.total_generated_student_id_cards ?? '—'} icon={IdCard} accent="chart3" />
        <StatCard label="Staff ID Cards" value={stats?.total_staff_id_cards ?? '—'} icon={CreditCard} accent="warning" />
        <StatCard label="Generated Staff ID Cards" value={stats?.total_generated_staff_id_cards ?? '—'} icon={CreditCard} accent="chart4" />
      </div>

      {/* Recent activities — latest certificate and ID card actions. */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activities</CardTitle>
          <CardDescription>Latest certificate and ID card actions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton variant="table" rows={5} cols={2} />
          ) : (
            <ul className="space-y-3">
              {(stats?.recent_activities || []).map((activity, idx) => {
                const Icon = ACTIVITY_ICONS[activity.type] || FileText
                return (
                  <li key={idx} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.time)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
