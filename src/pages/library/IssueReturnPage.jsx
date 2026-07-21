// Issue / Return — tracks book lending transactions. Staff can issue a book
// to a student or staff member, set a due date, and later mark it returned.
// Overdue books are flagged automatically, and fines are calculated in the UI.

import { useMemo, useState } from 'react'
import { ArrowLeftRight, Eye, Trash2, Printer, BookOpen, CircleCheck as CheckCircle2, CircleAlert, Clock, RotateCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { FineSummary, calculateFine } from '@/components/FineSummary'
import { useAsyncData } from '@/hooks/useAsyncData'
import { libraryService } from '@/services/library.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'book_title', label: 'Book' },
  { key: 'book_isbn', label: 'ISBN' },
  { key: 'member_name', label: 'Member' },
  { key: 'member_type', label: 'Member Type' },
  { key: 'issue_date', label: 'Issue Date' },
  { key: 'due_date', label: 'Due Date' },
  { key: 'return_date', label: 'Return Date' },
  { key: 'fine', label: 'Fine' },
  { key: 'status', label: 'Status' },
  { key: 'issued_by', label: 'Issued By' },
]

// Status pill styles — reused in the table and the detail drawer.
const STATUS_STYLES = {
  issued: 'bg-primary/10 text-primary border-primary/20',
  returned: 'bg-success/10 text-success border-success/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
}

