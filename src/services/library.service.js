// ─── Library Service ──────────────────────────────────────────────────────────
// Service layer isolates all backend communication for the Library module.
// Pages never call APIs directly — they call these methods, which return the
// standard envelope: { success, message, data }.
//
// Currently uses mock data. When the backend is ready, replace each
// mockResponse() call with the corresponding apiClient call. The UI does
// not need to change because the return shape stays the same.
//
// INTEGRATION example:
//   async getBooks() {
//     return apiClient.get('/library/books')
//   }

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

  async getBooks() {
    // INTEGRATION: return apiClient.get('/library/books')
    return mockResponse(books)
  },

  async createBook(payload) {
    // INTEGRATION: return apiClient.post('/library/books', payload)
    // New books start fully available — available copies = quantity.
    return mockResponse({
      _id: `bk-${Date.now()}`,
      available: payload.quantity,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...payload,
    })
  },

  async updateBook(id, payload) {
    // INTEGRATION: return apiClient.put(`/library/books/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteBook(id) {
    // INTEGRATION: return apiClient.delete(`/library/books/${id}`)
    return mockResponse({ message: 'Book deleted successfully' })
  },

  // ─── Categories ─────────────────────────────────────────────────────────────

  async getCategories() {
    // INTEGRATION: return apiClient.get('/library/categories')
    return mockResponse(bookCategories)
  },

  // ─── Issue / Return ──────────────────────────────────────────────────────────

  async getIssueRecords() {
    // INTEGRATION: return apiClient.get('/library/issues')
    return mockResponse(issueRecords)
  },

  async issueBook(payload) {
    // INTEGRATION: return apiClient.post('/library/issues', payload)
    return mockResponse({
      _id: `iss-${Date.now()}`,
      return_date: null,
      fine: 0,
      status: 'issued',
      ...payload,
    })
  },

  async returnBook(id, payload) {
    // INTEGRATION: return apiClient.patch(`/library/issues/${id}/return`, payload)
    return mockResponse({ _id: id, status: 'returned', ...payload })
  },

  async deleteIssueRecord(id) {
    // INTEGRATION: return apiClient.delete(`/library/issues/${id}`)
    return mockResponse({ message: 'Issue record deleted' })
  },

  // ─── Library Staff ───────────────────────────────────────────────────────────

  async getLibraryStaff() {
    // INTEGRATION: return apiClient.get('/library/staff')
    return mockResponse(libraryStaff)
  },

  async addLibraryStaff(payload) {
    // INTEGRATION: return apiClient.post('/library/staff', payload)
    return mockResponse({
      _id: `lst-${Date.now()}`,
      status: 'active',
      assigned_at: new Date().toISOString(),
      ...payload,
    })
  },

  async updateLibraryStaff(id, payload) {
    // INTEGRATION: return apiClient.put(`/library/staff/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteLibraryStaff(id) {
    // INTEGRATION: return apiClient.delete(`/library/staff/${id}`)
    return mockResponse({ message: 'Library staff removed' })
  },

  // ─── Dashboard Stats ─────────────────────────────────────────────────────────

  async getStats() {
    // INTEGRATION: return apiClient.get('/library/stats')
    return mockResponse(libraryStats)
  },
}

export default libraryService
