import { useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Users,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mockStudents = [
  {
    id: '1',
    admissionNo: 'ADM001',
    student: 'Rahul Sharma',
    primaryClass: 'Class 10 A',
    classes: ['10 A', '11 A'],
    status: 'Active',
  },
  {
    id: '2',
    admissionNo: 'ADM002',
    student: 'Priya Singh',
    primaryClass: 'Class 9 B',
    classes: ['9 B', '10 B', '11 B'],
    status: 'Active',
  },
]

export default function MultiClassStudentsPage() {
  const [students, setStudents] = useState(mockStudents)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const [openForm, setOpenForm] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const filteredStudents = useMemo(() => {
    return students.filter(
      (item) =>
        item.student.toLowerCase().includes(search.toLowerCase()) ||
        item.admissionNo.toLowerCase().includes(search.toLowerCase())
    )
  }, [students, search])

  return (
    <div className="space-y-6">

      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Student Information' },
          { label: 'Multi Class Students' },
        ]}
      />

      <PageHeader
        title="Multi Class Students"
        description="Manage students assigned to multiple classes."

        actions={
          <div className="flex gap-2">

            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button onClick={() => setOpenForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Class
            </Button>

          </div>
        }
      />

      {/* KPI */}

      <div className="grid gap-4 md:grid-cols-4">

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Students
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {students.length}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Multi Class
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {students.length}
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
                students.filter((s) => s.status === 'Active').length
              }
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Assignments
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {students.reduce((a, b) => a + b.classes.length, 0)}
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
              placeholder="Search Student..."
              className="pl-10"
            />

          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">

            <Select>

              <SelectTrigger>

                <SelectValue placeholder="Class" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="10">Class 10</SelectItem>

                <SelectItem value="11">Class 11</SelectItem>

              </SelectContent>

            </Select>

            <Select>

              <SelectTrigger>

                <SelectValue placeholder="Section" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="A">A</SelectItem>

                <SelectItem value="B">B</SelectItem>

              </SelectContent>

            </Select>

            <Select>

              <SelectTrigger>

                <SelectValue placeholder="Status" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="Active">
                  Active
                </SelectItem>

                <SelectItem value="Inactive">
                  Inactive
                </SelectItem>

              </SelectContent>

            </Select>

          </div>

        </CardContent>

      </Card>

      {/* Table */}

      <Card>

        <CardContent className="p-0">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>Admission No</TableHead>

                <TableHead>Student</TableHead>

                <TableHead>Primary Class</TableHead>

                <TableHead>Assigned Classes</TableHead>

                <TableHead>Status</TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {filteredStudents.map((student) => (

                <TableRow key={student.id}>

                  <TableCell>
                    {student.admissionNo}
                  </TableCell>

                  <TableCell className="font-medium">
                    {student.student}
                  </TableCell>

                  <TableCell>
                    {student.primaryClass}
                  </TableCell>

                  <TableCell>

                    <div className="flex flex-wrap gap-2">

                      {student.classes.map((cls) => (

                        <span
                          key={cls}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                        >
                          {cls}
                        </span>

                      ))}

                    </div>

                  </TableCell>

                  <TableCell>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      {student.status}
                    </span>

                  </TableCell>

                  <TableCell>

                    <div className="flex justify-end gap-2">

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelected(student)
                          setOpenForm(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelected(student)
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

            {/* Assign / Edit Dialog */}

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edit Multi Class Assignment' : 'Assign Multiple Classes'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">

            <div className="space-y-2">
              <Label>Student</Label>
              <Input
                defaultValue={selected?.student || ''}
                placeholder="Student Name"
              />
            </div>

            <div className="space-y-2">
              <Label>Admission Number</Label>
              <Input
                defaultValue={selected?.admissionNo || ''}
                placeholder="Admission Number"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div className="space-y-2">
                <Label>Primary Class</Label>

                <Select>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selected?.primaryClass || 'Select Primary Class'
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="10A">Class 10 A</SelectItem>
                    <SelectItem value="10B">Class 10 B</SelectItem>
                    <SelectItem value="11A">Class 11 A</SelectItem>
                    <SelectItem value="11B">Class 11 B</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              <div className="space-y-2">
                <Label>Status</Label>

                <Select>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={selected?.status || 'Active'}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Active">
                      Active
                    </SelectItem>

                    <SelectItem value="Inactive">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>

              </div>

            </div>

            <div className="space-y-2">

              <Label>Assigned Classes</Label>

              <Input
                defaultValue={
                  selected?.classes?.join(', ') || ''
                }
                placeholder="Example: 10 A, 11 A, 12 B"
              />

              <p className="text-xs text-muted-foreground">
                Separate multiple classes using commas.
              </p>

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
                // TODO:
                // create / update API

                setSelected(null)
                setOpenForm(false)
              }}
            >
              {selected ? 'Update Assignment' : 'Assign Classes'}
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* Remove Assignment Dialog */}

      <Dialog
        open={openDelete}
        onOpenChange={setOpenDelete}
      >
        <DialogContent className="sm:max-w-md">

          <DialogHeader>
            <DialogTitle>
              Remove Assignment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Users className="mx-auto h-12 w-12 text-red-500" />

            <div className="text-center">

              <h3 className="font-semibold">
                {selected?.student}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Admission No: {selected?.admissionNo}
              </p>

            </div>

            <div className="rounded-lg border p-4">

              <p className="text-sm font-medium">
                Assigned Classes
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {selected?.classes?.map((cls) => (

                  <span
                    key={cls}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs"
                  >
                    {cls}
                  </span>

                ))}

              </div>

            </div>

            <p className="text-center text-sm text-red-600">
              This assignment will be removed permanently.
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
                // TODO:
                // delete API

                setStudents((prev) =>
                  prev.filter(
                    (item) => item.id !== selected?.id
                  )
                )

                setSelected(null)
                setOpenDelete(false)
              }}
            >
              Remove Assignment
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  )
}