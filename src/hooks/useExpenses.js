// useExpenses
//
// Keeps business logic separate from UI.
//
// Later backend APIs will automatically work without changing pages.
//
// This hook wraps expensesService calls and provides memoized filtering,
// statistics, and CRUD handlers so pages stay UI-only.

import { useMemo, useState, useCallback } from 'react'
import { expensesService } from '@/services/expenses.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'

// ─── useExpenseHeads ───────────────────────────────────────────────────────────
// Manages expense head list state, filtering, stats, and CRUD operations.
export function useExpenseHeads() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => expensesService.getExpenseHeads(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered expense heads
  // unless expense head list or filters change.
  const filtered = useMemo(() => rows.filter((h) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      h.expense_head_name.toLowerCase().includes(q) ||
      (h.description || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || h.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((h) => h.status === 'active').length,
    inactive: rows.filter((h) => h.status === 'inactive').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveExpenseHead = useCallback(async (payload, id) => {
    if (id) {
      await expensesService.updateExpenseHead(id, payload)
      toast({ title: 'Expense head updated', description: payload.expense_head_name })
    } else {
      await expensesService.createExpenseHead(payload)
      toast({ title: 'Expense head added', description: payload.expense_head_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteExpenseHead = useCallback(async (id) => {
    await expensesService.deleteExpenseHead(id)
    toast({ title: 'Expense head deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    saveExpenseHead,
    deleteExpenseHead,
  }
}

// ─── useExpenses ───────────────────────────────────────────────────────────────
// Manages expense record list state, filtering, stats, and CRUD operations.
export function useExpenses() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => expensesService.getExpenses(), [])
  const { data: headsData } = useAsyncData(() => expensesService.getExpenseHeads(), [])

  const [search, setSearch] = useState('')
  const [headFilter, setHeadFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []
  const expenseHeads = headsData || []

  // useMemo prevents recalculating filtered expenses
  // unless expense list or filters change.
  const filtered = useMemo(() => rows.filter((e) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (e.expense_head_name || '').toLowerCase().includes(q) ||
      (e.note || '').toLowerCase().includes(q)
    const matchHead = headFilter === 'all' || e.expense_head_id === headFilter
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchHead && matchStatus
  }), [rows, search, headFilter, statusFilter])

  const stats = useMemo(() => ({
    total: rows.reduce((sum, e) => sum + e.amount, 0),
    thisMonth: rows
      .filter((e) => {
        const d = new Date(e.date)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, e) => sum + e.amount, 0),
    entries: rows.length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveExpense = useCallback(async (payload, id) => {
    if (id) {
      await expensesService.updateExpense(id, payload)
      toast({ title: 'Expense updated', description: payload.expense_head_name })
    } else {
      await expensesService.createExpense(payload)
      toast({ title: 'Expense added', description: payload.expense_head_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteExpense = useCallback(async (id) => {
    await expensesService.deleteExpense(id)
    toast({ title: 'Expense deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    expenseHeads,
    stats,
    isLoading,
    search, setSearch,
    headFilter, setHeadFilter,
    statusFilter, setStatusFilter,
    saveExpense,
    deleteExpense,
  }
}

// ─── useExpenseStats ────────────────────────────────────────────────────────────
// Fetches expense dashboard stats only.
export function useExpenseStats() {
  const { data, isLoading } = useAsyncData(() => expensesService.getStats(), [])
  return {
    stats: data || {},
    isLoading,
  }
}
