// ====================================================================
// Module: Front CMS
// Page: Events
//
// Purpose:
// Manage school events, dates, locations, and categories.
//
// Data Source:
// frontCms.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
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
import { StatusBadge } from '@/components/StatusBadge'
import { useEvents } from '@/hooks/useFrontCms'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'event_date', label: 'Event Date' },
  { key: 'event_time', label: 'Event Time' },
  { key: 'location', label: 'Location' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
]

const CATEGORIES = ['Cultural', 'Sports', 'Academic', 'Holiday']

export default function EventPage() {
  const {
    rows, stats, isLoading,
    search, setSearch, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter,
    saveEvent, deleteEvent,
  } = useEvents()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveEvent(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.title}</span>
            <span className="text-xs text-muted-foreground">{row.original.location}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'event_date', header: 'Date', cell: ({ row }) => <span className="text-sm">{formatDate(row.original.event_date)}</span> },
    { accessorKey: 'event_time', header: 'Time', cell: ({ row }) => <span className="font-mono text-sm">{row.original.event_time}</span> },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front CMS' }, { label: 'Events' }]} />
      <PageHeader
        title="Events"
        description="Manage school events, dates, locations, and categories."
        icon={CalendarDays}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Event</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Events" value={stats.total} icon={CalendarDays} accent="primary" />
        <StatCard label="Published" value={stats.published} icon={CalendarDays} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="events" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No events found" description="Add a new event to get started." actionLabel="Add Event" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="events"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <EventFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Event' : 'Add Event'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Event Details"
        description={viewRow?.title}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.title}</p>
                <p className="text-xs text-muted-foreground">{viewRow.location}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Date', value: formatDate(viewRow.event_date) },
                { label: 'Time', value: viewRow.event_time },
                { label: 'Category', value: viewRow.category },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            {viewRow.description && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{viewRow.description}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.title}
        onConfirm={() => deleteEvent(deleteRow._id)}
      />
    </div>
  )
}

// ─── Event Form Drawer (shared by Add and Edit) ───────────────────────────────
function EventFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    event_date: initial?.event_date || '',
    event_time: initial?.event_time || '',
    location: initial?.location || '',
    image_url: initial?.image_url || '',
    category: initial?.category || 'Cultural',
    status: initial?.status || 'draft',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Event information and schedule"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Event'}
          submitDisabled={!form.title.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Event title" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Event description" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Event Date</Label>
              <Input type="date" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Event Time</Label>
              <Input type="time" value={form.event_time} onChange={(e) => set('event_time', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Location</Label>
            <Input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Event location" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Image URL</Label>
            <Input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://… (upload placeholder)" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
