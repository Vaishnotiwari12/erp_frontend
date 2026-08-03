// // ─── Transport Module Mock Data ──────────────────────────────────────────────
// // All structures mirror the backend transportModel.js field names.
// // INTEGRATION: delete this file once real endpoints are wired in
// // transport.service.js. Only the service imports this file.

// // ─── Drivers (sourced from HR staff) ──────────────────────────────────────────
// export const drivers = [
//   { _id: 'drv-001', name: 'Robert Williams', phone: '+1 555-0401', license: 'DL-2021001', status: 'active' },
//   { _id: 'drv-002', name: 'James Carter', phone: '+1 555-0402', license: 'DL-2021002', status: 'active' },
//   { _id: 'drv-003', name: 'Michael Brown', phone: '+1 555-0403', license: 'DL-2021003', status: 'active' },
//   { _id: 'drv-004', name: 'David Wilson', phone: '+1 555-0404', license: 'DL-2021004', status: 'inactive' },
//   { _id: 'drv-005', name: 'Thomas Anderson', phone: '+1 555-0405', license: 'DL-2021005', status: 'active' },
// ]

// // ─── Routes ───────────────────────────────────────────────────────────────────
// // `stops` is an ordered list of pickup point IDs along the route.
// export const transportRoutes = [
//   { _id: 'rte-001', name: 'North Campus Loop', code: 'NCL-01', distance: 12.5, driver_id: 'drv-001', driver_name: 'Robert Williams', vehicle_id: 'veh-001', stops: ['pp-001', 'pp-002', 'pp-003'], status: 'active', createdAt: '2024-06-01T00:00:00Z' },
//   { _id: 'rte-002', name: 'South Campus Loop', code: 'SCL-01', distance: 8.2, driver_id: 'drv-002', driver_name: 'James Carter', vehicle_id: 'veh-002', stops: ['pp-004', 'pp-005', 'pp-006'], status: 'active', createdAt: '2024-06-02T00:00:00Z' },
//   { _id: 'rte-003', name: 'East Side Express', code: 'ESE-01', distance: 15.7, driver_id: 'drv-003', driver_name: 'Michael Brown', vehicle_id: 'veh-003', stops: ['pp-007', 'pp-008', 'pp-009'], status: 'active', createdAt: '2024-06-03T00:00:00Z' },
//   { _id: 'rte-004', name: 'West Valley Route', code: 'WVR-01', distance: 18.3, driver_id: 'drv-005', driver_name: 'Thomas Anderson', vehicle_id: 'veh-004', stops: ['pp-010', 'pp-011'], status: 'active', createdAt: '2024-06-04T00:00:00Z' },
//   { _id: 'rte-005', name: 'Downtown Shuttle', code: 'DTS-01', distance: 6.8, driver_id: null, driver_name: null, vehicle_id: null, stops: ['pp-001', 'pp-006'], status: 'inactive', createdAt: '2024-06-05T00:00:00Z' },
// ]

// // ─── Vehicles ────────────────────────────────────────────────────────────────
// export const vehicles = [
//   { _id: 'veh-001', vehicle_number: 'BUS-001', registration_number: 'REG-2021-001', driver_id: 'drv-001', driver_name: 'Robert Williams', capacity: 42, occupied: 38, route_id: 'rte-001', route_name: 'North Campus Loop', insurance_expiry: '2025-12-31', fitness_expiry: '2025-06-30', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//   { _id: 'veh-002', vehicle_number: 'BUS-002', registration_number: 'REG-2021-002', driver_id: 'drv-002', driver_name: 'James Carter', capacity: 42, occupied: 35, route_id: 'rte-002', route_name: 'South Campus Loop', insurance_expiry: '2025-09-15', fitness_expiry: '2025-03-15', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//   { _id: 'veh-003', vehicle_number: 'BUS-003', registration_number: 'REG-2022-003', driver_id: 'drv-003', driver_name: 'Michael Brown', capacity: 36, occupied: 30, route_id: 'rte-003', route_name: 'East Side Express', insurance_expiry: '2025-11-20', fitness_expiry: '2025-05-20', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   { _id: 'veh-004', vehicle_number: 'BUS-004', registration_number: 'REG-2022-004', driver_id: 'drv-005', driver_name: 'Thomas Anderson', capacity: 48, occupied: 28, route_id: 'rte-004', route_name: 'West Valley Route', insurance_expiry: '2025-08-10', fitness_expiry: '2025-02-10', status: 'active', createdAt: '2024-01-13T00:00:00Z' },
//   { _id: 'veh-005', vehicle_number: 'BUS-005', registration_number: 'REG-2023-005', driver_id: null, driver_name: null, capacity: 30, occupied: 0, route_id: null, route_name: null, insurance_expiry: '2025-04-01', fitness_expiry: '2025-01-01', status: 'inactive', createdAt: '2024-01-14T00:00:00Z' },
// ]

