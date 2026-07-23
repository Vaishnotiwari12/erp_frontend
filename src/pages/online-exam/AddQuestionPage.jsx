// ====================================================================
// Module: Online Exam
// Page: Add Question
//
// Purpose:
// Focused Add Question flow. When an `examId` query param is present,
// the view is pre-filtered to that exam and the form pre-selects it.
//
// Data Source:
// onlineExam.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Circle as HelpCircle, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useQuestionBank } from '@/hooks/useOnlineExam'
import { QuestionFormDrawer } from './QuestionBankPage'
import { onlineExams as allExamList } from '@/data/onlineExam.mock'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'question', label: 'Question' },
  { key: 'exam_name', label: 'Exam' },
  { key: 'marks', label: 'Marks' },
  { key: 'correct_answer', label: 'Correct Answer' },
  { key: 'status', label: 'Status' },
]

const OPTION_LABELS = { a: 'A', b: 'B', c: 'C', d: 'D' }

export default function AddQuestionPage() {
  const [searchParams] = useSearchParams()
  const examId = searchParams.get('examId') || ''
  const preselectedExam = allExamList.find((e) => e._id === examId)

  const {
    rows, exams, stats, isLoading,
    search, setSearch, examFilter, setExamFilter,
    statusFilter, setStatusFilter, saveQuestion, deleteQuestion,
  } = useQuestionBank()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveQuestion(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  // When examId is present, narrow the visible rows to that exam.
  const visibleRows = useMemo(() => {
    if (!examId) return rows
    return rows.filter((r) => r.exam_id === examId)
  }, [rows, examId])

  const columns = useMemo(() => [
    {
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HelpCircle className="h-4 w-4" />
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Online Exam' }, { label: 'Add Question' }]} />
      <PageHeader
        title="Add Question"
        description={preselectedExam ? `Adding questions for ${preselectedExam.exam_name}` : 'Add and manage exam questions.'}
        icon={HelpCircle}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Question</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Questions" value={examId ? visibleRows.length : stats.total} icon={HelpCircle} accent="primary" />
        <StatCard label="Active Questions" value={examId ? visibleRows.filter((r) => r.status === 'active').length : stats.active} icon={HelpCircle} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by question or exam…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={visibleRows} columns={EXPORT_COLS} filename="questions" />
          {!examId && (
            <select value={examFilter} onChange={(e) => setExamFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="all">All exams</option>
              {exams.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          )}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : visibleRows.length === 0 ? (
        <NoData title="No questions found" description="Add a new question to get started." actionLabel="Add Question" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={visibleRows}
          enableSelection
          enableExport
          exportFilename="questions"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <QuestionFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Question' : 'Add Question'}
        initial={editRow}
        exams={allExamList}
        preselectedExamId={examId}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.question}
        onConfirm={() => deleteQuestion(deleteRow._id)}
      />
    </div>
  )
}
