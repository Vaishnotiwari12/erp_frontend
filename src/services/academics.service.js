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
  academicClasses,
  academicSections,
  subjectGroups,
  subjects,
  teachers,
  classTeachers,
  classTimetable,
  getTeacherTimetable,
} from '@/data/academics.mock'

export const academicsService = {
  // TODO(BACKEND)
  // Replace with GET /academics/classes
  async classes() {
    return mockResponse(academicClasses)
  },
  // TODO(BACKEND)
  // Replace with GET /academics/sections
  async sections() {
    return mockResponse(academicSections)
  },
  // TODO(BACKEND)
  // Replace with GET /academics/subject-groups
  async subjectGroups() {
    return mockResponse(subjectGroups)
  },
  // TODO(BACKEND)
  // Replace with GET /academics/subjects
  async subjects() {
    return mockResponse(subjects)
  },
  // TODO(BACKEND)
  // Replace with GET /academics/teachers
  async teachers() {
    return mockResponse(teachers)
  },
  // TODO(BACKEND)
  // Replace with GET /academics/class-teachers
  async classTeachers() {
    return mockResponse(classTeachers)
  },
  // TODO(BACKEND)
  // Replace with GET /academics/class-timetable
  async classTimetable() {
    return mockResponse(classTimetable)
  },
  // TODO(BACKEND)
  // Replace with GET /academics/teacher-timetable
  async teacherTimetable(name) {
    return mockResponse(getTeacherTimetable(name))
  },
  // TODO(BACKEND)
  // Replace with POST /academics/classes
  async createClass(payload) {
    return mockResponse({ _id: `cls-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with POST /academics/sections
  async createSection(payload) {
    return mockResponse({ _id: `sec-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with POST /academics/subject-groups
  async createSubjectGroup(payload) {
    return mockResponse({ _id: `grp-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with POST /academics/subjects
  async createSubject(payload) {
    return mockResponse({ _id: `sub-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with POST /academics/class-teachers
  async createClassTeacher(payload) {
    return mockResponse({ _id: `ct-${Date.now()}`, ...payload })
  },
  // TODO(BACKEND)
  // Replace with PUT /academics/:id
  async update(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  // TODO(BACKEND)
  // Replace with DELETE /academics/:id
  async remove(id) {
    return mockResponse({ message: 'Deleted successfully' })
  },
  // TODO(BACKEND)
  // Replace with POST /academics/bulk-delete
  async bulkDelete(ids) {
    return mockResponse({ message: `${ids.length} records deleted` })
  },
}

export default academicsService
