// // Dev-only mock data for the Fees Collection module.
// // INTEGRATION: delete this file once real endpoints are wired in fees.service.js.

// import { students } from '@/services/mockData'

// export const FEE_FREQUENCIES = ['One Time', 'Monthly', 'Quarterly', 'Half-Yearly', 'Annually']
// export const PAYMENT_MODES = ['Cash', 'Cheque', 'Card', 'Net Banking', 'UPI', 'Bank Transfer']
// export const PAYMENT_STATUSES = ['Paid', 'Partial', 'Pending', 'Overdue', 'Rejected']
// export const BANK_PAYMENT_STATUSES = ['Pending', 'Approved', 'Rejected']
// export const DISCOUNT_TYPES = ['Percentage', 'Fixed']
// export const FEE_SESSIONS = ['2024-2025', '2025-2026', '2023-2024']

// export const feesGroups = [
//   { _id: 'fg-001', name: 'Tuition Fees', code: 'TUI', description: 'Recurring academic tuition charges', status: 'active', createdAt: '2024-04-01T00:00:00Z' },
//   { _id: 'fg-002', name: 'Hostel Fees', code: 'HST', description: 'Boarding and lodging charges', status: 'active', createdAt: '2024-04-02T00:00:00Z' },
//   { _id: 'fg-003', name: 'Transport Fees', code: 'TRN', description: 'School bus and transport services', status: 'active', createdAt: '2024-04-03T00:00:00Z' },
//   { _id: 'fg-004', name: 'Examination Fees', code: 'EXM', description: 'Term and board examination charges', status: 'active', createdAt: '2024-04-04T00:00:00Z' },
//   { _id: 'fg-005', name: 'Miscellaneous', code: 'MISC', description: 'One-time and ad-hoc charges', status: 'inactive', createdAt: '2024-04-05T00:00:00Z' },
// ]

// export const feesTypes = [
//   { _id: 'ft-001', name: 'Tuition Fee', code: 'TF', group: 'Tuition Fees', description: 'Core academic tuition', status: 'active', createdAt: '2024-04-01T00:00:00Z' },
//   { _id: 'ft-002', name: 'Lab Fee', code: 'LF', group: 'Tuition Fees', description: 'Laboratory usage charges', status: 'active', createdAt: '2024-04-01T00:00:00Z' },
//   { _id: 'ft-003', name: 'Hostel Rent', code: 'HR', group: 'Hostel Fees', description: 'Monthly hostel accommodation', status: 'active', createdAt: '2024-04-02T00:00:00Z' },
//   { _id: 'ft-004', name: 'Mess Charges', code: 'MC', group: 'Hostel Fees', description: 'Food and dining charges', status: 'active', createdAt: '2024-04-02T00:00:00Z' },
//   { _id: 'ft-005', name: 'Bus Fee', code: 'BF', group: 'Transport Fees', description: 'Term bus transport', status: 'active', createdAt: '2024-04-03T00:00:00Z' },
//   { _id: 'ft-006', name: 'Exam Fee', code: 'EF', group: 'Examination Fees', description: 'Term examination processing', status: 'active', createdAt: '2024-04-04T00:00:00Z' },
//   { _id: 'ft-007', name: 'Library Fine', code: 'LBL', group: 'Miscellaneous', description: 'Overdue library book fines', status: 'inactive', createdAt: '2024-04-05T00:00:00Z' },
// ]

