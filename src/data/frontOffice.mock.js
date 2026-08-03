// // ─── Front Office Module Mock Data ───────────────────────────────────────────
// // All data structures mirror the backend frontOfficeModel.js field names.
// // INTEGRATION: delete this file once real endpoints are wired in
// // frontOffice.service.js. The UI never imports this file directly — only the
// // service does, so swapping mock for real API calls touches only the service.

// // ─── Admission Enquiries ─────────────────────────────────────────────────────
// // Captures walk-in or phone enquiries from prospective parents/students.
// // `status` tracks the enquiry lifecycle so the front desk can follow up.
// export const admissionEnquiries = [
//   { _id: 'enq-001', name: 'Riya Kapoor', email: 'riya.kapoor@gmail.com', phone: '+1 555-0401', class_applying: 'Class 1', source: 'Walk-in', enquiry_date: '2025-04-02T10:00:00Z', assigned_to: 'Priya Patel', status: 'pending', notes: 'Parents visited campus, interested in April intake.', follow_ups: [{ date: '2025-04-05T10:00:00Z', note: 'Called parents — asked to share previous school records.', by: 'Priya Patel' }] },
//   { _id: 'enq-002', name: 'Aarav Mehta', email: 'aarav.mehta@gmail.com', phone: '+1 555-0402', class_applying: 'Class 6', source: 'Phone', enquiry_date: '2025-04-05T11:30:00Z', assigned_to: 'Marcus Johnson', status: 'in-progress', notes: 'Looking for mid-year admission due to relocation.', follow_ups: [{ date: '2025-04-08T11:00:00Z', note: 'Sent brochure and fee structure via email.', by: 'Marcus Johnson' }, { date: '2025-04-12T09:30:00Z', note: 'Parents confirmed campus visit next week.', by: 'Marcus Johnson' }] },
//   { _id: 'enq-003', name: 'Saanvi Reddy', email: 'saanvi.reddy@gmail.com', phone: '+1 555-0403', class_applying: 'Class 9', source: 'Website', enquiry_date: '2025-04-08T14:00:00Z', assigned_to: 'Hannah Kim', status: 'converted', notes: 'Enquiry converted to admission — admission no. ADM-1015.', follow_ups: [{ date: '2025-04-10T15:00:00Z', note: 'Application submitted and fee paid.', by: 'Hannah Kim' }] },
//   { _id: 'enq-004', name: 'Vihaan Gupta', email: 'vihaan.gupta@gmail.com', phone: '+1 555-0404', class_applying: 'Class 3', source: 'Walk-in', enquiry_date: '2025-04-10T09:15:00Z', assigned_to: 'Priya Patel', status: 'pending', notes: 'Asked about transport facility and scholarship options.', follow_ups: [] },
//   { _id: 'enq-005', name: 'Anaya Singh', email: 'anaya.singh@gmail.com', phone: '+1 555-0405', class_applying: 'Class 11', source: 'Referral', enquiry_date: '2025-04-12T13:45:00Z', assigned_to: 'Diego Ramirez', status: 'in-progress', notes: 'Interested in Science stream with Computer Science elective.', follow_ups: [{ date: '2025-04-15T10:00:00Z', note: 'Scheduled entrance test for next Saturday.', by: 'Diego Ramirez' }] },
//   { _id: 'enq-006', name: 'Kabir Nair', email: 'kabir.nair@gmail.com', phone: '+1 555-0406', class_applying: 'Class 8', source: 'Phone', enquiry_date: '2025-04-14T16:20:00Z', assigned_to: 'Marcus Johnson', status: 'dropped', notes: 'Parents decided on another school closer to home.', follow_ups: [{ date: '2025-04-18T11:00:00Z', note: 'Parents declined — went with competitor school.', by: 'Marcus Johnson' }] },
//   { _id: 'enq-007', name: 'Myra Joshi', email: 'myra.joshi@gmail.com', phone: '+1 555-0407', class_applying: 'Class 2', source: 'Website', enquiry_date: '2025-04-16T10:30:00Z', assigned_to: 'Hannah Kim', status: 'pending', notes: 'Enquired about admission timeline and age criteria.', follow_ups: [] },
//   { _id: 'enq-008', name: 'Reyansh Das', email: 'reyansh.das@gmail.com', phone: '+1 555-0408', class_applying: 'Class 10', source: 'Walk-in', enquiry_date: '2025-04-18T12:00:00Z', assigned_to: 'Priya Patel', status: 'in-progress', notes: 'Transfer case from another city, needs urgent seat.', follow_ups: [{ date: '2025-04-20T09:00:00Z', note: 'Collected transfer certificate and report card.', by: 'Priya Patel' }] },
// ]