function IssueStatusPill({ status }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_STYLES[status] || STATUS_STYLES.issued)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default function IssueReturnPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => libraryService.getIssueRecords(), [])
  const { data: booksData } = useAsyncData(() => libraryService.getBooks(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [memberTypeFilter, setMemberTypeFilter] = useState('all')
  const [issueOpen, setIssueOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [returnRow, setReturnRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const books = booksData || []

  // Memoize filtered records — avoids re-filtering on every render.
  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.book_title.toLowerCase().includes(q) || r.member_name.toLowerCase().includes(q) || r.book_isbn.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchMemberType = memberTypeFilter === 'all' || r.member_type === memberTypeFilter
    return matchSearch && matchStatus && matchMemberType
  }), [rows, search, statusFilter, memberTypeFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    issued: rows.filter((r) => r.status === 'issued').length,
    overdue: rows.filter((r) => r.status === 'overdue').length,
    returned: rows.filter((r) => r.status === 'returned').length,
  }), [rows])

  const handleIssue = async (payload) => {
    await libraryService.issueBook(payload)
    toast({ title: 'Book issued', description: payload.book_title })
    setIssueOpen(false)
    refetch()
  }

  // Return a book — marks the issue record as returned and calculates the fine.
  const handleReturn = async (record) => {
    const fine = calculateFine(record.due_date, new Date().toISOString().slice(0, 10))
    await libraryService.returnBook(record._id, {
      return_date: new Date().toISOString().slice(0, 10),
      fine,
      status: 'returned',
    })
    toast({ title: 'Book returned', description: fine > 0 ? `Fine: $${fine.toFixed(2)}` : 'No fine' })
    setReturnRow(null)
    refetch()
  }

  const handlePrint = () => {
    window.print()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'book_title',
      header: 'Book',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.book_title}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.original.book_isbn}</span>
        </button>
      ),
    },
    {
      accessorKey: 'member_name',
      header: 'Member',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.member_name}</span>
          <Badge variant="outline" className="w-fit capitalize text-xs">{row.original.member_type}</Badge>
        </div>
      ),
    },
    { accessorKey: 'issue_date', header: 'Issue Date', cell: ({ row }) => formatDate(row.original.issue_date) },
    { accessorKey: 'due_date', header: 'Due Date', cell: ({ row }) => formatDate(row.original.due_date) },
    { accessorKey: 'return_date', header: 'Return Date', cell: ({ row }) => row.original.return_date ? formatDate(row.original.return_date) : '—' },
    { accessorKey: 'fine', header: 'Fine', cell: ({ row }) => row.original.fine > 0 ? <span className="font-medium text-destructive">${row.original.fine}</span> : '—' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <IssueStatusPill status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Return Book', icon: RotateCcw, onClick: () => setReturnRow(r), disabled: r.status === 'returned' },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Library' }, { label: 'Issue / Return' }]} />
      <PageHeader
        title="Issue / Return"
        description="Manage book lending, returns, and overdue fines."
        icon={ArrowLeftRight}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
            <Button onClick={() => setIssueOpen(true)}><BookOpen className="mr-2 h-4 w-4" /> Issue Book</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Transactions" value={stats.total} icon={ArrowLeftRight} accent="primary" />
        <StatCard label="Currently Issued" value={stats.issued} icon={BookOpen} accent="chart2" />
        <StatCard label="Overdue" value={stats.overdue} icon={CircleAlert} accent="destructive" />
        <StatCard label="Returned" value={stats.returned} icon={CheckCircle2} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by book, member, or ISBN…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="issue-records" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="issued">Issued</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
          <select value={memberTypeFilter} onChange={(e) => setMemberTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All members</option>
            <option value="student">Students</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No issue records found" description="Issue a book to get started." actionLabel="Issue Book" onAction={() => setIssueOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="issue-records"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Issue dialog — search member, search book, set dates */}
      <IssueFormDrawer
        open={issueOpen}
        onOpenChange={setIssueOpen}
        books={books}
        onSubmit={handleIssue}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Issue Details"
        description={viewRow?.book_title}
        width="sm:max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>
            {viewRow && viewRow.status !== 'returned' && (
              <Button onClick={() => { setReturnRow(viewRow); setViewRow(null) }}>
                <RotateCcw className="mr-2 h-4 w-4" /> Return Book
              </Button>
            )}
          </>
        }
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.book_title}</p>
                <p className="text-xs text-muted-foreground font-mono">{viewRow.book_isbn}</p>
              </div>
              <IssueStatusPill status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Member', value: viewRow.member_name },
                { label: 'Member Type', value: <Badge variant="outline" className="capitalize">{viewRow.member_type}</Badge> },
                { label: 'Issue Date', value: formatDate(viewRow.issue_date) },
                { label: 'Due Date', value: formatDate(viewRow.due_date) },
                { label: 'Return Date', value: viewRow.return_date ? formatDate(viewRow.return_date) : 'Not returned' },
                { label: 'Issued By', value: viewRow.issued_by },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            {/* Fine summary — shows calculated or backend-provided fine */}
            <FineSummary dueDate={viewRow.due_date} returnDate={viewRow.return_date} fine={viewRow.fine} />
          </div>
        )}
      </Drawer>

      {/* Return confirmation dialog */}
      <Drawer
        open={!!returnRow}
        onOpenChange={(o) => !o && setReturnRow(null)}
        title="Return Book"
        description={returnRow?.book_title}
        width="sm:max-w-sm"
        footer={
          <DrawerFooter
            onCancel={() => setReturnRow(null)}
            submitLabel="Confirm Return"
            onSubmit={() => returnRow && handleReturn(returnRow)}
          />
        }
      >
        {returnRow && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Confirm the return of this book.</p>
            <dl className="grid grid-cols-1 gap-y-3">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Member</dt>
                <dd className="text-sm font-medium">{returnRow.member_name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Due Date</dt>
                <dd className="text-sm font-medium">{formatDate(returnRow.due_date)}</dd>
              </div>
            </dl>
            <FineSummary dueDate={returnRow.due_date} returnDate={null} fine={0} />
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.book_title}
        onConfirm={async () => {
          await libraryService.deleteIssueRecord(deleteRow._id)
          toast({ title: 'Issue record deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// ─── Issue Form Drawer ────────────────────────────────────────────────────────
// Staff search for a member (student or staff), pick a book, and set dates.
function IssueFormDrawer({ open, onOpenChange, books, onSubmit }) {
  const today = new Date().toISOString().slice(0, 10)
  // Default due date is 14 days from today — standard lending period.
  const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  const [form, setForm] = useState({
    book_id: '',
    member_name: '',
    member_id: '',
    member_type: 'student',
    issue_date: today,
    due_date: defaultDue,
    issued_by: 'Front Desk',
  })
  const [memberSearch, setMemberSearch] = useState('')
  const [bookSearch, setBookSearch] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Only books with available copies can be issued.
  const availableBooks = useMemo(() => books.filter((b) => b.available > 0), [books])

  const filteredBooks = useMemo(() => {
    const q = bookSearch.toLowerCase()
    if (!q) return availableBooks
    return availableBooks.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q))
  }, [availableBooks, bookSearch])

  const handleSubmit = () => {
    if (!form.book_id || !form.member_name.trim()) return
    const book = books.find((b) => b._id === form.book_id)
    onSubmit({
      ...form,
      book_title: book?.title || '',
      book_isbn: book?.isbn || '',
    })
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Issue Book"
      description="Lend a book to a student or staff member"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Issue Book"
          submitDisabled={!form.book_id || !form.member_name.trim()}
          onSubmit={handleSubmit}
        />
      }
    >
      <div className="space-y-4">
        {/* Member search — type the member name and select type */}
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Member Name <span className="text-destructive">*</span></Label>
            <Input value={memberSearch} onChange={(e) => { setMemberSearch(e.target.value); set('member_name', e.target.value) }} placeholder="Search student or staff name…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Member ID</Label>
              <Input value={form.member_id} onChange={(e) => set('member_id', e.target.value)} placeholder="e.g. stu-001" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Member Type</Label>
              <select value={form.member_type} onChange={(e) => set('member_type', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
        </FormSection>

        {/* Book search — only shows books with available copies */}
        <div className="space-y-2">
          <Label className="text-xs">Select Book <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} placeholder="Search by title, author, or ISBN…" className="pl-9" />
          </div>
          {/* Book results — scrollable list so the drawer stays compact */}
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
            {filteredBooks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No available books found.</p>
            ) : (
              filteredBooks.map((b) => (
                <button
                  key={b._id}
                  onClick={() => set('book_id', b._id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors',
                    form.book_id === b._id ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted',
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{b.title}</span>
                    <span className="text-xs text-muted-foreground">{b.author} · {b.isbn}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{b.available} left</Badge>
                </button>
              ))
            )}
          </div>
        </div>

        <FormSection columns={1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Issue Date</Label>
              <Input type="date" value={form.issue_date} onChange={(e) => set('issue_date', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Due Date</Label>
              <Input type="date" value={form.due_date} min={form.issue_date} onChange={(e) => set('due_date', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Issued By</Label>
            <Input value={form.issued_by} onChange={(e) => set('issued_by', e.target.value)} placeholder="Staff member name" />
          </div>
        </FormSection>
      </div>
    </Drawer>
  )
}