// export const feesMaster = [
//   { _id: 'fm-001', name: 'Class 10 Tuition', amount: 1200, frequency: 'Quarterly', group: 'Tuition Fees', type: 'Tuition Fee', class: 'Class 10', session: '2025-2026', description: 'Quarterly tuition for Class 10', status: 'active', createdAt: '2024-04-10T00:00:00Z' },
//   { _id: 'fm-002', name: 'Class 9 Tuition', amount: 1000, frequency: 'Quarterly', group: 'Tuition Fees', type: 'Tuition Fee', class: 'Class 9', session: '2025-2026', description: 'Quarterly tuition for Class 9', status: 'active', createdAt: '2024-04-10T00:00:00Z' },
//   { _id: 'fm-003', name: 'Class 8 Tuition', amount: 900, frequency: 'Quarterly', group: 'Tuition Fees', type: 'Tuition Fee', class: 'Class 8', session: '2025-2026', description: 'Quarterly tuition for Class 8', status: 'active', createdAt: '2024-04-10T00:00:00Z' },
//   { _id: 'fm-004', name: 'Class 11 Tuition', amount: 1500, frequency: 'Quarterly', group: 'Tuition Fees', type: 'Tuition Fee', class: 'Class 11', session: '2025-2026', description: 'Quarterly tuition for Class 11', status: 'active', createdAt: '2024-04-10T00:00:00Z' },
//   { _id: 'fm-005', name: 'Class 12 Tuition', amount: 1600, frequency: 'Quarterly', group: 'Tuition Fees', type: 'Tuition Fee', class: 'Class 12', session: '2025-2026', description: 'Quarterly tuition for Class 12', status: 'active', createdAt: '2024-04-10T00:00:00Z' },
//   { _id: 'fm-006', name: 'Annual Lab Fee', amount: 300, frequency: 'Annually', group: 'Tuition Fees', type: 'Lab Fee', class: 'All', session: '2025-2026', description: 'Annual laboratory fee', status: 'active', createdAt: '2024-04-11T00:00:00Z' },
//   { _id: 'fm-007', name: 'Hostel Rent', amount: 800, frequency: 'Monthly', group: 'Hostel Fees', type: 'Hostel Rent', class: 'All', session: '2025-2026', description: 'Monthly hostel accommodation', status: 'active', createdAt: '2024-04-11T00:00:00Z' },
//   { _id: 'fm-008', name: 'Mess Charges', amount: 600, frequency: 'Monthly', group: 'Hostel Fees', type: 'Mess Charges', class: 'All', session: '2025-2026', description: 'Monthly dining charges', status: 'active', createdAt: '2024-04-11T00:00:00Z' },
//   { _id: 'fm-009', name: 'Term Bus Fee', amount: 450, frequency: 'Quarterly', group: 'Transport Fees', type: 'Bus Fee', class: 'All', session: '2025-2026', description: 'Quarterly bus transport', status: 'active', createdAt: '2024-04-12T00:00:00Z' },
//   { _id: 'fm-010', name: 'Term Exam Fee', amount: 200, frequency: 'Quarterly', group: 'Examination Fees', type: 'Exam Fee', class: 'All', session: '2025-2026', description: 'Quarterly exam processing fee', status: 'inactive', createdAt: '2024-04-12T00:00:00Z' },
// ]

// export const feesDiscounts = [
//   { _id: 'fd-001', name: 'Sibling Concession', code: 'SIB', type: 'Percentage', value: 10, description: '10% off for siblings in the same school', status: 'active', createdAt: '2024-04-15T00:00:00Z' },
//   { _id: 'fd-002', name: 'Merit Scholarship', code: 'MER', type: 'Percentage', value: 25, description: '25% scholarship for top academic performers', status: 'active', createdAt: '2024-04-15T00:00:00Z' },
//   { _id: 'fd-003', name: 'Staff Ward Discount', code: 'STF', type: 'Percentage', value: 50, description: '50% off for children of staff members', status: 'active', createdAt: '2024-04-16T00:00:00Z' },
//   { _id: 'fd-004', name: 'Early Bird Rebate', code: 'EBD', type: 'Fixed', value: 100, description: 'Flat $100 off on early full-year payment', status: 'active', createdAt: '2024-04-16T00:00:00Z' },
//   { _id: 'fd-005', name: 'EWS Waiver', code: 'EWS', type: 'Percentage', value: 100, description: 'Full waiver for economically weaker section', status: 'inactive', createdAt: '2024-04-17T00:00:00Z' },
// ]

