// ─── Online Exam Module Mock Data ────────────────────────────────────────────
// All structures mirror the backend onlineExamModel.js field names.
// INTEGRATION: delete this file once real endpoints are wired in
// onlineExam.service.js. Only the service imports this file.

// ─── Exam Categories ──────────────────────────────────────────────────────────
// `status`: active, inactive.
export const examCategories = [
  { _id: 'ec-001', category_name: 'Mid Term', description: 'Mid-term examinations held halfway through the term', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'ec-002', category_name: 'Final Exam', description: 'End-of-term final examinations covering full syllabus', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'ec-003', category_name: 'Unit Test', description: 'Short tests on individual units of the syllabus', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'ec-004', category_name: 'Practice Test', description: 'Practice tests for student self-assessment', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'ec-005', category_name: 'Mock Exam', description: 'Mock exams simulating the final exam environment', status: 'inactive', createdAt: '2024-06-05T00:00:00Z' },
]

// ─── Online Exams ─────────────────────────────────────────────────────────────
// `status`: scheduled, active, completed, cancelled.
export const onlineExams = [
  { _id: 'oe-001', exam_name: 'Class 10 Math Mid Term', class_id: 'cls-003', class_name: 'Class 10', subject_id: 'sub-001', subject_name: 'Mathematics', category_id: 'ec-001', category_name: 'Mid Term', duration: 90, total_marks: 100, pass_marks: 40, scheduled_at: '2025-03-15T10:00:00Z', status: 'scheduled', created_by: 'tch-001', createdAt: '2025-02-01T00:00:00Z' },
  { _id: 'oe-002', exam_name: 'Class 9 Physics Unit Test', class_id: 'cls-002', class_name: 'Class 9', subject_id: 'sub-002', subject_name: 'Physics', category_id: 'ec-003', category_name: 'Unit Test', duration: 45, total_marks: 50, pass_marks: 20, scheduled_at: '2025-03-10T09:00:00Z', status: 'completed', created_by: 'tch-003', createdAt: '2025-01-25T00:00:00Z' },
  { _id: 'oe-003', exam_name: 'Class 11 CS Final', class_id: 'cls-004', class_name: 'Class 11', subject_id: 'sub-008', subject_name: 'Computer Science', category_id: 'ec-002', category_name: 'Final Exam', duration: 120, total_marks: 100, pass_marks: 40, scheduled_at: '2025-03-20T14:00:00Z', status: 'active', created_by: 'tch-005', createdAt: '2025-02-05T00:00:00Z' },
  { _id: 'oe-004', exam_name: 'Class 12 Physics Mock', class_id: 'cls-005', class_name: 'Class 12', subject_id: 'sub-002', subject_name: 'Physics', category_id: 'ec-005', category_name: 'Mock Exam', duration: 120, total_marks: 100, pass_marks: 40, scheduled_at: '2025-02-28T11:00:00Z', status: 'completed', created_by: 'tch-003', createdAt: '2025-01-20T00:00:00Z' },
  { _id: 'oe-005', exam_name: 'Class 10 English Practice', class_id: 'cls-003', class_name: 'Class 10', subject_id: 'sub-005', subject_name: 'English', category_id: 'ec-004', category_name: 'Practice Test', duration: 60, total_marks: 50, pass_marks: 20, scheduled_at: '2025-03-18T10:00:00Z', status: 'scheduled', created_by: 'tch-002', createdAt: '2025-02-10T00:00:00Z' },
  { _id: 'oe-006', exam_name: 'Class 9 Math Unit Test', class_id: 'cls-002', class_name: 'Class 9', subject_id: 'sub-001', subject_name: 'Mathematics', category_id: 'ec-003', category_name: 'Unit Test', duration: 30, total_marks: 25, pass_marks: 10, scheduled_at: '2025-03-12T09:00:00Z', status: 'active', created_by: 'tch-001', createdAt: '2025-02-08T00:00:00Z' },
  { _id: 'oe-007', exam_name: 'Class 11 Physics Mid Term', class_id: 'cls-004', class_name: 'Class 11', subject_id: 'sub-002', subject_name: 'Physics', category_id: 'ec-001', category_name: 'Mid Term', duration: 90, total_marks: 80, pass_marks: 32, scheduled_at: '2025-03-22T10:00:00Z', status: 'scheduled', created_by: 'tch-003', createdAt: '2025-02-12T00:00:00Z' },
  { _id: 'oe-008', exam_name: 'Class 10 CS Practice', class_id: 'cls-003', class_name: 'Class 10', subject_id: 'sub-008', subject_name: 'Computer Science', category_id: 'ec-004', category_name: 'Practice Test', duration: 45, total_marks: 40, pass_marks: 16, scheduled_at: '2025-02-25T14:00:00Z', status: 'cancelled', created_by: 'tch-005', createdAt: '2025-01-30T00:00:00Z' },
]

