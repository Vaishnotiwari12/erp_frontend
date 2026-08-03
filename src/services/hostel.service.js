import apiClient from "./api";

export const hostelService = {
  // ==========================================================
  // Room Types
  // ==========================================================

  getRoomTypes(params = {}) {
    return apiClient.get("/hostel/room-type", {
      params,
    });
  },

  getRoomType(id) {
    return apiClient.get(`/hostel/room-type/${id}`);
  },

  createRoomType(payload) {
    return apiClient.post("/hostel/room-type", payload);
  },

  updateRoomType(id, payload) {
    return apiClient.put(`/hostel/room-type/${id}`, payload);
  },

  deleteRoomType(id) {
    return apiClient.delete(`/hostel/room-type/${id}`);
  },

  // ==========================================================
  // Rooms
  // ==========================================================

  getRooms(params = {}) {
    return apiClient.get("/hostel/room", {
      params,
    });
  },

  getRoom(id) {
    return apiClient.get(`/hostel/room/${id}`);
  },

  createRoom(payload) {
    return apiClient.post("/hostel/room", payload);
  },

  updateRoom(id, payload) {
    return apiClient.put(`/hostel/room/${id}`, payload);
  },

  deleteRoom(id) {
    return apiClient.delete(`/hostel/room/${id}`);
  },

  // ==========================================================
  // Room Allocation
  // ==========================================================

  getAllocations(params = {}) {
    return apiClient.get("/hostel/room-allocation", {
      params,
    });
  },

  getAllocation(id) {
    return apiClient.get(`/hostel/room-allocation/${id}`);
  },

  allocateRoom(payload) {
    return apiClient.post("/hostel/room-allocation", payload);
  },

  updateAllocation(id, payload) {
    return apiClient.put(`/hostel/room-allocation/${id}`, payload);
  },

  deleteAllocation(id) {
    return apiClient.delete(`/hostel/room-allocation/${id}`);
  },

  // ==========================================================
  // Hostel Fees
  // ==========================================================

  getFees(params = {}) {
    return apiClient.get("/hostel/fees", {
      params,
    });
  },

  getFee(id) {
    return apiClient.get(`/hostel/fees/${id}`);
  },

  createFee(payload) {
    return apiClient.post("/hostel/fees", payload);
  },

  updateFee(id, payload) {
    return apiClient.put(`/hostel/fees/${id}`, payload);
  },

  deleteFee(id) {
    return apiClient.delete(`/hostel/fees/${id}`);
  },
};

export default hostelService;