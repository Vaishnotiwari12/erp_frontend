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
  drivers,
  transportRoutes,
  vehicles,
  pickupPoints,
  vehicleAssignments,
  transportFees,
  transportStats,
  routeSummary,
  vehicleOccupancy,
  feeBreakdown,
} from '@/data/transport.mock'

export const transportService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /transport/stats
  async getStats() {
    return mockResponse(transportStats)
  },

  // TODO(BACKEND)
  // Replace with GET /transport/reports/route-summary
  async getRouteSummary() {
    return mockResponse(routeSummary)
  },

  // TODO(BACKEND)
  // Replace with GET /transport/reports/vehicle-occupancy
  async getVehicleOccupancy() {
    return mockResponse(vehicleOccupancy)
  },

  // TODO(BACKEND)
  // Replace with GET /transport/reports/fee-breakdown
  async getFeeBreakdown() {
    return mockResponse(feeBreakdown)
  },

  // ─── Routes ──────────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /transport/routes
  async getRoutes() {
    return mockResponse(transportRoutes)
  },

  // TODO(BACKEND)
  // Replace with POST /transport/routes
  async createRoute(payload) {
    return mockResponse({ _id: `rte-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /transport/routes/:id
  async updateRoute(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /transport/routes/:id
  async deleteRoute(id) {
    return mockResponse({ message: 'Route deleted successfully' })
  },

  // ─── Vehicles ────────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /transport/vehicles
  async getVehicles() {
    return mockResponse(vehicles)
  },

  // TODO(BACKEND)
  // Replace with POST /transport/vehicles
  async createVehicle(payload) {
    return mockResponse({ _id: `veh-${Date.now()}`, occupied: 0, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /transport/vehicles/:id
  async updateVehicle(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /transport/vehicles/:id
  async deleteVehicle(id) {
    return mockResponse({ message: 'Vehicle deleted successfully' })
  },

  // ─── Drivers ──────────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /transport/drivers
  async getDrivers() {
    return mockResponse(drivers)
  },

  // ─── Pickup Points ───────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /transport/pickup-points
  async getPickupPoints() {
    return mockResponse(pickupPoints)
  },

  // TODO(BACKEND)
  // Replace with POST /transport/pickup-points
  async createPickupPoint(payload) {
    return mockResponse({ _id: `pp-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /transport/pickup-points/:id
  async updatePickupPoint(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /transport/pickup-points/:id
  async deletePickupPoint(id) {
    return mockResponse({ message: 'Pickup point deleted successfully' })
  },

  // ─── Vehicle Assignments ─────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /transport/assignments
  async getVehicleAssignments() {
    return mockResponse(vehicleAssignments)
  },

  // TODO(BACKEND)
  // Replace with POST /transport/assignments
  async assignVehicle(payload) {
    return mockResponse({ _id: `vas-${Date.now()}`, status: 'active', assigned_at: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /transport/assignments/:id
  async updateAssignment(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /transport/assignments/:id
  async deleteAssignment(id) {
    return mockResponse({ message: 'Assignment removed' })
  },

  // ─── Transport Fees ──────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /transport/fees
  async getTransportFees() {
    return mockResponse(transportFees)
  },

  // TODO(BACKEND)
  // Replace with POST /transport/fees/:id/collect
  async collectFee(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // ─── Reports ──────────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /transport/reports/student-wise
  async getStudentReport() {
    return mockResponse(vehicleAssignments)
  },

  // TODO(BACKEND)
  // Replace with GET /transport/reports/route-wise
  async getRouteReport() {
    return mockResponse(transportRoutes)
  },

  // TODO(BACKEND)
  // Replace with GET /transport/reports/vehicle-wise
  async getVehicleReport() {
    return mockResponse(vehicles)
  },

  // TODO(BACKEND)
  // Replace with GET /transport/reports/fee-collection
  async getFeeCollectionReport() {
    return mockResponse(transportFees)
  },
}

export default transportService
