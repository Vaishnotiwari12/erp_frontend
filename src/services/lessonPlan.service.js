import apiClient from "./api";

export const lessonPlanService = {
  // ==========================================================
  // Lesson Plans
  // ==========================================================

  getLessonPlans(params = {}) {
    return apiClient.get("/lesson-plan/lesson-plan", {
      params,
    });
  },

  getLessonPlan(id) {
    return apiClient.get(`/lesson-plan/lesson-plan/${id}`);
  },

  createLessonPlan(payload) {
    return apiClient.post("/lesson-plan/lesson-plan", payload);
  },

  updateLessonPlan(id, payload) {
    return apiClient.put(`/lesson-plan/lesson-plan/${id}`, payload);
  },

  deleteLessonPlan(id) {
    return apiClient.delete(`/lesson-plan/lesson-plan/${id}`);
  },

  // ==========================================================
  // Reference Data
  // ==========================================================

  getClasses(params = {}) {
    return apiClient.get("/academic/class", {
      params,
    });
  },

  getSubjects(params = {}) {
    return apiClient.get("/academic/subject", {
      params,
    });
  },
};

export default lessonPlanService;