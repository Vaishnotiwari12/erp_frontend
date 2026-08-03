import { useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import PageHeader from '@/components/PageHeader'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const mockReasons = [
  {
    id: '1',
    reason: 'Transfer Certificate Issued',
    description: 'Student transferred to another school',
    status: 'Active',
  },
  {
    id: '2',
    reason: 'Long Absence',
    description: 'Absent for more than 90 days',
    status: 'Active',
  },
  {
    id: '3',
    reason: 'Fees Pending',
    description: 'Fees overdue',
    status: 'Inactive',
  },
]

export default function DisableReasonsPage() {
  const [search, setSearch] = useState('')
  const [reasons, setReasons] = useState(mockReasons)

  const [openForm, setOpenForm] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [selected, setSelected] = useState(null)

  const filteredReasons = useMemo(() => {
    return reasons.filter((item) =>
      item.reason.toLowerCase().includes(search.toLowerCase())
    )
  }, [reasons, search])

  return (
    <div className="space-y-6">

      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Student Information' },
          { label: 'Disable Reasons' },
        ]}
      />

      <PageHeader
        title="Disable Reasons"
        description="Manage student disable reasons."

        actions={
          <div className="flex gap-2">

            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button onClick={() => setOpenForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Reason
            </Button>

          </div>
        }
      />

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-3">

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Reasons
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {reasons.length}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Active
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {
                reasons.filter((r) => r.status === 'Active').length
              }
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Inactive
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {
                reasons.filter((r) => r.status === 'Inactive').length
              }
            </h2>
          </CardContent>
        </Card>

      </div>

      {/* Search */}

      <Card>

        <CardContent className="p-5">

          <div className="relative">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Disable Reason..."
              className="pl-10"
            />

          </div>

        </CardContent>

      </Card>

      {/* Table */}

      <Card>

        <CardContent className="p-0">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>Reason</TableHead>

                <TableHead>Description</TableHead>

                <TableHead>Status</TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {filteredReasons.length === 0 && (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <AlertCircle className="mx-auto mb-2 h-8 w-8" />

                    No Disable Reasons Found

                  </TableCell>

                </TableRow>

              )}

              {filteredReasons.map((item) => (

                <TableRow key={item.id}>

                  <TableCell className="font-medium">
                    {item.reason}
                  </TableCell>

                  <TableCell>
                    {item.description}
                  </TableCell>

                  <TableCell>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>

                  </TableCell>

                  <TableCell>

                    <div className="flex justify-end gap-2">

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelected(item)
                          setOpenForm(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelected(item)
                          setOpenDelete(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    </div>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>


            {/* Add / Edit Dialog */}

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edit Disable Reason' : 'Add Disable Reason'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input
                defaultValue={selected?.reason || ''}
                placeholder="Enter disable reason"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={5}
                defaultValue={selected?.description || ''}
                placeholder="Write description..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelected(null)
                setOpenForm(false)
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                // TODO: Connect create/update API
                setSelected(null)
                setOpenForm(false)
              }}
            >
              {selected ? 'Update Reason' : 'Create Reason'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Disable Reason</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete
            </p>

            <div className="rounded-lg border bg-muted p-4">
              <p className="font-semibold">
                {selected?.reason}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {selected?.description}
              </p>
            </div>

            <p className="text-sm text-red-600">
              This action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelected(null)
                setOpenDelete(false)
              }}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                // TODO: Connect delete API

                setReasons((prev) =>
                  prev.filter((item) => item.id !== selected?.id)
                )

                setSelected(null)
                setOpenDelete(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}