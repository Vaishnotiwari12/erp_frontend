// ====================================================================
// Front CMS Service
//
// Service layer isolates all backend communication for the Front CMS module.
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
  banners,
  newsItems,
  events,
  galleryItems,
  mediaItems,
  cmsPages,
  menus,
  frontCmsStats,
} from '@/data/frontCms.mock'

export const frontCmsService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Front CMS Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /api/front-cms/stats (derived)
    // ====================================================================
    return mockResponse(frontCmsStats)
  },

  // ─── Banners ──────────────────────────────────────────────────────────────────

  // Fetch Banners
  // TODO(BACKEND):
  // Replace mock data with GET /api/front-cms/banner-images
  async getBanners() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/front-cms/banner-images
    // ====================================================================
    return mockResponse(banners)
  },

  // Create Banner
  // TODO(BACKEND):
  // Replace with POST /api/front-cms/banner-images
  async createBanner(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/front-cms/banner-images
    // ====================================================================
    return mockResponse({ _id: `bn-${Date.now()}`, status: 'draft', published_at: null, createdAt: new Date().toISOString(), ...payload })
  },

  // Update Banner
  // TODO(BACKEND):
  // Replace with PUT /api/front-cms/banner-images/:id
  async updateBanner(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/front-cms/banner-images/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Banner
  // TODO(BACKEND):
  // Replace with DELETE /api/front-cms/banner-images/:id
  async deleteBanner(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/front-cms/banner-images/:id
    // ====================================================================
    return mockResponse({ message: 'Banner deleted successfully' })
  },

  // ─── News ──────────────────────────────────────────────────────────────────────

  // Fetch News
  // TODO(BACKEND):
  // Replace mock data with GET /api/front-cms/news
  async getNews() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/front-cms/news
    // ====================================================================
    return mockResponse(newsItems)
  },

  // Create News
  // TODO(BACKEND):
  // Replace with POST /api/front-cms/news
  async createNews(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/front-cms/news
    // ====================================================================
    return mockResponse({ _id: `nw-${Date.now()}`, status: 'draft', published_at: null, createdAt: new Date().toISOString(), ...payload })
  },

  // Update News
  // TODO(BACKEND):
  // Replace with PUT /api/front-cms/news/:id
  async updateNews(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/front-cms/news/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete News
  // TODO(BACKEND):
  // Replace with DELETE /api/front-cms/news/:id
  async deleteNews(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/front-cms/news/:id
    // ====================================================================
    return mockResponse({ message: 'News item deleted successfully' })
  },

  // ─── Events ────────────────────────────────────────────────────────────────────

  // Fetch Events
  // TODO(BACKEND):
  // Replace mock data with GET /api/front-cms/event
  async getEvents() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/front-cms/event
    // ====================================================================
    return mockResponse(events)
  },

  // Create Event
  // TODO(BACKEND):
  // Replace with POST /api/front-cms/event
  async createEvent(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/front-cms/event
    // ====================================================================
    return mockResponse({ _id: `ev-${Date.now()}`, status: 'draft', published_at: null, createdAt: new Date().toISOString(), ...payload })
  },

  // Update Event
  // TODO(BACKEND):
  // Replace with PUT /api/front-cms/event/:id
  async updateEvent(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/front-cms/event/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Event
  // TODO(BACKEND):
  // Replace with DELETE /api/front-cms/event/:id
  async deleteEvent(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/front-cms/event/:id
    // ====================================================================
    return mockResponse({ message: 'Event deleted successfully' })
  },

  // ─── Gallery ────────────────────────────────────────────────────────────────────

  // Fetch Gallery
  // TODO(BACKEND):
  // Replace mock data with GET /api/front-cms/gallery
  async getGallery() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/front-cms/gallery
    // ====================================================================
    return mockResponse(galleryItems)
  },

  // Create Gallery Item
  // TODO(BACKEND):
  // Replace with POST /api/front-cms/gallery
  async createGallery(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/front-cms/gallery
    // ====================================================================
    return mockResponse({ _id: `gl-${Date.now()}`, status: 'draft', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Gallery Item
  // TODO(BACKEND):
  // Replace with PUT /api/front-cms/gallery/:id
  async updateGallery(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/front-cms/gallery/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Gallery Item
  // TODO(BACKEND):
  // Replace with DELETE /api/front-cms/gallery/:id
  async deleteGallery(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/front-cms/gallery/:id
    // ====================================================================
    return mockResponse({ message: 'Gallery item deleted successfully' })
  },

  // ─── Media Manager ──────────────────────────────────────────────────────────────

  // Fetch Media
  // TODO(BACKEND):
  // Replace mock data with GET /api/front-cms/media-manager
  async getMedia() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/front-cms/media-manager
    // ====================================================================
    return mockResponse(mediaItems)
  },

  // Create Media
  // TODO(BACKEND):
  // Replace with POST /api/front-cms/media-manager
  async createMedia(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/front-cms/media-manager
    // ====================================================================
    return mockResponse({ _id: `md-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Delete Media
  // TODO(BACKEND):
  // Replace with DELETE /api/front-cms/media-manager/:id
  async deleteMedia(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/front-cms/media-manager/:id
    // ====================================================================
    return mockResponse({ message: 'Media deleted successfully' })
  },

  // ─── Pages ────────────────────────────────────────────────────────────────────────

  // Fetch CMS Pages
  // TODO(BACKEND):
  // Replace mock data with GET /api/front-cms/pages
  async getPages() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/front-cms/pages
    // ====================================================================
    return mockResponse(cmsPages)
  },

  // Create CMS Page
  // TODO(BACKEND):
  // Replace with POST /api/front-cms/pages
  async createPage(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/front-cms/pages
    // ====================================================================
    return mockResponse({ _id: `pg-${Date.now()}`, status: 'draft', published_at: null, createdAt: new Date().toISOString(), ...payload })
  },

  // Update CMS Page
  // TODO(BACKEND):
  // Replace with PUT /api/front-cms/pages/:id
  async updatePage(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/front-cms/pages/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete CMS Page
  // TODO(BACKEND):
  // Replace with DELETE /api/front-cms/pages/:id
  async deletePage(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/front-cms/pages/:id
    // ====================================================================
    return mockResponse({ message: 'Page deleted successfully' })
  },

  // ─── Menus ────────────────────────────────────────────────────────────────────────

  // Fetch Menus
  // TODO(BACKEND):
  // Replace mock data with GET /api/front-cms/menus
  async getMenus() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/front-cms/menus
    // ====================================================================
    return mockResponse(menus)
  },

  // Create Menu
  // TODO(BACKEND):
  // Replace with POST /api/front-cms/menus
  async createMenu(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/front-cms/menus
    // ====================================================================
    return mockResponse({ _id: `mn-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Menu
  // TODO(BACKEND):
  // Replace with PUT /api/front-cms/menus/:id
  async updateMenu(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/front-cms/menus/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Menu
  // TODO(BACKEND):
  // Replace with DELETE /api/front-cms/menus/:id
  async deleteMenu(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/front-cms/menus/:id
    // ====================================================================
    return mockResponse({ message: 'Menu deleted successfully' })
  },
}

export default frontCmsService
