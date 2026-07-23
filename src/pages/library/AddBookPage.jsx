// ====================================================================
// Module: Library
// Page: Add Book
//
// Purpose:
// Form page for adding a single new book to the catalog.
//
// Data Source:
// library.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useState } from 'react'
import {
  BookPlus,
  Save,
  ArrowLeft,
  BookOpen,
  Building2,
  Hash,
  Layers,
  MapPin,
  Tags,
  Package,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { FormSection } from '@/components/FormSection'
import { BookStatusBadge } from '@/components/BookStatusBadge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { libraryService } from '@/services/library.service'
import { useToast } from '@/hooks/use-toast'

export default function AddBookPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: categoriesData } = useAsyncData(() => libraryService.getCategories(), [])
  const categories = categoriesData || []
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    edition: '',
    rack: '',
    category: 'Fiction',
    quantity: 1,
    cover_url: '',
    description: '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) {
      toast({ title: 'Please fill required fields', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      await libraryService.createBook(form)
      toast({ title: 'Book added successfully', description: form.title })
      navigate('/library/books')
    } catch {
      toast({ title: 'Failed to add book', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Library' }, { label: 'Books', to: '/library/books' }, { label: 'Add Book' }]} />
      <PageHeader
        title="Add Book"
        description="Add a new book to the library catalog."
        icon={BookPlus}
        actions={
          <Button variant="outline" onClick={() => navigate('/library/books')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Book List
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main form — takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold">Book Information</h3>
            </div>
            <FormSection columns={1}>
              <div className="space-y-1.5">
                <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
                <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Book title" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Author <span className="text-destructive">*</span></Label>
                  <Input value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Publisher</Label>
                  <Input value={form.publisher} onChange={(e) => set('publisher', e.target.value)} placeholder="Publisher name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">ISBN</Label>
                  <Input value={form.isbn} onChange={(e) => set('isbn', e.target.value)} placeholder="978-0-00-000000-0" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Edition</Label>
                  <Input value={form.edition} onChange={(e) => set('edition', e.target.value)} placeholder="e.g. 1st, 2nd" />
                </div>
              </div>
            </FormSection>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold">Cataloging & Inventory</h3>
            </div>
            <FormSection columns={1}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Rack Number</Label>
                  <Input value={form.rack} onChange={(e) => set('rack', e.target.value)} placeholder="e.g. A-12" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <select value={form.category} onChange={(e) => set('category', e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                    <option>Fiction</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Mathematics</option>
                    <option>Literature</option>
                    <option>Reference</option>
                    <option>Biography</option>
                    <option>Technology</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Quantity <span className="text-destructive">*</span></Label>
                  <Input type="number" min="1" value={form.quantity} onChange={(e) => set('quantity', parseInt(e.target.value) || 1)} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Cover Image URL</Label>
                  <Input value={form.cover_url} onChange={(e) => set('cover_url', e.target.value)} placeholder="Image URL (optional)" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description (optional)</Label>
                <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Brief summary or notes about the book…" />
              </div>
            </FormSection>
          </div>
        </div>

        {/* Live preview sidebar — shows what the book entry will look like */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold">Live Preview</h3>
            <div className="space-y-4">
              {/* Cover thumbnail */}
              {form.cover_url ? (
                <img src={form.cover_url} alt="Book cover" className="h-40 w-28 rounded-lg object-cover" onError={(e) => { e.target.style.display = 'none' }} />
              ) : (
                <div className="flex h-40 w-28 items-center justify-center rounded-lg bg-muted">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-2">
                <h4 className="font-semibold">{form.title || 'Book title'}</h4>
                <p className="text-sm text-muted-foreground">by {form.author || 'Author name'}</p>
                {form.isbn && <Badge variant="outline" className="font-mono text-xs">{form.isbn}</Badge>}
                {form.category && <Badge variant="secondary">{form.category}</Badge>}
              </div>
              <div className="space-y-1 text-sm">
                {form.publisher && <p className="text-muted-foreground"><Building2 className="mr-1.5 inline h-3.5 w-3.5" />{form.publisher}</p>}
                {form.edition && <p className="text-muted-foreground"><Hash className="mr-1.5 inline h-3.5 w-3.5" />{form.edition} edition</p>}
                {form.rack && <p className="text-muted-foreground"><MapPin className="mr-1.5 inline h-3.5 w-3.5" />Rack {form.rack}</p>}
                <p className="text-muted-foreground"><Package className="mr-1.5 inline h-3.5 w-3.5" />{form.quantity} copies</p>
              </div>
              {/* Available copies = quantity for a new book */}
              <BookStatusBadge available={form.quantity} quantity={form.quantity} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/library/books')}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving…' : 'Save Book'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
