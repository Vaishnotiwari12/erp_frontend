// ====================================================================
// Module: Front CMS
// Page: Events
//
// Purpose:
// Manage school events, dates, and descriptions.
//
// Data Source:
// frontCms.service.js (via useEvents hook)
//
// Backend model: event { event_title, event_date, description, image }
//   - createEvent(payload, file) uses FormData with 'image' field
//   - updateEvent(id, payload) uses JSON body
//
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
import { useEvents } from '@/hooks/useFrontCms'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'event_title', label: 'Event Title' },
  { key: 'event_date', label: 'Event Date' },
  { key: 'description', label: 'Description' },
  { key: 'createdAt', label: 'Created At' },
]

export default function EventPage() {
  const {
    rows, stats, isLoading,
    search, setSearch,
    saveEvent, deleteEvent,
  } = useEvents()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, file, id) => {
    await saveEvent(payload, file, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'event_title',
      header: 'Event Title',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="h-4 w-4" />
          </div>
          <span className="font-medium hover:underline">{row.original.event_title}</span>
        </button>
      ),
    },
    { accessorKey: 'event_date', header: 'Event Date', cell: ({ row }) => <span className="text-sm">{formatDate(row.original.event_date)}</span> },
    { accessorKey: 'description', header: 'Description', cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{row.original.description || '—'}</span>
    ) },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span> },
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
        description="Manage school events, dates, and descriptions."
        icon={CalendarDays}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Event</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Events" value={stats.total} icon={CalendarDays} accent="primary" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="events" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
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
        onSubmit={(payload, file) => handleSave(payload, file, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Event Details"
        description={viewRow?.event_title}
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
                <p className="font-semibold">{viewRow.event_title}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Event Date', value: formatDate(viewRow.event_date) },
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
                <p className="text-sm whitespace-pre-wrap">{viewRow.description}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.event_title}
        onConfirm={() => deleteEvent(deleteRow._id)}
      />
    </div>
  )
}

// ─── Event Form Drawer (shared by Add and Edit) ───────────────────────────────
function EventFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    event_title: initial?.event_title || '',
    event_date: initial?.event_date ? initial.event_date.slice(0, 10) : '',
    description: initial?.description || '',
  })
  const [file, setFile] = useState(null)

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
          submitDisabled={!form.event_title.trim()}
          onSubmit={() => onSubmit(form, file)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form, file) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Event Title <span className="text-destructive">*</span></Label>
            <Input value={form.event_title} onChange={(e) => set('event_title', e.target.value)} placeholder="Event title" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Event Date</Label>
            <Input type="date" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Event description" rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {initial?.image && !file && (
              <p className="text-xs text-muted-foreground">Current: {initial.image}</p>
            )}
            {file && (
              <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
            )}
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
