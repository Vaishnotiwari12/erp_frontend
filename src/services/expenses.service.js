import apiClient from "./api";

export const expensesService = {
  // ==========================================================
  // Expense Heads
  // ==========================================================

  getExpenseHeads(params = {}) {
    return apiClient.get("/expense/expense-head", {
      params,
    });
  },

  getExpenseHead(id) {
    return apiClient.get(`/expense/expense-head/${id}`);
  },

  createExpenseHead(payload) {
    return apiClient.post("/expense/expense-head", payload);
  },

  updateExpenseHead(id, payload) {
    return apiClient.put(`/expense/expense-head/${id}`, payload);
  },

  deleteExpenseHead(id) {
    return apiClient.delete(`/expense/expense-head/${id}`);
  },

  // ==========================================================
  // Expenses
  // ==========================================================

  getExpenses(params = {}) {
    return apiClient.get("/expense/expense", {
      params,
    });
  },

  getExpense(id) {
    return apiClient.get(`/expense/expense/${id}`);
  },

  createExpense(payload) {
    return apiClient.post("/expense/expense", payload);
  },

  updateExpense(id, payload) {
    return apiClient.put(`/expense/expense/${id}`, payload);
  },

  deleteExpense(id) {
    return apiClient.delete(`/expense/expense/${id}`);
  },
};

export default expensesService;