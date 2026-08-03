// // ─── Expenses Module Mock Data ─────────────────────────────────────────────────
// // All structures mirror the backend expensesModel.js field names.
// // INTEGRATION: delete this file once real endpoints are wired in
// // expenses.service.js. Only the service imports this file.

// // ─── Expense Heads ────────────────────────────────────────────────────────────
// export const expenseHeads = [
//   { _id: 'eh-001', expense_head_name: 'Salaries', description: 'Staff and teacher salaries', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
//   { _id: 'eh-002', expense_head_name: 'Utilities', description: 'Electricity, water, gas', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
//   { _id: 'eh-003', expense_head_name: 'Maintenance', description: 'Building and equipment repair', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
//   { _id: 'eh-004', expense_head_name: 'Transport', description: 'Fuel and vehicle maintenance', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
//   { _id: 'eh-005', expense_head_name: 'Office Supplies', description: 'Stationery and consumables', status: 'active', createdAt: '2024-06-05T00:00:00Z' },
//   { _id: 'eh-006', expense_head_name: 'Library Books', description: 'Book purchases and subscriptions', status: 'active', createdAt: '2024-06-06T00:00:00Z' },
//   { _id: 'eh-007', expense_head_name: 'Sports Equipment', description: 'Sports gear and uniforms', status: 'inactive', createdAt: '2024-06-07T00:00:00Z' },
//   { _id: 'eh-008', expense_head_name: 'Marketing', description: 'Advertising and promotions', status: 'active', createdAt: '2024-06-08T00:00:00Z' },
// ]

// // ─── Expense Records ─────────────────────────────────────────────────────────
// // `status`: active, inactive.
// export const expenses = [
//   { _id: 'exp-001', expense_head_id: 'eh-001', expense_head_name: 'Salaries', amount: 85000, date: '2024-07-01', note: 'July payroll', status: 'active', createdAt: '2024-07-01T00:00:00Z' },
//   { _id: 'exp-002', expense_head_id: 'eh-002', expense_head_name: 'Utilities', amount: 12000, date: '2024-07-05', note: 'Electricity bill July', status: 'active', createdAt: '2024-07-05T00:00:00Z' },
//   { _id: 'exp-003', expense_head_id: 'eh-003', expense_head_name: 'Maintenance', amount: 8500, date: '2024-07-10', note: 'AC repair in Block A', status: 'active', createdAt: '2024-07-10T00:00:00Z' },
//   { _id: 'exp-004', expense_head_id: 'eh-004', expense_head_name: 'Transport', amount: 15000, date: '2024-07-15', note: 'Fuel and bus maintenance', status: 'active', createdAt: '2024-07-15T00:00:00Z' },
//   { _id: 'exp-005', expense_head_id: 'eh-005', expense_head_name: 'Office Supplies', amount: 3200, date: '2024-07-18', note: 'Stationery restock', status: 'active', createdAt: '2024-07-18T00:00:00Z' },
//   { _id: 'exp-006', expense_head_id: 'eh-001', expense_head_name: 'Salaries', amount: 88000, date: '2024-08-01', note: 'August payroll', status: 'active', createdAt: '2024-08-01T00:00:00Z' },
//   { _id: 'exp-007', expense_head_id: 'eh-002', expense_head_name: 'Utilities', amount: 13500, date: '2024-08-05', note: 'Electricity bill August', status: 'active', createdAt: '2024-08-05T00:00:00Z' },
//   { _id: 'exp-008', expense_head_id: 'eh-006', expense_head_name: 'Library Books', amount: 7500, date: '2024-08-10', note: 'New reference books', status: 'active', createdAt: '2024-08-10T00:00:00Z' },
//   { _id: 'exp-009', expense_head_id: 'eh-003', expense_head_name: 'Maintenance', amount: 4200, date: '2024-08-12', note: 'Plumbing repair Block B', status: 'active', createdAt: '2024-08-12T00:00:00Z' },
//   { _id: 'exp-010', expense_head_id: 'eh-008', expense_head_name: 'Marketing', amount: 6000, date: '2024-08-15', note: 'Social media ads', status: 'inactive', createdAt: '2024-08-15T00:00:00Z' },
// ]

// // ─── Expenses Dashboard Stats ───────────────────────────────────────────────
// export const expenseStats = {
//   total_expenses: expenses.reduce((sum, e) => sum + e.amount, 0),
//   this_month: 18000,
//   total_heads: expenseHeads.length,
//   active_heads: expenseHeads.filter((h) => h.status === 'active').length,
//   total_entries: expenses.length,
// }
