// // ─── Hostel Module Mock Data ──────────────────────────────────────────────────
// // All structures mirror the backend hostelModel.js field names.
// // INTEGRATION: delete this file once real endpoints are wired in
// // hostel.service.js. Only the service imports this file.

// // ─── Room Types ──────────────────────────────────────────────────────────────
// export const roomTypes = [
//   { _id: 'rt-001', name: 'Single AC', code: 'SAC', capacity: 1, base_fee: 1200, description: 'Single occupancy with AC', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
//   { _id: 'rt-002', name: 'Double Non-AC', code: 'DNAC', capacity: 2, base_fee: 800, description: 'Double sharing without AC', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
//   { _id: 'rt-003', name: 'Triple AC', code: 'TAC', capacity: 3, base_fee: 1000, description: 'Triple sharing with AC', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
//   { _id: 'rt-004', name: 'Dormitory', code: 'DORM', capacity: 6, base_fee: 500, description: 'Six-bed dormitory style', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
//   { _id: 'rt-005', name: 'Deluxe Single', code: 'DSAC', capacity: 1, base_fee: 1800, description: 'Premium single with attached bath', status: 'inactive', createdAt: '2024-06-05T00:00:00Z' },
// ]

// // ─── Hostel Rooms ────────────────────────────────────────────────────────────
// // `room_status`: available, occupied, partial, maintenance.
// export const hostelRooms = [
//   { _id: 'rm-001', room_number: 'A-101', floor: '1st Floor', block: 'Block A', room_type_id: 'rt-001', room_type_name: 'Single AC', capacity: 1, occupied: 1, room_status: 'occupied', status: 'active', createdAt: '2024-07-01T00:00:00Z' },
//   { _id: 'rm-002', room_number: 'A-102', floor: '1st Floor', block: 'Block A', room_type_id: 'rt-002', room_type_name: 'Double Non-AC', capacity: 2, occupied: 2, room_status: 'occupied', status: 'active', createdAt: '2024-07-01T00:00:00Z' },
//   { _id: 'rm-003', room_number: 'A-103', floor: '1st Floor', block: 'Block A', room_type_id: 'rt-002', room_type_name: 'Double Non-AC', capacity: 2, occupied: 1, room_status: 'partial', status: 'active', createdAt: '2024-07-01T00:00:00Z' },
//   { _id: 'rm-004', room_number: 'A-201', floor: '2nd Floor', block: 'Block A', room_type_id: 'rt-003', room_type_name: 'Triple AC', capacity: 3, occupied: 3, room_status: 'occupied', status: 'active', createdAt: '2024-07-02T00:00:00Z' },
//   { _id: 'rm-005', room_number: 'A-202', floor: '2nd Floor', block: 'Block A', room_type_id: 'rt-003', room_type_name: 'Triple AC', capacity: 3, occupied: 0, room_status: 'available', status: 'active', createdAt: '2024-07-02T00:00:00Z' },
//   { _id: 'rm-006', room_number: 'B-101', floor: '1st Floor', block: 'Block B', room_type_id: 'rt-004', room_type_name: 'Dormitory', capacity: 6, occupied: 4, room_status: 'partial', status: 'active', createdAt: '2024-07-03T00:00:00Z' },
//   { _id: 'rm-007', room_number: 'B-102', floor: '1st Floor', block: 'Block B', room_type_id: 'rt-004', room_type_name: 'Dormitory', capacity: 6, occupied: 0, room_status: 'maintenance', status: 'inactive', createdAt: '2024-07-03T00:00:00Z' },
//   { _id: 'rm-008', room_number: 'B-201', floor: '2nd Floor', block: 'Block B', room_type_id: 'rt-001', room_type_name: 'Single AC', capacity: 1, occupied: 0, room_status: 'available', status: 'active', createdAt: '2024-07-04T00:00:00Z' },
//   { _id: 'rm-009', room_number: 'B-202', floor: '2nd Floor', block: 'Block B', room_type_id: 'rt-002', room_type_name: 'Double Non-AC', capacity: 2, occupied: 1, room_status: 'partial', status: 'active', createdAt: '2024-07-04T00:00:00Z' },
//   { _id: 'rm-010', room_number: 'C-101', floor: '1st Floor', block: 'Block C', room_type_id: 'rt-003', room_type_name: 'Triple AC', capacity: 3, occupied: 2, room_status: 'partial', status: 'active', createdAt: '2024-07-05T00:00:00Z' },
// ]

