// ─── Download Center Module Mock Data ──────────────────────────────────────────
// All structures mirror the backend downloadModel.js field names.
// INTEGRATION: delete this file once real endpoints are wired in
// downloadCenter.service.js. Only the service imports this file.

export const contentTypes = [
  { _id: 'ct-001', content_type_name: 'Assignments', description: 'Homework and assignment documents', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'ct-002', content_type_name: 'Study Material', description: 'Reference notes and guides', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'ct-003', content_type_name: 'Question Papers', description: 'Previous year question papers', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'ct-004', content_type_name: 'Syllabus', description: 'Course syllabus documents', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'ct-005', content_type_name: 'Circulars', description: 'School notices and circulars', status: 'active', createdAt: '2024-06-05T00:00:00Z' },
  { _id: 'ct-006', content_type_name: 'Worksheets', description: 'Practice worksheets', status: 'inactive', createdAt: '2024-06-06T00:00:00Z' },
]

export const uploadShareContents = [
  { _id: 'usc-001', title: 'Class 10 Mathematics - Chapter 5 Notes', content_type_id: 'ct-002', content_type_name: 'Study Material', file_url: '/downloads/math-ch5-notes.pdf', file_size: '2.4 MB', description: 'Comprehensive notes on trigonometry chapter', uploaded_by: 'Hannah Kim', uploaded_at: '2024-09-01', status: 'active', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'usc-002', title: 'Physics Lab Manual - Class 9', content_type_id: 'ct-002', content_type_name: 'Study Material', file_url: '/downloads/physics-lab-manual.pdf', file_size: '5.1 MB', description: 'Complete lab manual with experiments', uploaded_by: 'Priya Patel', uploaded_at: '2024-09-03', status: 'active', createdAt: '2024-09-03T00:00:00Z' },
  { _id: 'usc-003', title: 'Previous Year Question Paper - English 2023', content_type_id: 'ct-003', content_type_name: 'Question Papers', file_url: '/downloads/english-qpaper-2023.pdf', file_size: '1.2 MB', description: 'Class 10 English board exam paper', uploaded_by: 'Marcus Johnson', uploaded_at: '2024-09-05', status: 'active', createdAt: '2024-09-05T00:00:00Z' },
  { _id: 'usc-004', title: 'Class 8 Science Worksheet - Cells', content_type_id: 'ct-006', content_type_name: 'Worksheets', file_url: '/downloads/cells-worksheet.pdf', file_size: '0.8 MB', description: 'Practice worksheet on cell structure', uploaded_by: 'Priya Patel', uploaded_at: '2024-09-07', status: 'active', createdAt: '2024-09-07T00:00:00Z' },
  { _id: 'usc-005', title: 'Annual Syllabus - Computer Science', content_type_id: 'ct-004', content_type_name: 'Syllabus', file_url: '/downloads/cs-syllabus-2024.pdf', file_size: '1.5 MB', description: 'Complete year syllabus for CS classes', uploaded_by: 'Yuki Tanaka', uploaded_at: '2024-09-08', status: 'active', createdAt: '2024-09-08T00:00:00Z' },
  { _id: 'usc-006', title: 'School Circular - Annual Day Notice', content_type_id: 'ct-005', content_type_name: 'Circulars', file_url: '/downloads/annual-day-notice.pdf', file_size: '0.5 MB', description: 'Notice regarding annual day celebrations', uploaded_by: 'Administration', uploaded_at: '2024-09-10', status: 'active', createdAt: '2024-09-10T00:00:00Z' },
  { _id: 'usc-007', title: 'Class 10 Assignment - Quadratic Equations', content_type_id: 'ct-001', content_type_name: 'Assignments', file_url: '/downloads/quadratic-assignment.pdf', file_size: '1.1 MB', description: 'Assignment on solving quadratic equations', uploaded_by: 'Hannah Kim', uploaded_at: '2024-09-12', status: 'active', createdAt: '2024-09-12T00:00:00Z' },
  { _id: 'usc-008', title: 'Economics Previous Paper - 2022', content_type_id: 'ct-003', content_type_name: 'Question Papers', file_url: '/downloads/econ-qpaper-2022.pdf', file_size: '0.9 MB', description: 'Class 12 Economics previous year paper', uploaded_by: 'Olivia Brooks', uploaded_at: '2024-09-14', status: 'inactive', createdAt: '2024-09-14T00:00:00Z' },
]

