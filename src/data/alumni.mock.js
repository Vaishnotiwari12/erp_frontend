// // ─── Alumni Module Mock Data ───────────────────────────────────────────────────
// // All structures mirror the backend alumniModel.js field names.
// // INTEGRATION: delete this file once real endpoints are wired in
// // alumni.service.js. Only the service imports this file.

// export const alumni = [
//   { _id: 'alm-001', name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+1-555-0101', passing_year: 2018, course: 'Class 12 - Science', current_occupation: 'Software Engineer at Google', address: '123 Tech Park, San Jose, CA', status: 'active', createdAt: '2018-06-15T00:00:00Z' },
//   { _id: 'alm-002', name: 'Sarah Mitchell', email: 'sarah.m@email.com', phone: '+1-555-0102', passing_year: 2016, course: 'Class 12 - Commerce', current_occupation: 'Chartered Accountant', address: '456 Finance Street, New York, NY', status: 'active', createdAt: '2016-06-10T00:00:00Z' },
//   { _id: 'alm-003', name: 'Michael Chang', email: 'mchang@email.com', phone: '+1-555-0103', passing_year: 2019, course: 'Year 3 - Computer Science', current_occupation: 'Data Scientist at Microsoft', address: '789 Data Ave, Seattle, WA', status: 'active', createdAt: '2019-06-20T00:00:00Z' },
//   { _id: 'alm-004', name: 'Priya Nair', email: 'priya.nair@email.com', phone: '+1-555-0104', passing_year: 2017, course: 'Class 12 - Humanities', current_occupation: 'Civil Lawyer', address: '321 Legal Blvd, Boston, MA', status: 'active', createdAt: '2017-06-12T00:00:00Z' },
//   { _id: 'alm-005', name: 'David Thompson', email: 'dthompson@email.com', phone: '+1-555-0105', passing_year: 2015, course: 'Class 12 - Science', current_occupation: 'Doctor at City Hospital', address: '654 Medical Center, Chicago, IL', status: 'active', createdAt: '2015-06-08T00:00:00Z' },
//   { _id: 'alm-006', name: 'Aisha Patel', email: 'aisha.patel@email.com', phone: '+1-555-0106', passing_year: 2020, course: 'Year 2 - Economics', current_occupation: 'Investment Analyst at Goldman Sachs', address: '852 Wall Street, New York, NY', status: 'active', createdAt: '2020-06-18T00:00:00Z' },
//   { _id: 'alm-007', name: 'James Wilson', email: 'jwilson@email.com', phone: '+1-555-0107', passing_year: 2014, course: 'Class 12 - Commerce', current_occupation: 'Entrepreneur - Tech Startup', address: '147 Innovation Dr, Austin, TX', status: 'inactive', createdAt: '2014-06-05T00:00:00Z' },
//   { _id: 'alm-008', name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '+1-555-0108', passing_year: 2021, course: 'Year 3 - Biology', current_occupation: 'Research Scientist at Pfizer', address: '963 Research Way, Cambridge, MA', status: 'active', createdAt: '2021-06-22T00:00:00Z' },
//   { _id: 'alm-009', name: 'Robert Lee', email: 'rlee@email.com', phone: '+1-555-0109', passing_year: 2018, course: 'Class 12 - Science', current_occupation: 'Architect at Lee Designs', address: '258 Design Plaza, Portland, OR', status: 'active', createdAt: '2018-06-15T00:00:00Z' },
//   { _id: 'alm-010', name: 'Maria Garcia', email: 'mgarcia@email.com', phone: '+1-555-0110', passing_year: 2016, course: 'Class 12 - Humanities', current_occupation: 'Journalist at National Daily', address: '741 Media St, Washington, DC', status: 'active', createdAt: '2016-06-10T00:00:00Z' },
// ]

// export const alumniEvents = [
//   { _id: 'aev-001', event_name: 'Annual Alumni Meet 2024', event_date: '2024-12-15', venue: 'School Auditorium', description: 'Annual gathering for all alumni. Networking, dinner, and cultural events.', status: 'upcoming', createdAt: '2024-08-01T00:00:00Z' },
//   { _id: 'aev-002', event_name: 'Career Guidance Workshop', event_date: '2024-10-20', venue: 'Conference Hall B', description: 'Alumni-led career guidance session for current students.', status: 'upcoming', createdAt: '2024-07-15T00:00:00Z' },
//   { _id: 'aev-003', event_name: 'Silver Jubilee Celebration', event_date: '2024-06-01', venue: 'Main Campus Grounds', description: '25th anniversary celebration of the school with alumni and families.', status: 'completed', createdAt: '2024-01-10T00:00:00Z' },
//   { _id: 'aev-004', event_name: 'Fundraising Gala', event_date: '2024-11-30', venue: 'Grand Hotel Ballroom', description: 'Annual fundraising dinner to support scholarship programs.', status: 'upcoming', createdAt: '2024-08-10T00:00:00Z' },
//   { _id: 'aev-005', event_name: 'Tech Talk Series', event_date: '2024-09-05', venue: 'Seminar Room 3', description: 'Alumni tech leaders share industry insights.', status: 'completed', createdAt: '2024-06-20T00:00:00Z' },
//   { _id: 'aev-006', event_name: 'Sports Reunion', event_date: '2025-01-12', venue: 'School Sports Complex', description: 'Alumni vs current students friendly matches.', status: 'upcoming', createdAt: '2024-09-01T00:00:00Z' },
// ]

// export const alumniStats = {
//   total_alumni: alumni.length,
//   active: alumni.filter((a) => a.status === 'active').length,
//   upcoming_events: alumniEvents.filter((e) => e.status === 'upcoming').length,
//   completed_events: alumniEvents.filter((e) => e.status === 'completed').length,
// }
