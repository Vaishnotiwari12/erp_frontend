// ====================================================================
// Income Service
//
// Service layer isolates all backend communication for the Income module.
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
  incomeHeads,
  incomes,
  incomeStats,
} from '@/data/income.mock'

export const incomeService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Income Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /income/stats
    // ====================================================================
    return mockResponse(incomeStats)
  },

  // ─── Income Heads ────────────────────────────────────────────────────────────

  // Fetch Income Heads
  // TODO(BACKEND):
  // Replace mock data with GET /income/heads
  async getIncomeHeads() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /income/heads
    // ====================================================================
    return mockResponse(incomeHeads)
  },

  // Create Income Head
  // TODO(BACKEND):
  // Replace with POST /income/heads
  async createIncomeHead(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /income/heads
    // ====================================================================
    return mockResponse({ _id: `ih-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Income Head
  // TODO(BACKEND):
  // Replace with PUT /income/heads/:id
  async updateIncomeHead(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /income/heads/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Income Head
  // TODO(BACKEND):
  // Replace with DELETE /income/heads/:id
  async deleteIncomeHead(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /income/heads/:id
    // ====================================================================
    return mockResponse({ message: 'Income head deleted successfully' })
  },

  // ─── Income Records ──────────────────────────────────────────────────────────

  // Fetch Incomes
  // TODO(BACKEND):
  // Replace mock data with GET /income
  async getIncomes() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /income
    // ====================================================================
    return mockResponse(incomes)
  },

  // Create Income
  // TODO(BACKEND):
  // Replace with POST /income
  async createIncome(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /income
    // ====================================================================
    return mockResponse({ _id: `inc-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Income
  // TODO(BACKEND):
  // Replace with PUT /income/:id
  async updateIncome(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /income/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Income
  // TODO(BACKEND):
  // Replace with DELETE /income/:id
  async deleteIncome(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /income/:id
    // ====================================================================
    return mockResponse({ message: 'Income deleted successfully' })
  },
}

export default incomeService
