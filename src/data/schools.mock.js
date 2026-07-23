// Dev-only mock data for the Schools module.
// INTEGRATION: delete this file once real endpoints are wired in school.service.js.

// Matches centralModels.js schoolSchema: school_name, domain, mongo_uri, status.
export const schools = [
  { _id: 'sch-001', school_name: 'Lincoln High School', domain: 'lincoln.edu', mongo_uri: 'mongodb://localhost:27017/lincolnhighschool_db', status: 'active', createdAt: '2025-01-12T09:00:00Z' },
  { _id: 'sch-002', school_name: 'Riverside Academy', domain: 'riverside.edu', mongo_uri: 'mongodb://localhost:27017/riversideacademy_db', status: 'active', createdAt: '2025-02-03T10:30:00Z' },
  { _id: 'sch-003', school_name: 'Greenwood Public', domain: 'greenwood.edu', mongo_uri: 'mongodb://localhost:27017/greenwoodpublic_db', status: 'active', createdAt: '2024-11-20T14:00:00Z' },
  { _id: 'sch-004', school_name: 'St. Mary’s Convent', domain: 'stmarys.edu', mongo_uri: 'mongodb://localhost:27017/stmarysconvent_db', status: 'inactive', createdAt: '2025-03-08T08:15:00Z' },
  { _id: 'sch-005', school_name: 'Oakridge International', domain: 'oakridge.edu', mongo_uri: 'mongodb://localhost:27017/oakridgeinternational_db', status: 'active', createdAt: '2025-01-30T11:45:00Z' },
  { _id: 'sch-006', school_name: 'Sunrise Valley School', domain: 'sunrise.edu', mongo_uri: 'mongodb://localhost:27017/sunrisevalleyschool_db', status: 'suspended', createdAt: '2025-04-15T16:20:00Z' },
]