// // ─── Room Allocations ────────────────────────────────────────────────────────
// // `allocation_status`: active, vacated, pending.
// export const roomAllocations = [
//   { _id: 'all-001', student_id: 'stu-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', room_id: 'rm-001', room_number: 'A-101', room_type_name: 'Single AC', block: 'Block A', floor: '1st Floor', allocation_status: 'active', check_in: '2024-08-01', check_out: null, allocated_at: '2024-07-15T00:00:00Z' },
//   { _id: 'all-002', student_id: 'stu-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', room_id: 'rm-002', room_number: 'A-102', room_type_name: 'Double Non-AC', block: 'Block A', floor: '1st Floor', allocation_status: 'active', check_in: '2024-08-01', check_out: null, allocated_at: '2024-07-15T00:00:00Z' },
//   { _id: 'all-003', student_id: 'stu-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', room_id: 'rm-002', room_number: 'A-102', room_type_name: 'Double Non-AC', block: 'Block A', floor: '1st Floor', allocation_status: 'active', check_in: '2024-08-01', check_out: null, allocated_at: '2024-07-15T00:00:00Z' },
//   { _id: 'all-004', student_id: 'stu-005', student_name: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', room_id: 'rm-003', room_number: 'A-103', room_type_name: 'Double Non-AC', block: 'Block A', floor: '1st Floor', allocation_status: 'active', check_in: '2024-08-02', check_out: null, allocated_at: '2024-07-16T00:00:00Z' },
//   { _id: 'all-005', student_id: 'stu-007', student_name: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', room_id: 'rm-004', room_number: 'A-201', room_type_name: 'Triple AC', block: 'Block A', floor: '2nd Floor', allocation_status: 'active', check_in: '2024-08-01', check_out: null, allocated_at: '2024-07-15T00:00:00Z' },
//   { _id: 'all-006', student_id: 'stu-008', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', room_id: 'rm-004', room_number: 'A-201', room_type_name: 'Triple AC', block: 'Block A', floor: '2nd Floor', allocation_status: 'active', check_in: '2024-08-01', check_out: null, allocated_at: '2024-07-15T00:00:00Z' },
//   { _id: 'all-007', student_id: 'stu-009', student_name: 'Lucas Anderson', admission_no: 'ADM-1009', class: '11-B', room_id: 'rm-004', room_number: 'A-201', room_type_name: 'Triple AC', block: 'Block A', floor: '2nd Floor', allocation_status: 'active', check_in: '2024-08-01', check_out: null, allocated_at: '2024-07-15T00:00:00Z' },
//   { _id: 'all-008', student_id: 'stu-010', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class: '9-A', room_id: 'rm-006', room_number: 'B-101', room_type_name: 'Dormitory', block: 'Block B', floor: '1st Floor', allocation_status: 'active', check_in: '2024-08-03', check_out: null, allocated_at: '2024-07-17T00:00:00Z' },
//   { _id: 'all-009', student_id: 'stu-013', student_name: 'Henry Walker', admission_no: 'ADM-1013', class: 'Year-3', room_id: 'rm-006', room_number: 'B-101', room_type_name: 'Dormitory', block: 'Block B', floor: '1st Floor', allocation_status: 'active', check_in: '2024-08-03', check_out: null, allocated_at: '2024-07-17T00:00:00Z' },
//   { _id: 'all-010', student_id: 'stu-014', student_name: 'Charlotte Brooks', admission_no: 'ADM-1014', class: '8-A', room_id: 'rm-009', room_number: 'B-202', room_type_name: 'Double Non-AC', block: 'Block B', floor: '2nd Floor', allocation_status: 'active', check_in: '2024-08-05', check_out: null, allocated_at: '2024-07-18T00:00:00Z' },
//   { _id: 'all-011', student_id: 'stu-004', student_name: 'Sofia Garcia', admission_no: 'ADM-1004', class: '8-C', room_id: 'rm-003', room_number: 'A-103', room_type_name: 'Double Non-AC', block: 'Block A', floor: '1st Floor', allocation_status: 'vacated', check_in: '2024-08-02', check_out: '2025-01-15', allocated_at: '2024-07-16T00:00:00Z' },
//   { _id: 'all-012', student_id: 'stu-006', student_name: 'Olivia Davis', admission_no: 'ADM-1006', class: '12-A', room_id: 'rm-010', room_number: 'C-101', room_type_name: 'Triple AC', block: 'Block C', floor: '1st Floor', allocation_status: 'active', check_in: '2024-08-10', check_out: null, allocated_at: '2024-07-20T00:00:00Z' },
// ]

