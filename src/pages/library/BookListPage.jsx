// Book List — the library's catalog page. Staff can search, filter by
// category, filter by availability, sort, export, and print the list.
// Each row shows a book cover thumbnail, title, author, ISBN, and copies.

import { useMemo, useState } from 'react'
import { BookPlus, Eye, Pencil, Trash2, Printer, BookOpen, Library as LibraryIcon, CircleCheck as CheckCircle2, CircleX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { BookStatusBadge } from '@/components/BookStatusBadge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { libraryService } from '@/services/library.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'isbn', label: 'ISBN' },
  { key: 'edition', label: 'Edition' },
  { key: 'rack', label: 'Rack' },
  { key: 'category', label: 'Category' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'available', label: 'Available' },
]

export default function BookListPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => libraryService.getBooks(), [])
  const { data: categoriesData } = useAsyncData(() => libraryService.getCategories(), [])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const categories = categoriesData || []

  // Memoize filtered books for better performance — avoids re-filtering on every render.
  const filtered = useMemo(() => rows.filter((b) => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q)
    const matchCategory = categoryFilter === 'all' || b.category === categoryFilter
    const matchAvailability = availabilityFilter === 'all'
      || (availabilityFilter === 'available' && b.available > 0)
      || (availabilityFilter === 'issued' && b.available === 0)
    return matchSearch && matchCategory && matchAvailability
  }), [rows, search, categoryFilter, availabilityFilter])

  const stats = useMemo(() => ({
    totalTitles: rows.length,
    totalCopies: rows.reduce((sum, b) => sum + b.quantity, 0),
    available: rows.reduce((sum, b) => sum + b.available, 0),
    issued: rows.reduce((sum, b) => sum + (b.quantity - b.available), 0),
  }), [rows])

  const handleSave = async (payload, id) => {
    if (id) {
      await libraryService.updateBook(id, payload)
      toast({ title: 'Book updated', description: payload.title })
      setEditRow(null)
    } else {
      await libraryService.createBook(payload)
      toast({ title: 'Book added', description: payload.title })
      setAddOpen(false)
    }
    refetch()
  }

  const handlePrint = () => {
    window.print()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Book',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          {/* Book cover thumbnail — uses Pexels stock images from mock data */}
          <img
            src={row.original.cover_url}
            alt={row.original.title}
            className="h-12 w-9 flex-shrink-0 rounded object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.title}</span>
            <span className="text-xs text-muted-foreground">{row.original.author}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'isbn', header: 'ISBN', cell: ({ row }) => <Badge variant="outline" className="font-mono text-xs">{row.original.isbn}</Badge> },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge> },
    { accessorKey: 'rack', header: 'Rack' },
    { accessorKey: 'quantity', header: 'Copies' },
    { accessorKey: 'available', header: 'Status', cell: ({ row }) => <BookStatusBadge available={row.original.available} quantity={row.original.quantity} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Library' }, { label: 'Book List' }]} />
      <PageHeader
        title="Book List"
        description="Browse, search, and manage the library catalog."
        icon={BookOpen}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
            <Button onClick={() => setAddOpen(true)}><BookPlus className="mr-2 h-4 w-4" /> Add Book</Button>
          </div>
        }
      />

      {/* KPI cards — give librarians an at-a-glance snapshot of the catalog. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Titles" value={stats.totalTitles} icon={LibraryIcon} accent="primary" />
        <StatCard label="Total Copies" value={stats.totalCopies} icon={BookOpen} accent="chart2" />
        <StatCard label="Available" value={stats.available} icon={CheckCircle2} accent="success" />
        <StatCard label="Issued" value={stats.issued} icon={CircleX} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title, author, or ISBN…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="book-list" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All availability</option>
            <option value="available">Available</option>
            <option value="issued">All Issued</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No books found" description="Add a new book to get started." actionLabel="Add Book" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="book-list"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Shared dialog for Create and Edit — the same form, different initial data. */}
      <BookFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Book' : 'Add Book'}
        initial={editRow}
        categories={categories}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Book Details"
        description={viewRow?.title}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src={viewRow.cover_url}
                alt={viewRow.title}
                className="h-28 w-20 flex-shrink-0 rounded-lg object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{viewRow.title}</h3>
                <p className="text-sm text-muted-foreground">by {viewRow.author}</p>
                <BookStatusBadge available={viewRow.available} quantity={viewRow.quantity} />
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'ISBN', value: <Badge variant="outline" className="font-mono">{viewRow.isbn}</Badge> },
                { label: 'Publisher', value: viewRow.publisher },
                { label: 'Edition', value: viewRow.edition },
                { label: 'Category', value: <Badge variant="secondary">{viewRow.category}</Badge> },
                { label: 'Rack', value: viewRow.rack },
                { label: 'Quantity', value: viewRow.quantity },
                { label: 'Available', value: viewRow.available },
                { label: 'Added On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.title}
        onConfirm={async () => {
          await libraryService.deleteBook(deleteRow._id)
          toast({ title: 'Book deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// ─── Form Drawer (shared by Create and Edit) ──────────────────────────────────
// One form component serves both add and edit — the `initial` prop decides.
function BookFormDrawer({ open, onOpenChange, title, initial, categories, onSubmit }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    author: initial?.author || '',
    publisher: initial?.publisher || '',
    isbn: initial?.isbn || '',
    edition: initial?.edition || '',
    rack: initial?.rack || '',
    category: initial?.category || 'Fiction',
    quantity: initial?.quantity || 1,
    cover_url: initial?.cover_url || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Book information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Book'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Book title" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Author <span className="text-destructive">*</span></Label>
              <Input value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Publisher</Label>
              <Input value={form.publisher} onChange={(e) => set('publisher', e.target.value)} placeholder="Publisher name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">ISBN</Label>
              <Input value={form.isbn} onChange={(e) => set('isbn', e.target.value)} placeholder="978-0-00-000000-0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Edition</Label>
              <Input value={form.edition} onChange={(e) => set('edition', e.target.value)} placeholder="e.g. 1st, 2nd" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Rack Number</Label>
              <Input value={form.rack} onChange={(e) => set('rack', e.target.value)} placeholder="e.g. A-12" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                <option>Fiction</option>
                <option>Science</option>
                <option>History</option>
                <option>Mathematics</option>
                <option>Literature</option>
                <option>Reference</option>
                <option>Biography</option>
                <option>Technology</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Quantity <span className="text-destructive">*</span></Label>
              <Input type="number" min="1" value={form.quantity} onChange={(e) => set('quantity', parseInt(e.target.value) || 1)} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Cover URL</Label>
              <Input value={form.cover_url} onChange={(e) => set('cover_url', e.target.value)} placeholder="Image URL (optional)" />
            </div>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
