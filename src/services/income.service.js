import apiClient from "./api";

export const incomeService = {
  // ==============================
  // Income Heads
  // ==============================

  getIncomeHeads(params = {}) {
    return apiClient.get("/income/income-head", {
      params,
    });
  },

  getIncomeHead(id) {
    return apiClient.get(`/income/income-head/${id}`);
  },

  createIncomeHead(payload) {
    return apiClient.post("/income/income-head", payload);
  },

  updateIncomeHead(id, payload) {
    return apiClient.put(`/income/income-head/${id}`, payload);
  },

  deleteIncomeHead(id) {
    return apiClient.delete(`/income/income-head/${id}`);
  },

  // ==============================
  // Income
  // ==============================

  getIncomes(params = {}) {
    return apiClient.get("/income/income", {
      params,
    });
  },

  getIncome(id) {
    return apiClient.get(`/income/income/${id}`);
  },

  createIncome(payload) {
    return apiClient.post("/income/income", payload);
  },

  updateIncome(id, payload) {
    return apiClient.put(`/income/income/${id}`, payload);
  },

  deleteIncome(id) {
    return apiClient.delete(`/income/income/${id}`);
  },
};

export default incomeService;