// // ─── Pickup Points ────────────────────────────────────────────────────────────
// // `gps_lat` / `gps_lng` are placeholders for future map integration.
// export const pickupPoints = [
//   { _id: 'pp-001', name: 'Main Gate', route_id: 'rte-001', route_name: 'North Campus Loop', time: '07:00', gps_lat: 40.7128, gps_lng: -74.0060, status: 'active', createdAt: '2024-06-01T00:00:00Z' },
//   { _id: 'pp-002', name: 'Oak Street', route_id: 'rte-001', route_name: 'North Campus Loop', time: '07:15', gps_lat: 40.7200, gps_lng: -74.0100, status: 'active', createdAt: '2024-06-01T00:00:00Z' },
//   { _id: 'pp-003', name: 'Maple Avenue', route_id: 'rte-001', route_name: 'North Campus Loop', time: '07:30', gps_lat: 40.7250, gps_lng: -74.0150, status: 'active', createdAt: '2024-06-01T00:00:00Z' },
//   { _id: 'pp-004', name: 'Pine Road', route_id: 'rte-002', route_name: 'South Campus Loop', time: '07:10', gps_lat: 40.7000, gps_lng: -74.0200, status: 'active', createdAt: '2024-06-02T00:00:00Z' },
//   { _id: 'pp-005', name: 'Cedar Lane', route_id: 'rte-002', route_name: 'South Campus Loop', time: '07:25', gps_lat: 40.7050, gps_lng: -74.0250, status: 'active', createdAt: '2024-06-02T00:00:00Z' },
//   { _id: 'pp-006', name: 'Birch Street', route_id: 'rte-002', route_name: 'South Campus Loop', time: '07:40', gps_lat: 40.7080, gps_lng: -74.0300, status: 'active', createdAt: '2024-06-02T00:00:00Z' },
//   { _id: 'pp-007', name: 'Elm Court', route_id: 'rte-003', route_name: 'East Side Express', time: '06:50', gps_lat: 40.7300, gps_lng: -73.9900, status: 'active', createdAt: '2024-06-03T00:00:00Z' },
//   { _id: 'pp-008', name: 'Willow Drive', route_id: 'rte-003', route_name: 'East Side Express', time: '07:05', gps_lat: 40.7350, gps_lng: -73.9950, status: 'active', createdAt: '2024-06-03T00:00:00Z' },
//   { _id: 'pp-009', name: 'Spruce Avenue', route_id: 'rte-003', route_name: 'East Side Express', time: '07:20', gps_lat: 40.7400, gps_lng: -74.0000, status: 'active', createdAt: '2024-06-03T00:00:00Z' },
//   { _id: 'pp-010', name: 'Aspen Road', route_id: 'rte-004', route_name: 'West Valley Route', time: '06:45', gps_lat: 40.7500, gps_lng: -74.0400, status: 'active', createdAt: '2024-06-04T00:00:00Z' },
//   { _id: 'pp-011', name: 'Juniper Lane', route_id: 'rte-004', route_name: 'West Valley Route', time: '07:00', gps_lat: 40.7550, gps_lng: -74.0450, status: 'active', createdAt: '2024-06-04T00:00:00Z' },
// ]

