// ====================================================================
// Download Center Service
//
// Service layer isolates all backend communication for the Download Center module.
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
  contentTypes,
  uploadShareContents,
  contentShareLists,
  videoTutorials,
  downloadCenterStats,
} from '@/data/downloadCenter.mock'

export const downloadCenterService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Download Center Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /download-center/stats
    // ====================================================================
    return mockResponse(downloadCenterStats)
  },

  // ─── Content Types ───────────────────────────────────────────────────────────

  // Fetch Content Types
  // TODO(BACKEND):
  // Replace mock data with GET /download-center/content-types
  async getContentTypes() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /download-center/content-types
    // ====================================================================
    return mockResponse(contentTypes)
  },

  // Create Content Type
  // TODO(BACKEND):
  // Replace with POST /download-center/content-types
  async createContentType(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /download-center/content-types
    // ====================================================================
    return mockResponse({ _id: `ct-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Content Type
  // TODO(BACKEND):
  // Replace with PUT /download-center/content-types/:id
  async updateContentType(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /download-center/content-types/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Content Type
  // TODO(BACKEND):
  // Replace with DELETE /download-center/content-types/:id
  async deleteContentType(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /download-center/content-types/:id
    // ====================================================================
    return mockResponse({ message: 'Content type deleted successfully' })
  },

  // ─── Upload / Share Content ───────────────────────────────────────────────────

  // Fetch Upload Share Contents
  // TODO(BACKEND):
  // Replace mock data with GET /download-center/contents
  async getContents() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /download-center/contents
    // ====================================================================
    return mockResponse(uploadShareContents)
  },

  // Create Upload Share Content
  // TODO(BACKEND):
  // Replace with POST /download-center/contents
  async createContent(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /download-center/contents
    // ====================================================================
    return mockResponse({ _id: `usc-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Upload Share Content
  // TODO(BACKEND):
  // Replace with PUT /download-center/contents/:id
  async updateContent(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /download-center/contents/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Upload Share Content
  // TODO(BACKEND):
  // Replace with DELETE /download-center/contents/:id
  async deleteContent(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /download-center/contents/:id
    // ====================================================================
    return mockResponse({ message: 'Content deleted successfully' })
  },

  // ─── Content Share Lists ──────────────────────────────────────────────────────

  // Fetch Content Share Lists
  // TODO(BACKEND):
  // Replace mock data with GET /download-center/share-lists
  async getShareLists() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /download-center/share-lists
    // ====================================================================
    return mockResponse(contentShareLists)
  },

  // Create Content Share List
  // TODO(BACKEND):
  // Replace with POST /download-center/share-lists
  async createShareList(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /download-center/share-lists
    // ====================================================================
    return mockResponse({ _id: `csl-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Delete Content Share List
  // TODO(BACKEND):
  // Replace with DELETE /download-center/share-lists/:id
  async deleteShareList(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /download-center/share-lists/:id
    // ====================================================================
    return mockResponse({ message: 'Share list deleted successfully' })
  },

  // ─── Video Tutorials ──────────────────────────────────────────────────────────

  // Fetch Video Tutorials
  // TODO(BACKEND):
  // Replace mock data with GET /download-center/video-tutorials
  async getVideoTutorials() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /download-center/video-tutorials
    // ====================================================================
    return mockResponse(videoTutorials)
  },

  // Create Video Tutorial
  // TODO(BACKEND):
  // Replace with POST /download-center/video-tutorials
  async createVideoTutorial(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /download-center/video-tutorials
    // ====================================================================
    return mockResponse({ _id: `vt-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Video Tutorial
  // TODO(BACKEND):
  // Replace with PUT /download-center/video-tutorials/:id
  async updateVideoTutorial(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /download-center/video-tutorials/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Video Tutorial
  // TODO(BACKEND):
  // Replace with DELETE /download-center/video-tutorials/:id
  async deleteVideoTutorial(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /download-center/video-tutorials/:id
    // ====================================================================
    return mockResponse({ message: 'Video tutorial deleted successfully' })
  },
}

export default downloadCenterService