// // ─── Visitor Book ─────────────────────────────────────────────────────────────
// // Logs every visitor entering the campus for security and audit purposes.
// export const visitors = [
//   { _id: 'vis-001', name: 'Robert Williams', email: 'robert.w@gmail.com', phone: '+1 555-0501', purpose: 'Parent Meeting', person_to_meet: 'Hannah Kim', department: 'Mathematics', check_in: '2025-04-21T09:30:00Z', check_out: '2025-04-21T10:30:00Z', status: 'checked-out', notes: 'Met regarding Aarav Sharma progress.', attachment: null },
//   { _id: 'vis-002', name: 'Linda Park', email: 'linda.park@gmail.com', phone: '+1 555-0502', purpose: 'Vendor Visit', person_to_meet: 'Carlos Mendez', department: 'Administration', check_in: '2025-04-21T11:00:00Z', check_out: null, status: 'checked-in', notes: 'Came to deliver lab equipment samples.', attachment: 'invoice.pdf' },
//   { _id: 'vis-003', name: 'Dr. Samuel Lee', email: 'samuel.lee@clinic.com', phone: '+1 555-0503', purpose: 'Medical Checkup', person_to_meet: 'Elena Voronova', department: 'Administration', check_in: '2025-04-21T08:00:00Z', check_out: '2025-04-21T12:00:00Z', status: 'checked-out', notes: 'Annual health checkup for staff.', attachment: null },
//   { _id: 'vis-004', name: 'Jennifer Brown', email: 'jennifer.b@gmail.com', phone: '+1 555-0504', purpose: 'Admission Enquiry', person_to_meet: 'Priya Patel', department: 'Administration', check_in: '2025-04-21T14:00:00Z', check_out: null, status: 'checked-in', notes: 'Prospective parent, toured campus.', attachment: null },
//   { _id: 'vis-005', name: 'Mike Stevens', email: 'mike.stevens@audit.com', phone: '+1 555-0505', purpose: 'Official Audit', person_to_meet: 'Carlos Mendez', department: 'Administration', check_in: '2025-04-20T10:00:00Z', check_out: '2025-04-20T16:00:00Z', status: 'checked-out', notes: 'Annual financial audit visit.', attachment: 'audit-report.pdf' },
//   { _id: 'vis-006', name: 'Sofia Rossi', email: 'sofia.rossi@gmail.com', phone: '+1 555-0506', purpose: 'Guest Lecture', person_to_meet: 'Marcus Johnson', department: 'English', check_in: '2025-04-19T13:00:00Z', check_out: '2025-04-19T15:00:00Z', status: 'checked-out', notes: 'Delivered guest lecture on creative writing.', attachment: null },
//   { _id: 'vis-007', name: 'David Chen', email: 'david.chen@gmail.com', phone: '+1 555-0507', purpose: 'Parent Meeting', person_to_meet: 'Diego Ramirez', department: 'History & Social Studies', check_in: '2025-04-22T09:00:00Z', check_out: null, status: 'checked-in', notes: 'Meeting about upcoming field trip.', attachment: null },
// ]

