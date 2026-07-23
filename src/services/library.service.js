// ====================================================================
// Service Layer
//
// Purpose:
// Handles all backend communication for this module.
//
// Current State:
// Uses mock data.
//
// TODO(BACKEND):
// Replace mock implementation with Axios API calls.
//
// Expected Response:
// { success, message, data }
// ====================================================================

import { mockResponse } from './mockData'
import {
  books,
  bookCategories,
  issueRecords,
  libraryStaff,
  libraryStats,
} from '@/data/library.mock'

export const libraryService = {
  // ─── Books ──────────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /library/books
  async getBooks() {
    return mockResponse(books)
  },

  // TODO(BACKEND)
  // Replace with POST /library/books
  async createBook(payload) {
    // New books start fully available — available copies = quantity.
    return mockResponse({
      _id: `bk-${Date.now()}`,
      available: payload.quantity,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...payload,
    })
  },

  // TODO(BACKEND)
  // Replace with PUT /library/books/:id
  async updateBook(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /library/books/:id
  async deleteBook(id) {
    return mockResponse({ message: 'Book deleted successfully' })
  },

  // ─── Categories ─────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /library/categories
  async getCategories() {
    return mockResponse(bookCategories)
  },

  // ─── Issue / Return ──────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /library/issues
  async getIssueRecords() {
    return mockResponse(issueRecords)
  },

  // TODO(BACKEND)
  // Replace with POST /library/issues
  async issueBook(payload) {
    return mockResponse({
      _id: `iss-${Date.now()}`,
      return_date: null,
      fine: 0,
      status: 'issued',
      ...payload,
    })
  },

  // TODO(BACKEND)
  // Replace with PATCH /library/issues/:id/return
  async returnBook(id, payload) {
    return mockResponse({ _id: id, status: 'returned', ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /library/issues/:id
  async deleteIssueRecord(id) {
    return mockResponse({ message: 'Issue record deleted' })
  },

  // ─── Library Staff ───────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /library/staff
  async getLibraryStaff() {
    return mockResponse(libraryStaff)
  },

  // TODO(BACKEND)
  // Replace with POST /library/staff
  async addLibraryStaff(payload) {
    return mockResponse({
      _id: `lst-${Date.now()}`,
      status: 'active',
      assigned_at: new Date().toISOString(),
      ...payload,
    })
  },

  // TODO(BACKEND)
  // Replace with PUT /library/staff/:id
  async updateLibraryStaff(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /library/staff/:id
  async deleteLibraryStaff(id) {
    return mockResponse({ message: 'Library staff removed' })
  },

  // ─── Dashboard Stats ─────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /library/stats
  async getStats() {
    return mockResponse(libraryStats)
  },
}

export default libraryService
