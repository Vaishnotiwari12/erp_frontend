import apiClient from "./api";

export const downloadCenterService = {
  // ==========================================================
  // Content Types
  // ==========================================================

  getContentTypes(params = {}) {
    return apiClient.get("/download-center/content-type", {
      params,
    });
  },

  getContentType(id) {
    return apiClient.get(`/download-center/content-type/${id}`);
  },

  createContentType(payload) {
    return apiClient.post("/download-center/content-type", payload);
  },

  updateContentType(id, payload) {
    return apiClient.put(`/download-center/content-type/${id}`, payload);
  },

  deleteContentType(id) {
    return apiClient.delete(`/download-center/content-type/${id}`);
  },

  // ==========================================================
  // Upload / Share Content
  // ==========================================================

  getContents(params = {}) {
    return apiClient.get("/download-center/upload-content", {
      params,
    });
  },

  getContent(id) {
    return apiClient.get(`/download-center/upload-content/${id}`);
  },

  createContent(payload) {
    return apiClient.post("/download-center/upload-content", payload);
  },

  updateContent(id, payload) {
    return apiClient.put(`/download-center/upload-content/${id}`, payload);
  },

  deleteContent(id) {
    return apiClient.delete(`/download-center/upload-content/${id}`);
  },

  // ==========================================================
  // Content Share
  // ==========================================================

  getShareLists(params = {}) {
    return apiClient.get("/download-center/content-share", {
      params,
    });
  },

  getShareList(id) {
    return apiClient.get(`/download-center/content-share/${id}`);
  },

  createShareList(payload) {
    return apiClient.post("/download-center/content-share", payload);
  },

  updateShareList(id, payload) {
    return apiClient.put(`/download-center/content-share/${id}`, payload);
  },

  deleteShareList(id) {
    return apiClient.delete(`/download-center/content-share/${id}`);
  },

  // ==========================================================
  // Video Tutorials
  // ==========================================================

  getVideoTutorials(params = {}) {
    return apiClient.get("/download-center/video-tutorial", {
      params,
    });
  },

  getVideoTutorial(id) {
    return apiClient.get(`/download-center/video-tutorial/${id}`);
  },

  createVideoTutorial(payload) {
    return apiClient.post("/download-center/video-tutorial", payload);
  },

  updateVideoTutorial(id, payload) {
    return apiClient.put(`/download-center/video-tutorial/${id}`, payload);
  },

  deleteVideoTutorial(id) {
    return apiClient.delete(`/download-center/video-tutorial/${id}`);
  },
};

export default downloadCenterService;