// export const feesCarryForward = [
//   { _id: 'cf-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', session: '2024-2025', class: 'Class 10', amount: 320, type: 'Credit', reason: 'Overpayment refund carried forward', status: 'active', createdAt: '2025-03-20T00:00:00Z' },
//   { _id: 'cf-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', session: '2024-2025', class: 'Class 9', amount: 150, type: 'Debit', reason: 'Unpaid library fine carried over', status: 'active', createdAt: '2025-03-21T00:00:00Z' },
//   { _id: 'cf-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', session: '2024-2025', class: 'Class 11', amount: 500, type: 'Debit', reason: 'Pending last quarter tuition', status: 'active', createdAt: '2025-03-22T00:00:00Z' },
//   { _id: 'cf-004', student_name: 'Mia Thompson', admission_no: 'ADM-1010', session: '2024-2025', class: 'Class 9', amount: 75, type: 'Credit', reason: 'Excess mess charges refunded', status: 'active', createdAt: '2025-03-23T00:00:00Z' },
//   { _id: 'cf-005', student_name: 'Ethan Lee', admission_no: 'ADM-1007', session: '2024-2025', class: 'Year 2', amount: 240, type: 'Debit', reason: 'Transport fee shortfall', status: 'inactive', createdAt: '2025-03-24T00:00:00Z' },
// ]

// const feeBreakdownByStudent = {
//   'stu-001': [
//     { _id: 'fb-001', fee_name: 'Class 10 Tuition', amount: 1200, paid: 1200, discount: 0, status: 'Paid', due_date: '2025-04-10' },
//     { _id: 'fb-002', fee_name: 'Annual Lab Fee', amount: 300, paid: 300, discount: 0, status: 'Paid', due_date: '2025-04-10' },
//     { _id: 'fb-003', fee_name: 'Term Bus Fee', amount: 450, paid: 200, discount: 0, status: 'Partial', due_date: '2025-04-15' },
//     { _id: 'fb-004', fee_name: 'Term Exam Fee', amount: 200, paid: 0, discount: 0, status: 'Pending', due_date: '2025-05-01' },
//   ],
//   'stu-002': [
//     { _id: 'fb-101', fee_name: 'Class 9 Tuition', amount: 1000, paid: 750, discount: 250, status: 'Partial', due_date: '2025-04-10' },
//     { _id: 'fb-102', fee_name: 'Term Bus Fee', amount: 450, paid: 450, discount: 0, status: 'Paid', due_date: '2025-04-12' },
//     { _id: 'fb-103', fee_name: 'Term Exam Fee', amount: 200, paid: 0, discount: 0, status: 'Overdue', due_date: '2025-03-15' },
//   ],
//   'stu-003': [
//     { _id: 'fb-201', fee_name: 'Class 11 Tuition', amount: 1500, paid: 1500, discount: 0, status: 'Paid', due_date: '2025-04-08' },
//     { _id: 'fb-202', fee_name: 'Hostel Rent', amount: 800, paid: 800, discount: 0, status: 'Paid', due_date: '2025-04-05' },
//     { _id: 'fb-203', fee_name: 'Mess Charges', amount: 600, paid: 300, discount: 0, status: 'Partial', due_date: '2025-04-15' },
//   ],
//   'stu-005': [
//     { _id: 'fb-301', fee_name: 'Class 11 Tuition', amount: 1500, paid: 0, discount: 0, status: 'Pending', due_date: '2025-05-01' },
//     { _id: 'fb-302', fee_name: 'Annual Lab Fee', amount: 300, paid: 300, discount: 0, status: 'Paid', due_date: '2025-04-10' },
//   ],
//   'stu-008': [
//     { _id: 'fb-401', fee_name: 'Class 10 Tuition', amount: 1200, paid: 600, discount: 0, status: 'Partial', due_date: '2025-04-10' },
//     { _id: 'fb-402', fee_name: 'Term Exam Fee', amount: 200, paid: 0, discount: 0, status: 'Overdue', due_date: '2025-03-20' },
//   ],
// }

