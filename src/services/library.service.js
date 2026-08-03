import apiClient from "./api";

export const libraryService = {
  // ==========================================================
  // Books
  // ==========================================================

  getBooks(params = {}) {
    return apiClient.get("/library/book", {
      params,
    });
  },

  getBook(id) {
    return apiClient.get(`/library/book/${id}`);
  },

  createBook(payload) {
    return apiClient.post("/library/book", payload);
  },

  updateBook(id, payload) {
    return apiClient.put(`/library/book/${id}`, payload);
  },

  deleteBook(id) {
    return apiClient.delete(`/library/book/${id}`);
  },

  // ==========================================================
  // Book Categories
  // ==========================================================

  getCategories(params = {}) {
    return apiClient.get("/library/category", {
      params,
    });
  },

  getCategory(id) {
    return apiClient.get(`/library/category/${id}`);
  },

  createCategory(payload) {
    return apiClient.post("/library/category", payload);
  },

  updateCategory(id, payload) {
    return apiClient.put(`/library/category/${id}`, payload);
  },

  deleteCategory(id) {
    return apiClient.delete(`/library/category/${id}`);
  },

  // ==========================================================
  // Book Issue
  // ==========================================================

  getIssueRecords(params = {}) {
    return apiClient.get("/library/book-issue", {
      params,
    });
  },

  getIssueRecord(id) {
    return apiClient.get(`/library/book-issue/${id}`);
  },

  issueBook(payload) {
    return apiClient.post("/library/book-issue", payload);
  },

  updateIssueRecord(id, payload) {
    return apiClient.put(`/library/book-issue/${id}`, payload);
  },

  deleteIssueRecord(id) {
    return apiClient.delete(`/library/book-issue/${id}`);
  },

  // ==========================================================
  // Library Staff
  // ==========================================================

  getLibraryStaff(params = {}) {
    return apiClient.get("/library/staff", {
      params,
    });
  },

  getLibraryStaffMember(id) {
    return apiClient.get(`/library/staff/${id}`);
  },

  createLibraryStaff(payload) {
    return apiClient.post("/library/staff", payload);
  },

  updateLibraryStaff(id, payload) {
    return apiClient.put(`/library/staff/${id}`, payload);
  },

  deleteLibraryStaff(id) {
    return apiClient.delete(`/library/staff/${id}`);
  },
};

export default libraryService;