// // ─── Vehicle Assignments (students assigned to vehicles) ──────────────────────
// export const vehicleAssignments = [
//   { _id: 'vas-001', student_id: 'stu-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', vehicle_id: 'veh-001', vehicle_number: 'BUS-001', route_id: 'rte-001', route_name: 'North Campus Loop', pickup_point_id: 'pp-001', pickup_point_name: 'Main Gate', pickup_time: '07:00', status: 'active', assigned_at: '2024-07-01T00:00:00Z' },
//   { _id: 'vas-002', student_id: 'stu-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', vehicle_id: 'veh-001', vehicle_number: 'BUS-001', route_id: 'rte-001', route_name: 'North Campus Loop', pickup_point_id: 'pp-002', pickup_point_name: 'Oak Street', pickup_time: '07:15', status: 'active', assigned_at: '2024-07-01T00:00:00Z' },
//   { _id: 'vas-003', student_id: 'stu-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', vehicle_id: 'veh-002', vehicle_number: 'BUS-002', route_id: 'rte-002', route_name: 'South Campus Loop', pickup_point_id: 'pp-004', pickup_point_name: 'Pine Road', pickup_time: '07:10', status: 'active', assigned_at: '2024-07-02T00:00:00Z' },
//   { _id: 'vas-004', student_id: 'stu-005', student_name: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', vehicle_id: 'veh-003', vehicle_number: 'BUS-003', route_id: 'rte-003', route_name: 'East Side Express', pickup_point_id: 'pp-007', pickup_point_name: 'Elm Court', pickup_time: '06:50', status: 'active', assigned_at: '2024-07-03T00:00:00Z' },
//   { _id: 'vas-005', student_id: 'stu-007', student_name: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', vehicle_id: 'veh-003', vehicle_number: 'BUS-003', route_id: 'rte-003', route_name: 'East Side Express', pickup_point_id: 'pp-008', pickup_point_name: 'Willow Drive', pickup_time: '07:05', status: 'active', assigned_at: '2024-07-03T00:00:00Z' },
//   { _id: 'vas-006', student_id: 'stu-008', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', vehicle_id: 'veh-001', vehicle_number: 'BUS-001', route_id: 'rte-001', route_name: 'North Campus Loop', pickup_point_id: 'pp-003', pickup_point_name: 'Maple Avenue', pickup_time: '07:30', status: 'active', assigned_at: '2024-07-04T00:00:00Z' },
//   { _id: 'vas-007', student_id: 'stu-009', student_name: 'Lucas Anderson', admission_no: 'ADM-1009', class: '11-B', vehicle_id: 'veh-002', vehicle_number: 'BUS-002', route_id: 'rte-002', route_name: 'South Campus Loop', pickup_point_id: 'pp-005', pickup_point_name: 'Cedar Lane', pickup_time: '07:25', status: 'active', assigned_at: '2024-07-04T00:00:00Z' },
//   { _id: 'vas-008', student_id: 'stu-010', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class: '9-A', vehicle_id: 'veh-004', vehicle_number: 'BUS-004', route_id: 'rte-004', route_name: 'West Valley Route', pickup_point_id: 'pp-010', pickup_point_name: 'Aspen Road', pickup_time: '06:45', status: 'active', assigned_at: '2024-07-05T00:00:00Z' },
// ]

