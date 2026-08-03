import apiClient from "./api";

export const alumniService = {
  // Alumni
  getAlumni(params = {}) {
    return apiClient.get("/alumni/alumni", {
      params,
    });
  },

  getAlumniById(id) {
    return apiClient.get(`/alumni/alumni/${id}`);
  },

  createAlumni(payload) {
    return apiClient.post("/alumni/alumni", payload);
  },

  updateAlumni(id, payload) {
    return apiClient.put(`/alumni/alumni/${id}`, payload);
  },

  deleteAlumni(id) {
    return apiClient.delete(`/alumni/alumni/${id}`);
  },

  // Events
  getEvents(params = {}) {
    return apiClient.get("/alumni/event", {
      params,
    });
  },

  getEvent(id) {
    return apiClient.get(`/alumni/event/${id}`);
  },

  createEvent(payload) {
    return apiClient.post("/alumni/event", payload);
  },

  updateEvent(id, payload) {
    return apiClient.put(`/alumni/event/${id}`, payload);
  },

  deleteEvent(id) {
    return apiClient.delete(`/alumni/event/${id}`);
  },
};

export default alumniService;