// export function getFeeBreakdown(studentId) {
//   return feeBreakdownByStudent[studentId] || [
//     { _id: 'fb-def-1', fee_name: 'Class Tuition', amount: 1000, paid: 500, discount: 0, status: 'Partial', due_date: '2025-04-15' },
//     { _id: 'fb-def-2', fee_name: 'Term Bus Fee', amount: 450, paid: 0, discount: 0, status: 'Pending', due_date: '2025-05-01' },
//   ]
// }

// const paymentHistoryByStudent = {
//   'stu-001': [
//     { _id: 'ph-001', receipt_no: 'RCP-2025-001', date: '2025-04-10', amount: 1500, mode: 'Cash', status: 'Paid', collected_by: 'Priya Patel' },
//     { _id: 'ph-002', receipt_no: 'RCP-2025-002', date: '2025-04-12', amount: 200, mode: 'UPI', status: 'Paid', collected_by: 'Priya Patel' },
//   ],
//   'stu-002': [
//     { _id: 'ph-101', receipt_no: 'RCP-2025-010', date: '2025-04-09', amount: 750, mode: 'Card', status: 'Paid', collected_by: 'Marcus Johnson' },
//     { _id: 'ph-102', receipt_no: 'RCP-2025-011', date: '2025-04-11', amount: 450, mode: 'Cheque', status: 'Paid', collected_by: 'Marcus Johnson' },
//   ],
//   'stu-003': [
//     { _id: 'ph-201', receipt_no: 'RCP-2025-020', date: '2025-04-08', amount: 2300, mode: 'Net Banking', status: 'Paid', collected_by: 'Hannah Kim' },
//     { _id: 'ph-202', receipt_no: 'RCP-2025-021', date: '2025-04-14', amount: 300, mode: 'Cash', status: 'Paid', collected_by: 'Hannah Kim' },
//   ],
// }

// export function getPaymentHistory(studentId) {
//   return paymentHistoryByStudent[studentId] || []
// }

// export const offlinePayments = [
//   { _id: 'op-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', transaction_no: 'TXN-880123', bank: 'Chase Bank', date: '2025-04-18', amount: 1200, proof: 'chase-receipt.pdf', status: 'Pending', remarks: 'Quarterly tuition payment', createdAt: '2025-04-18T09:00:00Z' },
//   { _id: 'op-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', transaction_no: 'TXN-880456', bank: 'Bank of America', date: '2025-04-16', amount: 1000, proof: 'boa-transfer.pdf', status: 'Approved', remarks: 'Tuition fee Q1', createdAt: '2025-04-16T11:30:00Z' },
//   { _id: 'op-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', transaction_no: 'TXN-880789', bank: 'Wells Fargo', date: '2025-04-15', amount: 1500, proof: 'wf-deposit.pdf', status: 'Approved', remarks: 'Hostel + tuition', createdAt: '2025-04-15T14:00:00Z' },
//   { _id: 'op-004', student_name: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', transaction_no: 'TXN-881012', bank: 'Citibank', date: '2025-04-19', amount: 300, proof: 'citi-receipt.pdf', status: 'Pending', remarks: 'Lab fee payment', createdAt: '2025-04-19T08:45:00Z' },
//   { _id: 'op-005', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', transaction_no: 'TXN-881345', bank: 'Chase Bank', date: '2025-04-12', amount: 600, proof: 'chase-transfer.pdf', status: 'Rejected', remarks: 'Insufficient proof', createdAt: '2025-04-12T10:15:00Z' },
//   { _id: 'op-006', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class: '9-A', transaction_no: 'TXN-881678', bank: 'PNC Bank', date: '2025-04-20', amount: 450, proof: 'pnc-bus.pdf', status: 'Pending', remarks: 'Bus fee Q1', createdAt: '2025-04-20T13:20:00Z' },
//   { _id: 'op-007', student_name: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', transaction_no: 'TXN-881901', bank: 'TD Bank', date: '2025-04-17', amount: 800, proof: 'td-hostel.pdf', status: 'Approved', remarks: 'Hostel rent April', createdAt: '2025-04-17T16:00:00Z' },
// ]