// // ─── Transport Fees ──────────────────────────────────────────────────────────
// // `fee_status`: paid, partial, pending. `paid_amount` + `due_amount` = `total_amount`.
// export const transportFees = [
//   { _id: 'tfe-001', student_id: 'stu-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', route_name: 'North Campus Loop', vehicle_number: 'BUS-001', total_amount: 500, paid_amount: 500, due_amount: 0, fee_status: 'paid', payment_history: [{ _id: 'ph-001', amount: 500, date: '2024-07-10', method: 'Cash', remark: 'Full payment' }], createdAt: '2024-07-01T00:00:00Z' },
//   { _id: 'tfe-002', student_id: 'stu-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', route_name: 'North Campus Loop', vehicle_number: 'BUS-001', total_amount: 500, paid_amount: 300, due_amount: 200, fee_status: 'partial', payment_history: [{ _id: 'ph-002', amount: 300, date: '2024-07-15', method: 'Card', remark: 'Partial payment' }], createdAt: '2024-07-01T00:00:00Z' },
//   { _id: 'tfe-003', student_id: 'stu-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', route_name: 'South Campus Loop', vehicle_number: 'BUS-002', total_amount: 450, paid_amount: 0, due_amount: 450, fee_status: 'pending', payment_history: [], createdAt: '2024-07-02T00:00:00Z' },
//   { _id: 'tfe-004', student_id: 'stu-005', student_name: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', route_name: 'East Side Express', vehicle_number: 'BUS-003', total_amount: 550, paid_amount: 550, due_amount: 0, fee_status: 'paid', payment_history: [{ _id: 'ph-003', amount: 550, date: '2024-07-08', method: 'Bank Transfer', remark: 'Full payment' }], createdAt: '2024-07-03T00:00:00Z' },
//   { _id: 'tfe-005', student_id: 'stu-007', student_name: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', route_name: 'East Side Express', vehicle_number: 'BUS-003', total_amount: 550, paid_amount: 200, due_amount: 350, fee_status: 'partial', payment_history: [{ _id: 'ph-004', amount: 200, date: '2024-07-12', method: 'Cash', remark: 'Installment 1' }], createdAt: '2024-07-03T00:00:00Z' },
//   { _id: 'tfe-006', student_id: 'stu-008', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', route_name: 'North Campus Loop', vehicle_number: 'BUS-001', total_amount: 500, paid_amount: 500, due_amount: 0, fee_status: 'paid', payment_history: [{ _id: 'ph-005', amount: 500, date: '2024-07-05', method: 'Card', remark: 'Full payment' }], createdAt: '2024-07-04T00:00:00Z' },
//   { _id: 'tfe-007', student_id: 'stu-009', student_name: 'Lucas Anderson', admission_no: 'ADM-1009', class: '11-B', route_name: 'South Campus Loop', vehicle_number: 'BUS-002', total_amount: 450, paid_amount: 0, due_amount: 450, fee_status: 'pending', payment_history: [], createdAt: '2024-07-04T00:00:00Z' },
//   { _id: 'tfe-008', student_id: 'stu-010', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class: '9-A', route_name: 'West Valley Route', vehicle_number: 'BUS-004', total_amount: 600, paid_amount: 300, due_amount: 300, fee_status: 'partial', payment_history: [{ _id: 'ph-006', amount: 300, date: '2024-07-10', method: 'Cash', remark: 'Installment 1' }], createdAt: '2024-07-05T00:00:00Z' },
// ]

// // ─── Transport Dashboard Stats ────────────────────────────────────────────────
// export const transportStats = {
//   active_routes: transportRoutes.filter((r) => r.status === 'active').length,
//   total_vehicles: vehicles.length,
//   active_vehicles: vehicles.filter((v) => v.status === 'active').length,
//   students_using_transport: vehicleAssignments.length,
//   pending_fees: transportFees.filter((f) => f.fee_status !== 'paid').length,
//   total_pending_amount: transportFees.reduce((sum, f) => sum + f.due_amount, 0),
//   total_collected: transportFees.reduce((sum, f) => sum + f.paid_amount, 0),
// }

// // Route summary for the dashboard chart — students per route.
// export const routeSummary = transportRoutes.map((r) => ({
//   label: r.name,
//   value: vehicleAssignments.filter((a) => a.route_id === r._id).length,
// }))

// // Vehicle occupancy for the dashboard donut chart.
// export const vehicleOccupancy = vehicles.map((v) => ({
//   label: v.vehicle_number,
//   value: v.occupied,
//   capacity: v.capacity,
//   color: v.status === 'active' ? 'chart-1' : 'chart-4',
// }))

// // Fee collection breakdown for the dashboard donut chart.
// export const feeBreakdown = [
//   { label: 'Paid', value: transportFees.filter((f) => f.fee_status === 'paid').length, color: 'chart-2' },
//   { label: 'Partial', value: transportFees.filter((f) => f.fee_status === 'partial').length, color: 'chart-3' },
//   { label: 'Pending', value: transportFees.filter((f) => f.fee_status === 'pending').length, color: 'chart-4' },
// ]
