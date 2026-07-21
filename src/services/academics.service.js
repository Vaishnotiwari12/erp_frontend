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
} from './mockData'

export const academicsService = {
  async classes() {
    return mockResponse(academicClasses)
  },
  async sections() {
    return mockResponse(academicSections)
  },
  async subjectGroups() {
    return mockResponse(subjectGroups)
  },
  async subjects() {
    return mockResponse(subjects)
  },
  async teachers() {
    return mockResponse(teachers)
  },
  async classTeachers() {
    return mockResponse(classTeachers)
  },
  async classTimetable() {
    return mockResponse(classTimetable)
  },
  async teacherTimetable(name) {
    return mockResponse(getTeacherTimetable(name))
  },
  async createClass(payload) {
    return mockResponse({ _id: `cls-${Date.now()}`, ...payload })
  },
  async createSection(payload) {
    return mockResponse({ _id: `sec-${Date.now()}`, ...payload })
  },
  async createSubjectGroup(payload) {
    return mockResponse({ _id: `grp-${Date.now()}`, ...payload })
  },
  async createSubject(payload) {
    return mockResponse({ _id: `sub-${Date.now()}`, ...payload })
  },
  async createClassTeacher(payload) {
    return mockResponse({ _id: `ct-${Date.now()}`, ...payload })
  },
  async update(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
  async remove(id) {
    return mockResponse({ message: 'Deleted successfully' })
  },
  async bulkDelete(ids) {
    return mockResponse({ message: `${ids.length} records deleted` })
  },
}

export default academicsService