// // ─── Phone Call Log ───────────────────────────────────────────────────────────
// // Records incoming and outgoing phone calls at the front desk.
// export const phoneCallLogs = [
//   { _id: 'pcl-001', caller_name: 'Robert Williams', phone: '+1 555-0501', call_type: 'incoming', purpose: 'Enquiry', duration: '5 min', call_date: '2025-04-21T09:15:00Z', attended_by: 'Priya Patel', notes: 'Asked about Class 1 admission process and fee structure.', status: 'resolved' },
//   { _id: 'pcl-002', caller_name: 'Linda Park', phone: '+1 555-0502', call_type: 'incoming', purpose: 'Complaint', duration: '8 min', call_date: '2025-04-21T10:30:00Z', attended_by: 'Carlos Mendez', notes: 'Complained about delayed lab equipment delivery.', status: 'pending' },
//   { _id: 'pcl-003', caller_name: 'Hannah Kim', phone: '+1 555-1001', call_type: 'outgoing', purpose: 'Follow-up', duration: '3 min', call_date: '2025-04-21T11:00:00Z', attended_by: 'Priya Patel', notes: 'Called parent regarding student attendance improvement.', status: 'resolved' },
//   { _id: 'pcl-004', caller_name: 'James Wilson', phone: '+1 555-0202', call_type: 'incoming', purpose: 'Enquiry', duration: '4 min', call_date: '2025-04-21T12:45:00Z', attended_by: 'Marcus Johnson', notes: 'Enquired about transport routes and pickup points.', status: 'resolved' },
//   { _id: 'pcl-005', caller_name: 'Sarah Davis', phone: '+1 555-0206', call_type: 'incoming', purpose: 'Complaint', duration: '12 min', call_date: '2025-04-20T15:00:00Z', attended_by: 'Carlos Mendez', notes: 'Raised concern about homework load in Class 12.', status: 'pending' },
//   { _id: 'pcl-006', caller_name: 'Diego Ramirez', phone: '+1 555-1004', call_type: 'outgoing', purpose: 'Information', duration: '2 min', call_date: '2025-04-20T09:00:00Z', attended_by: 'Marcus Johnson', notes: 'Informed parents about history exhibition schedule.', status: 'resolved' },
//   { _id: 'pcl-007', caller_name: 'Maria Garcia', phone: '+1 555-0204', call_type: 'incoming', purpose: 'Enquiry', duration: '6 min', call_date: '2025-04-19T14:30:00Z', attended_by: 'Priya Patel', notes: 'Asked about scholarship application deadline.', status: 'resolved' },
//   { _id: 'pcl-008', caller_name: 'Olivia Brooks', phone: '+1 555-1006', call_type: 'outgoing', purpose: 'Follow-up', duration: '5 min', call_date: '2025-04-19T11:00:00Z', attended_by: 'Hannah Kim', notes: 'Followed up on pending fee payment reminder.', status: 'resolved' },
// ]

// // ─── Postal Dispatch ─────────────────────────────────────────────────────────
// // Letters/parcels sent out from the institution.
// export const postalDispatches = [
//   { _id: 'pdc-001', to_title: 'Mr. Robert Williams', to_address: '1204 Cedar Lane, Austin, TX', reference_no: 'REF-2025-001', dispatch_type: 'Letter', dispatch_date: '2025-04-20T10:00:00Z', dispatched_by: 'Carlos Mendez', received_by: 'FedEx', notes: 'Fee receipt sent to parent.', attachment: 'fee-receipt.pdf' },
//   { _id: 'pdc-002', to_title: 'Office of Education Board', to_address: 'State Education Dept, Austin, TX', reference_no: 'REF-2025-002', dispatch_type: 'Official Document', dispatch_date: '2025-04-18T14:00:00Z', dispatched_by: 'Priya Patel', received_by: 'DHL', notes: 'Annual report submission to education board.', attachment: 'annual-report.pdf' },
//   { _id: 'pdc-003', to_title: 'Ms. Linda Park', to_address: '55 Tech Park Rd, Portland, OR', reference_no: 'REF-2025-003', dispatch_type: 'Parcel', dispatch_date: '2025-04-17T09:30:00Z', dispatched_by: 'Marcus Johnson', received_by: 'USPS', notes: 'Returned lab equipment samples.', attachment: null },
//   { _id: 'pdc-004', to_title: 'Mr. David Chen', to_address: '742 Oakwood Dr, Portland, OR', reference_no: 'REF-2025-004', dispatch_type: 'Letter', dispatch_date: '2025-04-15T11:00:00Z', dispatched_by: 'Hannah Kim', received_by: 'UPS', notes: 'Student transfer certificate dispatched.', attachment: 'transfer-cert.pdf' },
//   { _id: 'pdc-005', to_title: 'Library Suppliers Inc.', to_address: '200 Book St, San Jose, CA', reference_no: 'REF-2025-005', dispatch_type: 'Parcel', dispatch_date: '2025-04-12T16:00:00Z', dispatched_by: 'Carlos Mendez', received_by: 'FedEx', notes: 'Returned damaged books to supplier.', attachment: 'return-slip.pdf' },
// ]

