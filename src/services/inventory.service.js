// ====================================================================
// Inventory Service
//
// Service layer isolates all backend communication for the Inventory module.
// Pages never call APIs directly — they call these methods, which return
// the standard envelope: { success, message, data }.
//
// Currently uses mock data. When the backend is ready, replace each
// mockResponse() call with the corresponding Axios API call. The UI
// does not need to change because the return shape stays the same.
// ====================================================================
// BACKEND INTEGRATION
// Replace this mock implementation with Axios API call.
// UI components should never call APIs directly.
// Only modify this service when backend APIs become available.
// ====================================================================

import { mockResponse } from './mockData'
import {
  itemCategories,
  items,
  itemStores,
  itemSuppliers,
  itemStocks,
  issueItems,
  inventoryStats,
} from '@/data/inventory.mock'

export const inventoryService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Inventory Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /inventory/stats
    // ====================================================================
    return mockResponse(inventoryStats)
  },

  // ─── Item Categories ──────────────────────────────────────────────────────────

  // Fetch Item Categories
  // TODO(BACKEND):
  // Replace mock data with GET /inventory/item-categories
  async getItemCategories() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /inventory/item-categories
    // ====================================================================
    return mockResponse(itemCategories)
  },

  // Create Item Category
  // TODO(BACKEND):
  // Replace with POST /inventory/item-categories
  async createItemCategory(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /inventory/item-categories
    // ====================================================================
    return mockResponse({ _id: `ic-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Item Category
  // TODO(BACKEND):
  // Replace with PUT /inventory/item-categories/:id
  async updateItemCategory(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /inventory/item-categories/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Item Category
  // TODO(BACKEND):
  // Replace with DELETE /inventory/item-categories/:id
  async deleteItemCategory(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /inventory/item-categories/:id
    // ====================================================================
    return mockResponse({ message: 'Item category deleted successfully' })
  },

  // ─── Items ────────────────────────────────────────────────────────────────────

  // Fetch Items
  // TODO(BACKEND):
  // Replace mock data with GET /inventory/items
  async getItems() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /inventory/items
    // ====================================================================
    return mockResponse(items)
  },

  // Create Item
  // TODO(BACKEND):
  // Replace with POST /inventory/items
  async createItem(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /inventory/items
    // ====================================================================
    return mockResponse({ _id: `itm-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Item
  // TODO(BACKEND):
  // Replace with PUT /inventory/items/:id
  async updateItem(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /inventory/items/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Item
  // TODO(BACKEND):
  // Replace with DELETE /inventory/items/:id
  async deleteItem(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /inventory/items/:id
    // ====================================================================
    return mockResponse({ message: 'Item deleted successfully' })
  },

  // ─── Item Stores ──────────────────────────────────────────────────────────────

  // Fetch Item Stores
  // TODO(BACKEND):
  // Replace mock data with GET /inventory/stores
  async getItemStores() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /inventory/stores
    // ====================================================================
    return mockResponse(itemStores)
  },

  // Create Item Store
  // TODO(BACKEND):
  // Replace with POST /inventory/stores
  async createItemStore(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /inventory/stores
    // ====================================================================
    return mockResponse({ _id: `is-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Item Store
  // TODO(BACKEND):
  // Replace with PUT /inventory/stores/:id
  async updateItemStore(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /inventory/stores/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Item Store
  // TODO(BACKEND):
  // Replace with DELETE /inventory/stores/:id
  async deleteItemStore(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /inventory/stores/:id
    // ====================================================================
    return mockResponse({ message: 'Item store deleted successfully' })
  },

  // ─── Item Suppliers ───────────────────────────────────────────────────────────

  // Fetch Item Suppliers
  // TODO(BACKEND):
  // Replace mock data with GET /inventory/suppliers
  async getItemSuppliers() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /inventory/suppliers
    // ====================================================================
    return mockResponse(itemSuppliers)
  },

  // Create Item Supplier
  // TODO(BACKEND):
  // Replace with POST /inventory/suppliers
  async createItemSupplier(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /inventory/suppliers
    // ====================================================================
    return mockResponse({ _id: `sup-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Item Supplier
  // TODO(BACKEND):
  // Replace with PUT /inventory/suppliers/:id
  async updateItemSupplier(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /inventory/suppliers/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Item Supplier
  // TODO(BACKEND):
  // Replace with DELETE /inventory/suppliers/:id
  async deleteItemSupplier(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /inventory/suppliers/:id
    // ====================================================================
    return mockResponse({ message: 'Item supplier deleted successfully' })
  },

  // ─── Item Stock ───────────────────────────────────────────────────────────────

  // Fetch Item Stocks
  // TODO(BACKEND):
  // Replace mock data with GET /inventory/stock
  async getItemStocks() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /inventory/stock
    // ====================================================================
    return mockResponse(itemStocks)
  },

  // Create Item Stock
  // TODO(BACKEND):
  // Replace with POST /inventory/stock
  async createItemStock(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /inventory/stock
    // ====================================================================
    const quantity = Number(payload.quantity) || 0
    const unit_price = Number(payload.unit_price) || 0
    return mockResponse({ _id: `stk-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), total_value: quantity * unit_price, ...payload })
  },

  // Update Item Stock
  // TODO(BACKEND):
  // Replace with PUT /inventory/stock/:id
  async updateItemStock(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /inventory/stock/:id
    // ====================================================================
    const quantity = Number(payload.quantity) || 0
    const unit_price = Number(payload.unit_price) || 0
    return mockResponse({ _id: id, total_value: quantity * unit_price, ...payload })
  },

  // Delete Item Stock
  // TODO(BACKEND):
  // Replace with DELETE /inventory/stock/:id
  async deleteItemStock(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /inventory/stock/:id
    // ====================================================================
    return mockResponse({ message: 'Item stock deleted successfully' })
  },

  // ─── Issue Items ──────────────────────────────────────────────────────────────

  // Fetch Issue Items
  // TODO(BACKEND):
  // Replace mock data with GET /inventory/issue
  async getIssueItems() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /inventory/issue
    // ====================================================================
    return mockResponse(issueItems)
  },

  // Create Issue Item
  // TODO(BACKEND):
  // Replace with POST /inventory/issue
  async createIssueItem(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /inventory/issue
    // ====================================================================
    return mockResponse({ _id: `iss-${Date.now()}`, status: 'issued', return_date: null, createdAt: new Date().toISOString(), ...payload })
  },

  // Return Item
  // TODO(BACKEND):
  // Replace with PUT /inventory/issue/:id/return
  async returnItem(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /inventory/issue/:id/return
    // ====================================================================
    return mockResponse({ _id: id, status: 'returned', return_date: payload?.return_date || new Date().toISOString().slice(0, 10), ...payload })
  },

  // Delete Issue Item
  // TODO(BACKEND):
  // Replace with DELETE /inventory/issue/:id
  async deleteIssueItem(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /inventory/issue/:id
    // ====================================================================
    return mockResponse({ message: 'Issue item deleted successfully' })
  },
}

export default inventoryService
