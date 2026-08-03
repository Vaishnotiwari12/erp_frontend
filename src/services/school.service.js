import apiClient from "./api";

export const schoolService = {
  // ==========================================================
  // Schools
  // ==========================================================

  list(params = {}) {
    return apiClient.get("/school", {
      params,
    });
  },

  get(id) {
    return apiClient.get(`/school/${id}`);
  },

  create(payload) {
    return apiClient.post("/school", payload);
  },

  update(id, payload) {
    return apiClient.put(`/school/${id}`, payload);
  },

  remove(id) {
    return apiClient.delete(`/school/${id}`);
  },
};

export default schoolService;