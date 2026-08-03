import apiClient from "./api";

export const transportService = {
  // ==========================================================
  // Routes
  // ==========================================================

  getRoutes(params = {}) {
    return apiClient.get("/transport/route", { params });
  },

  getRoute(id) {
    return apiClient.get(`/transport/route/${id}`);
  },

  createRoute(payload) {
    return apiClient.post("/transport/route", payload);
  },

  updateRoute(id, payload) {
    return apiClient.put(`/transport/route/${id}`, payload);
  },

  deleteRoute(id) {
    return apiClient.delete(`/transport/route/${id}`);
  },

  // ==========================================================
  // Vehicles
  // ==========================================================

  getVehicles(params = {}) {
    return apiClient.get("/transport/vehicle", { params });
  },

  getVehicle(id) {
    return apiClient.get(`/transport/vehicle/${id}`);
  },

  createVehicle(payload) {
    return apiClient.post("/transport/vehicle", payload);
  },

  updateVehicle(id, payload) {
    return apiClient.put(`/transport/vehicle/${id}`, payload);
  },

  deleteVehicle(id) {
    return apiClient.delete(`/transport/vehicle/${id}`);
  },

  // ==========================================================
  // Drivers
  // ==========================================================

  getDrivers(params = {}) {
    return apiClient.get("/transport/driver", { params });
  },

  getDriver(id) {
    return apiClient.get(`/transport/driver/${id}`);
  },

  createDriver(payload) {
    return apiClient.post("/transport/driver", payload);
  },

  updateDriver(id, payload) {
    return apiClient.put(`/transport/driver/${id}`, payload);
  },

  deleteDriver(id) {
    return apiClient.delete(`/transport/driver/${id}`);
  },

  // ==========================================================
  // Pickup Points
  // ==========================================================

  getPickupPoints(params = {}) {
    return apiClient.get("/transport/pickup-point", { params });
  },

  getPickupPoint(id) {
    return apiClient.get(`/transport/pickup-point/${id}`);
  },

  createPickupPoint(payload) {
    return apiClient.post("/transport/pickup-point", payload);
  },

  updatePickupPoint(id, payload) {
    return apiClient.put(`/transport/pickup-point/${id}`, payload);
  },

  deletePickupPoint(id) {
    return apiClient.delete(`/transport/pickup-point/${id}`);
  },

  // ==========================================================
  // Vehicle Assignment
  // ==========================================================

  getAssignments(params = {}) {
    return apiClient.get("/transport/assign-vehicle", { params });
  },

  getAssignment(id) {
    return apiClient.get(`/transport/assign-vehicle/${id}`);
  },

  assignVehicle(payload) {
    return apiClient.post("/transport/assign-vehicle", payload);
  },

  updateAssignment(id, payload) {
    return apiClient.put(`/transport/assign-vehicle/${id}`, payload);
  },

  deleteAssignment(id) {
    return apiClient.delete(`/transport/assign-vehicle/${id}`);
  },

  // ==========================================================
  // Transport Fees
  // ==========================================================

  getTransportFees(params = {}) {
    return apiClient.get("/transport/fees", { params });
  },

  getTransportFee(id) {
    return apiClient.get(`/transport/fees/${id}`);
  },

  createTransportFee(payload) {
    return apiClient.post("/transport/fees", payload);
  },

  updateTransportFee(id, payload) {
    return apiClient.put(`/transport/fees/${id}`, payload);
  },

  deleteTransportFee(id) {
    return apiClient.delete(`/transport/fees/${id}`);
  },
};

export default transportService;