// ─── Question Bank ─────────────────────────────────────────────────────────────
// `correct_answer`: a, b, c, d.
// `status`: active, inactive.
export const questionBank = [
  { _id: 'q-001', exam_id: 'oe-001', exam_name: 'Class 10 Math Mid Term', question: 'What is the value of 7 × 8?', option_a: '54', option_b: '56', option_c: '58', option_d: '64', correct_answer: 'b', marks: 1, status: 'active', createdAt: '2025-02-02T00:00:00Z' },
  { _id: 'q-002', exam_id: 'oe-001', exam_name: 'Class 10 Math Mid Term', question: 'Solve for x: 2x + 5 = 15', option_a: 'x = 3', option_b: 'x = 4', option_c: 'x = 5', option_d: 'x = 6', correct_answer: 'c', marks: 2, status: 'active', createdAt: '2025-02-02T00:00:00Z' },
  { _id: 'q-003', exam_id: 'oe-001', exam_name: 'Class 10 Math Mid Term', question: 'What is the area of a circle with radius 7? (Use π = 22/7)', option_a: '154 sq units', option_b: '144 sq units', option_c: '164 sq units', option_d: '174 sq units', correct_answer: 'a', marks: 2, status: 'active', createdAt: '2025-02-03T00:00:00Z' },
  { _id: 'q-004', exam_id: 'oe-002', exam_name: 'Class 9 Physics Unit Test', question: 'The SI unit of force is?', option_a: 'Joule', option_b: 'Watt', option_c: 'Newton', option_d: 'Pascal', correct_answer: 'c', marks: 1, status: 'active', createdAt: '2025-01-26T00:00:00Z' },
  { _id: 'q-005', exam_id: 'oe-002', exam_name: 'Class 9 Physics Unit Test', question: 'Which of the following is a scalar quantity?', option_a: 'Velocity', option_b: 'Displacement', option_c: 'Acceleration', option_d: 'Speed', correct_answer: 'd', marks: 1, status: 'active', createdAt: '2025-01-26T00:00:00Z' },
  { _id: 'q-006', exam_id: 'oe-002', exam_name: 'Class 9 Physics Unit Test', question: 'Newton’s first law of motion is also known as the law of?', option_a: 'Inertia', option_b: 'Conservation', option_c: 'Action-Reaction', option_d: 'Gravitation', correct_answer: 'a', marks: 2, status: 'active', createdAt: '2025-01-27T00:00:00Z' },
  { _id: 'q-007', exam_id: 'oe-003', exam_name: 'Class 11 CS Final', question: 'Which data structure uses LIFO (Last In, First Out) order?', option_a: 'Queue', option_b: 'Stack', option_c: 'Linked List', option_d: 'Tree', correct_answer: 'b', marks: 1, status: 'active', createdAt: '2025-02-06T00:00:00Z' },
  { _id: 'q-008', exam_id: 'oe-003', exam_name: 'Class 11 CS Final', question: 'What is the time complexity of binary search?', option_a: 'O(n)', option_b: 'O(n log n)', option_c: 'O(log n)', option_d: 'O(1)', correct_answer: 'c', marks: 2, status: 'active', createdAt: '2025-02-06T00:00:00Z' },
  { _id: 'q-009', exam_id: 'oe-003', exam_name: 'Class 11 CS Final', question: 'Which keyword is used to define a constant in JavaScript?', option_a: 'let', option_b: 'var', option_c: 'const', option_d: 'static', correct_answer: 'c', marks: 1, status: 'active', createdAt: '2025-02-07T00:00:00Z' },
  { _id: 'q-010', exam_id: 'oe-004', exam_name: 'Class 12 Physics Mock', question: 'The speed of light in vacuum is approximately?', option_a: '3 × 10⁸ m/s', option_b: '3 × 10⁶ m/s', option_c: '3 × 10¹⁰ m/s', option_d: '3 × 10⁵ m/s', correct_answer: 'a', marks: 1, status: 'active', createdAt: '2025-01-21T00:00:00Z' },
  { _id: 'q-011', exam_id: 'oe-004', exam_name: 'Class 12 Physics Mock', question: 'Which phenomenon explains the bending of light around obstacles?', option_a: 'Reflection', option_b: 'Refraction', option_c: 'Diffraction', option_d: 'Polarization', correct_answer: 'c', marks: 2, status: 'active', createdAt: '2025-01-21T00:00:00Z' },
  { _id: 'q-012', exam_id: 'oe-005', exam_name: 'Class 10 English Practice', question: 'Choose the correct synonym for "Happy".', option_a: 'Sad', option_b: 'Joyful', option_c: 'Angry', option_d: 'Tired', correct_answer: 'b', marks: 1, status: 'active', createdAt: '2025-02-11T00:00:00Z' },
  { _id: 'q-013', exam_id: 'oe-005', exam_name: 'Class 10 English Practice', question: 'Identify the noun in: "The cat sat on the mat."', option_a: 'sat', option_b: 'on', option_c: 'cat', option_d: 'the', correct_answer: 'c', marks: 1, status: 'active', createdAt: '2025-02-11T00:00:00Z' },
  { _id: 'q-014', exam_id: 'oe-006', exam_name: 'Class 9 Math Unit Test', question: 'What is the square root of 144?', option_a: '10', option_b: '11', option_c: '12', option_d: '13', correct_answer: 'c', marks: 1, status: 'active', createdAt: '2025-02-09T00:00:00Z' },
  { _id: 'q-015', exam_id: 'oe-006', exam_name: 'Class 9 Math Unit Test', question: 'Simplify: 3(2x − 4) − 2x', option_a: '4x − 12', option_b: '4x − 4', option_c: '8x − 12', option_d: '8x − 4', correct_answer: 'a', marks: 2, status: 'active', createdAt: '2025-02-09T00:00:00Z' },
  { _id: 'q-016', exam_id: 'oe-007', exam_name: 'Class 11 Physics Mid Term', question: 'The unit of electric current is?', option_a: 'Volt', option_b: 'Ampere', option_c: 'Ohm', option_d: 'Coulomb', correct_answer: 'b', marks: 1, status: 'active', createdAt: '2025-02-13T00:00:00Z' },
  { _id: 'q-017', exam_id: 'oe-007', exam_name: 'Class 11 Physics Mid Term', question: 'Which law relates voltage, current, and resistance?', option_a: "Newton's Law", option_b: "Ohm's Law", option_c: "Kirchhoff's Law", option_d: "Faraday's Law", correct_answer: 'b', marks: 2, status: 'active', createdAt: '2025-02-13T00:00:00Z' },
  { _id: 'q-018', exam_id: 'oe-008', exam_name: 'Class 10 CS Practice', question: 'Which of these is a programming language?', option_a: 'HTTP', option_b: 'Python', option_c: 'HTML', option_d: 'TCP', correct_answer: 'b', marks: 1, status: 'inactive', createdAt: '2025-01-31T00:00:00Z' },
  { _id: 'q-019', exam_id: 'oe-003', exam_name: 'Class 11 CS Final', question: 'What does "CPU" stand for?', option_a: 'Central Processing Unit', option_b: 'Computer Personal Unit', option_c: 'Central Process Utility', option_d: 'Control Processing Unit', correct_answer: 'a', marks: 1, status: 'active', createdAt: '2025-02-07T00:00:00Z' },
  { _id: 'q-020', exam_id: 'oe-001', exam_name: 'Class 10 Math Mid Term', question: 'If sin θ = 1/2, what is θ in degrees?', option_a: '30°', option_b: '45°', option_c: '60°', option_d: '90°', correct_answer: 'a', marks: 2, status: 'active', createdAt: '2025-02-03T00:00:00Z' },
]

