import apiClient from "./api";

export const frontOfficeService = {
  // ==========================================================
  // Admission Enquiry
  // ==========================================================

  getEnquiries(params = {}) {
    return apiClient.get("/front-office/admission-enquiry", {
      params,
    });
  },

  getEnquiry(id) {
    return apiClient.get(`/front-office/admission-enquiry/${id}`);
  },

  createEnquiry(payload) {
    return apiClient.post("/front-office/admission-enquiry", payload);
  },

  updateEnquiry(id, payload) {
    return apiClient.put(`/front-office/admission-enquiry/${id}`, payload);
  },

  deleteEnquiry(id) {
    return apiClient.delete(`/front-office/admission-enquiry/${id}`);
  },

  // ==========================================================
  // Visitor
  // ==========================================================

  getVisitors(params = {}) {
    return apiClient.get("/front-office/visitor", {
      params,
    });
  },

  getVisitor(id) {
    return apiClient.get(`/front-office/visitor/${id}`);
  },

  createVisitor(payload) {
    return apiClient.post("/front-office/visitor", payload);
  },

  updateVisitor(id, payload) {
    return apiClient.put(`/front-office/visitor/${id}`, payload);
  },

  deleteVisitor(id) {
    return apiClient.delete(`/front-office/visitor/${id}`);
  },

  // ==========================================================
  // Phone Call Log
  // ==========================================================

  getCallLogs(params = {}) {
    return apiClient.get("/front-office/phone-call-log", {
      params,
    });
  },

  getCallLog(id) {
    return apiClient.get(`/front-office/phone-call-log/${id}`);
  },

  createCallLog(payload) {
    return apiClient.post("/front-office/phone-call-log", payload);
  },

  updateCallLog(id, payload) {
    return apiClient.put(`/front-office/phone-call-log/${id}`, payload);
  },

  deleteCallLog(id) {
    return apiClient.delete(`/front-office/phone-call-log/${id}`);
  },

  // ==========================================================
  // Postal Dispatch
  // ==========================================================

  getDispatches(params = {}) {
    return apiClient.get("/front-office/postal-dispatch", {
      params,
    });
  },

  getDispatch(id) {
    return apiClient.get(`/front-office/postal-dispatch/${id}`);
  },

  createDispatch(payload) {
    return apiClient.post("/front-office/postal-dispatch", payload);
  },

  updateDispatch(id, payload) {
    return apiClient.put(`/front-office/postal-dispatch/${id}`, payload);
  },

  deleteDispatch(id) {
    return apiClient.delete(`/front-office/postal-dispatch/${id}`);
  },

  // ==========================================================
  // Postal Receive
  // ==========================================================

  getReceives(params = {}) {
    return apiClient.get("/front-office/postal-receive", {
      params,
    });
  },

  getReceive(id) {
    return apiClient.get(`/front-office/postal-receive/${id}`);
  },

  createReceive(payload) {
    return apiClient.post("/front-office/postal-receive", payload);
  },

  updateReceive(id, payload) {
    return apiClient.put(`/front-office/postal-receive/${id}`, payload);
  },

  deleteReceive(id) {
    return apiClient.delete(`/front-office/postal-receive/${id}`);
  },

  // ==========================================================
  // Complaints
  // ==========================================================

  getComplaints(params = {}) {
    return apiClient.get("/front-office/complaint", {
      params,
    });
  },

  getComplaint(id) {
    return apiClient.get(`/front-office/complaint/${id}`);
  },

  createComplaint(payload) {
    return apiClient.post("/front-office/complaint", payload);
  },

  updateComplaint(id, payload) {
    return apiClient.put(`/front-office/complaint/${id}`, payload);
  },

  deleteComplaint(id) {
    return apiClient.delete(`/front-office/complaint/${id}`);
  },

  // ==========================================================
  // Front Office Setup
  // ==========================================================

  getSetup(params = {}) {
    return apiClient.get("/front-office/setup", {
      params,
    });
  },

  getSetupItem(id) {
    return apiClient.get(`/front-office/setup/${id}`);
  },

  createSetupItem(payload) {
    return apiClient.post("/front-office/setup", payload);
  },

  updateSetupItem(id, payload) {
    return apiClient.put(`/front-office/setup/${id}`, payload);
  },

  deleteSetupItem(id) {
    return apiClient.delete(`/front-office/setup/${id}`);
  },
};

export default frontOfficeService;