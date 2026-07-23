// ====================================================================
// Module: Inventory
// Page: Inventory Dashboard
//
// Purpose:
// Overview of inventory items, stock value, low-stock alerts, and issues.
//
// Data Source:
// inventory.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { Package, DollarSign, TriangleAlert as AlertTriangle, ClipboardList, Tag, Warehouse, Truck, Send } from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useInventoryStats } from '@/hooks/useInventory'
import { formatCurrency } from '@/utils/format'

export default function InventoryDashboardPage() {
  const { stats, isLoading } = useInventoryStats()

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Inventory' }, { label: 'Dashboard' }]} />
      <PageHeader
        title="Inventory Overview"
        description="Track items, stock value, suppliers, and issued equipment across all stores."
        icon={Package}
      />

      {/* KPI cards — at-a-glance snapshot of the inventory operation. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Items" value={stats?.total_items ?? '—'} icon={Package} accent="primary" />
        <StatCard label="Total Stock Value" value={stats ? formatCurrency(stats.total_stock_value) : '—'} icon={DollarSign} accent="success" />
        <StatCard label="Low Stock Alerts" value={stats?.low_stock_items ?? '—'} icon={AlertTriangle} accent="destructive" />
        <StatCard label="Total Issues" value={stats?.total_issues ?? '—'} icon={ClipboardList} accent="chart2" />
      </div>

      {/* Secondary KPI cards — breakdown of supporting entities. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Categories" value={stats?.total_categories ?? '—'} icon={Tag} accent="primary" />
        <StatCard label="Stores" value={stats?.total_stores ?? '—'} icon={Warehouse} accent="chart3" />
        <StatCard label="Suppliers" value={stats?.total_suppliers ?? '—'} icon={Truck} accent="chart4" />
        <StatCard label="Items Issued" value={stats?.issued_items ?? '—'} icon={Send} accent="chart2" />
      </div>

      {isLoading && <LoadingSkeleton variant="table" rows={4} cols={4} />}
    </div>
  )
}