// ─── Student Attempts ──────────────────────────────────────────────────────────
// `result`: pass, fail.
// `status`: completed, in-progress.
export const studentAttempts = [
  { _id: 'att-001', exam_id: 'oe-002', exam_name: 'Class 9 Physics Unit Test', student_id: 'stu-001', student_name: 'Aarav Sharma', class_name: 'Class 9', started_at: '2025-03-10T09:00:00Z', submitted_at: '2025-03-10T09:42:00Z', total_marks: 50, obtained_marks: 42, percentage: 84, result: 'pass', time_taken: 42, status: 'completed', createdAt: '2025-03-10T09:42:00Z' },
  { _id: 'att-002', exam_id: 'oe-002', exam_name: 'Class 9 Physics Unit Test', student_id: 'stu-002', student_name: 'Emma Wilson', class_name: 'Class 9', started_at: '2025-03-10T09:00:00Z', submitted_at: '2025-03-10T09:38:00Z', total_marks: 50, obtained_marks: 28, percentage: 56, result: 'pass', time_taken: 38, status: 'completed', createdAt: '2025-03-10T09:38:00Z' },
  { _id: 'att-003', exam_id: 'oe-002', exam_name: 'Class 9 Physics Unit Test', student_id: 'stu-003', student_name: 'Liam Chen', class_name: 'Class 9', started_at: '2025-03-10T09:00:00Z', submitted_at: '2025-03-10T09:45:00Z', total_marks: 50, obtained_marks: 18, percentage: 36, result: 'fail', time_taken: 45, status: 'completed', createdAt: '2025-03-10T09:45:00Z' },
  { _id: 'att-004', exam_id: 'oe-004', exam_name: 'Class 12 Physics Mock', student_id: 'stu-004', student_name: 'Sofia Garcia', class_name: 'Class 12', started_at: '2025-02-28T11:00:00Z', submitted_at: '2025-02-28T12:55:00Z', total_marks: 100, obtained_marks: 78, percentage: 78, result: 'pass', time_taken: 115, status: 'completed', createdAt: '2025-02-28T12:55:00Z' },
  { _id: 'att-005', exam_id: 'oe-004', exam_name: 'Class 12 Physics Mock', student_id: 'stu-005', student_name: 'Noah Brown', class_name: 'Class 12', started_at: '2025-02-28T11:00:00Z', submitted_at: '2025-02-28T12:48:00Z', total_marks: 100, obtained_marks: 88, percentage: 88, result: 'pass', time_taken: 108, status: 'completed', createdAt: '2025-02-28T12:48:00Z' },
  { _id: 'att-006', exam_id: 'oe-004', exam_name: 'Class 12 Physics Mock', student_id: 'stu-006', student_name: 'Olivia Davis', class_name: 'Class 12', started_at: '2025-02-28T11:00:00Z', submitted_at: '2025-02-28T12:58:00Z', total_marks: 100, obtained_marks: 35, percentage: 35, result: 'fail', time_taken: 118, status: 'completed', createdAt: '2025-02-28T12:58:00Z' },
  { _id: 'att-007', exam_id: 'oe-003', exam_name: 'Class 11 CS Final', student_id: 'stu-007', student_name: 'Ethan Lee', class_name: 'Class 11', started_at: '2025-03-20T14:00:00Z', submitted_at: '2025-03-20T15:52:00Z', total_marks: 100, obtained_marks: 91, percentage: 91, result: 'pass', time_taken: 112, status: 'completed', createdAt: '2025-03-20T15:52:00Z' },
  { _id: 'att-008', exam_id: 'oe-003', exam_name: 'Class 11 CS Final', student_id: 'stu-008', student_name: 'Ava Martinez', class_name: 'Class 11', started_at: '2025-03-20T14:00:00Z', submitted_at: '2025-03-20T15:40:00Z', total_marks: 100, obtained_marks: 76, percentage: 76, result: 'pass', time_taken: 100, status: 'completed', createdAt: '2025-03-20T15:40:00Z' },
  { _id: 'att-009', exam_id: 'oe-003', exam_name: 'Class 11 CS Final', student_id: 'stu-009', student_name: 'Lucas Anderson', class_name: 'Class 11', started_at: '2025-03-20T14:00:00Z', submitted_at: null, total_marks: 100, obtained_marks: 0, percentage: 0, result: 'fail', time_taken: 0, status: 'in-progress', createdAt: '2025-03-20T14:00:00Z' },
  { _id: 'att-010', exam_id: 'oe-006', exam_name: 'Class 9 Math Unit Test', student_id: 'stu-010', student_name: 'Mia Thompson', class_name: 'Class 9', started_at: '2025-03-12T09:00:00Z', submitted_at: '2025-03-12T09:26:00Z', total_marks: 25, obtained_marks: 23, percentage: 92, result: 'pass', time_taken: 26, status: 'completed', createdAt: '2025-03-12T09:26:00Z' },
  { _id: 'att-011', exam_id: 'oe-006', exam_name: 'Class 9 Math Unit Test', student_id: 'stu-001', student_name: 'Aarav Sharma', class_name: 'Class 9', started_at: '2025-03-12T09:00:00Z', submitted_at: '2025-03-12T09:24:00Z', total_marks: 25, obtained_marks: 19, percentage: 76, result: 'pass', time_taken: 24, status: 'completed', createdAt: '2025-03-12T09:24:00Z' },
  { _id: 'att-012', exam_id: 'oe-006', exam_name: 'Class 9 Math Unit Test', student_id: 'stu-002', student_name: 'Emma Wilson', class_name: 'Class 9', started_at: '2025-03-12T09:00:00Z', submitted_at: '2025-03-12T09:28:00Z', total_marks: 25, obtained_marks: 8, percentage: 32, result: 'fail', time_taken: 28, status: 'completed', createdAt: '2025-03-12T09:28:00Z' },
  { _id: 'att-013', exam_id: 'oe-002', exam_name: 'Class 9 Physics Unit Test', student_id: 'stu-010', student_name: 'Mia Thompson', class_name: 'Class 9', started_at: '2025-03-10T09:00:00Z', submitted_at: '2025-03-10T09:40:00Z', total_marks: 50, obtained_marks: 45, percentage: 90, result: 'pass', time_taken: 40, status: 'completed', createdAt: '2025-03-10T09:40:00Z' },
  { _id: 'att-014', exam_id: 'oe-004', exam_name: 'Class 12 Physics Mock', student_id: 'stu-013', student_name: 'Henry Walker', class_name: 'Class 12', started_at: '2025-02-28T11:00:00Z', submitted_at: '2025-02-28T12:50:00Z', total_marks: 100, obtained_marks: 62, percentage: 62, result: 'pass', time_taken: 110, status: 'completed', createdAt: '2025-02-28T12:50:00Z' },
  { _id: 'att-015', exam_id: 'oe-003', exam_name: 'Class 11 CS Final', student_id: 'stu-014', student_name: 'Charlotte Brooks', class_name: 'Class 11', started_at: '2025-03-20T14:00:00Z', submitted_at: '2025-03-20T15:58:00Z', total_marks: 100, obtained_marks: 54, percentage: 54, result: 'pass', time_taken: 118, status: 'completed', createdAt: '2025-03-20T15:58:00Z' },
]

// ─── Online Exam Dashboard Stats ──────────────────────────────────────────────
export const onlineExamStats = {
  total_exams: onlineExams.length,
  scheduled: onlineExams.filter((e) => e.status === 'scheduled').length,
  active: onlineExams.filter((e) => e.status === 'active').length,
  completed: onlineExams.filter((e) => e.status === 'completed').length,
  total_questions: questionBank.length,
  total_attempts: studentAttempts.length,
  pass_rate: Math.round((studentAttempts.filter((a) => a.result === 'pass').length / studentAttempts.length) * 100),
  avg_score: Math.round(studentAttempts.reduce((sum, a) => sum + a.percentage, 0) / studentAttempts.length),
}
