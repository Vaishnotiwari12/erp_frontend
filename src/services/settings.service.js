// ====================================================================
// Settings Service
//
// Service layer isolates all backend communication for the Settings module.
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
  generalSettings,
  sessionSettings,
  rolePermissions,
  userSettings,
  notificationSettings,
  smsSettings,
  paymentSettings,
  currencySettings,
  languageSettings,
  captchaSettings,
  modules,
  frontCmsSettings,
  customFields,
  systemFields,
  fileTypes,
  settingsStats,
} from '@/data/settings.mock'

export const settingsService = {
  // ─── Dashboard / Stats ──────────────────────────────────────────────────────

  // Fetch Settings Dashboard Stats (derived)
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /api/settings/stats (derived)
    // ====================================================================
    return mockResponse(settingsStats)
  },

  // ─── General Settings ──────────────────────────────────────────────────────

  // Fetch General Settings
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getGeneralSettings() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/settings
    // ====================================================================
    return mockResponse(generalSettings)
  },

  // Update General Settings
  // TODO(BACKEND):
  // Replace with PUT /api/settings
  async updateGeneralSettings(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/settings
    // ====================================================================
    return mockResponse({ ...generalSettings, ...payload })
  },

  // ─── Session Settings ──────────────────────────────────────────────────────

  // Fetch Sessions
  // TODO(BACKEND):
  // Replace mock data with GET /api/session
  async getSessions() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/session
    // ====================================================================
    return mockResponse(sessionSettings)
  },

  // Create Session
  // TODO(BACKEND):
  // Replace with POST /api/session
  async createSession(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/session
    // ====================================================================
    return mockResponse({ _id: `ss-${Date.now()}`, is_current: false, status: 'active', ...payload })
  },

  // Update Session
  // TODO(BACKEND):
  // Replace with PUT /api/session/:id
  async updateSession(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/session/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Session
  // TODO(BACKEND):
  // Replace with DELETE /api/session/:id
  async deleteSession(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/session/:id
    // ====================================================================
    return mockResponse({ message: 'Session deleted successfully' })
  },

  // ─── Role Permissions ──────────────────────────────────────────────────────

  // Fetch Role Permissions
  // TODO(BACKEND):
  // Replace mock data with GET /api/role-permission
  async getRolePermissions() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/role-permission
    // ====================================================================
    return mockResponse(rolePermissions)
  },

  // Create Role Permission
  // TODO(BACKEND):
  // Replace with POST /api/role-permission
  async createRolePermission(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/role-permission
    // ====================================================================
    return mockResponse({ _id: `rp-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Role Permission
  // TODO(BACKEND):
  // Replace with PUT /api/role-permission/:id
  async updateRolePermission(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/role-permission/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Role Permission
  // TODO(BACKEND):
  // Replace with DELETE /api/role-permission/:id
  async deleteRolePermission(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/role-permission/:id
    // ====================================================================
    return mockResponse({ message: 'Role permission deleted successfully' })
  },

  // ─── Users ──────────────────────────────────────────────────────────────────

  // Fetch Users
  // TODO(BACKEND):
  // Replace mock data with GET /api/users
  async getUsers() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/users
    // ====================================================================
    return mockResponse(userSettings)
  },

  // Create User
  // TODO(BACKEND):
  // Replace with POST /api/users
  async createUser(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/users
    // ====================================================================
    return mockResponse({ _id: `us-${Date.now()}`, status: 'active', created_at: new Date().toISOString(), last_login: null, ...payload })
  },

  // Update User
  // TODO(BACKEND):
  // Replace with PUT /api/users/:id
  async updateUser(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/users/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete User
  // TODO(BACKEND):
  // Replace with DELETE /api/users/:id
  async deleteUser(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/users/:id
    // ====================================================================
    return mockResponse({ message: 'User deleted successfully' })
  },

  // ─── Notification Settings ──────────────────────────────────────────────────

  // Fetch Notification Settings
  // TODO(BACKEND):
  // Replace mock data with GET /api/notification
  async getNotificationSettings() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/notification
    // ====================================================================
    return mockResponse(notificationSettings)
  },

  // Update Notification Settings
  // TODO(BACKEND):
  // Replace with PUT /api/notification
  async updateNotificationSettings(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/notification
    // ====================================================================
    return mockResponse({ ...notificationSettings, ...payload })
  },

  // ─── SMS Settings ───────────────────────────────────────────────────────────

  // Fetch SMS Settings
  // TODO(BACKEND):
  // Replace mock data with GET /api/sms
  async getSmsSettings() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/sms
    // ====================================================================
    return mockResponse(smsSettings)
  },

  // Update SMS Settings
  // TODO(BACKEND):
  // Replace with PUT /api/sms
  async updateSmsSettings(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/sms
    // ====================================================================
    return mockResponse({ ...smsSettings, ...payload })
  },

  // ─── Payment Settings ───────────────────────────────────────────────────────

  // Fetch Payment Settings
  // TODO(BACKEND):
  // Replace mock data with GET /api/payment
  async getPaymentSettings() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/payment
    // ====================================================================
    return mockResponse(paymentSettings)
  },

  // Update Payment Settings
  // TODO(BACKEND):
  // Replace with PUT /api/payment
  async updatePaymentSettings(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/payment
    // ====================================================================
    return mockResponse({ ...paymentSettings, ...payload })
  },

  // ─── Currency Settings ──────────────────────────────────────────────────────

  // Fetch Currencies
  // TODO(BACKEND):
  // Replace mock data with GET /api/currency
  async getCurrencies() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/currency
    // ====================================================================
    return mockResponse(currencySettings)
  },

  // Create Currency
  // TODO(BACKEND):
  // Replace with POST /api/currency
  async createCurrency(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/currency
    // ====================================================================
    return mockResponse({ _id: `cr-${Date.now()}`, is_default: false, status: 'active', ...payload })
  },

  // Update Currency
  // TODO(BACKEND):
  // Replace with PUT /api/currency/:id
  async updateCurrency(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/currency/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Currency
  // TODO(BACKEND):
  // Replace with DELETE /api/currency/:id
  async deleteCurrency(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/currency/:id
    // ====================================================================
    return mockResponse({ message: 'Currency deleted successfully' })
  },

  // ─── Language Settings ────────────────────────────────────────────────────────

  // Fetch Languages
  // TODO(BACKEND):
  // Replace mock data with GET /api/language
  async getLanguages() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/language
    // ====================================================================
    return mockResponse(languageSettings)
  },

  // Create Language
  // TODO(BACKEND):
  // Replace with POST /api/language
  async createLanguage(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/language
    // ====================================================================
    return mockResponse({ _id: `lg-${Date.now()}`, is_default: false, status: 'active', ...payload })
  },

  // Update Language
  // TODO(BACKEND):
  // Replace with PUT /api/language/:id
  async updateLanguage(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/language/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Language
  // TODO(BACKEND):
  // Replace with DELETE /api/language/:id
  async deleteLanguage(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/language/:id
    // ====================================================================
    return mockResponse({ message: 'Language deleted successfully' })
  },

  // ─── Captcha Settings ────────────────────────────────────────────────────────

  // Fetch Captcha Settings
  // TODO(BACKEND):
  // Replace mock data with GET /api/captcha
  async getCaptchaSettings() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/captcha
    // ====================================================================
    return mockResponse(captchaSettings)
  },

  // Update Captcha Settings
  // TODO(BACKEND):
  // Replace with PUT /api/captcha
  async updateCaptchaSettings(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/captcha
    // ====================================================================
    return mockResponse({ ...captchaSettings, ...payload })
  },

  // ─── Modules ──────────────────────────────────────────────────────────────────

  // Fetch Modules
  // TODO(BACKEND):
  // Replace mock data with GET /api/modules
  async getModules() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/modules
    // ====================================================================
    return mockResponse(modules)
  },

  // Update Module
  // TODO(BACKEND):
  // Replace with PUT /api/modules/:id
  async updateModule(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/modules/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // ─── Front CMS Settings ──────────────────────────────────────────────────────

  // Fetch Front CMS Settings
  // TODO(BACKEND):
  // Replace mock data with GET /api/front-cms
  async getFrontCmsSettings() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/front-cms
    // ====================================================================
    return mockResponse(frontCmsSettings)
  },

  // Update Front CMS Settings
  // TODO(BACKEND):
  // Replace with PUT /api/front-cms
  async updateFrontCmsSettings(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/front-cms
    // ====================================================================
    return mockResponse({ ...frontCmsSettings, ...payload })
  },

  // ─── Custom Fields ────────────────────────────────────────────────────────────

  // Fetch Custom Fields
  // TODO(BACKEND):
  // Replace mock data with GET /api/custom-fields
  async getCustomFields() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/custom-fields
    // ====================================================================
    return mockResponse(customFields)
  },

  // Create Custom Field
  // TODO(BACKEND):
  // Replace with POST /api/custom-fields
  async createCustomField(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/custom-fields
    // ====================================================================
    return mockResponse({ _id: `cf-${Date.now()}`, is_required: false, options: [], status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Custom Field
  // TODO(BACKEND):
  // Replace with PUT /api/custom-fields/:id
  async updateCustomField(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/custom-fields/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Custom Field
  // TODO(BACKEND):
  // Replace with DELETE /api/custom-fields/:id
  async deleteCustomField(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/custom-fields/:id
    // ====================================================================
    return mockResponse({ message: 'Custom field deleted successfully' })
  },

  // ─── System Fields ────────────────────────────────────────────────────────────

  // Fetch System Fields
  // TODO(BACKEND):
  // Replace mock data with GET /api/system-fields
  async getSystemFields() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/system-fields
    // ====================================================================
    return mockResponse(systemFields)
  },

  // Update System Field
  // TODO(BACKEND):
  // Replace with PUT /api/system-fields/:id
  async updateSystemField(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/system-fields/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // ─── File Types ────────────────────────────────────────────────────────────────

  // Fetch File Types
  // TODO(BACKEND):
  // Replace mock data with GET /api/file-settings
  async getFileTypes() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/file-settings
    // ====================================================================
    return mockResponse(fileTypes)
  },

  // Create File Type
  // TODO(BACKEND):
  // Replace with POST /api/file-settings
  async createFileType(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/file-settings
    // ====================================================================
    return mockResponse({ _id: `ft-${Date.now()}`, is_allowed: true, status: 'active', ...payload })
  },

  // Update File Type
  // TODO(BACKEND):
  // Replace with PUT /api/file-settings/:id
  async updateFileType(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/file-settings/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete File Type
  // TODO(BACKEND):
  // Replace with DELETE /api/file-settings/:id
  async deleteFileType(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/file-settings/:id
    // ====================================================================
    return mockResponse({ message: 'File type deleted successfully' })
  },
}

export default settingsService
