// ====================================================================
// Module: Online Exam
// Page: Assign Questions
//
// Purpose:
// Select an exam and manage (add/view) the questions assigned to it.
//
// Data Source:
// onlineExam.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  BookOpenCheck,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { DeleteDialog } from '@/components/DeleteDialog'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useQuestionBank, useOnlineExams } from '@/hooks/useOnlineExam'
import { QuestionFormDrawer } from './QuestionBankPage'
import { onlineExams as allExamList } from '@/data/onlineExam.mock'
import { formatDate } from '@/utils/format'

const OPTION_LABELS = { a: 'A', b: 'B', c: 'C', d: 'D' }

export default function AssignQuestionsPage() {
  const {
    allQuestions, isLoading, saveQuestion, deleteQuestion,
  } = useQuestionBank()

  const { allExams } = useOnlineExams()

  const [selectedExamId, setSelectedExamId] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveQuestion(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  // Questions assigned to the selected exam.
  const assignedQuestions = useMemo(() => {
    if (!selectedExamId) return allQuestions
    return allQuestions.filter((q) => q.exam_id === selectedExamId)
  }, [allQuestions, selectedExamId])

  const columns = useMemo(() => [
    {
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpenCheck className="h-4 w-4" />
          </div>
          <span className="font-medium hover:underline line-clamp-1">
            {row.original.question.length > 50 ? `${row.original.question.slice(0, 50)}…` : row.original.question}
          </span>
        </button>
      ),
    },
    { accessorKey: 'exam_name', header: 'Exam', cell: ({ row }) => <Badge variant="secondary">{row.original.exam_name}</Badge> },
    { accessorKey: 'marks', header: 'Marks', cell: ({ row }) => <Badge variant="outline">{row.original.marks}</Badge> },
    {
      accessorKey: 'correct_answer',
      header: 'Correct Answer',
      cell: ({ row }) => <Badge variant="outline">Option {OPTION_LABELS[row.original.correct_answer]}</Badge>,
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'} className="capitalize">{row.original.status}</Badge> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Online Exam' }, { label: 'Assign Questions' }]} />
      <PageHeader
        title="Assign Questions"
        description="Select an exam and manage the questions assigned to it."
        icon={BookOpenCheck}
        actions={<Button onClick={() => setAddOpen(true)} disabled={!selectedExamId}><Plus className="mr-2 h-4 w-4" /> Add Question</Button>}
      />

      {/* Left panel: exam selector */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Select Exam</label>
          <select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)}
            className="h-9 min-w-[280px] rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="">All exams</option>
            {allExamList.map((e) => (
              <option key={e._id} value={e._id}>{e.exam_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Questions" value={assignedQuestions.length} icon={BookOpenCheck} accent="primary" />
        <StatCard label="Active Questions" value={assignedQuestions.filter((q) => q.status === 'active').length} icon={BookOpenCheck} accent="success" />
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : assignedQuestions.length === 0 ? (
        <NoData title="No questions assigned" description={selectedExamId ? 'Add a question to this exam to get started.' : 'Select an exam or add a question.'} actionLabel="Add Question" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={assignedQuestions}
          enableSelection
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <QuestionFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Question' : 'Add Question'}
        initial={editRow}
        exams={allExamList}
        preselectedExamId={selectedExamId || undefined}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Question Details"
        description={viewRow?.exam_name}
        width="sm:max-w-lg"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="font-medium">{viewRow.question}</p>
            </div>
            <div className="space-y-2">
              {['a', 'b', 'c', 'd'].map((opt) => (
                <div
                  key={opt}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                    viewRow.correct_answer === opt ? 'border-green-300 bg-green-50 font-medium text-green-800' : 'border-border bg-background'
                  }`}
                >
                  <Badge variant={viewRow.correct_answer === opt ? 'default' : 'outline'}>{OPTION_LABELS[opt]}</Badge>
                  <span>{viewRow[`option_${opt}`]}</span>
                  {viewRow.correct_answer === opt && <Badge variant="default" className="ml-auto">Correct</Badge>}
                </div>
              ))}
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Marks', value: viewRow.marks },
                { label: 'Status', value: viewRow.status },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium capitalize">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.question}
        onConfirm={() => deleteQuestion(deleteRow._id)}
      />
    </div>
  )
}
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======

>>>>>>> d519b6a (Updated file)
>>>>>>> d262216 (Resolve merge conflicts)
