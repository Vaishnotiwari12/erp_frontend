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
  async getFeesCollection() {
    return mockResponse({ stats: feesStats, students: searchableStudents })
  },
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
  async collectPayment(payload) {
    return mockResponse({
      _id: `pay-${Date.now()}`,
      receipt_no: `RCP-2025-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: new Date().toISOString().slice(0, 10),
      ...payload,
      status: 'Paid',
    })
  },
  async getOfflinePayments() {
    return mockResponse(offlinePayments)
  },
  async getBankPayments() {
    return mockResponse(offlinePayments)
  },
  async createOfflinePayment(payload) {
    return mockResponse({ _id: `op-${Date.now()}`, ...payload })
  },
  async approveOfflinePayment(id) {
    return mockResponse({ _id: id, status: 'Approved' })
  },
  async rejectOfflinePayment(id) {
    return mockResponse({ _id: id, status: 'Rejected' })
  },
  async getFeesPayments() {
    return mockResponse(feePayments)
  },
  async getDueFees() {
    return mockResponse(dueFees)
  },
  async sendReminder(id) {
    return mockResponse({ _id: id, reminder_sent: true, message: 'Reminder sent successfully' })
  },
  async getFeesReport() {
    return mockResponse(feesReport)
  },
  async getFeesMaster() {
    return mockResponse(feesMaster)
  },
  async getFeesGroups() {
    return mockResponse(feesGroups)
  },
  async getFeesTypes() {
    return mockResponse(feesTypes)
  },
  async getFeesDiscounts() {
    return mockResponse(feesDiscounts)
  },
  async getCarryForward() {
    return mockResponse(feesCarryForward)
  },
  async createFeesMaster(payload) {
    return mockResponse({ _id: `fm-${Date.now()}`, ...payload })
  },
  async createFeesGroup(payload) {
    return mockResponse({ _id: `fg-${Date.now()}`, ...payload })
  },
  async createFeesType(payload) {
    return mockResponse({ _id: `ft-${Date.now()}`, ...payload })
  },
  async createFeesDiscount(payload) {
    return mockResponse({ _id: `fd-${Date.now()}`, ...payload })
  },
  async createCarryForward(payload) {
    return mockResponse({ _id: `cf-${Date.now()}`, ...payload })
  },
  async update(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  async remove(id) {
    return mockResponse({ message: 'Deleted successfully' })
  },
}

export default feesService