// export const feePayments = [
//   { _id: 'fp-001', receipt_no: 'RCP-2025-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', session: '2025-2026', date: '2025-04-10', amount: 1500, mode: 'Cash', status: 'Paid', collected_by: 'Priya Patel' },
//   { _id: 'fp-002', receipt_no: 'RCP-2025-002', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', session: '2025-2026', date: '2025-04-12', amount: 200, mode: 'UPI', status: 'Paid', collected_by: 'Priya Patel' },
//   { _id: 'fp-003', receipt_no: 'RCP-2025-010', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', session: '2025-2026', date: '2025-04-09', amount: 750, mode: 'Card', status: 'Paid', collected_by: 'Marcus Johnson' },
//   { _id: 'fp-004', receipt_no: 'RCP-2025-011', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', session: '2025-2026', date: '2025-04-11', amount: 450, mode: 'Cheque', status: 'Paid', collected_by: 'Marcus Johnson' },
//   { _id: 'fp-005', receipt_no: 'RCP-2025-020', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', session: '2025-2026', date: '2025-04-08', amount: 2300, mode: 'Net Banking', status: 'Paid', collected_by: 'Hannah Kim' },
//   { _id: 'fp-006', receipt_no: 'RCP-2025-021', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', session: '2025-2026', date: '2025-04-14', amount: 300, mode: 'Cash', status: 'Paid', collected_by: 'Hannah Kim' },
//   { _id: 'fp-007', receipt_no: 'RCP-2025-030', student_name: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', session: '2025-2026', date: '2025-04-05', amount: 300, mode: 'Cash', status: 'Paid', collected_by: 'Diego Ramirez' },
//   { _id: 'fp-008', receipt_no: 'RCP-2025-031', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', session: '2025-2026', date: '2025-04-03', amount: 600, mode: 'Cheque', status: 'Partial', collected_by: 'Priya Patel' },
//   { _id: 'fp-009', receipt_no: 'RCP-2025-040', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class: '9-A', session: '2025-2026', date: '2025-04-01', amount: 450, mode: 'UPI', status: 'Paid', collected_by: 'Marcus Johnson' },
//   { _id: 'fp-010', receipt_no: 'RCP-2025-050', student_name: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', session: '2025-2026', date: '2025-04-06', amount: 800, mode: 'Bank Transfer', status: 'Paid', collected_by: 'Hannah Kim' },
//   { _id: 'fp-011', receipt_no: 'RCP-2025-060', student_name: 'Charlotte Brooks', admission_no: 'ADM-1014', class: '8-A', session: '2025-2026', date: '2025-04-02', amount: 900, mode: 'Cash', status: 'Paid', collected_by: 'Diego Ramirez' },
//   { _id: 'fp-012', receipt_no: 'RCP-2025-061', student_name: 'Henry Walker', admission_no: 'ADM-1013', class: 'Year-3', session: '2025-2026', date: '2025-04-04', amount: 1600, mode: 'Card', status: 'Paid', collected_by: 'Priya Patel' },
// ]

