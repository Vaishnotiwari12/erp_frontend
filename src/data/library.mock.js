// // ─── Library Module Mock Data ────────────────────────────────────────────────
// // All structures mirror the backend libraryModel.js field names.
// // INTEGRATION: delete this file once real endpoints are wired in
// // library.service.js. Only the service imports this file, so swapping
// // mock for real API calls touches only the service.

// // ─── Book Categories ──────────────────────────────────────────────────────────
// export const bookCategories = [
//   { _id: 'cat-001', name: 'Fiction', status: 'active' },
//   { _id: 'cat-002', name: 'Science', status: 'active' },
//   { _id: 'cat-003', name: 'History', status: 'active' },
//   { _id: 'cat-004', name: 'Mathematics', status: 'active' },
//   { _id: 'cat-005', name: 'Literature', status: 'active' },
//   { _id: 'cat-006', name: 'Reference', status: 'active' },
//   { _id: 'cat-007', name: 'Biography', status: 'active' },
//   { _id: 'cat-008', name: 'Technology', status: 'active' },
// ]

// // ─── Books ────────────────────────────────────────────────────────────────────
// // `quantity` is total copies owned; `available` decrements when issued.
// export const books = [
//   { _id: 'bk-001', title: 'To Kill a Mockingbird', author: 'Harper Lee', publisher: 'J.B. Lippincott', isbn: '978-0-06-112008-4', edition: '1st', rack: 'A-12', category: 'Fiction', quantity: 5, available: 3, cover_url: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-15T00:00:00Z' },
//   { _id: 'bk-002', title: 'A Brief History of Time', author: 'Stephen Hawking', publisher: 'Bantam Books', isbn: '978-0-553-38016-3', edition: '2nd', rack: 'B-04', category: 'Science', quantity: 4, available: 4, cover_url: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-16T00:00:00Z' },
//   { _id: 'bk-003', title: 'The Art of War', author: 'Sun Tzu', publisher: 'Penguin Classics', isbn: '978-0-14-310575-6', edition: 'Reissue', rack: 'C-08', category: 'History', quantity: 3, available: 1, cover_url: 'https://images.pexels.com/photos/1038922/pexels-photo-1038922.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-17T00:00:00Z' },
//   { _id: 'bk-004', title: 'Calculus Made Easy', author: 'Silvanus Thompson', publisher: 'St. Martin\'s Press', isbn: '978-0-312-18548-0', edition: '3rd', rack: 'D-15', category: 'Mathematics', quantity: 6, available: 6, cover_url: 'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-18T00:00:00Z' },
//   { _id: 'bk-005', title: 'Pride and Prejudice', author: 'Jane Austen', publisher: 'Penguin Classics', isbn: '978-0-14-143951-8', edition: 'Reissue', rack: 'A-05', category: 'Literature', quantity: 4, available: 2, cover_url: 'https://images.pexels.com/photos/268415/pexels-photo-268415.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-19T00:00:00Z' },
//   { _id: 'bk-006', title: 'The Selfish Gene', author: 'Richard Dawkins', publisher: 'Oxford University Press', isbn: '978-0-19-857749-1', edition: '4th', rack: 'B-09', category: 'Science', quantity: 3, available: 0, cover_url: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-20T00:00:00Z' },
//   { _id: 'bk-007', title: 'Steve Jobs', author: 'Walter Isaacson', publisher: 'Simon & Schuster', isbn: '978-1-4516-4853-9', edition: '1st', rack: 'E-02', category: 'Biography', quantity: 5, available: 4, cover_url: 'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-21T00:00:00Z' },
//   { _id: 'bk-008', title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', isbn: '978-0-13-235088-4', edition: '1st', rack: 'F-10', category: 'Technology', quantity: 4, available: 2, cover_url: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-22T00:00:00Z' },
//   { _id: 'bk-009', title: 'The Wright Brothers', author: 'David McCullough', publisher: 'Simon & Schuster', isbn: '978-1-4767-2811-7', edition: '1st', rack: 'E-06', category: 'Biography', quantity: 3, available: 3, cover_url: 'https://images.pexels.com/photos/212824/pexels-photo-212824.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-23T00:00:00Z' },
//   { _id: 'bk-010', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', publisher: 'Harper', isbn: '978-0-06-231609-7', edition: '1st', rack: 'C-01', category: 'History', quantity: 5, available: 1, cover_url: 'https://images.pexels.com/photos/212824/pexels-photo-212824.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-24T00:00:00Z' },
//   { _id: 'bk-011', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publisher: 'Scribner', isbn: '978-0-7432-7356-5', edition: 'Reissue', rack: 'A-08', category: 'Fiction', quantity: 4, available: 4, cover_url: 'https://images.pexels.com/photos/268415/pexels-photo-268415.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-25T00:00:00Z' },
//   { _id: 'bk-012', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', publisher: 'MIT Press', isbn: '978-0-262-03384-8', edition: '4th', rack: 'F-01', category: 'Technology', quantity: 3, available: 0, cover_url: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=200', status: 'active', createdAt: '2024-01-26T00:00:00Z' },
// ]

