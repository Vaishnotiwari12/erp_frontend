// ─── Inventory Module Mock Data ─────────────────────────────────────────────────
// All structures mirror the backend inventoryModel.js field names.
// INTEGRATION: delete this file once real endpoints are wired in
// inventory.service.js. Only the service imports this file.

// ─── Item Categories ──────────────────────────────────────────────────────────
export const itemCategories = [
  { _id: 'ic-001', category_name: 'Furniture', description: 'Chairs, desks, tables, and other furniture items', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'ic-002', category_name: 'Electronics', description: 'Projectors, computers, and electronic devices', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'ic-003', category_name: 'Sports Equipment', description: 'Balls, nets, and sports gear', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'ic-004', category_name: 'Lab Equipment', description: 'Microscopes, flasks, and lab apparatus', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'ic-005', category_name: 'Stationery', description: 'Paper, pens, markers, and office supplies', status: 'active', createdAt: '2024-06-05T00:00:00Z' },
  { _id: 'ic-006', category_name: 'Cleaning Supplies', description: 'Detergents, mops, and cleaning materials', status: 'active', createdAt: '2024-06-06T00:00:00Z' },
  { _id: 'ic-007', category_name: 'Kitchen Equipment', description: 'Utensils, cookware, and kitchen appliances', status: 'active', createdAt: '2024-06-07T00:00:00Z' },
  { _id: 'ic-008', category_name: 'Medical Supplies', description: 'First aid kits and medical consumables', status: 'inactive', createdAt: '2024-06-08T00:00:00Z' },
]

