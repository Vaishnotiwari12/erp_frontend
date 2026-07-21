import { useMemo, useState } from 'react'
import { Plus, School, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
import FilterSelect from '@/components/common/FilterSelect'
import FilterBar from '@/components/common/FilterBar'
import ListState from '@/components/common/ListState'
import StatusBadge from '@/components/common/StatusBadge'
import DataTable from '@/components/tables/DataTable'
import { useAsyncData } from '@/hooks/useAsyncData'
import { schoolService } from '@/services/school.service'
import { STATUS_OPTIONS } from '@/constants/navigation'
import { formatDate } from '@/utils/format'

export default function SchoolsPage() {
  const { data, isLoading } = useAsyncData(() => schoolService.list(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const rows = data || []
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const ms = !search || r.school_name.toLowerCase().includes(search.toLowerCase()) || r.domain.toLowerCase().includes(search.toLowerCase())
        const mst = status === 'all' || r.status === status
        return ms && mst
      }),
    [rows, search, status],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'school_name',
        header: 'School',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <School className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{row.original.school_name}</p>
              <p className="text-xs text-muted-foreground">{row.original.domain}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'domain', header: 'Domain' },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => formatDate(row.original.createdAt) },
      {
        id: 'actions',
        header: '',
        cell: () => (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Institutions' }, { label: 'Schools' }]} />
      <PageHeader
        title="Schools"
        description="Manage all schools onboarded to the platform. Each school maps to a tenant database."
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Add School</Button>}
      />
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search schools…" className="max-w-sm" />
        <FilterSelect value={status} onChange={setStatus} options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]} />
      </FilterBar>
      <ListState isLoading={isLoading} isEmpty={!isLoading && filtered.length === 0} emptyTitle="No schools found">
        <DataTable columns={columns} data={filtered} />
      </ListState>
    </div>
  )
}
