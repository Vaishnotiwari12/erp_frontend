<<<<<<< HEAD
// ─── Front CMS Module Mock Data ────────────────────────────────────────────────
// All structures mirror the backend front CMS model field names.
// INTEGRATION: delete this file once real endpoints are wired in
// frontCms.service.js. Only the service imports this file.

// ─── Banner Images ─────────────────────────────────────────────────────────────
export const banners = [
  { _id: 'bn-001', title: 'Welcome to Greenfield Academy', subtitle: 'Excellence in education since 1985', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f5?w=1200', link_url: '/about', display_order: 1, status: 'published', published_at: '2024-09-01T00:00:00Z', createdAt: '2024-08-25T00:00:00Z' },
  { _id: 'bn-002', title: 'Annual Sports Day 2024', subtitle: 'Join us on November 15th for a day of athletic excellence', image_url: 'https://images.unsplash.com/photo-1461896836938-ef5e4ad9d8f0?w=1200', link_url: '/events/sports-day', display_order: 2, status: 'published', published_at: '2024-10-01T00:00:00Z', createdAt: '2024-09-20T00:00:00Z' },
  { _id: 'bn-003', title: 'Science Exhibition', subtitle: 'Students showcase innovative projects on December 5th', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200', link_url: '/events/science-exhibition', display_order: 3, status: 'published', published_at: '2024-10-15T00:00:00Z', createdAt: '2024-10-01T00:00:00Z' },
  { _id: 'bn-004', title: 'Admissions Open 2025-26', subtitle: 'Applications are now being accepted for all grades', image_url: 'https://images.unsplash.com/photo-1503676260728-1c05a8b0e307?w=1200', link_url: '/admissions', display_order: 4, status: 'published', published_at: '2024-11-01T00:00:00Z', createdAt: '2024-10-20T00:00:00Z' },
  { _id: 'bn-005', title: 'Cultural Festival', subtitle: 'Celebrating diversity through music, dance, and art', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', link_url: '/events/cultural-festival', display_order: 5, status: 'draft', published_at: null, createdAt: '2024-11-10T00:00:00Z' },
  { _id: 'bn-006', title: 'Parent-Teacher Conference', subtitle: 'Scheduled for the last Saturday of every month', image_url: 'https://images.unsplash.com/photo-1577896851233-cf143863831f?w=1200', link_url: '/events/ptc', display_order: 6, status: 'draft', published_at: null, createdAt: '2024-11-15T00:00:00Z' },
]

// ─── News ──────────────────────────────────────────────────────────────────────
export const newsItems = [
  { _id: 'nw-001', title: 'School Ranked #1 in District Academic Survey', slug: 'school-ranked-1-district-survey', content: 'Greenfield Academy has been ranked first in the district-wide academic survey conducted by the Board of Education. The survey evaluated over 200 schools on academic performance, infrastructure, and student development programs.', excerpt: 'Greenfield Academy tops the district academic survey, outperforming 200+ schools.', image_url: 'https://images.unsplash.com/photo-1503676260728-1c05a8b0e307?w=800', author: 'Principal Office', category: 'Academic', status: 'published', published_at: '2024-11-01T00:00:00Z', createdAt: '2024-10-28T00:00:00Z' },
  { _id: 'nw-002', title: 'Inter-School Basketball Championship Won', slug: 'inter-school-basketball-championship-won', content: 'Our school basketball team clinched the inter-school championship trophy after a thrilling final match against St. Mary\'s School. The team was led by captain Rohan Verma and coached by Mr. David Smith.', excerpt: 'Victorious basketball team brings home the inter-school championship trophy.', image_url: 'https://images.unsplash.com/photo-1518604666820-7ce0e7f6d8f1?w=800', author: 'Sports Department', category: 'Sports', status: 'published', published_at: '2024-10-20T00:00:00Z', createdAt: '2024-10-18T00:00:00Z' },
  { _id: 'nw-003', title: 'Annual Day Celebration Scheduled', slug: 'annual-day-celebration-scheduled', content: 'The Annual Day celebration will be held on December 20th at the school auditorium. The event will feature cultural performances, award ceremonies, and a keynote address by the Chief Guest, Dr. Anjali Mehta.', excerpt: 'Annual Day set for December 20th with cultural performances and awards.', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', author: 'Events Committee', category: 'Events', status: 'published', published_at: '2024-11-05T00:00:00Z', createdAt: '2024-11-01T00:00:00Z' },
  { _id: 'nw-004', title: 'New Computer Lab Inaugurated', slug: 'new-computer-lab-inaugurated', content: 'A state-of-the-art computer lab with 40 workstations and high-speed internet has been inaugurated. The lab will support coding, robotics, and digital literacy programs across all grades.', excerpt: 'Modern computer lab with 40 workstations now open for students.', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', author: 'Administration', category: 'Announcement', status: 'published', published_at: '2024-10-10T00:00:00Z', createdAt: '2024-10-08T00:00:00Z' },
  { _id: 'nw-005', title: 'Students Excel in National Science Olympiad', slug: 'students-excel-national-science-olympiad', content: 'Twelve students from our school secured top ranks in the National Science Olympiad. Three students won gold medals, five secured silver, and four earned bronze in various categories.', excerpt: 'Twelve students bring home medals from the National Science Olympiad.', image_url: 'https://images.unsplash.com/photo-1532012806473-7b1d2f5f7f9f?w=800', author: 'Science Department', category: 'Academic', status: 'published', published_at: '2024-09-25T00:00:00Z', createdAt: '2024-09-22T00:00:00Z' },
  { _id: 'nw-006', title: 'Swimming Pool Renovation Complete', slug: 'swimming-pool-renovation-complete', content: 'The school swimming pool has been fully renovated with modern filtration systems and heated water facilities. Swimming classes will resume from next month for all interested students.', excerpt: 'Renovated swimming pool with heated water ready for classes.', image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', author: 'Sports Department', category: 'Announcement', status: 'draft', published_at: null, createdAt: '2024-11-12T00:00:00Z' },
  { _id: 'nw-007', title: 'Music and Arts Festival Announced', slug: 'music-and-arts-festival-announced', content: 'A three-day music and arts festival will be held in January featuring student performances, guest artists, and interactive workshops. Registration for performers opens next week.', excerpt: 'Three-day music and arts festival coming this January.', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', author: 'Events Committee', category: 'Events', status: 'draft', published_at: null, createdAt: '2024-11-18T00:00:00Z' },
  { _id: 'nw-008', title: 'Parent Workshop on Digital Safety', slug: 'parent-workshop-digital-safety', content: 'A workshop for parents on children\'s digital safety and responsible internet use will be conducted on December 1st. The session will be led by cybersecurity expert Ms. Sarah Johnson.', excerpt: 'Digital safety workshop for parents scheduled for December 1st.', image_url: 'https://images.unsplash.com/photo-1577896851233-cf143863831f?w=800', author: 'Administration', category: 'Announcement', status: 'published', published_at: '2024-11-10T00:00:00Z', createdAt: '2024-11-05T00:00:00Z' },
]

// ─── Events ────────────────────────────────────────────────────────────────────
export const events = [
  { _id: 'ev-001', title: 'Annual Sports Day', description: 'A full day of track and field events, team sports, and award ceremonies for all grades.', event_date: '2024-11-15', event_time: '09:00', location: 'School Sports Ground', image_url: 'https://images.unsplash.com/photo-1461896836938-ef5e4ad9d8f0?w=800', category: 'Sports', status: 'published', published_at: '2024-10-01T00:00:00Z', createdAt: '2024-09-20T00:00:00Z' },
  { _id: 'ev-002', title: 'Science Exhibition', description: 'Students from grades 6-12 showcase innovative science projects and working models.', event_date: '2024-12-05', event_time: '10:00', location: 'Science Block Auditorium', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', category: 'Academic', status: 'published', published_at: '2024-10-15T00:00:00Z', createdAt: '2024-10-01T00:00:00Z' },
  { _id: 'ev-003', title: 'Cultural Festival', description: 'Three-day celebration of music, dance, drama, and art featuring student and guest performances.', event_date: '2024-12-20', event_time: '18:00', location: 'Main Auditorium', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', category: 'Cultural', status: 'published', published_at: '2024-11-05T00:00:00Z', createdAt: '2024-11-01T00:00:00Z' },
  { _id: 'ev-004', title: 'Winter Break', description: 'School will remain closed for the winter holidays. Classes resume on January 6th.', event_date: '2024-12-23', event_time: '00:00', location: 'School Campus', image_url: 'https://images.unsplash.com/photo-1543412444-7e7ee8b1c93e?w=800', category: 'Holiday', status: 'published', published_at: '2024-11-10T00:00:00Z', createdAt: '2024-11-05T00:00:00Z' },
  { _id: 'ev-005', title: 'Inter-School Debate Competition', description: 'Host the regional inter-school debate championship with participants from 15 schools.', event_date: '2025-01-12', event_time: '14:00', location: 'Conference Hall', image_url: 'https://images.unsplash.com/photo-1532012806473-7b1d2f5f7f9f?w=800', category: 'Academic', status: 'draft', published_at: null, createdAt: '2024-11-15T00:00:00Z' },
  { _id: 'ev-006', title: 'Founders Day Celebration', description: 'Commemorate the founding of the school with a special ceremony and alumni meet.', event_date: '2025-02-01', event_time: '11:00', location: 'Main Auditorium', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f5?w=800', category: 'Cultural', status: 'draft', published_at: null, createdAt: '2024-11-20T00:00:00Z' },
]

// ─── Gallery ────────────────────────────────────────────────────────────────────
export const galleryItems = [
  { _id: 'gl-001', title: 'Main Building', image_url: 'https://images.unsplash.com/photo-1562774053-701939f2412b?w=600', category: 'Campus', display_order: 1, status: 'published', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'gl-002', title: 'Basketball Court', image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600', category: 'Sports', display_order: 2, status: 'published', createdAt: '2024-09-05T00:00:00Z' },
  { _id: 'gl-003', title: 'Annual Day Performance', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', category: 'Cultural', display_order: 3, status: 'published', createdAt: '2024-09-10T00:00:00Z' },
  { _id: 'gl-004', title: 'Science Lab', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600', category: 'Academic', display_order: 4, status: 'published', createdAt: '2024-09-12T00:00:00Z' },
  { _id: 'gl-005', title: 'Library', image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600', category: 'Campus', display_order: 5, status: 'published', createdAt: '2024-09-15T00:00:00Z' },
  { _id: 'gl-006', title: 'Football Match', image_url: 'https://images.unsplash.com/photo-1574629810369-1124ce7fc4c2?w=600', category: 'Sports', display_order: 6, status: 'published', createdAt: '2024-09-18T00:00:00Z' },
  { _id: 'gl-007', title: 'Art Exhibition', image_url: 'https://images.unsplash.com/photo-1513474723786-f4a9b6f7f9f1?w=600', category: 'Cultural', display_order: 7, status: 'draft', published_at: null, createdAt: '2024-09-20T00:00:00Z' },
  { _id: 'gl-008', title: 'Computer Lab', image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600', category: 'Academic', display_order: 8, status: 'draft', published_at: null, createdAt: '2024-09-22T00:00:00Z' },
]

// ─── Media Manager ─────────────────────────────────────────────────────────────
export const mediaItems = [
  { _id: 'md-001', file_name: 'campus-banner.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1562774053-701939f2412b?w=1200', file_size: '2.4 MB', uploaded_by: 'Admin', status: 'active', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'md-002', file_name: 'sports-day-video.mp4', file_type: 'video', file_url: 'https://example.com/media/sports-day.mp4', file_size: '45.2 MB', uploaded_by: 'Sports Dept', status: 'active', createdAt: '2024-09-15T00:00:00Z' },
  { _id: 'md-003', file_name: 'prospectus-2024.pdf', file_type: 'document', file_url: 'https://example.com/media/prospectus-2024.pdf', file_size: '3.8 MB', uploaded_by: 'Admin', status: 'active', createdAt: '2024-09-20T00:00:00Z' },
  { _id: 'md-004', file_name: 'annual-day-photo.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', file_size: '1.9 MB', uploaded_by: 'Events Committee', status: 'active', createdAt: '2024-10-01T00:00:00Z' },
  { _id: 'md-005', file_name: 'science-exhibition.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200', file_size: '2.1 MB', uploaded_by: 'Science Dept', status: 'active', createdAt: '2024-10-10T00:00:00Z' },
  { _id: 'md-006', file_name: 'school-tour.mp4', file_type: 'video', file_url: 'https://example.com/media/school-tour.mp4', file_size: '78.5 MB', uploaded_by: 'Admin', status: 'active', createdAt: '2024-10-15T00:00:00Z' },
  { _id: 'md-007', file_name: 'admission-form.pdf', file_type: 'document', file_url: 'https://example.com/media/admission-form.pdf', file_size: '0.8 MB', uploaded_by: 'Admissions Office', status: 'active', createdAt: '2024-10-20T00:00:00Z' },
  { _id: 'md-008', file_name: 'library-photo.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200', file_size: '1.5 MB', uploaded_by: 'Librarian', status: 'inactive', createdAt: '2024-11-01T00:00:00Z' },
  { _id: 'md-009', file_name: 'cultural-festival.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', file_size: '2.8 MB', uploaded_by: 'Events Committee', status: 'active', createdAt: '2024-11-05T00:00:00Z' },
  { _id: 'md-010', file_name: 'old-brochure.pdf', file_type: 'document', file_url: 'https://example.com/media/old-brochure.pdf', file_size: '5.2 MB', uploaded_by: 'Admin', status: 'inactive', createdAt: '2024-08-15T00:00:00Z' },
]

// ─── CMS Pages ──────────────────────────────────────────────────────────────────
export const cmsPages = [
  { _id: 'pg-001', page_title: 'About Us', slug: 'about-us', content: 'Greenfield Academy has been a beacon of educational excellence for over three decades, committed to nurturing well-rounded individuals through holistic learning.', template: 'Default', meta_title: 'About Greenfield Academy', meta_description: 'Learn about our history, mission, and commitment to educational excellence.', status: 'published', published_at: '2024-09-01T00:00:00Z', createdAt: '2024-08-25T00:00:00Z' },
  { _id: 'pg-002', page_title: 'Admissions', slug: 'admissions', content: 'Find all the information you need about our admission process, eligibility criteria, and application deadlines for the 2025-26 academic year.', template: 'Sidebar', meta_title: 'Admissions 2025-26 | Greenfield Academy', meta_description: 'Admission process, eligibility, and deadlines for Greenfield Academy.', status: 'published', published_at: '2024-09-05T00:00:00Z', createdAt: '2024-08-28T00:00:00Z' },
  { _id: 'pg-003', page_title: 'Academic Programs', slug: 'academic-programs', content: 'Explore our comprehensive academic programs from primary through senior secondary, designed to foster critical thinking and creativity.', template: 'Full Width', meta_title: 'Academic Programs', meta_description: 'Comprehensive academic programs from primary to senior secondary.', status: 'published', published_at: '2024-09-10T00:00:00Z', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'pg-004', page_title: 'Campus Life', slug: 'campus-life', content: 'Discover the vibrant campus life at Greenfield Academy with diverse clubs, sports, arts, and community service opportunities.', template: 'Default', meta_title: 'Campus Life at Greenfield', meta_description: 'Explore clubs, sports, arts, and activities at Greenfield Academy.', status: 'published', published_at: '2024-09-15T00:00:00Z', createdAt: '2024-09-08T00:00:00Z' },
  { _id: 'pg-005', page_title: 'Contact Us', slug: 'contact-us', content: 'Get in touch with us for any inquiries. Our office is open Monday to Friday, 8 AM to 4 PM. Phone: +1-555-0100. Email: info@greenfield.edu', template: 'Sidebar', meta_title: 'Contact Greenfield Academy', meta_description: 'Contact information and office hours for Greenfield Academy.', status: 'published', published_at: '2024-09-20T00:00:00Z', createdAt: '2024-09-12T00:00:00Z' },
  { _id: 'pg-006', page_title: 'Alumni Network', slug: 'alumni-network', content: 'Our alumni network connects graduates across the globe. Join our alumni association to stay connected and give back to your alma mater.', template: 'Full Width', meta_title: 'Alumni Network', meta_description: 'Connect with Greenfield Academy alumni worldwide.', status: 'draft', published_at: null, createdAt: '2024-11-10T00:00:00Z' },
]

// ─── Menus ─────────────────────────────────────────────────────────────────────
export const menus = [
  { _id: 'mn-001', menu_name: 'Home', menu_type: 'Header', parent_id: null, link_url: '/', display_order: 1, status: 'active', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'mn-002', menu_name: 'About Us', menu_type: 'Header', parent_id: null, link_url: '/about-us', display_order: 2, status: 'active', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'mn-003', menu_name: 'Admissions', menu_type: 'Header', parent_id: null, link_url: '/admissions', display_order: 3, status: 'active', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'mn-004', menu_name: 'Privacy Policy', menu_type: 'Footer', parent_id: null, link_url: '/privacy-policy', display_order: 1, status: 'active', createdAt: '2024-09-05T00:00:00Z' },
  { _id: 'mn-005', menu_name: 'Quick Links', menu_type: 'Sidebar', parent_id: null, link_url: '#', display_order: 1, status: 'active', createdAt: '2024-09-10T00:00:00Z' },
]

// ─── Front CMS Dashboard Stats ─────────────────────────────────────────────────
export const frontCmsStats = {
  total_banners: banners.length,
  published_banners: banners.filter((b) => b.status === 'published').length,
  total_news: newsItems.length,
  published_news: newsItems.filter((n) => n.status === 'published').length,
  total_events: events.length,
  published_events: events.filter((e) => e.status === 'published').length,
  total_gallery: galleryItems.length,
  total_pages: cmsPages.length,
  published_pages: cmsPages.filter((p) => p.status === 'published').length,
  total_menus: menus.length,
  total_media: mediaItems.length,
}
=======
// // ─── Front CMS Module Mock Data ────────────────────────────────────────────────
// // All structures mirror the backend front CMS model field names.
// // INTEGRATION: delete this file once real endpoints are wired in
// // frontCms.service.js. Only the service imports this file.

// // ─── Banner Images ─────────────────────────────────────────────────────────────
// export const banners = [
//   { _id: 'bn-001', title: 'Welcome to Greenfield Academy', subtitle: 'Excellence in education since 1985', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f5?w=1200', link_url: '/about', display_order: 1, status: 'published', published_at: '2024-09-01T00:00:00Z', createdAt: '2024-08-25T00:00:00Z' },
//   { _id: 'bn-002', title: 'Annual Sports Day 2024', subtitle: 'Join us on November 15th for a day of athletic excellence', image_url: 'https://images.unsplash.com/photo-1461896836938-ef5e4ad9d8f0?w=1200', link_url: '/events/sports-day', display_order: 2, status: 'published', published_at: '2024-10-01T00:00:00Z', createdAt: '2024-09-20T00:00:00Z' },
//   { _id: 'bn-003', title: 'Science Exhibition', subtitle: 'Students showcase innovative projects on December 5th', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200', link_url: '/events/science-exhibition', display_order: 3, status: 'published', published_at: '2024-10-15T00:00:00Z', createdAt: '2024-10-01T00:00:00Z' },
//   { _id: 'bn-004', title: 'Admissions Open 2025-26', subtitle: 'Applications are now being accepted for all grades', image_url: 'https://images.unsplash.com/photo-1503676260728-1c05a8b0e307?w=1200', link_url: '/admissions', display_order: 4, status: 'published', published_at: '2024-11-01T00:00:00Z', createdAt: '2024-10-20T00:00:00Z' },
//   { _id: 'bn-005', title: 'Cultural Festival', subtitle: 'Celebrating diversity through music, dance, and art', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', link_url: '/events/cultural-festival', display_order: 5, status: 'draft', published_at: null, createdAt: '2024-11-10T00:00:00Z' },
//   { _id: 'bn-006', title: 'Parent-Teacher Conference', subtitle: 'Scheduled for the last Saturday of every month', image_url: 'https://images.unsplash.com/photo-1577896851233-cf143863831f?w=1200', link_url: '/events/ptc', display_order: 6, status: 'draft', published_at: null, createdAt: '2024-11-15T00:00:00Z' },
// ]

// // ─── News ──────────────────────────────────────────────────────────────────────
// export const newsItems = [
//   { _id: 'nw-001', title: 'School Ranked #1 in District Academic Survey', slug: 'school-ranked-1-district-survey', content: 'Greenfield Academy has been ranked first in the district-wide academic survey conducted by the Board of Education. The survey evaluated over 200 schools on academic performance, infrastructure, and student development programs.', excerpt: 'Greenfield Academy tops the district academic survey, outperforming 200+ schools.', image_url: 'https://images.unsplash.com/photo-1503676260728-1c05a8b0e307?w=800', author: 'Principal Office', category: 'Academic', status: 'published', published_at: '2024-11-01T00:00:00Z', createdAt: '2024-10-28T00:00:00Z' },
//   { _id: 'nw-002', title: 'Inter-School Basketball Championship Won', slug: 'inter-school-basketball-championship-won', content: 'Our school basketball team clinched the inter-school championship trophy after a thrilling final match against St. Mary\'s School. The team was led by captain Rohan Verma and coached by Mr. David Smith.', excerpt: 'Victorious basketball team brings home the inter-school championship trophy.', image_url: 'https://images.unsplash.com/photo-1518604666820-7ce0e7f6d8f1?w=800', author: 'Sports Department', category: 'Sports', status: 'published', published_at: '2024-10-20T00:00:00Z', createdAt: '2024-10-18T00:00:00Z' },
//   { _id: 'nw-003', title: 'Annual Day Celebration Scheduled', slug: 'annual-day-celebration-scheduled', content: 'The Annual Day celebration will be held on December 20th at the school auditorium. The event will feature cultural performances, award ceremonies, and a keynote address by the Chief Guest, Dr. Anjali Mehta.', excerpt: 'Annual Day set for December 20th with cultural performances and awards.', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', author: 'Events Committee', category: 'Events', status: 'published', published_at: '2024-11-05T00:00:00Z', createdAt: '2024-11-01T00:00:00Z' },
//   { _id: 'nw-004', title: 'New Computer Lab Inaugurated', slug: 'new-computer-lab-inaugurated', content: 'A state-of-the-art computer lab with 40 workstations and high-speed internet has been inaugurated. The lab will support coding, robotics, and digital literacy programs across all grades.', excerpt: 'Modern computer lab with 40 workstations now open for students.', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', author: 'Administration', category: 'Announcement', status: 'published', published_at: '2024-10-10T00:00:00Z', createdAt: '2024-10-08T00:00:00Z' },
//   { _id: 'nw-005', title: 'Students Excel in National Science Olympiad', slug: 'students-excel-national-science-olympiad', content: 'Twelve students from our school secured top ranks in the National Science Olympiad. Three students won gold medals, five secured silver, and four earned bronze in various categories.', excerpt: 'Twelve students bring home medals from the National Science Olympiad.', image_url: 'https://images.unsplash.com/photo-1532012806473-7b1d2f5f7f9f?w=800', author: 'Science Department', category: 'Academic', status: 'published', published_at: '2024-09-25T00:00:00Z', createdAt: '2024-09-22T00:00:00Z' },
//   { _id: 'nw-006', title: 'Swimming Pool Renovation Complete', slug: 'swimming-pool-renovation-complete', content: 'The school swimming pool has been fully renovated with modern filtration systems and heated water facilities. Swimming classes will resume from next month for all interested students.', excerpt: 'Renovated swimming pool with heated water ready for classes.', image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', author: 'Sports Department', category: 'Announcement', status: 'draft', published_at: null, createdAt: '2024-11-12T00:00:00Z' },
//   { _id: 'nw-007', title: 'Music and Arts Festival Announced', slug: 'music-and-arts-festival-announced', content: 'A three-day music and arts festival will be held in January featuring student performances, guest artists, and interactive workshops. Registration for performers opens next week.', excerpt: 'Three-day music and arts festival coming this January.', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', author: 'Events Committee', category: 'Events', status: 'draft', published_at: null, createdAt: '2024-11-18T00:00:00Z' },
//   { _id: 'nw-008', title: 'Parent Workshop on Digital Safety', slug: 'parent-workshop-digital-safety', content: 'A workshop for parents on children\'s digital safety and responsible internet use will be conducted on December 1st. The session will be led by cybersecurity expert Ms. Sarah Johnson.', excerpt: 'Digital safety workshop for parents scheduled for December 1st.', image_url: 'https://images.unsplash.com/photo-1577896851233-cf143863831f?w=800', author: 'Administration', category: 'Announcement', status: 'published', published_at: '2024-11-10T00:00:00Z', createdAt: '2024-11-05T00:00:00Z' },
// ]

// // ─── Events ────────────────────────────────────────────────────────────────────
// export const events = [
//   { _id: 'ev-001', title: 'Annual Sports Day', description: 'A full day of track and field events, team sports, and award ceremonies for all grades.', event_date: '2024-11-15', event_time: '09:00', location: 'School Sports Ground', image_url: 'https://images.unsplash.com/photo-1461896836938-ef5e4ad9d8f0?w=800', category: 'Sports', status: 'published', published_at: '2024-10-01T00:00:00Z', createdAt: '2024-09-20T00:00:00Z' },
//   { _id: 'ev-002', title: 'Science Exhibition', description: 'Students from grades 6-12 showcase innovative science projects and working models.', event_date: '2024-12-05', event_time: '10:00', location: 'Science Block Auditorium', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', category: 'Academic', status: 'published', published_at: '2024-10-15T00:00:00Z', createdAt: '2024-10-01T00:00:00Z' },
//   { _id: 'ev-003', title: 'Cultural Festival', description: 'Three-day celebration of music, dance, drama, and art featuring student and guest performances.', event_date: '2024-12-20', event_time: '18:00', location: 'Main Auditorium', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', category: 'Cultural', status: 'published', published_at: '2024-11-05T00:00:00Z', createdAt: '2024-11-01T00:00:00Z' },
//   { _id: 'ev-004', title: 'Winter Break', description: 'School will remain closed for the winter holidays. Classes resume on January 6th.', event_date: '2024-12-23', event_time: '00:00', location: 'School Campus', image_url: 'https://images.unsplash.com/photo-1543412444-7e7ee8b1c93e?w=800', category: 'Holiday', status: 'published', published_at: '2024-11-10T00:00:00Z', createdAt: '2024-11-05T00:00:00Z' },
//   { _id: 'ev-005', title: 'Inter-School Debate Competition', description: 'Host the regional inter-school debate championship with participants from 15 schools.', event_date: '2025-01-12', event_time: '14:00', location: 'Conference Hall', image_url: 'https://images.unsplash.com/photo-1532012806473-7b1d2f5f7f9f?w=800', category: 'Academic', status: 'draft', published_at: null, createdAt: '2024-11-15T00:00:00Z' },
//   { _id: 'ev-006', title: 'Founders Day Celebration', description: 'Commemorate the founding of the school with a special ceremony and alumni meet.', event_date: '2025-02-01', event_time: '11:00', location: 'Main Auditorium', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f5?w=800', category: 'Cultural', status: 'draft', published_at: null, createdAt: '2024-11-20T00:00:00Z' },
// ]

// // ─── Gallery ────────────────────────────────────────────────────────────────────
// export const galleryItems = [
//   { _id: 'gl-001', title: 'Main Building', image_url: 'https://images.unsplash.com/photo-1562774053-701939f2412b?w=600', category: 'Campus', display_order: 1, status: 'published', createdAt: '2024-09-01T00:00:00Z' },
//   { _id: 'gl-002', title: 'Basketball Court', image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600', category: 'Sports', display_order: 2, status: 'published', createdAt: '2024-09-05T00:00:00Z' },
//   { _id: 'gl-003', title: 'Annual Day Performance', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', category: 'Cultural', display_order: 3, status: 'published', createdAt: '2024-09-10T00:00:00Z' },
//   { _id: 'gl-004', title: 'Science Lab', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600', category: 'Academic', display_order: 4, status: 'published', createdAt: '2024-09-12T00:00:00Z' },
//   { _id: 'gl-005', title: 'Library', image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600', category: 'Campus', display_order: 5, status: 'published', createdAt: '2024-09-15T00:00:00Z' },
//   { _id: 'gl-006', title: 'Football Match', image_url: 'https://images.unsplash.com/photo-1574629810369-1124ce7fc4c2?w=600', category: 'Sports', display_order: 6, status: 'published', createdAt: '2024-09-18T00:00:00Z' },
//   { _id: 'gl-007', title: 'Art Exhibition', image_url: 'https://images.unsplash.com/photo-1513474723786-f4a9b6f7f9f1?w=600', category: 'Cultural', display_order: 7, status: 'draft', published_at: null, createdAt: '2024-09-20T00:00:00Z' },
//   { _id: 'gl-008', title: 'Computer Lab', image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600', category: 'Academic', display_order: 8, status: 'draft', published_at: null, createdAt: '2024-09-22T00:00:00Z' },
// ]

// // ─── Media Manager ─────────────────────────────────────────────────────────────
// export const mediaItems = [
//   { _id: 'md-001', file_name: 'campus-banner.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1562774053-701939f2412b?w=1200', file_size: '2.4 MB', uploaded_by: 'Admin', status: 'active', createdAt: '2024-09-01T00:00:00Z' },
//   { _id: 'md-002', file_name: 'sports-day-video.mp4', file_type: 'video', file_url: 'https://example.com/media/sports-day.mp4', file_size: '45.2 MB', uploaded_by: 'Sports Dept', status: 'active', createdAt: '2024-09-15T00:00:00Z' },
//   { _id: 'md-003', file_name: 'prospectus-2024.pdf', file_type: 'document', file_url: 'https://example.com/media/prospectus-2024.pdf', file_size: '3.8 MB', uploaded_by: 'Admin', status: 'active', createdAt: '2024-09-20T00:00:00Z' },
//   { _id: 'md-004', file_name: 'annual-day-photo.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', file_size: '1.9 MB', uploaded_by: 'Events Committee', status: 'active', createdAt: '2024-10-01T00:00:00Z' },
//   { _id: 'md-005', file_name: 'science-exhibition.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200', file_size: '2.1 MB', uploaded_by: 'Science Dept', status: 'active', createdAt: '2024-10-10T00:00:00Z' },
//   { _id: 'md-006', file_name: 'school-tour.mp4', file_type: 'video', file_url: 'https://example.com/media/school-tour.mp4', file_size: '78.5 MB', uploaded_by: 'Admin', status: 'active', createdAt: '2024-10-15T00:00:00Z' },
//   { _id: 'md-007', file_name: 'admission-form.pdf', file_type: 'document', file_url: 'https://example.com/media/admission-form.pdf', file_size: '0.8 MB', uploaded_by: 'Admissions Office', status: 'active', createdAt: '2024-10-20T00:00:00Z' },
//   { _id: 'md-008', file_name: 'library-photo.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200', file_size: '1.5 MB', uploaded_by: 'Librarian', status: 'inactive', createdAt: '2024-11-01T00:00:00Z' },
//   { _id: 'md-009', file_name: 'cultural-festival.jpg', file_type: 'image', file_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', file_size: '2.8 MB', uploaded_by: 'Events Committee', status: 'active', createdAt: '2024-11-05T00:00:00Z' },
//   { _id: 'md-010', file_name: 'old-brochure.pdf', file_type: 'document', file_url: 'https://example.com/media/old-brochure.pdf', file_size: '5.2 MB', uploaded_by: 'Admin', status: 'inactive', createdAt: '2024-08-15T00:00:00Z' },
// ]

// // ─── CMS Pages ──────────────────────────────────────────────────────────────────
// export const cmsPages = [
//   { _id: 'pg-001', page_title: 'About Us', slug: 'about-us', content: 'Greenfield Academy has been a beacon of educational excellence for over three decades, committed to nurturing well-rounded individuals through holistic learning.', template: 'Default', meta_title: 'About Greenfield Academy', meta_description: 'Learn about our history, mission, and commitment to educational excellence.', status: 'published', published_at: '2024-09-01T00:00:00Z', createdAt: '2024-08-25T00:00:00Z' },
//   { _id: 'pg-002', page_title: 'Admissions', slug: 'admissions', content: 'Find all the information you need about our admission process, eligibility criteria, and application deadlines for the 2025-26 academic year.', template: 'Sidebar', meta_title: 'Admissions 2025-26 | Greenfield Academy', meta_description: 'Admission process, eligibility, and deadlines for Greenfield Academy.', status: 'published', published_at: '2024-09-05T00:00:00Z', createdAt: '2024-08-28T00:00:00Z' },
//   { _id: 'pg-003', page_title: 'Academic Programs', slug: 'academic-programs', content: 'Explore our comprehensive academic programs from primary through senior secondary, designed to foster critical thinking and creativity.', template: 'Full Width', meta_title: 'Academic Programs', meta_description: 'Comprehensive academic programs from primary to senior secondary.', status: 'published', published_at: '2024-09-10T00:00:00Z', createdAt: '2024-09-01T00:00:00Z' },
//   { _id: 'pg-004', page_title: 'Campus Life', slug: 'campus-life', content: 'Discover the vibrant campus life at Greenfield Academy with diverse clubs, sports, arts, and community service opportunities.', template: 'Default', meta_title: 'Campus Life at Greenfield', meta_description: 'Explore clubs, sports, arts, and activities at Greenfield Academy.', status: 'published', published_at: '2024-09-15T00:00:00Z', createdAt: '2024-09-08T00:00:00Z' },
//   { _id: 'pg-005', page_title: 'Contact Us', slug: 'contact-us', content: 'Get in touch with us for any inquiries. Our office is open Monday to Friday, 8 AM to 4 PM. Phone: +1-555-0100. Email: info@greenfield.edu', template: 'Sidebar', meta_title: 'Contact Greenfield Academy', meta_description: 'Contact information and office hours for Greenfield Academy.', status: 'published', published_at: '2024-09-20T00:00:00Z', createdAt: '2024-09-12T00:00:00Z' },
//   { _id: 'pg-006', page_title: 'Alumni Network', slug: 'alumni-network', content: 'Our alumni network connects graduates across the globe. Join our alumni association to stay connected and give back to your alma mater.', template: 'Full Width', meta_title: 'Alumni Network', meta_description: 'Connect with Greenfield Academy alumni worldwide.', status: 'draft', published_at: null, createdAt: '2024-11-10T00:00:00Z' },
// ]

// // ─── Menus ─────────────────────────────────────────────────────────────────────
// export const menus = [
//   { _id: 'mn-001', menu_name: 'Home', menu_type: 'Header', parent_id: null, link_url: '/', display_order: 1, status: 'active', createdAt: '2024-09-01T00:00:00Z' },
//   { _id: 'mn-002', menu_name: 'About Us', menu_type: 'Header', parent_id: null, link_url: '/about-us', display_order: 2, status: 'active', createdAt: '2024-09-01T00:00:00Z' },
//   { _id: 'mn-003', menu_name: 'Admissions', menu_type: 'Header', parent_id: null, link_url: '/admissions', display_order: 3, status: 'active', createdAt: '2024-09-01T00:00:00Z' },
//   { _id: 'mn-004', menu_name: 'Privacy Policy', menu_type: 'Footer', parent_id: null, link_url: '/privacy-policy', display_order: 1, status: 'active', createdAt: '2024-09-05T00:00:00Z' },
//   { _id: 'mn-005', menu_name: 'Quick Links', menu_type: 'Sidebar', parent_id: null, link_url: '#', display_order: 1, status: 'active', createdAt: '2024-09-10T00:00:00Z' },
// ]

// // ─── Front CMS Dashboard Stats ─────────────────────────────────────────────────
// export const frontCmsStats = {
//   total_banners: banners.length,
//   published_banners: banners.filter((b) => b.status === 'published').length,
//   total_news: newsItems.length,
//   published_news: newsItems.filter((n) => n.status === 'published').length,
//   total_events: events.length,
//   published_events: events.filter((e) => e.status === 'published').length,
//   total_gallery: galleryItems.length,
//   total_pages: cmsPages.length,
//   published_pages: cmsPages.filter((p) => p.status === 'published').length,
//   total_menus: menus.length,
//   total_media: mediaItems.length,
// }
>>>>>>> e863ed6 (Updated  files)
