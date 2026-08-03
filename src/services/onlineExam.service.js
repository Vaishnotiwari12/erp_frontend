import apiClient from "./api";

export const onlineExamService = {
  // ==========================================================
  // Exam Categories
  // ==========================================================

  getExamCategories(params = {}) {
    return apiClient.get("/online-exam/exam-category", {
      params,
    });
  },

  getExamCategory(id) {
    return apiClient.get(`/online-exam/exam-category/${id}`);
  },

  createExamCategory(payload) {
    return apiClient.post("/online-exam/exam-category", payload);
  },

  updateExamCategory(id, payload) {
    return apiClient.put(`/online-exam/exam-category/${id}`, payload);
  },

  deleteExamCategory(id) {
    return apiClient.delete(`/online-exam/exam-category/${id}`);
  },

  // ==========================================================
  // Online Exams
  // ==========================================================

  getExams(params = {}) {
    return apiClient.get("/online-exam/exam", {
      params,
    });
  },

  getExam(id) {
    return apiClient.get(`/online-exam/exam/${id}`);
  },

  createExam(payload) {
    return apiClient.post("/online-exam/exam", payload);
  },

  updateExam(id, payload) {
    return apiClient.put(`/online-exam/exam/${id}`, payload);
  },

  deleteExam(id) {
    return apiClient.delete(`/online-exam/exam/${id}`);
  },

  // ==========================================================
  // Question Bank
  // ==========================================================

  getQuestions(params = {}) {
    return apiClient.get("/online-exam/question", {
      params,
    });
  },

  getQuestion(id) {
    return apiClient.get(`/online-exam/question/${id}`);
  },

  createQuestion(payload) {
    return apiClient.post("/online-exam/question", payload);
  },

  updateQuestion(id, payload) {
    return apiClient.put(`/online-exam/question/${id}`, payload);
  },

  deleteQuestion(id) {
    return apiClient.delete(`/online-exam/question/${id}`);
  },

  // ==========================================================
  // Student Attempts
  // ==========================================================

  getAttempts(params = {}) {
    return apiClient.get("/online-exam/student-attempt", {
      params,
    });
  },

  getAttempt(id) {
    return apiClient.get(`/online-exam/student-attempt/${id}`);
  },

  createAttempt(payload) {
    return apiClient.post("/online-exam/student-attempt", payload);
  },

  updateAttempt(id, payload) {
    return apiClient.put(`/online-exam/student-attempt/${id}`, payload);
  },

  deleteAttempt(id) {
    return apiClient.delete(`/online-exam/student-attempt/${id}`);
  },

  // ==========================================================
  // Results
  // ==========================================================

  getResults(params = {}) {
    return apiClient.get("/online-exam/result", {
      params,
    });
  },

  getResult(id) {
    return apiClient.get(`/online-exam/result/${id}`);
  },

  createResult(payload) {
    return apiClient.post("/online-exam/result", payload);
  },

  updateResult(id, payload) {
    return apiClient.put(`/online-exam/result/${id}`, payload);
  },

  deleteResult(id) {
    return apiClient.delete(`/online-exam/result/${id}`);
  },
};

export default onlineExamService;