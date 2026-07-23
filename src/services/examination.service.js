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
  examGroups,
  examSchedule,
  examResults,
  marksGrades,
  marksDivisions,
  admitCards,
  marksheets,
  admitCardTemplate,
  marksheetTemplate,
  consolidatedMarksheets,
} from '@/data/examinations.mock'

export {
  examGroups,
  examSchedule,
  examResults,
  marksGrades,
  marksDivisions,
  admitCards,
  marksheets,
  admitCardTemplate,
  marksheetTemplate,
  consolidatedMarksheets,
}

export const examinationService = {
  // TODO(BACKEND)
  // Replace with GET /exam/group
  async getExamGroups() {
    return mockResponse(examGroups)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/schedule
  async getExamSchedule() {
    return mockResponse(examSchedule)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/result
  async getExamResults() {
    return mockResponse(examResults)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/marks-grade
  async getMarksGrades() {
    return mockResponse(marksGrades)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/marks-division
  async getMarksDivisions() {
    return mockResponse(marksDivisions)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/admit-card
  async getAdmitCards() {
    return mockResponse(admitCards)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/admit-card-template
  async getAdmitCardTemplate() {
    return mockResponse(admitCardTemplate)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/marksheet
  async getMarksheets() {
    return mockResponse(marksheets)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/marksheet-template
  async getMarksheetTemplate() {
    return mockResponse(marksheetTemplate)
  },
  // TODO(BACKEND)
  // Replace with GET /exam/consolidated-marksheet
  async getConsolidatedMarksheets() {
    return mockResponse(consolidatedMarksheets)
  },
  // TODO(BACKEND)
  // Replace with POST /exam/group
  async createExamGroup(payload) {
    return mockResponse({ _id: `eg-${Date.now()}`, ...payload, status: 'scheduled', students_count: 0, subjects_count: 0, createdAt: new Date().toISOString() })
  },
  // TODO(BACKEND)
  // Replace with PUT /exam/group/:id
  async updateExamGroup(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  // TODO(BACKEND)
  // Replace with DELETE /exam/group/:id
  async removeExamGroup(id) {
    return mockResponse({ message: 'Exam group deleted' })
  },
  // TODO(BACKEND)
  // Replace with POST /exam/group/bulk-delete
  async bulkDeleteExamGroups(ids) {
    return mockResponse({ message: `${ids.length} exam groups deleted` })
  },
  // TODO(BACKEND)
  // Replace with POST /exam/schedule
  async createSchedule(payload) {
    return mockResponse({ _id: `es-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with PUT /exam/schedule/:id
  async updateSchedule(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  // TODO(BACKEND)
  // Replace with DELETE /exam/schedule/:id
  async removeSchedule(id) {
    return mockResponse({ message: 'Schedule entry deleted' })
  },
  // TODO(BACKEND)
  // Replace with POST /exam/result
  async createResult(payload) {
    return mockResponse({ _id: `er-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with PUT /exam/result/:id
  async updateResult(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  // TODO(BACKEND)
  // Replace with DELETE /exam/result/:id
  async removeResult(id) {
    return mockResponse({ message: 'Result deleted' })
  },
  // TODO(BACKEND)
  // Replace with POST /exam/marks-grade
  async createMarksGrade(payload) {
    return mockResponse({ _id: `mg-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with PUT /exam/marks-grade/:id
  async updateMarksGrade(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  // TODO(BACKEND)
  // Replace with DELETE /exam/marks-grade/:id
  async removeMarksGrade(id) {
    return mockResponse({ message: 'Grade deleted' })
  },
  // TODO(BACKEND)
  // Replace with POST /exam/marks-division
  async createMarksDivision(payload) {
    return mockResponse({ _id: `md-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with PUT /exam/marks-division/:id
  async updateMarksDivision(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  // TODO(BACKEND)
  // Replace with DELETE /exam/marks-division/:id
  async removeMarksDivision(id) {
    return mockResponse({ message: 'Division deleted' })
  },
  // TODO(BACKEND)
  // Replace with PUT /exam/admit-card-template
  async updateAdmitCardTemplate(payload) {
    return mockResponse({ ...admitCardTemplate, ...payload })
  },
  // TODO(BACKEND)
  // Replace with PUT /exam/marksheet-template
  async updateMarksheetTemplate(payload) {
    return mockResponse({ ...marksheetTemplate, ...payload })
  },
}

export default examinationService
