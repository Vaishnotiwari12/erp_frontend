// ====================================================================
// Module: Fees
// Page: Collect Fees
//
// Purpose:
// Search students, view fee summaries, and collect payments.
//
// Data Source:
// fees.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Wallet, Plus, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { FeeStats } from '@/components/fees/collect/FeeStats'
import { StudentSearch } from '@/components/fees/collect/StudentSearch'
import { StudentProfile } from '@/components/fees/collect/StudentProfile'
import { FeeBreakdown } from '@/components/fees/collect/FeeBreakdown'
import { PaymentSummary } from '@/components/fees/collect/PaymentSummary'
import { PaymentHistory } from '@/components/fees/collect/PaymentHistory'
import { PaymentDrawer } from '@/components/fees/collect/PaymentDrawer'
import { ReceiptPreview } from '@/components/fees/collect/ReceiptPreview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAsyncData } from '@/hooks/useAsyncData'
import { feesService } from '@/services/fees.service'
import { useToast } from '@/hooks/use-toast'

export default function CollectFeesPage() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => feesService.getFeesCollection(), [])
  const [selected, setSelected] = useState(null)
  const [summary, setSummary] = useState(null)
  const [payOpen, setPayOpen] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [receiptOpen, setReceiptOpen] = useState(false)

  const loadSummary = async (student) => {
    setSelected(student)
    const res = await feesService.getStudentFeeSummary(student._id)
    setSummary(res.data)
  }

  const handleCollect = async (payload) => {
    const res = await feesService.collectPayment({ ...payload, student_id: selected?._id })
    setReceipt(res.data)
    setPayOpen(false)
    setReceiptOpen(true)
    toast({ title: 'Payment collected', description: `Receipt ${res.data.receipt_no} generated` })
    if (selected) loadSummary(selected)
  }

  const stats = data?.stats
  const students = data?.students

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Collect Fees' }]} />
      <PageHeader
        title="Collect Fees"
        description="Search students, view fee summaries, and collect payments."
        icon={Wallet}
        actions={
          <Button onClick={() => selected && setPayOpen(true)} disabled={!selected}>
            <Plus className="mr-2 h-4 w-4" /> Collect Payment
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={4} cols={4} />
      ) : (
        <>
          <FeeStats stats={stats} />
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Search Student</CardTitle>
              </CardHeader>
              <CardContent>
                <StudentSearch students={students} onSelect={loadSummary} selected={selected} />
              </CardContent>
            </Card>
            <div className="space-y-6 lg:col-span-2">
              {selected ? (
                <>
                  <StudentProfile student={selected} />
                  <PaymentSummary summary={summary} />
                  <FeeBreakdown breakdown={summary?.breakdown} />
                  <PaymentHistory history={summary?.history} />
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Wallet className="mb-3 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Select a student to view fee details</p>
                    <p className="text-xs text-muted-foreground">Search and pick a student from the left panel</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

      <PaymentDrawer open={payOpen} onOpenChange={setPayOpen} summary={summary} onCollect={handleCollect} />
      <ReceiptPreview open={receiptOpen} onOpenChange={setReceiptOpen} receipt={receipt} student={selected} />
    </div>
  )
}
