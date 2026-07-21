// Domains service aligned with School_erp-b-main domain.routes.js.
// Domains are derived from the School model (tenantResolver resolves by domain).
// Backend endpoints (mounted at /api):
//   GET    /api/schools  -> list of schools with `domain` field (used to populate domains view)
//   POST   /api/schools  -> create school with domain (registers a domain)
//   DELETE /api/schools/:id -> removes domain association
// Domain verification/SSL is handled at the infrastructure layer (DNS + reverse proxy).

import apiClient from './api'
import { mockResponse, domains as mockDomains } from './mockData'

export const domainService = {
  async list(params = {}) {
    // INTEGRATION: return apiClient.get('/schools', { params }) then map to domain records
    return mockResponse(mockDomains)
  },

  async create(payload) {
    // INTEGRATION: return apiClient.post('/schools', { school_name, domain })
    return mockResponse({ _id: `dom-${Date.now()}`, ...payload, status: 'active', verified: false, ssl: 'Pending' })
  },

  async verify(id) {
    // INTEGRATION: trigger DNS verification (infrastructure-side)
    return mockResponse({ _id: id, verified: true, ssl: 'Active', status: 'active' })
  },

  async remove(id) {
    // INTEGRATION: return apiClient.delete(`/schools/${id}`)
    return mockResponse({ message: 'Domain removed successfully' })
  },
}

export default domainService
