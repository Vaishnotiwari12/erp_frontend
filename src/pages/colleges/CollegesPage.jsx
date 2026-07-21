import { useMemo, useState } from 'react'
import { Plus, Building2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import PageHeader from '@/components/common/PageHeader'
import SearchInput from '@/components/common/SearchInput'
import FilterSelect from '@/components/common/FilterSelect'
import FilterBar from '@/components/common/FilterBar'
import ListState from '@/components/common/ListState'
import StatusBadge from '@/components/common/StatusBadge'
import DataTable from '@/components/tables/DataTable'
import { useAsyncData } from '@/hooks/useAsyncData'
import { collegeService } from '@/services/college.service'
import { STATUS_OPTIONS } from '@/constants/navigation'
import { formatDate } from '@/utils/format'

export default function CollegesPage() {
  const { data, isLoading } = useAsyncData(() => collegeService.list(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const rows = data || []
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const ms = !search || r.college_name.toLowerCase().includes(search.toLowerCase()) || r.college_code.toLowerCase().includes(search.toLowerCase())
        const mst = status === 'all' || r.status === status
        return ms && mst
      }),
    [rows, search, status],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'college_name',
        header: 'College',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{row.original.college_name}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'college_code', header: 'Code', cell: ({ row }) => <Badge variant="outline">{row.original.college_code}</Badge> },
      { accessorKey: 'type', header: 'Type' },
      { accessorKey: 'address', header: 'Address' },
      { accessorKey: 'phone', header: 'Phone' },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Institutions' }, { label: 'Colleges' }]} />
      <PageHeader
        title="Colleges"
        description="Manage colleges within tenant databases."
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Add College</Button>}
      />
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search colleges…" className="max-w-sm" />
        <FilterSelect value={status} onChange={setStatus} options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]} />
      </FilterBar>
      <ListState isLoading={isLoading} isEmpty={!isLoading && filtered.length === 0} emptyTitle="No colleges found">
        <DataTable columns={columns} data={filtered} />
      </ListState>
    </div>
  )
}
