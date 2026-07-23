// ====================================================================
// Expenses Service
//
// Service layer isolates all backend communication for the Expenses module.
// Pages never call APIs directly — they call these methods, which return
// the standard envelope: { success, message, data }.
//
// Currently uses mock data. When the backend is ready, replace each
// mockResponse() call with the corresponding Axios API call. The UI
// does not need to change because the return shape stays the same.
// ====================================================================
// BACKEND INTEGRATION
// Replace this mock implementation with Axios API call.
// UI components should never call APIs directly.
// Only modify this service when backend APIs become available.
// ====================================================================

import { mockResponse } from './mockData'
import {
  expenseHeads,
  expenses,
  expenseStats,
} from '@/data/expenses.mock'

export const expensesService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Expenses Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /expenses/stats
    // ====================================================================
    return mockResponse(expenseStats)
  },

  // ─── Expense Heads ───────────────────────────────────────────────────────────

  // Fetch Expense Heads
  // TODO(BACKEND):
  // Replace mock data with GET /expenses/heads
  async getExpenseHeads() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /expenses/heads
    // ====================================================================
    return mockResponse(expenseHeads)
  },

  // Create Expense Head
  // TODO(BACKEND):
  // Replace with POST /expenses/heads
  async createExpenseHead(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /expenses/heads
    // ====================================================================
    return mockResponse({ _id: `eh-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Expense Head
  // TODO(BACKEND):
  // Replace with PUT /expenses/heads/:id
  async updateExpenseHead(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /expenses/heads/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Expense Head
  // TODO(BACKEND):
  // Replace with DELETE /expenses/heads/:id
  async deleteExpenseHead(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /expenses/heads/:id
    // ====================================================================
    return mockResponse({ message: 'Expense head deleted successfully' })
  },

  // ─── Expense Records ─────────────────────────────────────────────────────────

  // Fetch Expenses
  // TODO(BACKEND):
  // Replace mock data with GET /expenses
  async getExpenses() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /expenses
    // ====================================================================
    return mockResponse(expenses)
  },

  // Create Expense
  // TODO(BACKEND):
  // Replace with POST /expenses
  async createExpense(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /expenses
    // ====================================================================
    return mockResponse({ _id: `exp-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Expense
  // TODO(BACKEND):
  // Replace with PUT /expenses/:id
  async updateExpense(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /expenses/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Expense
  // TODO(BACKEND):
  // Replace with DELETE /expenses/:id
  async deleteExpense(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /expenses/:id
    // ====================================================================
    return mockResponse({ message: 'Expense deleted successfully' })
  },
}

export default expensesService