// // ─── Hostel Fees ──────────────────────────────────────────────────────────────
// // `fee_status`: paid, partial, pending.
// export const hostelFees = [
//   { _id: 'hfe-001', student_id: 'stu-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', room_number: 'A-101', room_type_name: 'Single AC', total_amount: 1200, paid_amount: 1200, due_amount: 0, fee_status: 'paid', payment_history: [{ _id: 'hph-001', amount: 1200, date: '2024-08-10', method: 'Cash', remark: 'Full payment' }], createdAt: '2024-08-01T00:00:00Z' },
//   { _id: 'hfe-002', student_id: 'stu-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', room_number: 'A-102', room_type_name: 'Double Non-AC', total_amount: 800, paid_amount: 400, due_amount: 400, fee_status: 'partial', payment_history: [{ _id: 'hph-002', amount: 400, date: '2024-08-15', method: 'Card', remark: 'Installment 1' }], createdAt: '2024-08-01T00:00:00Z' },
//   { _id: 'hfe-003', student_id: 'stu-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', room_number: 'A-102', room_type_name: 'Double Non-AC', total_amount: 800, paid_amount: 0, due_amount: 800, fee_status: 'pending', payment_history: [], createdAt: '2024-08-01T00:00:00Z' },
//   { _id: 'hfe-004', student_id: 'stu-005', student_name: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', room_number: 'A-103', room_type_name: 'Double Non-AC', total_amount: 800, paid_amount: 800, due_amount: 0, fee_status: 'paid', payment_history: [{ _id: 'hph-003', amount: 800, date: '2024-08-08', method: 'Bank Transfer', remark: 'Full payment' }], createdAt: '2024-08-02T00:00:00Z' },
//   { _id: 'hfe-005', student_id: 'stu-007', student_name: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', room_number: 'A-201', room_type_name: 'Triple AC', total_amount: 1000, paid_amount: 500, due_amount: 500, fee_status: 'partial', payment_history: [{ _id: 'hph-004', amount: 500, date: '2024-08-12', method: 'Cash', remark: 'Installment 1' }], createdAt: '2024-08-01T00:00:00Z' },
//   { _id: 'hfe-006', student_id: 'stu-008', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', room_number: 'A-201', room_type_name: 'Triple AC', total_amount: 1000, paid_amount: 1000, due_amount: 0, fee_status: 'paid', payment_history: [{ _id: 'hph-005', amount: 1000, date: '2024-08-05', method: 'Card', remark: 'Full payment' }], createdAt: '2024-08-01T00:00:00Z' },
//   { _id: 'hfe-007', student_id: 'stu-010', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class: '9-A', room_number: 'B-101', room_type_name: 'Dormitory', total_amount: 500, paid_amount: 0, due_amount: 500, fee_status: 'pending', payment_history: [], createdAt: '2024-08-03T00:00:00Z' },
//   { _id: 'hfe-008', student_id: 'stu-014', student_name: 'Charlotte Brooks', admission_no: 'ADM-1014', class: '8-A', room_number: 'B-202', room_type_name: 'Double Non-AC', total_amount: 800, paid_amount: 400, due_amount: 400, fee_status: 'partial', payment_history: [{ _id: 'hph-006', amount: 400, date: '2024-08-10', method: 'Cash', remark: 'Installment 1' }], createdAt: '2024-08-05T00:00:00Z' },
// ]

// // ─── Hostel Dashboard Stats ──────────────────────────────────────────────────
// export const hostelStats = {
//   total_rooms: hostelRooms.length,
//   available_rooms: hostelRooms.filter((r) => r.room_status === 'available').length,
//   occupied_beds: hostelRooms.reduce((sum, r) => sum + r.occupied, 0),
//   total_beds: hostelRooms.reduce((sum, r) => sum + r.capacity, 0),
//   total_students: roomAllocations.filter((a) => a.allocation_status === 'active').length,
//   pending_fees: hostelFees.filter((f) => f.fee_status !== 'paid').length,
//   total_pending_amount: hostelFees.reduce((sum, f) => sum + f.due_amount, 0),
//   total_collected: hostelFees.reduce((sum, f) => sum + f.paid_amount, 0),
// }

// // Occupancy by room type for the dashboard chart.
// export const occupancyByType = roomTypes.map((rt) => {
//   const rooms = hostelRooms.filter((r) => r.room_type_id === rt._id)
//   return {
//     label: rt.name,
//     value: rooms.reduce((sum, r) => sum + r.occupied, 0),
//     capacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
//   }
// })

// // Room status distribution for the dashboard donut chart.
// export const roomStatusBreakdown = [
//   { label: 'Available', value: hostelRooms.filter((r) => r.room_status === 'available').length, color: 'chart-2' },
//   { label: 'Occupied', value: hostelRooms.filter((r) => r.room_status === 'occupied').length, color: 'chart-1' },
//   { label: 'Partial', value: hostelRooms.filter((r) => r.room_status === 'partial').length, color: 'chart-3' },
//   { label: 'Maintenance', value: hostelRooms.filter((r) => r.room_status === 'maintenance').length, color: 'chart-4' },
// ]

// // Block-wise occupancy for the dashboard bar chart.
// export const blockOccupancy = ['Block A', 'Block B', 'Block C'].map((block) => {
//   const rooms = hostelRooms.filter((r) => r.block === block)
//   return {
//     label: block,
//     value: rooms.reduce((sum, r) => sum + r.occupied, 0),
//   }
// })
