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
} from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { useCertificateStats } from '@/hooks/useCertificate'

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
        <StatCard label="Student Certificates" value={isLoading ? '—' : (stats?.total_student_certificates ?? 0)} icon={FileText} accent="primary" />
        <StatCard label="Generated Certificates" value={isLoading ? '—' : (stats?.total_generated_certificates ?? 0)} icon={FileBadge} accent="chart2" />
        <StatCard label="Student ID Cards" value={isLoading ? '—' : (stats?.total_student_id_cards ?? 0)} icon={IdCard} accent="success" />
        <StatCard label="Generated Student ID Cards" value={isLoading ? '—' : (stats?.total_generated_student_id_cards ?? 0)} icon={IdCard} accent="chart3" />
        <StatCard label="Staff ID Cards" value={isLoading ? '—' : (stats?.total_staff_id_cards ?? 0)} icon={CreditCard} accent="warning" />
        <StatCard label="Generated Staff ID Cards" value={isLoading ? '—' : (stats?.total_generated_staff_id_cards ?? 0)} icon={CreditCard} accent="chart4" />
      </div>
    </div>
  )
}
