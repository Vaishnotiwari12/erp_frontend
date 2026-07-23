// ====================================================================
// Hostel Service
//
// Service layer isolates all backend communication for the Hostel module.
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
  roomTypes,
  hostelRooms,
  roomAllocations,
  hostelFees,
  hostelStats,
  occupancyByType,
  roomStatusBreakdown,
  blockOccupancy,
} from '@/data/hostel.mock'

export const hostelService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Hostel Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /hostel/stats
    // ====================================================================
    return mockResponse(hostelStats)
  },

  // Fetch Occupancy By Room Type
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getOccupancyByType() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/reports/occupancy-by-type
    // ====================================================================
    return mockResponse(occupancyByType)
  },

  // Fetch Room Status Breakdown
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getRoomStatusBreakdown() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/reports/room-status-breakdown
    // ====================================================================
    return mockResponse(roomStatusBreakdown)
  },

  // Fetch Block Occupancy
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getBlockOccupancy() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/reports/block-occupancy
    // ====================================================================
    return mockResponse(blockOccupancy)
  },

  // ─── Room Types ──────────────────────────────────────────────────────────────

  // Fetch Hostel Room Types
  // TODO(BACKEND):
  // Replace mock data with GET /hostel/room-types
  async getRoomTypes() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /hostel/room-types
    // ====================================================================
    return mockResponse(roomTypes)
  },

  // Create Room Type
  // TODO(BACKEND):
  // Replace with POST /hostel/room-types
  async createRoomType(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /hostel/room-types
    // ====================================================================
    return mockResponse({ _id: `rt-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Room Type
  // TODO(BACKEND):
  // Replace with PUT /hostel/room-types/:id
  async updateRoomType(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /hostel/room-types/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Room Type
  // TODO(BACKEND):
  // Replace with DELETE /hostel/room-types/:id
  async deleteRoomType(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /hostel/room-types/:id
    // ====================================================================
    return mockResponse({ message: 'Room type deleted successfully' })
  },

  // ─── Hostel Rooms ────────────────────────────────────────────────────────────

  // Fetch Hostel Rooms
  // TODO(BACKEND):
  // Replace mock data with GET /hostel/rooms
  async getRooms() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/rooms
    // ====================================================================
    return mockResponse(hostelRooms)
  },

  // Create Hostel Room
  // TODO(BACKEND):
  // Replace with POST /hostel/rooms
  async createRoom(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /hostel/rooms
    // ====================================================================
    return mockResponse({ _id: `rm-${Date.now()}`, occupied: 0, room_status: 'available', status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Hostel Room
  // TODO(BACKEND):
  // Replace with PUT /hostel/rooms/:id
  async updateRoom(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /hostel/rooms/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Hostel Room
  // TODO(BACKEND):
  // Replace with DELETE /hostel/rooms/:id
  async deleteRoom(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /hostel/rooms/:id
    // ====================================================================
    return mockResponse({ message: 'Room deleted successfully' })
  },

  // ─── Room Allocations ───────────────────────────────────────────────────────

  // Fetch Room Allocations
  // TODO(BACKEND):
  // Replace mock data with GET /hostel/allocation
  async getAllocations() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/allocation
    // ====================================================================
    return mockResponse(roomAllocations)
  },

  // Allocate Student
  // TODO(BACKEND):
  // Replace with POST /hostel/allocation
  //
  // Capacity validation happens here in the service layer so pages stay UI-only.
  // The backend should also validate capacity before persisting the allocation.
  async allocateRoom(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /hostel/allocation
    // ====================================================================

    // Capacity check — prevent over-allocation at the service layer.
    const room = hostelRooms.find((r) => r._id === payload.room_id)
    if (room && room.occupied >= room.capacity) {
      return {
        success: false,
        message: `${room.room_number} is at full capacity (${room.capacity} beds).`,
        data: null,
      }
    }

    return mockResponse({ _id: `all-${Date.now()}`, allocation_status: 'active', check_out: null, allocated_at: new Date().toISOString(), ...payload })
  },

  // Update Allocation
  // TODO(BACKEND):
  // Replace with PUT /hostel/allocation/:id
  async updateAllocation(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /hostel/allocation/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Vacate Room
  // TODO(BACKEND):
  // Replace with DELETE /hostel/allocation/:id
  async vacateAllocation(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /hostel/allocation/:id
    // ====================================================================
    return mockResponse({ message: 'Allocation vacated successfully' })
  },

  // ─── Hostel Fees ──────────────────────────────────────────────────────────────

  // Fetch Hostel Fees
  // TODO(BACKEND):
  // Replace mock data with GET /hostel/fees
  async getFees() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/fees
    // ====================================================================
    return mockResponse(hostelFees)
  },

  // Collect Hostel Fee
  // TODO(BACKEND):
  // Replace with POST /hostel/fees/:id/collect
  async collectFee(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /hostel/fees/:id/collect
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // ─── Reports ──────────────────────────────────────────────────────────────────

  // Fetch Student-wise Report
  // TODO(BACKEND):
  // Replace with GET /hostel/reports/student-wise
  async getStudentReport() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/reports/student-wise
    // ====================================================================
    return mockResponse(roomAllocations)
  },

  // Fetch Room-wise Report
  // TODO(BACKEND):
  // Replace with GET /hostel/reports/room-wise
  async getRoomReport() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/reports/room-wise
    // ====================================================================
    return mockResponse(hostelRooms)
  },

  // Fetch Fee Collection Report
  // TODO(BACKEND):
  // Replace with GET /hostel/reports/fee-collection
  async getFeeCollectionReport() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/reports/fee-collection
    // ====================================================================
    return mockResponse(hostelFees)
  },

  // Fetch Occupancy Report
  // TODO(BACKEND):
  // Replace with GET /hostel/reports/occupancy
  async getOccupancyReport() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /hostel/reports/occupancy
    // ====================================================================
    return mockResponse(hostelRooms)
  },
}

export default hostelService