// export const dueFees = [
//   { _id: 'df-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', section: 'A', session: '2025-2026', fee_name: 'Term Bus Fee', total: 450, paid: 200, due: 250, due_date: '2025-04-15', status: 'Partial', reminder_count: 1, last_reminder: '2025-04-08' },
//   { _id: 'df-002', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', section: 'A', session: '2025-2026', fee_name: 'Term Exam Fee', total: 200, paid: 0, due: 200, due_date: '2025-05-01', status: 'Pending', reminder_count: 0, last_reminder: null },
//   { _id: 'df-003', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', section: 'B', session: '2025-2026', fee_name: 'Class 9 Tuition', total: 1000, paid: 750, due: 250, due_date: '2025-04-10', status: 'Partial', reminder_count: 2, last_reminder: '2025-04-05' },
//   { _id: 'df-004', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', section: 'B', session: '2025-2026', fee_name: 'Term Exam Fee', total: 200, paid: 0, due: 200, due_date: '2025-03-15', status: 'Overdue', reminder_count: 3, last_reminder: '2025-04-10' },
//   { _id: 'df-005', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', section: 'A', session: '2025-2026', fee_name: 'Mess Charges', total: 600, paid: 300, due: 300, due_date: '2025-04-15', status: 'Partial', reminder_count: 1, last_reminder: '2025-04-09' },
//   { _id: 'df-006', student_name: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', section: 'A', session: '2025-2026', fee_name: 'Class 11 Tuition', total: 1500, paid: 0, due: 1500, due_date: '2025-05-01', status: 'Pending', reminder_count: 0, last_reminder: null },
//   { _id: 'df-007', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', section: 'B', session: '2025-2026', fee_name: 'Class 10 Tuition', total: 1200, paid: 600, due: 600, due_date: '2025-04-10', status: 'Partial', reminder_count: 1, last_reminder: '2025-04-06' },
//   { _id: 'df-008', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', section: 'B', session: '2025-2026', fee_name: 'Term Exam Fee', total: 200, paid: 0, due: 200, due_date: '2025-03-20', status: 'Overdue', reminder_count: 2, last_reminder: '2025-04-12' },
// ]

// export const feesStats = {
//   totalCollected: 10450,
//   totalDue: 3500,
//   pendingPayments: 18,
//   overdueCount: 4,
//   todayCollected: 2300,
//   onlineCollected: 6200,
//   offlineCollected: 4250,
//   monthlyTrend: [
//     { month: 'Jan', collected: 8200, due: 2100 },
//     { month: 'Feb', collected: 9100, due: 1800 },
//     { month: 'Mar', collected: 10500, due: 2400 },
//     { month: 'Apr', collected: 10450, due: 3500 },
//     { month: 'May', collected: 9800, due: 2900 },
//     { month: 'Jun', collected: 11200, due: 2200 },
//   ],
//   modeBreakdown: [
//     { name: 'Cash', value: 3200, color: '#2563eb' },
//     { name: 'Card', value: 2400, color: '#16a34a' },
//     { name: 'UPI', value: 1850, color: '#ca8a04' },
//     { name: 'Net Banking', value: 2300, color: '#0891b2' },
//     { name: 'Cheque', value: 700, color: '#c2410c' },
//   ],
// }

// export const feesReport = [
//   { _id: 'fr-001', session: '2025-2026', class: 'Class 10', total_students: 42, total_fees: 50400, collected: 38000, due: 12400, collection_rate: 75 },
//   { _id: 'fr-002', session: '2025-2026', class: 'Class 9', total_students: 38, total_fees: 38000, collected: 31000, due: 7000, collection_rate: 82 },
//   { _id: 'fr-003', session: '2025-2026', class: 'Class 8', total_students: 45, total_fees: 40500, collected: 36900, due: 3600, collection_rate: 91 },
//   { _id: 'fr-004', session: '2025-2026', class: 'Class 11', total_students: 30, total_fees: 45000, collected: 28500, due: 16500, collection_rate: 63 },
//   { _id: 'fr-005', session: '2025-2026', class: 'Class 12', total_students: 28, total_fees: 44800, collected: 41200, due: 3600, collection_rate: 92 },
//   { _id: 'fr-006', session: '2025-2026', class: 'Year 1', total_students: 50, total_fees: 75000, collected: 52000, due: 23000, collection_rate: 69 },
// ]

// export const searchableStudents = students
//   .filter((s) => s.status === 'active')
//   .map((s) => ({
//     _id: s._id,
//     admission_no: s.admission_no,
//     name: `${s.name.first} ${s.name.last}`,
//     class: s.class,
//     section: s.section,
//     school_name: s.school_name,
//     guardian_name: s.guardian_name,
//     mobile: s.mobile,
//     email: s.email,
//     avatar: `${s.name.first[0]}${s.name.last[0]}`,
//   }))

// export const classOptions = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Year 1', 'Year 2', 'Year 3', 'All']
// export const sectionOptions = ['A', 'B', 'C']