// ─── Item Stores ──────────────────────────────────────────────────────────────
export const itemStores = [
  { _id: 'is-001', store_name: 'Main Warehouse', location: 'Ground Floor, Block A', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'is-002', store_name: 'Science Lab Store', location: 'First Floor, Science Block', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'is-003', store_name: 'Sports Store', location: 'Basement, Sports Complex', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'is-004', store_name: 'Admin Store', location: 'Second Floor, Admin Block', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
]

// ─── Item Suppliers ───────────────────────────────────────────────────────────
export const itemSuppliers = [
  { _id: 'sup-001', supplier_name: 'EduSupplies Ltd', phone: '+1 555-0101', email: 'contact@edusupplies.com', address: '123 Commerce St, New York, NY 10001', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'sup-002', supplier_name: 'Tech Solutions Inc', phone: '+1 555-0102', email: 'sales@techsolutions.com', address: '456 Tech Ave, San Jose, CA 95101', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'sup-003', supplier_name: 'SportZone', phone: '+1 555-0103', email: 'orders@sportzone.com', address: '789 Athletic Blvd, Chicago, IL 60601', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'sup-004', supplier_name: 'ChemLab Supplies', phone: '+1 555-0104', email: 'info@chemlabsupplies.com', address: '321 Research Rd, Boston, MA 02101', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'sup-005', supplier_name: 'Office Depot', phone: '+1 555-0105', email: 'business@officedepot.com', address: '654 Office Park Dr, Atlanta, GA 30301', status: 'active', createdAt: '2024-06-05T00:00:00Z' },
  { _id: 'sup-006', supplier_name: 'CleanPro Services', phone: '+1 555-0106', email: 'support@cleanpro.com', address: '987 Hygiene Way, Dallas, TX 75201', status: 'inactive', createdAt: '2024-06-06T00:00:00Z' },
]

// ─── Items ───────────────────────────────────────────────────────────────────
export const items = [
  { _id: 'itm-001', item_name: 'Office Chair', category_id: 'ic-001', category_name: 'Furniture', unit: 'pcs', description: 'Ergonomic office chair with lumbar support', status: 'active', createdAt: '2024-07-01T00:00:00Z' },
  { _id: 'itm-002', item_name: 'Projector', category_id: 'ic-002', category_name: 'Electronics', unit: 'pcs', description: 'HD projector for classrooms and auditoriums', status: 'active', createdAt: '2024-07-02T00:00:00Z' },
  { _id: 'itm-003', item_name: 'Football', category_id: 'ic-003', category_name: 'Sports Equipment', unit: 'pcs', description: 'Standard size 5 football', status: 'active', createdAt: '2024-07-03T00:00:00Z' },
  { _id: 'itm-004', item_name: 'Microscope', category_id: 'ic-004', category_name: 'Lab Equipment', unit: 'pcs', description: 'Compound light microscope 1000x', status: 'active', createdAt: '2024-07-04T00:00:00Z' },
  { _id: 'itm-005', item_name: 'A4 Paper (Ream)', category_id: 'ic-005', category_name: 'Stationery', unit: 'ream', description: '500 sheets, 80 GSM white A4 paper', status: 'active', createdAt: '2024-07-05T00:00:00Z' },
  { _id: 'itm-006', item_name: 'Whiteboard Marker', category_id: 'ic-005', category_name: 'Stationery', unit: 'pcs', description: 'Dry-erase marker, assorted colors', status: 'active', createdAt: '2024-07-06T00:00:00Z' },
  { _id: 'itm-007', item_name: 'Chemistry Flask', category_id: 'ic-004', category_name: 'Lab Equipment', unit: 'pcs', description: '250ml borosilicate glass Erlenmeyer flask', status: 'active', createdAt: '2024-07-07T00:00:00Z' },
  { _id: 'itm-008', item_name: 'First Aid Kit', category_id: 'ic-008', category_name: 'Medical Supplies', unit: 'pcs', description: 'Standard wall-mounted first aid kit', status: 'active', createdAt: '2024-07-08T00:00:00Z' },
  { _id: 'itm-009', item_name: 'Student Desk', category_id: 'ic-001', category_name: 'Furniture', unit: 'pcs', description: 'Single-seater student desk with drawer', status: 'active', createdAt: '2024-07-09T00:00:00Z' },
  { _id: 'itm-010', item_name: 'Floor Cleaner', category_id: 'ic-006', category_name: 'Cleaning Supplies', unit: 'litr', description: '5-liter concentrated floor cleaning solution', status: 'active', createdAt: '2024-07-10T00:00:00Z' },
  { _id: 'itm-011', item_name: 'Cooking Pot', category_id: 'ic-007', category_name: 'Kitchen Equipment', unit: 'pcs', description: '20-liter stainless steel cooking pot', status: 'active', createdAt: '2024-07-11T00:00:00Z' },
  { _id: 'itm-012', item_name: 'Basketball', category_id: 'ic-003', category_name: 'Sports Equipment', unit: 'pcs', description: 'Official size 7 indoor/outdoor basketball', status: 'active', createdAt: '2024-07-12T00:00:00Z' },
]

// ─── Item Stock ───────────────────────────────────────────────────────────────
// Includes some entries with low quantity (< 10) for the low-stock indicator.
export const itemStocks = [
  { _id: 'stk-001', item_id: 'itm-001', item_name: 'Office Chair', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-001', supplier_name: 'EduSupplies Ltd', quantity: 45, unit_price: 85, total_value: 3825, date: '2024-08-01', invoice_number: 'INV-2024-001', status: 'active', createdAt: '2024-08-01T00:00:00Z' },
  { _id: 'stk-002', item_id: 'itm-002', item_name: 'Projector', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-002', supplier_name: 'Tech Solutions Inc', quantity: 8, unit_price: 450, total_value: 3600, date: '2024-08-02', invoice_number: 'INV-2024-002', status: 'active', createdAt: '2024-08-02T00:00:00Z' },
  { _id: 'stk-003', item_id: 'itm-003', item_name: 'Football', store_id: 'is-003', store_name: 'Sports Store', supplier_id: 'sup-003', supplier_name: 'SportZone', quantity: 30, unit_price: 25, total_value: 750, date: '2024-08-03', invoice_number: 'INV-2024-003', status: 'active', createdAt: '2024-08-03T00:00:00Z' },
  { _id: 'stk-004', item_id: 'itm-004', item_name: 'Microscope', store_id: 'is-002', store_name: 'Science Lab Store', supplier_id: 'sup-004', supplier_name: 'ChemLab Supplies', quantity: 5, unit_price: 320, total_value: 1600, date: '2024-08-04', invoice_number: 'INV-2024-004', status: 'active', createdAt: '2024-08-04T00:00:00Z' },
  { _id: 'stk-005', item_id: 'itm-005', item_name: 'A4 Paper (Ream)', store_id: 'is-004', store_name: 'Admin Store', supplier_id: 'sup-005', supplier_name: 'Office Depot', quantity: 120, unit_price: 6, total_value: 720, date: '2024-08-05', invoice_number: 'INV-2024-005', status: 'active', createdAt: '2024-08-05T00:00:00Z' },
  { _id: 'stk-006', item_id: 'itm-006', item_name: 'Whiteboard Marker', store_id: 'is-004', store_name: 'Admin Store', supplier_id: 'sup-005', supplier_name: 'Office Depot', quantity: 200, unit_price: 2, total_value: 400, date: '2024-08-06', invoice_number: 'INV-2024-006', status: 'active', createdAt: '2024-08-06T00:00:00Z' },
  { _id: 'stk-007', item_id: 'itm-007', item_name: 'Chemistry Flask', store_id: 'is-002', store_name: 'Science Lab Store', supplier_id: 'sup-004', supplier_name: 'ChemLab Supplies', quantity: 60, unit_price: 12, total_value: 720, date: '2024-08-07', invoice_number: 'INV-2024-007', status: 'active', createdAt: '2024-08-07T00:00:00Z' },
  { _id: 'stk-008', item_id: 'itm-008', item_name: 'First Aid Kit', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-001', supplier_name: 'EduSupplies Ltd', quantity: 7, unit_price: 45, total_value: 315, date: '2024-08-08', invoice_number: 'INV-2024-008', status: 'active', createdAt: '2024-08-08T00:00:00Z' },
  { _id: 'stk-009', item_id: 'itm-009', item_name: 'Student Desk', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-001', supplier_name: 'EduSupplies Ltd', quantity: 80, unit_price: 110, total_value: 8800, date: '2024-08-09', invoice_number: 'INV-2024-009', status: 'active', createdAt: '2024-08-09T00:00:00Z' },
  { _id: 'stk-010', item_id: 'itm-010', item_name: 'Floor Cleaner', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-006', supplier_name: 'CleanPro Services', quantity: 35, unit_price: 8, total_value: 280, date: '2024-08-10', invoice_number: 'INV-2024-010', status: 'active', createdAt: '2024-08-10T00:00:00Z' },
  { _id: 'stk-011', item_id: 'itm-011', item_name: 'Cooking Pot', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-001', supplier_name: 'EduSupplies Ltd', quantity: 12, unit_price: 65, total_value: 780, date: '2024-08-11', invoice_number: 'INV-2024-011', status: 'active', createdAt: '2024-08-11T00:00:00Z' },
  { _id: 'stk-012', item_id: 'itm-012', item_name: 'Basketball', store_id: 'is-003', store_name: 'Sports Store', supplier_id: 'sup-003', supplier_name: 'SportZone', quantity: 3, unit_price: 35, total_value: 105, date: '2024-08-12', invoice_number: 'INV-2024-012', status: 'active', createdAt: '2024-08-12T00:00:00Z' },
  { _id: 'stk-013', item_id: 'itm-005', item_name: 'A4 Paper (Ream)', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-005', supplier_name: 'Office Depot', quantity: 50, unit_price: 6, total_value: 300, date: '2024-08-13', invoice_number: 'INV-2024-013', status: 'active', createdAt: '2024-08-13T00:00:00Z' },
  { _id: 'stk-014', item_id: 'itm-006', item_name: 'Whiteboard Marker', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-005', supplier_name: 'Office Depot', quantity: 9, unit_price: 2, total_value: 18, date: '2024-08-14', invoice_number: 'INV-2024-014', status: 'active', createdAt: '2024-08-14T00:00:00Z' },
  { _id: 'stk-015', item_id: 'itm-003', item_name: 'Football', store_id: 'is-001', store_name: 'Main Warehouse', supplier_id: 'sup-003', supplier_name: 'SportZone', quantity: 15, unit_price: 25, total_value: 375, date: '2024-08-15', invoice_number: 'INV-2024-015', status: 'active', createdAt: '2024-08-15T00:00:00Z' },
]

// ─── Issue Items ──────────────────────────────────────────────────────────────
// `issued_to_type`: student | staff. `status`: issued | returned.
export const issueItems = [
  { _id: 'iss-001', item_id: 'itm-001', item_name: 'Office Chair', issued_to_type: 'staff', issued_to_name: 'Mr. Robert Smith', quantity: 2, issue_date: '2024-09-01', return_date: null, status: 'issued', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'iss-002', item_id: 'itm-002', item_name: 'Projector', issued_to_type: 'staff', issued_to_name: 'Ms. Sarah Johnson', quantity: 1, issue_date: '2024-09-02', return_date: '2024-09-10', status: 'returned', createdAt: '2024-09-02T00:00:00Z' },
  { _id: 'iss-003', item_id: 'itm-003', item_name: 'Football', issued_to_type: 'student', issued_to_name: 'Aarav Sharma', quantity: 1, issue_date: '2024-09-03', return_date: null, status: 'issued', createdAt: '2024-09-03T00:00:00Z' },
  { _id: 'iss-004', item_id: 'itm-005', item_name: 'A4 Paper (Ream)', issued_to_type: 'staff', issued_to_name: 'Mrs. Linda Brown', quantity: 5, issue_date: '2024-09-04', return_date: null, status: 'issued', createdAt: '2024-09-04T00:00:00Z' },
  { _id: 'iss-005', item_id: 'itm-006', item_name: 'Whiteboard Marker', issued_to_type: 'staff', issued_to_name: 'Mr. David Wilson', quantity: 10, issue_date: '2024-09-05', return_date: '2024-09-15', status: 'returned', createdAt: '2024-09-05T00:00:00Z' },
  { _id: 'iss-006', item_id: 'itm-012', item_name: 'Basketball', issued_to_type: 'student', issued_to_name: 'Emma Wilson', quantity: 1, issue_date: '2024-09-06', return_date: null, status: 'issued', createdAt: '2024-09-06T00:00:00Z' },
  { _id: 'iss-007', item_id: 'itm-004', item_name: 'Microscope', issued_to_type: 'staff', issued_to_name: 'Dr. Michael Lee', quantity: 2, issue_date: '2024-09-07', return_date: null, status: 'issued', createdAt: '2024-09-07T00:00:00Z' },
  { _id: 'iss-008', item_id: 'itm-008', item_name: 'First Aid Kit', issued_to_type: 'staff', issued_to_name: 'Nurse Patricia Adams', quantity: 1, issue_date: '2024-09-08', return_date: '2024-09-20', status: 'returned', createdAt: '2024-09-08T00:00:00Z' },
  { _id: 'iss-009', item_id: 'itm-009', item_name: 'Student Desk', issued_to_type: 'student', issued_to_name: 'Liam Chen', quantity: 1, issue_date: '2024-09-09', return_date: null, status: 'issued', createdAt: '2024-09-09T00:00:00Z' },
  { _id: 'iss-010', item_id: 'itm-007', item_name: 'Chemistry Flask', issued_to_type: 'student', issued_to_name: 'Noah Brown', quantity: 5, issue_date: '2024-09-10', return_date: null, status: 'issued', createdAt: '2024-09-10T00:00:00Z' },
]

// ─── Inventory Dashboard Stats ──────────────────────────────────────────────
export const inventoryStats = {
  total_items: items.length,
  total_categories: itemCategories.length,
  total_stores: itemStores.length,
  total_suppliers: itemSuppliers.length,
  total_stock_value: itemStocks.reduce((sum, s) => sum + s.total_value, 0),
  low_stock_items: itemStocks.filter((s) => s.quantity < 10).length,
  issued_items: issueItems.filter((i) => i.status === 'issued').length,
  total_issues: issueItems.length,
}