export const contentShareLists = [
  { _id: 'csl-001', content_id: 'usc-001', content_title: 'Class 10 Mathematics - Chapter 5 Notes', class_id: 'cls-003', class_name: 'Class 10', shared_date: '2024-09-01', note: 'Shared with Class 10 students', status: 'active', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'csl-002', content_id: 'usc-002', content_title: 'Physics Lab Manual - Class 9', class_id: 'cls-002', class_name: 'Class 9', shared_date: '2024-09-03', note: 'Lab manual for Class 9 students', status: 'active', createdAt: '2024-09-03T00:00:00Z' },
  { _id: 'csl-003', content_id: 'usc-003', content_title: 'Previous Year Question Paper - English 2023', class_id: 'cls-003', class_name: 'Class 10', shared_date: '2024-09-05', note: 'Practice paper for board students', status: 'active', createdAt: '2024-09-05T00:00:00Z' },
  { _id: 'csl-004', content_id: 'usc-004', content_title: 'Class 8 Science Worksheet - Cells', class_id: 'cls-001', class_name: 'Class 8', shared_date: '2024-09-07', note: 'Worksheet for biology unit', status: 'active', createdAt: '2024-09-07T00:00:00Z' },
  { _id: 'csl-005', content_id: 'usc-005', content_title: 'Annual Syllabus - Computer Science', class_id: 'cls-004', class_name: 'Class 11', shared_date: '2024-09-08', note: 'Syllabus for CS students', status: 'active', createdAt: '2024-09-08T00:00:00Z' },
  { _id: 'csl-006', content_id: 'usc-006', content_title: 'School Circular - Annual Day Notice', class_id: 'cls-001', class_name: 'Class 8', shared_date: '2024-09-10', note: 'Notice for all Class 8 students', status: 'active', createdAt: '2024-09-10T00:00:00Z' },
]

export const videoTutorials = [
  { _id: 'vt-001', title: 'Understanding Quadratic Equations', description: 'Step-by-step guide to solving quadratic equations', video_url: 'https://example.com/videos/quadratic', thumbnail: 'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Mathematics', duration: '15:30', uploaded_by: 'Hannah Kim', uploaded_at: '2024-09-01', status: 'active', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'vt-002', title: 'Newton\'s Laws Explained', description: 'Visual explanation of Newton\'s three laws of motion', video_url: 'https://example.com/videos/newton', thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Physics', duration: '22:15', uploaded_by: 'Priya Patel', uploaded_at: '2024-09-03', status: 'active', createdAt: '2024-09-03T00:00:00Z' },
  { _id: 'vt-003', title: 'Python Basics for Beginners', description: 'Introduction to Python programming', video_url: 'https://example.com/videos/python', thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Computer Science', duration: '30:00', uploaded_by: 'Yuki Tanaka', uploaded_at: '2024-09-05', status: 'active', createdAt: '2024-09-05T00:00:00Z' },
  { _id: 'vt-004', title: 'The Art of Essay Writing', description: 'Tips and techniques for writing compelling essays', video_url: 'https://example.com/videos/essay', thumbnail: 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'English', duration: '18:45', uploaded_by: 'Marcus Johnson', uploaded_at: '2024-09-07', status: 'active', createdAt: '2024-09-07T00:00:00Z' },
  { _id: 'vt-005', title: 'Cell Structure Overview', description: 'Detailed tour of plant and animal cell structures', video_url: 'https://example.com/videos/cells', thumbnail: 'https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Biology', duration: '25:20', uploaded_by: 'Priya Patel', uploaded_at: '2024-09-09', status: 'active', createdAt: '2024-09-09T00:00:00Z' },
  { _id: 'vt-006', title: 'Supply and Demand Basics', description: 'Understanding market equilibrium', video_url: 'https://example.com/videos/economics', thumbnail: 'https://images.pexels.com/photos/534217/pexels-photo-534217.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Economics', duration: '12:10', uploaded_by: 'Olivia Brooks', uploaded_at: '2024-09-11', status: 'inactive', createdAt: '2024-09-11T00:00:00Z' },
]

export const downloadCenterStats = {
  total_contents: uploadShareContents.length,
  total_shares: contentShareLists.length,
  total_videos: videoTutorials.length,
  total_types: contentTypes.length,
  active_types: contentTypes.filter((t) => t.status === 'active').length,
}
