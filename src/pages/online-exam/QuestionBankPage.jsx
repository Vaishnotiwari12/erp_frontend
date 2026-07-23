// ====================================================================
// Module: Online Exam
// Page: Question Bank
//
// Purpose:
// Manage the question bank — create, edit, view, and delete questions.
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useQuestionBank } from '@/hooks/useOnlineExam'
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

export default function QuestionBankPage() {
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Online Exam' }, { label: 'Question Bank' }]} />
      <PageHeader
        title="Question Bank"
        description="Manage exam questions across all online examinations."
        icon={HelpCircle}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Question</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Questions" value={stats.total} icon={HelpCircle} accent="primary" />
        <StatCard label="Active Questions" value={stats.active} icon={HelpCircle} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by question or exam…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="question-bank" />
          <select value={examFilter} onChange={(e) => setExamFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All exams</option>
            {exams.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
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
      ) : rows.length === 0 ? (
        <NoData title="No questions found" description="Add a new question to get started." actionLabel="Add Question" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="question-bank"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Question Form Drawer used for both Add and Edit. */}
      <QuestionFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Question' : 'Add Question'}
        initial={editRow}
        exams={allExamList}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer — highlights the correct answer with a green background. */}
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

// ─── Question Form Drawer (shared by Add and Edit) ───────────────────────────
export function QuestionFormDrawer({ open, onOpenChange, title, initial, exams, onSubmit, preselectedExamId }) {
  const [form, setForm] = useState({
    exam_id: initial?.exam_id || preselectedExamId || '',
    exam_name: initial?.exam_name || '',
    question: initial?.question || '',
    option_a: initial?.option_a || '',
    option_b: initial?.option_b || '',
    option_c: initial?.option_c || '',
    option_d: initial?.option_d || '',
    correct_answer: initial?.correct_answer || 'a',
    marks: initial?.marks || 1,
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleExamChange = (id) => {
    const exam = exams.find((e) => e._id === id)
    setForm((f) => ({ ...f, exam_id: id, exam_name: exam?.exam_name || '' }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Question configuration"
      width="sm:max-w-lg"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Question'}
          submitDisabled={!form.exam_id || !form.question.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Exam <span className="text-destructive">*</span></Label>
            <select value={form.exam_id} onChange={(e) => handleExamChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select exam</option>
              {exams.map((e) => (
                <option key={e._id} value={e._id}>{e.exam_name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Question <span className="text-destructive">*</span></Label>
            <Textarea value={form.question} onChange={(e) => set('question', e.target.value)} placeholder="Enter the question" rows={3} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Option A</Label>
              <Input value={form.option_a} onChange={(e) => set('option_a', e.target.value)} placeholder="Option A" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Option B</Label>
              <Input value={form.option_b} onChange={(e) => set('option_b', e.target.value)} placeholder="Option B" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Option C</Label>
              <Input value={form.option_c} onChange={(e) => set('option_c', e.target.value)} placeholder="Option C" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Option D</Label>
              <Input value={form.option_d} onChange={(e) => set('option_d', e.target.value)} placeholder="Option D" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Correct Answer</Label>
              <select value={form.correct_answer} onChange={(e) => set('correct_answer', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Marks</Label>
              <Input type="number" min="1" value={form.marks} onChange={(e) => set('marks', parseInt(e.target.value) || 1)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
