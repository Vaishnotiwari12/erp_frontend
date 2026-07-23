// ====================================================================
// Module: Students
// Page: Student Categories
//
// Purpose:
// Manage reservation and admission categories for students.
//
// Data Source:
// student.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Plus, Tags, Pencil, Trash2, Eye, Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { studentService } from '@/services/student.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Category' },
  { key: 'code', label: 'Code' },
  { key: 'description', label: 'Description' },
  { key: 'students_count', label: 'Students' },
  { key: 'status', label: 'Status' },
]

export default function StudentCategoriesPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => studentService.categories(), [])
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [deleteCat, setDeleteCat] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    students: rows.reduce((sum, r) => sum + (r.students_count || 0), 0),
    inactive: rows.filter((r) => r.status !== 'active').length,
  }), [rows])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Category',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tags className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.code}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'description', header: 'Description' },
      {
        accessorKey: 'students_count',
        header: 'Students',
        cell: ({ row }) => <span className="font-medium">{row.original.students_count}</span>,
      },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => formatDate(row.original.createdAt) },
    ],
    [],
  )

  const rowActions = (cat) => [
    { label: 'View', icon: Eye, onClick: () => toast({ title: cat.name, description: cat.description }) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditCat(cat) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteCat(cat) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Students', to: '/students' }, { label: 'Categories' }]} />
      <PageHeader
        title="Student Categories"
        description="Manage reservation and admission categories."
        icon={Tags}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Category</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Categories" value={stats.total} icon={Tags} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={Tags} accent="success" />
        <StatCard label="Total Students" value={stats.students} icon={Users} accent="chart2" />
        <StatCard label="Inactive" value={stats.inactive} icon={Tags} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search categories…" className="max-w-sm" />
        <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="student-categories" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <NoData title="No categories found" actionLabel="Add Category" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="student-categories"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Categories deleted' }); refetch() } }]}
          rowActions={(cat) => <ActionDropdown actions={rowActions(cat)} />}
        />
      )}

      <CategoryDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Category" onSubmit={async (payload) => { toast({ title: 'Category added', description: payload.name }); setAddOpen(false); refetch() }} />
      <CategoryDrawer open={!!editCat} onOpenChange={(o) => !o && setEditCat(null)} title="Edit Category" initial={editCat} onSubmit={async (payload) => { toast({ title: 'Category updated', description: payload.name }); setEditCat(null); refetch() }} />

      <DeleteDialog
        open={!!deleteCat}
        onOpenChange={(o) => !o && setDeleteCat(null)}
        entityName={deleteCat?.name}
        onConfirm={() => { toast({ title: 'Category deleted' }); setDeleteCat(null); refetch() }}
      />
    </div>
  )
}

function CategoryDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    code: initial?.code || '',
    description: initial?.description || '',
    status: initial?.status || 'active',
  })
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Category details"
      width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. General" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Code</Label>
            <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. GEN" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
