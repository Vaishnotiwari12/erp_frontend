// ====================================================================
// Academics Service
//
// Handles all backend communication for Academic Module.
//
// Backend Endpoints:
//
// /api/academic/class
// /api/academic/sections
// /api/academic/subjects
// /api/academic/subject-group
// /api/academic/assign-teacher
// /api/academic/class-timetable
// /api/academic/teacher-timetable
// /api/academic/promote-students
//
// Response Format:
// {
//   success,
//   message,
//   data
// }
// ====================================================================

import apiClient from './api'

export const academicsService = {
  // ==========================================================
  // Classes
  // ==========================================================

  async classes(params = {}) {
    return apiClient.get('/academic/class', {
      params,
    })
  },

  async getClass(id) {
    return apiClient.get(`/academic/class/${id}`)
  },

  async createClass(payload) {
    return apiClient.post('/academic/class', payload)
  },

  async updateClass(id, payload) {
    return apiClient.put(`/academic/class/${id}`, payload)
  },

  async deleteClass(id) {
    return apiClient.delete(`/academic/class/${id}`)
  },

  // ==========================================================
  // Sections
  // ==========================================================

  async sections(params = {}) {
    return apiClient.get('/academic/sections', {
      params,
    })
  },

  async getSection(id) {
    return apiClient.get(`/academic/sections/${id}`)
  },

  async createSection(payload) {
    return apiClient.post('/academic/sections', payload)
  },

  async updateSection(id, payload) {
    return apiClient.put(`/academic/sections/${id}`, payload)
  },

  async deleteSection(id) {
    return apiClient.delete(`/academic/sections/${id}`)
  },

  // ==========================================================
  // Subject Groups
  // ==========================================================

  async subjectGroups(params = {}) {
    return apiClient.get('/academic/subject-group', {
      params,
    })
  },

  async getSubjectGroup(id) {
    return apiClient.get(`/academic/subject-group/${id}`)
  },

  async createSubjectGroup(payload) {
    return apiClient.post('/academic/subject-group', payload)
  },

  async updateSubjectGroup(id, payload) {
    return apiClient.put(`/academic/subject-group/${id}`, payload)
  },

  async deleteSubjectGroup(id) {
    return apiClient.delete(`/academic/subject-group/${id}`)
  },

  // ==========================================================
  // Subjects
  // ==========================================================

  async subjects(params = {}) {
    // Mock implementation for development
    // TODO: Replace with: return apiClient.get('/academic/subjects', { params })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            { _id: 'sub-001', name: 'Mathematics', code: 'MATH', theory: 80, practical: 20, type: 'Core', group: 'Mathematics Group', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
            { _id: 'sub-002', name: 'Physics', code: 'PHY', theory: 70, practical: 30, type: 'Elective', group: 'Science Group', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
            { _id: 'sub-003', name: 'Chemistry', code: 'CHEM', theory: 70, practical: 30, type: 'Elective', group: 'Science Group', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
            { _id: 'sub-004', name: 'Biology', code: 'BIO', theory: 60, practical: 40, type: 'Elective', group: 'Science Group', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
            { _id: 'sub-005', name: 'English', code: 'ENG', theory: 100, practical: 0, type: 'Core', group: 'Languages Group', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
          ],
          message: 'Subjects fetched successfully'
        })
      }, 300)
    })
  },

  async getSubject(id) {
    return apiClient.get(`/academic/subjects/${id}`)
  },

  async createSubject(payload) {
    return apiClient.post('/academic/subjects', payload)
  },

  async updateSubject(id, payload) {
    return apiClient.put(`/academic/subjects/${id}`, payload)
  },

  async deleteSubject(id) {
    return apiClient.delete(`/academic/subjects/${id}`)
  },

  // ==========================================================
  // Assign Class Teacher
  // ==========================================================

  async classTeachers(params = {}) {
    return apiClient.get('/academic/assign-teacher', {
      params,
    })
  },

  async getClassTeacher(id) {
    return apiClient.get(`/academic/assign-teacher/${id}`)
  },

  async createClassTeacher(payload) {
    return apiClient.post('/academic/assign-teacher', payload)
  },

  async updateClassTeacher(id, payload) {
    return apiClient.put(`/academic/assign-teacher/${id}`, payload)
  },

  async deleteClassTeacher(id) {
    return apiClient.delete(`/academic/assign-teacher/${id}`)
  },

  // ==========================================================
  // Class Timetable
  // ==========================================================

  async classTimetable(params = {}) {
    return apiClient.get('/academic/class-timetable', {
      params,
    })
  },

  async getClassTimetable(id) {
    return apiClient.get(`/academic/class-timetable/${id}`)
  },

  async createClassTimetable(payload) {
    return apiClient.post('/academic/class-timetable', payload)
  },

  async updateClassTimetable(id, payload) {
    return apiClient.put(`/academic/class-timetable/${id}`, payload)
  },

  async deleteClassTimetable(id) {
    return apiClient.delete(`/academic/class-timetable/${id}`)
  },

  // ==========================================================
  // Teacher Timetable
  // Backend:
  // GET /api/academic/teacher-timetable/:teacherId
  // ==========================================================

  async teacherTimetable(teacherId) {
    return apiClient.get(`/academic/teacher-timetable/${teacherId}`)
  },

  // ==========================================================
  // Promote Students
  // ==========================================================

  async promotedStudents(params = {}) {
    return apiClient.get('/academic/promote-students', {
      params,
    })
  },

  async getPromotion(id) {
    return apiClient.get(`/academic/promote-students/${id}`)
  },

  async promoteStudents(payload) {
    return apiClient.post('/academic/promote-students', payload)
  },

  async updatePromotion(id, payload) {
    return apiClient.put(`/academic/promote-students/${id}`, payload)
  },

  async deletePromotion(id) {
    return apiClient.delete(`/academic/promote-students/${id}`)
  },
}

export default academicsService