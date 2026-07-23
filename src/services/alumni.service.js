// ====================================================================
// Alumni Service
//
// Service layer isolates all backend communication for the Alumni module.
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
  alumni,
  alumniEvents,
  alumniStats,
} from '@/data/alumni.mock'

export const alumniService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Alumni Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /alumni/stats
    // ====================================================================
    return mockResponse(alumniStats)
  },

  // ─── Alumni ──────────────────────────────────────────────────────────────────

  // Fetch Alumni
  // TODO(BACKEND):
  // Replace mock data with GET /alumni
  async getAlumni() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /alumni
    // ====================================================================
    return mockResponse(alumni)
  },

  // Create Alumni
  // TODO(BACKEND):
  // Replace with POST /alumni
  async createAlumni(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /alumni
    // ====================================================================
    return mockResponse({ _id: `alm-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Alumni
  // TODO(BACKEND):
  // Replace with PUT /alumni/:id
  async updateAlumni(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /alumni/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Alumni
  // TODO(BACKEND):
  // Replace with DELETE /alumni/:id
  async deleteAlumni(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /alumni/:id
    // ====================================================================
    return mockResponse({ message: 'Alumni deleted successfully' })
  },

  // ─── Alumni Events ────────────────────────────────────────────────────────────

  // Fetch Alumni Events
  // TODO(BACKEND):
  // Replace mock data with GET /alumni/events
  async getEvents() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /alumni/events
    // ====================================================================
    return mockResponse(alumniEvents)
  },

  // Create Event
  // TODO(BACKEND):
  // Replace with POST /alumni/events
  async createEvent(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /alumni/events
    // ====================================================================
    return mockResponse({ _id: `aev-${Date.now()}`, status: 'upcoming', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Event
  // TODO(BACKEND):
  // Replace with PUT /alumni/events/:id
  async updateEvent(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /alumni/events/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Event
  // TODO(BACKEND):
  // Replace with DELETE /alumni/events/:id
  async deleteEvent(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /alumni/events/:id
    // ====================================================================
    return mockResponse({ message: 'Event deleted successfully' })
  },
}

export default alumniService
