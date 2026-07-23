// ─── Income Module Mock Data ──────────────────────────────────────────────────
// All structures mirror the backend incomeModel.js field names.
// INTEGRATION: delete this file once real endpoints are wired in
// income.service.js. Only the service imports this file.

// ─── Income Heads ─────────────────────────────────────────────────────────────
export const incomeHeads = [
  { _id: 'ih-001', income_head_name: 'Tuition Fees', description: 'Primary tuition income', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'ih-002', income_head_name: 'Admission Fees', description: 'One-time admission charges', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'ih-003', income_head_name: 'Examination Fees', description: 'Exam registration charges', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'ih-004', income_head_name: 'Transport Fees', description: 'Bus and transport income', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'ih-005', income_head_name: 'Library Fines', description: 'Late return fines', status: 'inactive', createdAt: '2024-06-05T00:00:00Z' },
  { _id: 'ih-006', income_head_name: 'Hostel Fees', description: 'Boarding and lodging', status: 'active', createdAt: '2024-06-06T00:00:00Z' },
  { _id: 'ih-007', income_head_name: 'Donations', description: 'External donations and grants', status: 'active', createdAt: '2024-06-07T00:00:00Z' },
  { _id: 'ih-008', income_head_name: 'Sports Fees', description: 'Sports and activity charges', status: 'inactive', createdAt: '2024-06-08T00:00:00Z' },
]

// ─── Income Records ──────────────────────────────────────────────────────────
// `status`: active, inactive.
export const incomes = [
  { _id: 'inc-001', income_head_id: 'ih-001', income_head_name: 'Tuition Fees', amount: 45000, date: '2024-07-05', note: 'Q1 tuition collection', status: 'active', createdAt: '2024-07-05T00:00:00Z' },
  { _id: 'inc-002', income_head_id: 'ih-002', income_head_name: 'Admission Fees', amount: 12000, date: '2024-07-10', note: 'New admissions July batch', status: 'active', createdAt: '2024-07-10T00:00:00Z' },
  { _id: 'inc-003', income_head_id: 'ih-003', income_head_name: 'Examination Fees', amount: 8500, date: '2024-07-15', note: 'Mid-term exam fees', status: 'active', createdAt: '2024-07-15T00:00:00Z' },
  { _id: 'inc-004', income_head_id: 'ih-004', income_head_name: 'Transport Fees', amount: 18000, date: '2024-07-20', note: 'Monthly transport collection', status: 'active', createdAt: '2024-07-20T00:00:00Z' },
  { _id: 'inc-005', income_head_id: 'ih-006', income_head_name: 'Hostel Fees', amount: 32000, date: '2024-08-01', note: 'Hostel quarterly fees', status: 'active', createdAt: '2024-08-01T00:00:00Z' },
  { _id: 'inc-006', income_head_id: 'ih-007', income_head_name: 'Donations', amount: 50000, date: '2024-08-05', note: 'Alumni donation drive', status: 'active', createdAt: '2024-08-05T00:00:00Z' },
  { _id: 'inc-007', income_head_id: 'ih-001', income_head_name: 'Tuition Fees', amount: 48000, date: '2024-08-10', note: 'Q2 tuition collection', status: 'active', createdAt: '2024-08-10T00:00:00Z' },
  { _id: 'inc-008', income_head_id: 'ih-002', income_head_name: 'Admission Fees', amount: 9000, date: '2024-08-15', note: 'Late admission charges', status: 'inactive', createdAt: '2024-08-15T00:00:00Z' },
  { _id: 'inc-009', income_head_id: 'ih-004', income_head_name: 'Transport Fees', amount: 16500, date: '2024-08-20', note: 'August transport', status: 'active', createdAt: '2024-08-20T00:00:00Z' },
  { _id: 'inc-010', income_head_id: 'ih-003', income_head_name: 'Examination Fees', amount: 7200, date: '2024-09-01', note: 'Final exam registration', status: 'active', createdAt: '2024-09-01T00:00:00Z' },
]

// ─── Income Dashboard Stats ──────────────────────────────────────────────────
export const incomeStats = {
  total_income: incomes.reduce((sum, i) => sum + i.amount, 0),
  this_month: 24000,
  total_heads: incomeHeads.length,
  active_heads: incomeHeads.filter((h) => h.status === 'active').length,
  total_entries: incomes.length,
}
