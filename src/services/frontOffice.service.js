// ─── Front Office Service ────────────────────────────────────────────────────
// Service layer isolates all backend communication for the Front Office module.
// Pages never call APIs directly — they call these methods, which return the
// standard envelope: { success, message, data }.
//
// Currently uses mock data. When the backend is ready, replace each
// mockResponse() call with the corresponding apiClient call. The UI does not
// need to change because the return shape stays the same.
//
// INTEGRATION example:
//   async getEnquiries() {
//     return apiClient.get('/front-office/enquiries')
//   }

import { mockResponse } from './mockData'
import {
  admissionEnquiries,
  visitors,
  phoneCallLogs,
  postalDispatches,
  postalReceives,
  complaints,
  frontOfficeSetup,
  frontOfficeStats,
} from '@/data/frontOffice.mock'

export const frontOfficeService = {
  // ─── Admission Enquiries ────────────────────────────────────────────────────

  async getEnquiries() {
    // INTEGRATION: return apiClient.get('/front-office/enquiries')
    return mockResponse(admissionEnquiries)
  },

  async createEnquiry(payload) {
    // INTEGRATION: return apiClient.post('/front-office/enquiries', payload)
    return mockResponse({
      _id: `enq-${Date.now()}`,
      status: 'pending',
      enquiry_date: new Date().toISOString(),
      follow_ups: [],
      ...payload,
    })
  },

  async updateEnquiry(id, payload) {
    // INTEGRATION: return apiClient.put(`/front-office/enquiries/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteEnquiry(id) {
    // INTEGRATION: return apiClient.delete(`/front-office/enquiries/${id}`)
    return mockResponse({ message: 'Enquiry deleted successfully' })
  },

  // Add a follow-up note to an existing enquiry — used by the timeline.
  async addEnquiryFollowUp(id, payload) {
    // INTEGRATION: return apiClient.post(`/front-office/enquiries/${id}/follow-ups`, payload)
    return mockResponse({ _id: `fu-${Date.now()}`, ...payload })
  },

  // ─── Visitor Book ───────────────────────────────────────────────────────────

  async getVisitors() {
    // INTEGRATION: return apiClient.get('/front-office/visitors')
    return mockResponse(visitors)
  },

  async createVisitor(payload) {
    // INTEGRATION: return apiClient.post('/front-office/visitors', payload)
    return mockResponse({
      _id: `vis-${Date.now()}`,
      status: 'checked-in',
      check_out: null,
      ...payload,
    })
  },

  async updateVisitor(id, payload) {
    // INTEGRATION: return apiClient.put(`/front-office/visitors/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteVisitor(id) {
    // INTEGRATION: return apiClient.delete(`/front-office/visitors/${id}`)
    return mockResponse({ message: 'Visitor record deleted' })
  },

  // Check-out a visitor — flips status from checked-in to checked-out.
  async checkOutVisitor(id) {
    // INTEGRATION: return apiClient.patch(`/front-office/visitors/${id}/checkout`)
    return mockResponse({ _id: id, status: 'checked-out', check_out: new Date().toISOString() })
  },

  // ─── Phone Call Log ─────────────────────────────────────────────────────────

  async getCallLogs() {
    // INTEGRATION: return apiClient.get('/front-office/call-logs')
    return mockResponse(phoneCallLogs)
  },

  async createCallLog(payload) {
    // INTEGRATION: return apiClient.post('/front-office/call-logs', payload)
    return mockResponse({ _id: `pcl-${Date.now()}`, status: 'pending', ...payload })
  },

  async updateCallLog(id, payload) {
    // INTEGRATION: return apiClient.put(`/front-office/call-logs/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteCallLog(id) {
    // INTEGRATION: return apiClient.delete(`/front-office/call-logs/${id}`)
    return mockResponse({ message: 'Call log deleted' })
  },

  // ─── Postal Dispatch ────────────────────────────────────────────────────────

  async getDispatches() {
    // INTEGRATION: return apiClient.get('/front-office/dispatches')
    return mockResponse(postalDispatches)
  },

  async createDispatch(payload) {
    // INTEGRATION: return apiClient.post('/front-office/dispatches', payload)
    return mockResponse({ _id: `pdc-${Date.now()}`, ...payload })
  },

  async updateDispatch(id, payload) {
    // INTEGRATION: return apiClient.put(`/front-office/dispatches/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteDispatch(id) {
    // INTEGRATION: return apiClient.delete(`/front-office/dispatches/${id}`)
    return mockResponse({ message: 'Dispatch record deleted' })
  },

  // ─── Postal Receive ─────────────────────────────────────────────────────────

  async getReceives() {
    // INTEGRATION: return apiClient.get('/front-office/receives')
    return mockResponse(postalReceives)
  },

  async createReceive(payload) {
    // INTEGRATION: return apiClient.post('/front-office/receives', payload)
    return mockResponse({ _id: `prc-${Date.now()}`, ...payload })
  },

  async updateReceive(id, payload) {
    // INTEGRATION: return apiClient.put(`/front-office/receives/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteReceive(id) {
    // INTEGRATION: return apiClient.delete(`/front-office/receives/${id}`)
    return mockResponse({ message: 'Receive record deleted' })
  },

  // ─── Complaints ───────────────────────────────────────────────────────────────

  async getComplaints() {
    // INTEGRATION: return apiClient.get('/front-office/complaints')
    return mockResponse(complaints)
  },

  async createComplaint(payload) {
    // INTEGRATION: return apiClient.post('/front-office/complaints', payload)
    return mockResponse({
      _id: `cmp-${Date.now()}`,
      status: 'open',
      created_date: new Date().toISOString(),
      resolved_date: null,
      follow_ups: [],
      ...payload,
    })
  },

  async updateComplaint(id, payload) {
    // INTEGRATION: return apiClient.put(`/front-office/complaints/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteComplaint(id) {
    // INTEGRATION: return apiClient.delete(`/front-office/complaints/${id}`)
    return mockResponse({ message: 'Complaint deleted' })
  },

  // Add a follow-up / progress note to a complaint — powers the timeline.
  async addComplaintFollowUp(id, payload) {
    // INTEGRATION: return apiClient.post(`/front-office/complaints/${id}/follow-ups`, payload)
    return mockResponse({ _id: `fu-${Date.now()}`, ...payload })
  },

  // ─── Front Office Setup ─────────────────────────────────────────────────────
  // Setup items are grouped by category. Each category is a small CRUD list.

  async getSetup() {
    // INTEGRATION: return apiClient.get('/front-office/setup')
    return mockResponse(frontOfficeSetup)
  },

  async createSetupItem(category, payload) {
    // INTEGRATION: return apiClient.post(`/front-office/setup/${category}`, payload)
    return mockResponse({ _id: `${category}-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  async updateSetupItem(category, id, payload) {
    // INTEGRATION: return apiClient.put(`/front-office/setup/${category}/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteSetupItem(category, id) {
    // INTEGRATION: return apiClient.delete(`/front-office/setup/${category}/${id}`)
    return mockResponse({ message: 'Setup item deleted' })
  },

  // ─── Dashboard Stats ─────────────────────────────────────────────────────────

  async getStats() {
    // INTEGRATION: return apiClient.get('/front-office/stats')
    return mockResponse(frontOfficeStats)
  },
}

export default frontOfficeService