// // ─── Issue / Return Records ───────────────────────────────────────────────────
// // `member_type` distinguishes students from staff — both can borrow books.
// // `status` is derived: issued, returned, or overdue (past due_date with no return).
// export const issueRecords = [
//   { _id: 'iss-001', book_id: 'bk-001', book_title: 'To Kill a Mockingbird', book_isbn: '978-0-06-112008-4', member_id: 'stu-001', member_name: 'Aarav Sharma', member_type: 'student', issue_date: '2025-04-01', due_date: '2025-04-15', return_date: null, fine: 0, status: 'issued', issued_by: 'Priya Patel' },
//   { _id: 'iss-002', book_id: 'bk-003', book_title: 'The Art of War', book_isbn: '978-0-14-310575-6', member_id: 'stu-002', member_name: 'Emma Wilson', member_type: 'student', issue_date: '2025-03-20', due_date: '2025-04-03', return_date: '2025-04-02', fine: 0, status: 'returned', issued_by: 'Priya Patel' },
//   { _id: 'iss-003', book_id: 'bk-006', book_title: 'The Selfish Gene', book_isbn: '978-0-19-857749-1', member_id: 'stu-003', member_name: 'Liam Chen', member_type: 'student', issue_date: '2025-04-05', due_date: '2025-04-19', return_date: null, fine: 0, status: 'overdue', issued_by: 'Marcus Johnson' },
//   { _id: 'iss-004', book_id: 'bk-008', book_title: 'Clean Code', book_isbn: '978-0-13-235088-4', member_id: 'tch-001', member_name: 'Hannah Kim', member_type: 'staff', issue_date: '2025-04-10', due_date: '2025-04-24', return_date: null, fine: 0, status: 'issued', issued_by: 'Priya Patel' },
//   { _id: 'iss-005', book_id: 'bk-001', book_title: 'To Kill a Mockingbird', book_isbn: '978-0-06-112008-4', member_id: 'stu-005', member_name: 'Noah Brown', member_type: 'student', issue_date: '2025-04-12', due_date: '2025-04-26', return_date: null, fine: 0, status: 'issued', issued_by: 'Marcus Johnson' },
//   { _id: 'iss-006', book_id: 'bk-010', book_title: 'Sapiens: A Brief History of Humankind', book_isbn: '978-0-06-231609-7', member_id: 'stu-007', member_name: 'Ethan Lee', member_type: 'student', issue_date: '2025-03-28', due_date: '2025-04-11', return_date: '2025-04-14', fine: 6, status: 'returned', issued_by: 'Priya Patel' },
//   { _id: 'iss-007', book_id: 'bk-005', book_title: 'Pride and Prejudice', book_isbn: '978-0-14-143951-8', member_id: 'stu-008', member_name: 'Ava Martinez', member_type: 'student', issue_date: '2025-04-15', due_date: '2025-04-29', return_date: null, fine: 0, status: 'issued', issued_by: 'Priya Patel' },
//   { _id: 'iss-008', book_id: 'bk-012', book_title: 'Introduction to Algorithms', book_isbn: '978-0-262-03384-8', member_id: 'tch-005', member_name: 'Yuki Tanaka', member_type: 'staff', issue_date: '2025-04-08', due_date: '2025-04-22', return_date: null, fine: 0, status: 'overdue', issued_by: 'Marcus Johnson' },
//   { _id: 'iss-009', book_id: 'bk-008', book_title: 'Clean Code', book_isbn: '978-0-13-235088-4', member_id: 'stu-009', member_name: 'Lucas Anderson', member_type: 'student', issue_date: '2025-04-18', due_date: '2025-05-02', return_date: null, fine: 0, status: 'issued', issued_by: 'Priya Patel' },
//   { _id: 'iss-010', book_id: 'bk-003', book_title: 'The Art of War', book_isbn: '978-0-14-310575-6', member_id: 'stu-010', member_name: 'Mia Thompson', member_type: 'student', issue_date: '2025-03-15', due_date: '2025-03-29', return_date: '2025-03-28', fine: 0, status: 'returned', issued_by: 'Marcus Johnson' },
// ]

// // ─── Library Staff Members ────────────────────────────────────────────────────
// // Staff assigned library permissions — references HR module staff.
// export const libraryStaff = [
//   { _id: 'lst-001', staff_id: 'tch-001', name: 'Hannah Kim', email: 'hannah@lincoln.edu', department: 'Mathematics', permissions: ['issue_books', 'return_books', 'manage_books'], status: 'active', assigned_at: '2024-01-15T00:00:00Z' },
//   { _id: 'lst-002', staff_id: 'tch-002', name: 'Marcus Johnson', email: 'marcus@lincoln.edu', department: 'English', permissions: ['issue_books', 'return_books'], status: 'active', assigned_at: '2024-01-16T00:00:00Z' },
//   { _id: 'lst-003', staff_id: 'tch-003', name: 'Priya Patel', email: 'priya@riverside.edu', department: 'Science', permissions: ['issue_books', 'return_books', 'manage_books', 'manage_staff'], status: 'active', assigned_at: '2024-01-17T00:00:00Z' },
//   { _id: 'lst-004', staff_id: 'tch-004', name: 'Diego Ramirez', email: 'diego@oakridge.edu', department: 'History', permissions: ['issue_books'], status: 'inactive', assigned_at: '2024-01-18T00:00:00Z' },
//   { _id: 'lst-005', staff_id: 'tch-005', name: 'Yuki Tanaka', email: 'yuki@greenwood.edu', department: 'Computer Science', permissions: ['issue_books', 'return_books', 'manage_books'], status: 'active', assigned_at: '2024-01-19T00:00:00Z' },
// ]

// // ─── Library Dashboard Stats ──────────────────────────────────────────────────
// export const libraryStats = {
//   total_books: books.reduce((sum, b) => sum + b.quantity, 0),
//   total_titles: books.length,
//   available_books: books.reduce((sum, b) => sum + b.available, 0),
//   issued_books: issueRecords.filter((r) => r.status === 'issued' || r.status === 'overdue').length,
//   overdue_books: issueRecords.filter((r) => r.status === 'overdue').length,
//   total_staff: libraryStaff.filter((s) => s.status === 'active').length,
// }