// // ─── Postal Receive ───────────────────────────────────────────────────────────
// // Letters/parcels received by the institution.
// export const postalReceives = [
//   { _id: 'prc-001', from_title: 'State Education Department', from_address: 'State Education Dept, Austin, TX', reference_no: 'IN-2025-001', receive_type: 'Letter', receive_date: '2025-04-21T09:00:00Z', received_by: 'Carlos Mendez', delivered_to: 'Priya Patel', notes: 'Circular on new curriculum guidelines.', attachment: 'circular.pdf' },
//   { _id: 'prc-002', from_title: 'Lab Equipment Suppliers', from_address: '55 Tech Park Rd, Portland, OR', reference_no: 'IN-2025-002', receive_type: 'Parcel', receive_date: '2025-04-20T13:00:00Z', received_by: 'Marcus Johnson', delivered_to: 'Priya Patel', notes: 'New science lab microscopes delivery.', attachment: 'delivery-note.pdf' },
//   { _id: 'prc-003', from_title: 'Mr. Robert Williams', from_address: '1204 Cedar Lane, Austin, TX', reference_no: 'IN-2025-003', receive_type: 'Letter', receive_date: '2025-04-18T10:30:00Z', received_by: 'Hannah Kim', delivered_to: 'Hannah Kim', notes: 'Parent consent form for field trip.', attachment: 'consent-form.pdf' },
//   { _id: 'prc-004', from_title: 'Sports Authority', from_address: '5 Sports Complex Dr, Austin, TX', reference_no: 'IN-2025-004', receive_type: 'Parcel', receive_date: '2025-04-16T15:00:00Z', received_by: 'Carlos Mendez', delivered_to: 'Sam Torres', notes: 'New athletics equipment for sports day.', attachment: null },
//   { _id: 'prc-005', from_title: 'Library Suppliers Inc.', from_address: '200 Book St, San Jose, CA', reference_no: 'IN-2025-005', receive_type: 'Parcel', receive_date: '2025-04-14T11:00:00Z', received_by: 'Marcus Johnson', delivered_to: 'Rachel Green', notes: 'Ordered reference books for the library.', attachment: 'packing-list.pdf' },
//   { _id: 'prc-006', from_title: 'Parent Teacher Association', from_address: 'PTA Office, Austin, TX', reference_no: 'IN-2025-006', receive_type: 'Letter', receive_date: '2025-04-12T08:00:00Z', received_by: 'Carlos Mendez', delivered_to: 'Diego Ramirez', notes: 'PTA meeting minutes for record.', attachment: 'minutes.pdf' },
// ]

// // ─── Complaints ───────────────────────────────────────────────────────────────
// // Complaints raised by parents, students, or staff — tracked to resolution.
// export const complaints = [
//   { _id: 'cmp-001', title: 'Broken classroom window', complaint_type: 'Infrastructure', description: 'Window in Class 10-A is cracked and needs urgent repair before monsoon.', complainant_name: 'Hannah Kim', complainant_type: 'Staff', phone: '+1 555-1001', priority: 'high', status: 'open', assigned_to: 'Carlos Mendez', created_date: '2025-04-19T09:00:00Z', resolved_date: null, attachment: 'window-photo.jpg', notes: 'Glass vendor contacted, awaiting quote.', follow_ups: [{ date: '2025-04-20T10:00:00Z', note: 'Vendor inspected, replacement scheduled for Friday.', by: 'Carlos Mendez' }] },
//   { _id: 'cmp-002', title: 'School bus arrived late', complaint_type: 'Transport', description: 'Bus route 3 was 25 minutes late on two consecutive days last week.', complainant_name: 'Robert Williams', complainant_type: 'Parent', phone: '+1 555-0501', priority: 'medium', status: 'in-progress', assigned_to: 'Sam Torres', created_date: '2025-04-18T14:00:00Z', resolved_date: null, attachment: null, notes: 'Driver reassigned, route optimized.', follow_ups: [{ date: '2025-04-19T08:00:00Z', note: 'Spoke with driver — traffic was the cause.', by: 'Sam Torres' }, { date: '2025-04-21T09:00:00Z', note: 'New route timing implemented, monitoring for 3 days.', by: 'Sam Torres' }] },
//   { _id: 'cmp-003', title: 'Library books not returned', complaint_type: 'Library', description: 'Two library books overdue by more than 30 days by a student.', complainant_name: 'Rachel Green', complainant_type: 'Staff', phone: '+1 555-1010', priority: 'low', status: 'resolved', assigned_to: 'Marcus Johnson', created_date: '2025-04-10T10:00:00Z', resolved_date: '2025-04-15T15:00:00Z', attachment: null, notes: 'Books returned after parent meeting.', follow_ups: [{ date: '2025-04-12T11:00:00Z', note: 'Reminder sent to parent.', by: 'Marcus Johnson' }, { date: '2025-04-15T15:00:00Z', note: 'Books returned in good condition. Complaint closed.', by: 'Marcus Johnson' }] },
//   { _id: 'cmp-004', title: 'Canteen food quality', complaint_type: 'Facilities', description: 'Several students reported stale food in the canteen during lunch.', complainant_name: 'Aarav Sharma', complainant_type: 'Student', phone: '+1 555-0201', priority: 'high', status: 'open', assigned_to: 'Carlos Mendez', created_date: '2025-04-20T12:00:00Z', resolved_date: null, attachment: 'food-photo.jpg', notes: 'Canteen contractor warned, inspection scheduled.', follow_ups: [{ date: '2025-04-21T08:00:00Z', note: 'Surprise inspection done — issued notice to contractor.', by: 'Carlos Mendez' }] },
//   { _id: 'cmp-005', title: 'Drinking water dispenser not working', complaint_type: 'Infrastructure', description: 'Water dispenser on second floor is not cooling water.', complainant_name: 'Marcus Johnson', complainant_type: 'Staff', phone: '+1 555-1002', priority: 'medium', status: 'in-progress', assigned_to: 'Carlos Mendez', created_date: '2025-04-17T09:00:00Z', resolved_date: null, attachment: null, notes: 'Maintenance team assigned.', follow_ups: [{ date: '2025-04-18T10:00:00Z', note: 'Technician visited — compressor needs replacement.', by: 'Carlos Mendez' }] },
//   { _id: 'cmp-006', title: 'Wi-Fi connectivity issues', complaint_type: 'IT', description: 'Intermittent Wi-Fi in the computer lab affecting classes.', complainant_name: 'Yuki Tanaka', complainant_type: 'Staff', phone: '+1 555-1005', priority: 'medium', status: 'resolved', assigned_to: 'Diego Ramirez', created_date: '2025-04-14T11:00:00Z', resolved_date: '2025-04-17T16:00:00Z', attachment: null, notes: 'Router firmware updated, access point added.', follow_ups: [{ date: '2025-04-15T09:00:00Z', note: 'IT vendor contacted for router check.', by: 'Diego Ramirez' }, { date: '2025-04-17T16:00:00Z', note: 'New access point installed, connectivity stable.', by: 'Diego Ramirez' }] },
// ]

