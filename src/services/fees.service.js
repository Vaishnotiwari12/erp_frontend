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
  feesGroups,
  feesTypes,
  feesMaster,
  feesDiscounts,
  feesCarryForward,
  offlinePayments,
  feePayments,
  dueFees,
  feesStats,
  feesReport,
  searchableStudents,
  getFeeBreakdown,
  getPaymentHistory,
} from '@/data/fees.mock'

export const feesService = {
  // TODO(BACKEND)
  // Replace with GET /fees/collection
  async getFeesCollection() {
    return mockResponse({ stats: feesStats, students: searchableStudents })
  },
  // TODO(BACKEND)
  // Replace with GET /fees/students/search
  async searchStudents(query) {
    const q = (query || '').toLowerCase()
    const result = q
      ? searchableStudents.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.admission_no.toLowerCase().includes(q) ||
            s.class.toLowerCase().includes(q),
        )
      : searchableStudents
    return mockResponse(result)
  },
  // TODO(BACKEND)
  // Replace with GET /fees/student/:id/summary
  async getStudentFeeSummary(studentId) {
    const breakdown = getFeeBreakdown(studentId)
    const total = breakdown.reduce((a, b) => a + b.amount, 0)
    const paid = breakdown.reduce((a, b) => a + b.paid, 0)
    const discount = breakdown.reduce((a, b) => a + b.discount, 0)
    const balance = total - paid - discount
    return mockResponse({
      studentId,
      breakdown,
      total,
      paid,
      discount,
      balance,
      history: getPaymentHistory(studentId),
    })
  },
  // TODO(BACKEND)
  // Replace with POST /fees/collect
  async collectPayment(payload) {
    return mockResponse({
      _id: `pay-${Date.now()}`,
      receipt_no: `RCP-2025-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: new Date().toISOString().slice(0, 10),
      ...payload,
      status: 'Paid',
    })
  },
  // TODO(BACKEND)
  // Replace with GET /fees/offline-payments
  async getOfflinePayments() {
    return mockResponse(offlinePayments)
  },
  // TODO(BACKEND)
  // Replace with GET /fees/bank-payments
  async getBankPayments() {
    return mockResponse(offlinePayments)
  },
  // TODO(BACKEND)
  // Replace with POST /fees/offline-payments
  async createOfflinePayment(payload) {
    return mockResponse({ _id: `op-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with PATCH /fees/offline-payments/:id/approve
  async approveOfflinePayment(id) {
    return mockResponse({ _id: id, status: 'Approved' })
  },
  // TODO(BACKEND)
  // Replace with PATCH /fees/offline-payments/:id/reject
  async rejectOfflinePayment(id) {
    return mockResponse({ _id: id, status: 'Rejected' })
  },
  // TODO(BACKEND)
  // Replace with GET /fees/payments
  async getFeesPayments() {
    return mockResponse(feePayments)
  },
  // TODO(BACKEND)
  // Replace with GET /fees/due
  async getDueFees() {
    return mockResponse(dueFees)
  },
  // TODO(BACKEND)
  // Replace with POST /fees/:id/reminder
  async sendReminder(id) {
    return mockResponse({ _id: id, reminder_sent: true, message: 'Reminder sent successfully' })
  },
  // TODO(BACKEND)
  // Replace with GET /fees/report
  async getFeesReport() {
    return mockResponse(feesReport)
  },
  // TODO(BACKEND)
  // Replace with GET /fees/master
  async getFeesMaster() {
    return mockResponse(feesMaster)
  },
  // TODO(BACKEND)
  // Replace with GET /fees/groups
  async getFeesGroups() {
    return mockResponse(feesGroups)
  },
  // TODO(BACKEND)
  // Replace with GET /fees/types
  async getFeesTypes() {
    return mockResponse(feesTypes)
  },
  // TODO(BACKEND)
  // Replace with GET /fees/discounts
  async getFeesDiscounts() {
    return mockResponse(feesDiscounts)
  },
  // TODO(BACKEND)
  // Replace with GET /fees/carry-forward
  async getCarryForward() {
    return mockResponse(feesCarryForward)
  },
  // TODO(BACKEND)
  // Replace with POST /fees/master
  async createFeesMaster(payload) {
    return mockResponse({ _id: `fm-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with POST /fees/groups
  async createFeesGroup(payload) {
    return mockResponse({ _id: `fg-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with POST /fees/types
  async createFeesType(payload) {
    return mockResponse({ _id: `ft-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with POST /fees/discounts
  async createFeesDiscount(payload) {
    return mockResponse({ _id: `fd-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with POST /fees/carry-forward
  async createCarryForward(payload) {
    return mockResponse({ _id: `cf-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with PUT /fees/:id
  async update(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  // TODO(BACKEND)
  // Replace with DELETE /fees/:id
  async remove(id) {
    return mockResponse({ message: 'Deleted successfully' })
  },
}

export default feesService
