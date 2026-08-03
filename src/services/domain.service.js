import apiClient from "./api";

export const domainService = {
  list(params = {}) {
    return apiClient.get("/domain", {
      params,
    });
  },

  get(id) {
    return apiClient.get(`/domain/${id}`);
  },

  create(payload) {
    return apiClient.post("/domain", payload);
  },

  update(id, payload) {
    return apiClient.put(`/domain/${id}`, payload);
  },

  remove(id) {
    return apiClient.delete(`/domain/${id}`);
  },
};

export default domainService;