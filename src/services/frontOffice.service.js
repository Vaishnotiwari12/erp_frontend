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

  // TODO(BACKEND)
  // Replace with GET /front-office/enquiries
  async getEnquiries() {
    return mockResponse(admissionEnquiries)
  },

  // TODO(BACKEND)
  // Replace with POST /front-office/enquiries
  async createEnquiry(payload) {
    return mockResponse({
      _id: `enq-${Date.now()}`,
      status: 'pending',
      enquiry_date: new Date().toISOString(),
      follow_ups: [],
      ...payload,
    })
  },

  // TODO(BACKEND)
  // Replace with PUT /front-office/enquiries/:id
  async updateEnquiry(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /front-office/enquiries/:id
  async deleteEnquiry(id) {
    return mockResponse({ message: 'Enquiry deleted successfully' })
  },

  // Add a follow-up note to an existing enquiry — used by the timeline.
  // TODO(BACKEND)
  // Replace with POST /front-office/enquiries/:id/follow-ups
  async addEnquiryFollowUp(id, payload) {
    return mockResponse({ _id: `fu-${Date.now()}`, ...payload })
  },

  // ─── Visitor Book ───────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /front-office/visitors
  async getVisitors() {
    return mockResponse(visitors)
  },

  // TODO(BACKEND)
  // Replace with POST /front-office/visitors
  async createVisitor(payload) {
    return mockResponse({
      _id: `vis-${Date.now()}`,
      status: 'checked-in',
      check_out: null,
      ...payload,
    })
  },

  // TODO(BACKEND)
  // Replace with PUT /front-office/visitors/:id
  async updateVisitor(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /front-office/visitors/:id
  async deleteVisitor(id) {
    return mockResponse({ message: 'Visitor record deleted' })
  },

  // Check-out a visitor — flips status from checked-in to checked-out.
  // TODO(BACKEND)
  // Replace with PATCH /front-office/visitors/:id/checkout
  async checkOutVisitor(id) {
    return mockResponse({ _id: id, status: 'checked-out', check_out: new Date().toISOString() })
  },

  // ─── Phone Call Log ─────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /front-office/call-logs
  async getCallLogs() {
    return mockResponse(phoneCallLogs)
  },

  // TODO(BACKEND)
  // Replace with POST /front-office/call-logs
  async createCallLog(payload) {
    return mockResponse({ _id: `pcl-${Date.now()}`, status: 'pending', ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /front-office/call-logs/:id
  async updateCallLog(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /front-office/call-logs/:id
  async deleteCallLog(id) {
    return mockResponse({ message: 'Call log deleted' })
  },

  // ─── Postal Dispatch ────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /front-office/dispatches
  async getDispatches() {
    return mockResponse(postalDispatches)
  },

  // TODO(BACKEND)
  // Replace with POST /front-office/dispatches
  async createDispatch(payload) {
    return mockResponse({ _id: `pdc-${Date.now()}`, ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /front-office/dispatches/:id
  async updateDispatch(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /front-office/dispatches/:id
  async deleteDispatch(id) {
    return mockResponse({ message: 'Dispatch record deleted' })
  },

  // ─── Postal Receive ─────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /front-office/receives
  async getReceives() {
    return mockResponse(postalReceives)
  },

  // TODO(BACKEND)
  // Replace with POST /front-office/receives
  async createReceive(payload) {
    return mockResponse({ _id: `prc-${Date.now()}`, ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /front-office/receives/:id
  async updateReceive(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /front-office/receives/:id
  async deleteReceive(id) {
    return mockResponse({ message: 'Receive record deleted' })
  },

  // ─── Complaints ───────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /front-office/complaints
  async getComplaints() {
    return mockResponse(complaints)
  },

  // TODO(BACKEND)
  // Replace with POST /front-office/complaints
  async createComplaint(payload) {
    return mockResponse({
      _id: `cmp-${Date.now()}`,
      status: 'open',
      created_date: new Date().toISOString(),
      resolved_date: null,
      follow_ups: [],
      ...payload,
    })
  },

  // TODO(BACKEND)
  // Replace with PUT /front-office/complaints/:id
  async updateComplaint(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /front-office/complaints/:id
  async deleteComplaint(id) {
    return mockResponse({ message: 'Complaint deleted' })
  },

  // Add a follow-up / progress note to a complaint — powers the timeline.
  // TODO(BACKEND)
  // Replace with POST /front-office/complaints/:id/follow-ups
  async addComplaintFollowUp(id, payload) {
    return mockResponse({ _id: `fu-${Date.now()}`, ...payload })
  },

  // ─── Front Office Setup ─────────────────────────────────────────────────────
  // Setup items are grouped by category. Each category is a small CRUD list.

  // TODO(BACKEND)
  // Replace with GET /front-office/setup
  async getSetup() {
    return mockResponse(frontOfficeSetup)
  },

  // TODO(BACKEND)
  // Replace with POST /front-office/setup/:category
  async createSetupItem(category, payload) {
    return mockResponse({ _id: `${category}-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /front-office/setup/:category/:id
  async updateSetupItem(category, id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /front-office/setup/:category/:id
  async deleteSetupItem(category, id) {
    return mockResponse({ message: 'Setup item deleted' })
  },

  // ─── Dashboard Stats ─────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /front-office/stats
  async getStats() {
    return mockResponse(frontOfficeStats)
  },
}

export default frontOfficeService
