import { useState } from 'react'
import { Trash2, RefreshCw, Search, Download } from 'lucide-react'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export default function BulkDeletePage() {
  const [selected, setSelected] = useState([])

  const students = [
    {
      id: '1',
      admissionNo: 'ADM001',
      rollNo: '01',
      name: 'Rahul Sharma',
      father: 'Rajesh Sharma',
      class: '10',
      section: 'A',
      phone: '9876543210',
      status: 'Active',
    },
    {
      id: '2',
      admissionNo: 'ADM002',
      rollNo: '02',
      name: 'Priya Singh',
      father: 'Mahesh Singh',
      class: '10',
      section: 'A',
      phone: '9876543211',
      status: 'Active',
    },
  ]

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selected.length === students.length) {
      setSelected([])
    } else {
      setSelected(students.map((s) => s.id))
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Student Information' },
          { label: 'Bulk Delete' },
        ]}
      />

      <PageHeader
        title="Bulk Delete Students"
        description="Delete multiple students at once."
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button
              variant="destructive"
              disabled={!selected.length}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selected.length})
            </Button>
          </div>
        }
      />

      {/* Stats */}

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
              Selected
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {selected.length}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Remaining
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {students.length - selected.length}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Ready To Delete
            </p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {selected.length}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}

      <Card>
        <CardContent className="p-6 space-y-4">

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10">Class 10</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Section" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="A">A</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">
                  Active
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="general">
                  General
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

                <TableHead>

                  <Checkbox
                    checked={
                      selected.length === students.length &&
                      students.length > 0
                    }
                    onCheckedChange={toggleAll}
                  />

                </TableHead>

                <TableHead>Admission No</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Father</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {students.map((student) => (

                <TableRow key={student.id}>

                  <TableCell>

                    <Checkbox
                      checked={selected.includes(student.id)}
                      onCheckedChange={() =>
                        toggle(student.id)
                      }
                    />

                  </TableCell>

                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.father}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.status}</TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>
    </div>
  )
}