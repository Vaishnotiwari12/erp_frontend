// ====================================================================
// Module: Domains
// Page: Domains
//
// Purpose:
// Manage tenant domains and their verification status.
//
// Data Source:
// domain.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Plus, Globe, MoveHorizontal as MoreHorizontal, ShieldCheck, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import FilterSelect from '@/components/common/FilterSelect'
import FilterBar from '@/components/FilterBar'
import ListState from '@/components/common/ListState'
import StatusBadge from '@/components/StatusBadge'
import DataTable from '@/components/DataTable'
import { useAsyncData } from '@/hooks/useAsyncData'
import { domainService } from '@/services/domain.service'
import { STATUS_OPTIONS } from '@/constants/navigation'
import { formatDate } from '@/utils/format'

export default function DomainsPage() {
  const { data, isLoading } = useAsyncData(() => domainService.list(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const rows = data || []
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const ms = !search || r.domain.toLowerCase().includes(search.toLowerCase()) || r.school_name.toLowerCase().includes(search.toLowerCase())
        const mst = status === 'all' || r.status === status
        return ms && mst
      }),
    [rows, search, status],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'domain',
        header: 'Domain',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe className="h-4 w-4" />
            </div>
            <p className="font-medium">{row.original.domain}</p>
          </div>
        ),
      },
      { accessorKey: 'school_name', header: 'Institution' },
      {
        accessorKey: 'verified',
        header: 'Verified',
        cell: ({ row }) =>
          row.original.verified ? (
            <span className="inline-flex items-center gap-1 text-success"><ShieldCheck className="h-4 w-4" /> Verified</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-warning"><ShieldAlert className="h-4 w-4" /> Pending</span>
          ),
      },
      { accessorKey: 'ssl', header: 'SSL' },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Institutions' }, { label: 'Domains' }]} />
      <PageHeader
        title="Domains"
        description="Custom domains used for tenant resolution. The backend resolves tenants by request host."
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Register Domain</Button>}
      />
      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search domains…" className="max-w-sm" />
        <FilterSelect value={status} onChange={setStatus} options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]} />
      </FilterBar>
      <ListState isLoading={isLoading} isEmpty={!isLoading && filtered.length === 0} emptyTitle="No domains found">
        <DataTable columns={columns} data={filtered} />
      </ListState>
    </div>
  )
}