// // ─── Front Office Setup ───────────────────────────────────────────────────────
// // Configuration items — purpose of visit, complaint types, sources, etc.
// // Stored as categories so admins can add/remove options without code changes.
// export const frontOfficeSetup = {
//   visitPurposes: [
//     { _id: 'vp-001', name: 'Parent Meeting', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'vp-002', name: 'Vendor Visit', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'vp-003', name: 'Medical Checkup', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'vp-004', name: 'Admission Enquiry', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'vp-005', name: 'Guest Lecture', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//     { _id: 'vp-006', name: 'Official Audit', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   ],
//   complaintTypes: [
//     { _id: 'ct-001', name: 'Infrastructure', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'ct-002', name: 'Transport', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'ct-003', name: 'Library', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'ct-004', name: 'Facilities', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'ct-005', name: 'IT', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//     { _id: 'ct-006', name: 'Staff Behavior', status: 'inactive', createdAt: '2024-01-12T00:00:00Z' },
//   ],
//   enquirySources: [
//     { _id: 'es-001', name: 'Walk-in', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'es-002', name: 'Phone', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'es-003', name: 'Website', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'es-004', name: 'Referral', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'es-005', name: 'Social Media', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//     { _id: 'es-006', name: 'Newspaper Ad', status: 'inactive', createdAt: '2024-01-12T00:00:00Z' },
//   ],
//   callPurposes: [
//     { _id: 'cp-001', name: 'Enquiry', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'cp-002', name: 'Complaint', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'cp-003', name: 'Follow-up', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'cp-004', name: 'Information', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'cp-005', name: 'Emergency', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   ],
//   postalTypes: [
//     { _id: 'pt-001', name: 'Letter', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'pt-002', name: 'Parcel', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//     { _id: 'pt-003', name: 'Official Document', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//     { _id: 'pt-004', name: 'Courier', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//   ],
// }

// // ─── Front Office Dashboard Stats ─────────────────────────────────────────────
// // Aggregated counts shown as KPI cards on each page.
// export const frontOfficeStats = {
//   total_enquiries: admissionEnquiries.length,
//   pending_enquiries: admissionEnquiries.filter((e) => e.status === 'pending').length,
//   converted_enquiries: admissionEnquiries.filter((e) => e.status === 'converted').length,
//   active_visitors: visitors.filter((v) => v.status === 'checked-in').length,
//   total_visitors: visitors.length,
//   total_calls: phoneCallLogs.length,
//   pending_calls: phoneCallLogs.filter((c) => c.status === 'pending').length,
//   open_complaints: complaints.filter((c) => c.status === 'open').length,
//   in_progress_complaints: complaints.filter((c) => c.status === 'in-progress').length,
//   resolved_complaints: complaints.filter((c) => c.status === 'resolved').length,
//   total_dispatches: postalDispatches.length,
//   total_receives: postalReceives.length,
// }
