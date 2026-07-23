# ERP_FRONTEND - Technical Documentation

**Version:** 0.1  
**Date:** July 2026  
**Status:** Active Development - Frontend Development Phase, Backend Integration In Progress

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Current Development Progress](#2-current-development-progress)
3. [Technology Stack](#3-technology-stack)
4. [Architecture](#4-architecture)
5. [Folder Structure](#5-folder-structure)
6. [Authentication](#6-authentication)
7. [Routing](#7-routing)
8. [Components](#8-components)
9. [Hooks](#9-hooks)
10. [Services](#10-services)
11. [Mock Data](#11-mock-data)
12. [Module Documentation](#12-module-documentation)
13. [Planned Modules](#13-planned-modules)
14. [Coding Standards](#14-coding-standards)
15. [Development Workflow](#15-development-workflow)
16. [Future Roadmap](#16-future-roadmap)

---

## 1. Introduction

ERP_FRONTEND is the frontend application for a multi-tenant educational ERP system. The application provides a web interface for managing school and college operations including student records, academics, attendance, examinations, fees, and administrative functions.

The frontend is built with React and uses a component-based architecture. Business logic is isolated in custom hooks, data fetching is handled through a service layer, and the application currently uses mock data for development. Backend API integration is in progress.

---

## 2. Current Development Progress

### Completed
- Authentication UI with login/logout flows
- Dashboard with KPI cards and activity feed
- Student Management module pages
- Academics module pages
- Attendance module pages
- Examination module pages
- Fees module pages
- HR module pages
- Library module pages
- Transport module pages
- Hostel module pages
- Front Office module pages
- User Management pages
- School/College/Domain Management pages
- Settings and Profile pages
- Shared component library (DataTable, StatCard, PageHeader, etc.)
- Responsive layout with sidebar navigation
- Route guards (ProtectedRoute, PublicRoute)
- Mock service layer for all modules
- Theme system (light/dark/system modes)

### In Progress
- Backend API integration
- JWT authentication implementation
- Data validation and error handling
- Testing and bug fixes

### Planned
- React Query integration for data caching
- Role-based access control implementation
- Performance optimization
- Production deployment configuration

---

## 3. Technology Stack

### Framework and Build Tools
- React 19.2.7 - UI library
- Vite 8.1.1 - Build tool and dev server
- JavaScript (ES6+) - Language

### Routing and State
- React Router DOM 7.18.1 - Client-side routing with lazy loading
- React Context API - Global state management
- Custom hooks - Module-specific state and data fetching

### Styling
- Tailwind CSS 3.4.19 - Utility-first CSS
- PostCSS 8.5.19 - CSS processing
- Radix UI - Headless UI components for dialogs, dropdowns, forms, etc.

### Forms and Validation
- React Hook Form 7.81.0 - Form state management
- Zod 4.4.3 - Schema validation
- @hookform/resolvers - Form validation integration

### Data and Tables
- Axios 1.18.1 - HTTP client for API calls
- @tanstack/react-table 8.21.3 - Headless table for DataTable component

### Visualization
- Recharts 3.9.2 - Chart library for dashboards

### Utilities
- Lucide React 1.24.0 - Icon library
- date-fns 4.4.0 - Date manipulation and formatting
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.6.0 - Tailwind class merging

---

## 4. Architecture

The application follows a layered architecture:

### Presentation Layer
Page components render the UI and handle user interactions. Pages use shared components for consistent UI patterns and module-specific components for domain-specific functionality.

### Business Logic Layer
Custom hooks encapsulate business logic and data fetching. The `useAsyncData` hook provides a generic pattern for async operations. Module-specific hooks (e.g., `useStudents`, `useAcademics`) handle module-specific logic.

### Service Layer
Service files provide a clean abstraction for API calls. Each module has a corresponding service file that defines methods for CRUD operations. Services currently return mock data and will be updated to call backend APIs during integration.

### Data Layer
Mock data files in `src/data/` provide sample data for development. The `mockResponse` function wraps data in a standardized response format. Backend APIs will replace mock data during integration.

### State Management
- Local component state uses React hooks (useState, useEffect)
- Global state uses React Context (AuthContext, ThemeContext)
- Server state uses custom hooks (planned migration to React Query)

---

## 5. Folder Structure

```
erp_frontend/
├── src/
│   ├── app/                    # Application configuration
│   │   ├── App.jsx             # Root component
│   │   ├── providers.jsx       # Context providers wrapper
│   │   └── router.jsx          # Route configuration with lazy loading
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Radix UI components
│   │   ├── DataTable/          # Sortable table component
│   │   ├── StatCard/           # KPI card component
│   │   ├── PageHeader/         # Page title header
│   │   ├── SearchBar/          # Search input
│   │   ├── FilterBar/          # Filter controls
│   │   ├── ActionDropdown/     # Row action menu
│   │   ├── Drawer/             # Slide-over panel
│   │   ├── DeleteDialog/       # Delete confirmation
│   │   ├── LoadingSkeleton/    # Loading placeholder
│   │   ├── NoData/             # Empty state
│   │   ├── sidebar/            # Sidebar navigation
│   │   ├── navbar/             # Top navigation bar
│   │   └── ...                 # Other shared components
│   ├── config/                 # Configuration files
│   │   └── sidebar.js          # Sidebar menu structure
│   ├── constants/              # Application constants
│   │   ├── app.js              # App-wide constants
│   │   └── navigation.js       # Navigation and domain constants
│   ├── context/                # React contexts
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── ThemeContext.jsx    # Theme state
│   ├── data/                   # Mock data files
│   │   ├── students.mock.js
│   │   ├── academics.mock.js
│   │   ├── attendance.mock.js
│   │   └── ...                 # Other module mock data files
│   ├── hooks/                  # Custom hooks
│   │   ├── useAsyncData.js     # Generic async data fetcher
│   │   ├── useStudents.js      # Student data operations
│   │   ├── useAcademics.js     # Academics data operations
│   │   └── ...                 # Other module hooks
│   ├── layouts/                # Layout components
│   │   ├── AppLayout.jsx       # Main application layout
│   │   └── AuthLayout.jsx      # Authentication layout
│   ├── lib/                    # Library utilities
│   │   └── utils.js            # Utility functions (cn, etc.)
│   ├── pages/                  # Page components
│   │   ├── dashboard/          # Dashboard module
│   │   ├── students/           # Student Management module
│   │   ├── academics/          # Academics module
│   │   ├── attendance/         # Attendance module
│   │   ├── examinations/       # Examination module
│   │   ├── fees/               # Fees module
│   │   ├── hr/                 # HR module
│   │   ├── library/            # Library module
│   │   ├── transport/          # Transport module
│   │   ├── hostel/             # Hostel module
│   │   ├── front-office/       # Front Office module
│   │   ├── inventory/          # Inventory module
│   │   ├── online-exam/        # Online Exam module
│   │   ├── download-center/    # Download Center module
│   │   ├── homework/           # Homework module
│   │   ├── lesson-plan/        # Lesson Plan module
│   │   ├── alumni/             # Alumni module
│   │   ├── income/             # Income module
│   │   ├── expenses/           # Expenses module
│   │   ├── schools/            # School Management
│   │   ├── colleges/           # College Management
│   │   ├── domains/            # Domain Management
│   │   ├── users/              # User Management
│   │   ├── settings/           # Settings
│   │   └── profile/            # Profile
│   ├── routes/                 # Route guards
│   │   ├── ProtectedRoute.jsx  # Authenticated route guard
│   │   └── PublicRoute.jsx     # Public route guard
│   ├── services/               # Service layer
│   │   ├── api.js              # Axios configuration
│   │   ├── mockData.js         # Mock response wrapper
│   │   ├── student.service.js  # Student API
│   │   ├── academics.service.js # Academics API
│   │   └── ...                 # Other service files
│   ├── styles/                 # Global styles
│   │   └── index.css           # Main stylesheet
│   └── utils/                  # Utility functions
│       ├── format.js           # Formatting utilities
│       └── export.js           # Export utilities
```

---

## 6. Authentication

### AuthContext
**Location:** `src/context/AuthContext.jsx`

Manages authentication state across the application. Stores session in localStorage under key `scholaria.auth`.

**State:**
- `session` - Current session object containing token and user data
- `isLoading` - Loading state during login

**Methods:**
- `login({ email, password })` - Authenticates user and stores session
- `logout()` - Clears session and redirects to login

**Current Implementation:**
Uses mock authentication. The `authService.login()` method returns a mock user object with test credentials.

**Backend Integration Notes:**
Will integrate with backend authentication endpoints. Expected to receive JWT token and user data from backend. Token will be stored in session and included in API request headers.

### authService
**Location:** `src/services/auth.service.js`

**Current Methods:**
- `login({ email, password })` - Returns mock user data
- `logout()` - Mock logout

**Backend Integration Notes:**
Will call POST /auth/login and POST /auth/logout endpoints during API integration phase.

---

## 7. Routing

### Router Configuration
**Location:** `src/app/router.jsx`

Configures all application routes using React Router DOM. All page components are lazy-loaded for code splitting.

**Features:**
- Lazy loading for all page components using React.lazy()
- Suspense fallback shows PageLoader during chunk loading
- ProtectedRoute wraps authenticated pages
- PublicRoute wraps login page
- Error routes for 403 and 404
- Catch-all route redirects unmatched paths to 404

### Route Guards

**ProtectedRoute** (`src/routes/ProtectedRoute.jsx`)
Checks `isAuthenticated` from AuthContext. Redirects to /login if user is not authenticated. Preserves intended location in state for post-login redirect.

**PublicRoute** (`src/routes/PublicRoute.jsx`)
Redirects authenticated users away from public routes (login). Default redirect is /dashboard.

---

## 8. Components

### Shared Components

**DataTable** (`src/components/DataTable/`)
Sortable, paginated table built on TanStack Table. Supports row selection, bulk actions, and CSV export. Used across all list pages.

**StatCard** (`src/components/StatCard/`)
KPI display card with large value, icon, and optional trend indicator. Used on dashboard and module dashboards.

**PageHeader** (`src/components/PageHeader/`)
Consistent page title with optional icon, description, and right-aligned action buttons. Used on all pages.

**SearchBar** (`src/components/SearchBar/`)
Search input with debouncing (300ms delay). Includes clear button and icon.

**FilterBar** (`src/components/FilterBar/`)
Container for filter controls with horizontal layout and responsive wrapping.

**ActionDropdown** (`src/components/ActionDropdown/`)
Dropdown menu for row-level actions in DataTable.

**Drawer** (`src/components/Drawer/`)
Slide-over panel from right side. Used for forms (add/edit records).

**DeleteDialog** (`src/components/DeleteDialog/`)
Confirmation dialog for delete operations with warning message.

**LoadingSkeleton** (`src/components/LoadingSkeleton/`)
Loading state placeholder with table and card variants.

**NoData** (`src/components/NoData/`)
Empty state display with icon, message, and optional action button.

### UI Components

Radix UI components in `src/components/ui/` include button, dialog, select, table, input, checkbox, radio-group, switch, dropdown-menu, popover, tooltip, toast, tabs, accordion, and others. These provide accessible, unstyled primitives styled with Tailwind CSS.

---

## 9. Hooks

### Generic Hooks

**useAsyncData** (`src/hooks/useAsyncData.js`)
Generic async data fetcher. Accepts a fetcher function and returns data, isLoading, error, and refetch. Unwraps the { success, data, message } response envelope used by services.

**useDebounce** (`src/hooks/useDebounce.js`)
Debounce utility for search inputs. Default delay is 300ms.

**useMediaQuery** (`src/hooks/useMediaQuery.js`)
Responsive breakpoint detection.

**useToast** (`src/hooks/use-toast.js`)
Toast notification hook from sonner library.

### Module Hooks

Each module has a dedicated hook for data operations:
- `useStudents` - Student data operations
- `useAcademics` - Academics data operations
- `useAttendance` - Attendance data operations
- `useExaminations` - Examination data operations
- `useFees` - Fee data operations
- `useHR` - HR data operations
- `useLibrary` - Library data operations
- `useTransport` - Transport data operations
- `useHostel` - Hostel data operations
- `useInventory` - Inventory data operations
- `useOnlineExam` - Online exam data operations
- `useDownloadCenter` - Download center data operations
- `useAlumni` - Alumni data operations
- `useHomework` - Homework data operations
- `useLessonPlan` - Lesson plan data operations
- `useIncome` - Income data operations
- `useExpenses` - Expenses data operations

---

## 10. Services

### Service Pattern

Each service file follows a consistent pattern:

```javascript
export const moduleService = {
  async list(params = {}) { /* GET endpoint */ },
  async get(id) { /* GET by id */ },
  async create(payload) { /* POST */ },
  async update(id, payload) { /* PUT */ },
  async remove(id) { /* DELETE */ },
}
```

Services currently use mock data via the `mockResponse` function. TODO comments in each service file indicate the planned backend endpoints.

### Available Services

- `student.service.js` - Student operations
- `academics.service.js` - Academics operations
- `attendance.service.js` - Attendance operations
- `examination.service.js` - Examination operations
- `fees.service.js` - Fee operations
- `hr.service.js` - HR operations
- `library.service.js` - Library operations
- `transport.service.js` - Transport operations
- `hostel.service.js` - Hostel operations
- `inventory.service.js` - Inventory operations
- `onlineExam.service.js` - Online exam operations
- `frontOffice.service.js` - Front office operations
- `downloadCenter.service.js` - Download center operations
- `homework.service.js` - Homework operations
- `lessonPlan.service.js` - Lesson plan operations
- `alumni.service.js` - Alumni operations
- `income.service.js` - Income operations
- `expenses.service.js` - Expenses operations
- `school.service.js` - School operations
- `college.service.js` - College operations
- `domain.service.js` - Domain operations
- `users.service.js` - User operations
- `auth.service.js` - Authentication operations

### API Client

**Location:** `src/services/api.js`

Axios instance configured with:
- Base URL from VITE_API_BASE_URL environment variable (defaults to /api)
- 15 second timeout
- Content-Type: application/json header
- withCredentials: true for httpOnly cookie support

**Request Interceptor:**
Attaches JWT token from localStorage to Authorization header as fallback to cookies.

**Response Interceptor:**
Unwraps { success, data, message } envelope. Normalizes errors. Automatically clears session on 401 responses.

---

## 11. Mock Data

### Mock Data Organization

Mock data files are organized by module in `src/data/`. Each file exports arrays of mock objects matching the expected data structure for that module.

**Available Mock Data Files:**
- `students.mock.js` - Student records, admissions, categories, houses
- `academics.mock.js` - Classes, sections, subjects, teachers, timetables
- `attendance.mock.js` - Attendance records, leave applications
- `examinations.mock.js` - Exam groups, schedules, results
- `fees.mock.js` - Fee records, fee masters, discounts
- `hr.mock.js` - Staff records, payroll, leave types
- `library.mock.js` - Books, issue records
- `transport.mock.js` - Routes, vehicles, pickup points
- `hostel.mock.js` - Rooms, allocations
- `inventory.mock.js` - Items, stock, suppliers
- `onlineExam.mock.js` - Questions, exams, attempts
- `frontOffice.mock.js` - Enquiries, visitors, calls
- `downloadCenter.mock.js` - Content, tutorials
- `homework.mock.js` - Homework assignments
- `lessonPlan.mock.js` - Lessons, topics
- `alumni.mock.js` - Alumni records, events
- `income.mock.js` - Income records
- `expenses.mock.js` - Expense records
- `schools.mock.js` - School configurations
- `colleges.mock.js` - College configurations
- `domains.mock.js` - Domain configurations
- `users.mock.js` - User accounts, roles
- `auth.mock.js` - Authentication test data

### mockResponse Function

**Location:** `src/services/mockData.js`

Wraps data in a Promise that resolves after a simulated delay (600ms by default). Returns a standardized response format:

```javascript
{
  success: true,
  data: T,
  message: 'Fetched successfully'
}
```

This matches the expected backend response format so switching to real APIs requires minimal changes to components.

---

## 12. Module Documentation

## Dashboard Module

### Purpose
Provides a central hub displaying school-wide statistics, activity feed, and quick navigation to other modules.

### Current Implementation
DashboardPage displays KPI cards showing key metrics, an activity feed showing recent system activities, and chart components for data visualization. Uses mock data for statistics and activities.

### Folder Location
`src/pages/dashboard/DashboardPage.jsx`

### Future Development
- Real-time data updates via WebSocket
- Customizable dashboard layout
- Widget system for adding/removing cards
- Advanced analytics and reporting

### Backend Integration Notes
Will call GET /api/dashboard/stats for statistics and GET /api/dashboard/activities for activity feed. Chart data will come from dedicated analytics endpoints.

### Known Limitations
- Static dashboard layout
- No customization options
- Mock data only
- No real-time updates

## Student Management Module

### Purpose
Manages student records including personal information, admission details, categories, and houses. Supports CRUD operations for student data.

### Current Implementation
Includes pages for student list, student profile, admissions, student categories, student houses, and disabled students. Uses DataTable for listing, Drawer for forms, and StatusBadge for status indicators. StudentForm component handles add/edit operations.

### Folder Location
`src/pages/students/`

### Future Development
- Bulk import/export functionality
- Student photo upload
- Document attachments
- Parent linking and management
- Academic history tracking
- Advanced filtering and search

### Backend Integration Notes
Service file includes TODO comments for planned endpoints: GET/POST/PUT/DELETE /api/student/details, GET /api/student/disabled, GET /api/student/online-admission, GET /api/student/category, GET /api/student/house. Integration will replace mock data with API calls.

### Known Limitations
- No photo upload capability
- No document management
- No parent linking
- No academic history
- Mock data only

## Academics Module

### Purpose
Manages academic structure including classes, sections, subjects, subject groups, class teachers, and timetables. Supports student promotion between classes.

### Current Implementation
Pages for classes, sections, subjects, subject groups, class teacher assignment, student promotion, class timetable, and teacher timetable. Uses DataTable for listing and forms for CRUD operations.

### Folder Location
`src/pages/academics/`

### Future Development
- Timetable conflict detection
- Drag-and-drop timetable editor
- Subject prerequisites and dependencies
- Credit system implementation
- Grading scale configuration
- Academic calendar management

### Backend Integration Notes
Service includes planned endpoints for classes, sections, subjects, subject groups, teachers, class teachers, and timetables. Integration will replace mock data with API calls to backend academics endpoints.

### Known Limitations
- No conflict detection for timetables
- No drag-and-drop interface
- No prerequisite validation
- Mock data only

## Attendance Module

### Purpose
Tracks student attendance and manages leave application approval workflow.

### Current Implementation
Pages for student attendance marking, leave approval, and attendance viewing by date. Uses DataTable for records and forms for attendance marking.

### Folder Location
`src/pages/attendance/`

### Future Development
- Bulk attendance marking
- Attendance notifications to parents
- Attendance analytics and reports
- Auto-attendance integration with biometric systems
- Mobile app for teachers

### Backend Integration Notes
Service includes planned endpoints for attendance records, leave applications, and attendance by date. Integration will replace mock data with API calls.

### Known Limitations
- No bulk marking capability
- No notification system
- No analytics
- Mock data only

## Examination Module

### Purpose
Manages exam groups, exam schedules, exam results, admit cards, and marksheets. Supports exam configuration and result processing.

### Current Implementation
Pages for exam groups, exam schedules, exam results, admit card design/printing, marksheet design/printing, marks grading, and marks division. Uses forms for configuration and DataTable for listings.

### Folder Location
`src/pages/examinations/`

### Future Development
- Automatic grade calculation
- Result publishing workflow with parent notifications
- Advanced analytics and comparative reports
- Question paper management
- Exam hall allocation

### Backend Integration Notes
Service includes planned endpoints for exam groups, schedules, results, admit cards, and marksheets. Integration will replace mock data with API calls.

### Known Limitations
- No automatic grade calculation
- No publishing workflow
- No question paper management
- Mock data only

## Fees Module

### Purpose
Manages fee collection, fee payments, fee masters, fee groups, fee types, fee discounts, and fee reports. Supports payment processing and due fee tracking.

### Current Implementation
Pages for fee collection, payment search, due fee search, offline bank payment, fee reports, fee master, fee groups, fee types, fee discounts, and fee carry forward. Uses DataTable for listings and forms for fee operations.

### Folder Location
`src/pages/fees/`

### Future Development
- Online payment gateway integration
- Automatic payment reminders via SMS/email
- Payment receipt customization
- Fee concession rules engine
- Payment history and analytics

### Backend Integration Notes
Service includes planned endpoints for fee collection, payments, reports, and fee configuration. Integration will replace mock data with API calls and add payment gateway integration.

### Known Limitations
- No online payment capability
- No reminder system
- No receipt customization
- Mock data only

## HR Module

### Purpose
Manages staff directory, staff attendance, payroll, leave management, leave types, teacher ratings, departments, designations, and disabled staff records.

### Current Implementation
Pages for staff directory, staff attendance, payroll, leave approval, leave application, leave types, teacher ratings, departments, designations, and disabled staff. Uses DataTable for listings and forms for HR operations.

### Folder Location
`src/pages/hr/`

### Future Development
- Automated payroll calculation with tax handling
- Leave balance tracking and accrual
- Performance review system
- Training and development tracking
- Recruitment workflow management
- Employee self-service portal

### Backend Integration Notes
Service includes planned endpoints for staff, attendance, payroll, leave applications, leave types, departments, and designations. Integration will replace mock data with API calls.

### Known Limitations
- Manual payroll calculation only
- No automated leave tracking
- No performance review system
- Mock data only

## Library Module

### Purpose
Manages library books, book issue/return operations, and library staff. Tracks book inventory and circulation.

### Current Implementation
Pages for book list, issue/return, add books, and library staff. Uses DataTable for book listings and forms for book management.

### Folder Location
`src/pages/library/`

### Future Development
- Barcode scanning for books
- Fine calculation and collection
- Due date reminders
- Book reservation system
- Reading recommendations
- Library analytics

### Backend Integration Notes
Service includes planned endpoints for books, issue records, and library staff. Integration will replace mock data with API calls.

### Known Limitations
- No barcode scanning
- No fine calculation
- No reservation system
- Mock data only

## Transport Module

### Purpose
Manages transport routes, vehicles, pickup points, vehicle assignments, pickup point assignments, transport fees, and transport reports.

### Current Implementation
Pages for transport dashboard, routes, vehicles, pickup points, vehicle assignment, pickup point assignment, transport fees, and transport reports. Uses DataTable for listings and forms for transport management.

### Folder Location
`src/pages/transport/`

### Future Development
- GPS tracking for vehicles
- Route optimization algorithms
- Fuel consumption tracking
- Maintenance scheduling
- Parent notifications for delays
- Mobile app for drivers

### Backend Integration Notes
Service includes planned endpoints for routes, vehicles, pickup points, assignments, and fees. Integration will replace mock data with API calls.

### Known Limitations
- No GPS tracking
- No route optimization
- No maintenance tracking
- Mock data only

## Hostel Module

### Purpose
Manages hostel rooms, room types, room allocations, student hostel lists, hostel fees, and hostel reports.

### Current Implementation
Pages for hostel dashboard, hostel rooms, room types, room allocation, student hostel list, hostel fees, and hostel reports. Uses DataTable for listings and forms for hostel management. Includes occupancy and capacity indicators.

### Folder Location
`src/pages/hostel/`

### Future Development
- Bed-level management
- Visitor logging system
- Mess management integration
- Attendance tracking for hostel residents
- Room amenities management
- Hostel analytics

### Backend Integration Notes
Service includes planned endpoints for rooms, room types, allocations, and fees. Integration will replace mock data with API calls.

### Known Limitations
- No bed-level management
- No visitor logging
- No mess management
- Mock data only

## Front Office Module

### Purpose
Manages admission enquiries, visitor book, phone call logs, postal dispatch/receive, complaints, and front office setup.

### Current Implementation
Pages for admission enquiry, visitor book, phone call log, postal dispatch, postal receive, complaint, and front office setup. Uses DataTable for listings and forms for front office operations.

### Folder Location
`src/pages/front-office/`

### Future Development
- Automated follow-up reminders
- SMS and email notifications
- Document attachment support
- Analytics dashboard
- Integration with communication tools

### Backend Integration Notes
Service includes planned endpoints for enquiries, visitors, calls, postal records, and complaints. Integration will replace mock data with API calls.

### Known Limitations
- No automated reminders
- No notification system
- No document attachments
- Mock data only

## Inventory Module

### Purpose
Manages inventory items, item categories, item stores, item suppliers, item stock, and item issues.

### Current Implementation
Pages for inventory dashboard, item categories, item stores, item suppliers, add items, item stock, and issue items. Uses DataTable for listings and forms for inventory management.

### Folder Location
`src/pages/inventory/`

### Future Development
- Barcode scanning for items
- Stock forecasting and reordering
- Purchase order management
- Return and refund tracking
- Asset lifecycle management
- Inventory analytics

### Backend Integration Notes
Service includes planned endpoints for categories, items, stores, suppliers, stock, and issues. Integration will replace mock data with API calls.

### Known Limitations
- No barcode scanning
- No forecasting
- No purchase orders
- Mock data only

## Online Exam Module

### Purpose
Manages online exams, question banks, exam categories, exam schedules, question assignments, student attempts, exam results, and exam reports.

### Current Implementation
Pages for online exams, question bank, add questions, categories, exam schedule, assign questions, student attempts, results, and reports. Uses DataTable for listings and forms for exam management.

### Folder Location
`src/pages/online-exam/`

### Future Development
- Proctoring integration
- Time tracking and auto-submit
- Random question selection
- Question pooling
- Advanced analytics and comparison
- Mobile-friendly exam interface

### Backend Integration Notes
Service includes planned endpoints for questions, exams, categories, schedules, assignments, attempts, and results. Integration will replace mock data with API calls.

### Known Limitations
- No proctoring
- No time tracking
- No randomization
- Mock data only

## Download Center Module

### Purpose
Manages content types, content sharing, upload/share content, and video tutorials.

### Current Implementation
Pages for content types, content share list, upload/share content, and video tutorials. Uses DataTable for listings and forms for content management.

### Folder Location
`src/pages/download-center/`

### Future Development
- File versioning
- Access control and permissions
- Download analytics
- Content recommendations
- Search optimization
- Large file handling

### Backend Integration Notes
Service includes planned endpoints for content types, content, and videos. Integration will replace mock data with API calls.

### Known Limitations
- No versioning
- No access control
- No analytics
- Mock data only

## Homework Module

### Purpose
Manages homework assignments and daily assignments.

### Current Implementation
Pages for add homework and daily assignment. Uses DataTable for listings and forms for homework management.

### Folder Location
`src/pages/homework/`

### Future Development
- File attachments for assignments
- Submission tracking
- Grading system
- Parent notifications
- Assignment templates
- Plagiarism checking

### Backend Integration Notes
Service includes planned endpoints for homework and daily assignments. Integration will replace mock data with API calls.

### Known Limitations
- No file attachments
- No submission tracking
- No grading system
- Mock data only

## Lesson Plan Module

### Purpose
Manages lesson plans, lesson copying, lessons, and topics.

### Current Implementation
Pages for manage lesson plan, copy old lesson, lesson, and topic. Uses DataTable for listings and forms for lesson plan management.

### Folder Location
`src/pages/lesson-plan/`

### Future Development
- Resource library integration
- Lesson sharing between teachers
- Template library
- Calendar view for planning
- Progress tracking
- Standards alignment

### Backend Integration Notes
Service includes planned endpoints for lesson plans, lessons, topics, and copying. Integration will replace mock data with API calls.

### Known Limitations
- No resource library
- No sharing capability
- No calendar view
- Mock data only

## Alumni Module

### Purpose
Manages alumni records and alumni events.

### Current Implementation
Pages for manage alumni and alumni events. Uses DataTable for listings and forms for alumni management.

### Folder Location
`src/pages/alumni/`

### Future Development
- Alumni networking platform
- Job board and career services
- Mentorship program
- Donation tracking
- Newsletter management
- Event registration

### Backend Integration Notes
Service includes planned endpoints for alumni and events. Integration will replace mock data with API calls.

### Known Limitations
- No networking features
- No job board
- No mentorship system
- Mock data only

## Income Module

### Purpose
Tracks income heads and income records.

### Current Implementation
Pages for income head, add income, and search income. Uses DataTable for listings and forms for income management.

### Folder Location
`src/pages/income/`

### Future Development
- Recurring income setup
- Income projections and forecasting
- Budget tracking
- Financial reports
- Integration with accounting systems

### Backend Integration Notes
Service includes planned endpoints for income heads and records. Integration will replace mock data with API calls.

### Known Limitations
- No recurring income
- No projections
- No budget tracking
- Mock data only

## Expenses Module

### Purpose
Tracks expense heads and expense records.

### Current Implementation
Pages for expense head, add expense, and search expense. Uses DataTable for listings and forms for expense management.

### Folder Location
`src/pages/expenses/`

### Future Development
- Budget tracking and alerts
- Expense approval workflow
- Receipt scanning and OCR
- Expense analytics
- Integration with accounting systems

### Backend Integration Notes
Service includes planned endpoints for expense heads and records. Integration will replace mock data with API calls.

### Known Limitations
- No budget tracking
- No approval workflow
- No receipt scanning
- Mock data only

## User Management Module

### Purpose
Manages user accounts and roles.

### Current Implementation
Pages for users and roles. Uses DataTable for listings and forms for user management.

### Folder Location
`src/pages/users/`

### Future Development
- Permission system implementation
- Audit logging for user actions
- User groups for bulk operations
- SSO integration
- Multi-factor authentication
- User activity tracking

### Backend Integration Notes
Service includes planned endpoints for users and roles. Integration will replace mock data with API calls.

### Known Limitations
- No permission system
- No audit logging
- No SSO
- Mock data only

## School/College/Domain Management Module

### Purpose
Manages school, college, and domain configurations for multi-tenant architecture.

### Current Implementation
Separate pages for schools, colleges, and domains. Uses DataTable for listings and forms for institution management.

### Folder Location
`src/pages/schools/`, `src/pages/colleges/`, `src/pages/domains/`

### Future Development
- Institution templates
- Bulk configuration operations
- Institution cloning
- Migration tools
- Domain-level analytics
- Subdomain routing

### Backend Integration Notes
Service includes planned endpoints for schools, colleges, and domains. Integration will replace mock data with API calls.

### Known Limitations
- No templates
- No bulk operations
- No subdomain routing
- Mock data only

## Settings Module

### Purpose
Provides application settings and user profile configuration.

### Current Implementation
Settings page with theme toggle and basic settings. Profile page for user information management.

### Folder Location
`src/pages/settings/`, `src/pages/profile/`

### Future Development
- Notification preferences
- Privacy settings
- Accessibility options
- Language selection
- Timezone configuration
- System-wide settings for admins

### Backend Integration Notes
Planned endpoints for settings and profile management. Integration will replace local state with API calls.

### Known Limitations
- Limited settings options
- No backend integration
- No notification settings
- No accessibility options

---

## 13. Planned Modules

The following modules are planned for future development but are not yet implemented:

### Reports Module
Centralized reporting system with custom report builder, scheduled reports, and multi-format export (PDF, Excel, CSV).

### Notifications Module
In-app notification system with real-time updates, notification preferences, and notification history.

### Communication Module
Internal messaging system, announcements, and communication between staff, students, and parents.

### Certificates Module
Certificate generation for students, staff, and various achievements with customizable templates.

### Analytics Module
Advanced analytics dashboard with custom reports, data visualization, and predictive analytics.

### Audit Logs Module
Comprehensive audit logging system tracking all user actions, data changes, and system events.

### Activity Timeline Module
Timeline view of activities across modules with filtering and search capabilities.

### Role Permissions Module
Granular permission system defining access control at module and feature level.

### System Logs Module
Application error logs, performance metrics, and system health monitoring.

---

## 14. Coding Standards

### Naming Conventions
- Components: PascalCase (e.g., `StudentForm.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useStudents.js`)
- Services: camelCase with `service` suffix (e.g., `student.service.js`)
- Utilities: camelCase (e.g., `format.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_PAGE_SIZE`)
- Files: camelCase for utilities, PascalCase for components

### Component Structure
Components should include a header comment explaining purpose, props, and usage:

```javascript
// Component: ComponentName
// Purpose: Brief description
// Props: prop1 - description, prop2 - description
// Used by: ParentComponent1, ParentComponent2

import { useState, useEffect } from 'react'

export function ComponentName({ prop1, prop2 }) {
  // State declarations
  // Effects
  // Event handlers
  // Render
}
```

### File Organization
- Keep components focused and single-purpose
- Extract logic into custom hooks
- Use services for all API calls
- Use utilities for pure functions
- Avoid prop drilling where context is appropriate

### Code Style
- Use functional components with hooks
- Prefer const over let
- Use template literals for string interpolation
- Destructure props and objects
- Use meaningful variable names
- Add comments for complex logic

---

## 15. Development Workflow

### Local Development

**Setup:**
```bash
npm install
```

**Development Server:**
```bash
npm run dev
```
Opens at http://localhost:5173

**Build:**
```bash
npm run build
```

**Preview Build:**
```bash
npm run preview
```

**Linting:**
```bash
npm run lint
```

### Adding a New Module

1. Create page component in `src/pages/module-name/`
2. Create service file in `src/services/module.service.js`
3. Create mock data in `src/data/module.mock.js`
4. Create custom hook in `src/hooks/useModule.js` (if needed)
5. Add route in `src/app/router.jsx`
6. Add navigation in `src/config/sidebar.js`
7. Add constants in `src/constants/navigation.js` (if needed)

### Adding a New Component

1. Create component folder in `src/components/ComponentName/`
2. Create index.jsx with component implementation
3. Add header comment with purpose, props, usage
4. Export component
5. Follow existing component patterns

---

## 16. Future Roadmap

### Backend API Integration
- Replace mock data with real API calls across all modules
- Implement JWT authentication with token refresh
- Add proper error handling and loading states
- Implement request retry logic for failed requests

### Role Based Access Control
- Implement permission system at module and feature level
- Add role guards to routes
- Filter sidebar menu based on user role
- Implement permission checks in components

### Performance Optimization
- Implement React Query for data caching and synchronization
- Add code splitting for larger modules
- Optimize bundle size
- Implement lazy loading for images
- Optimize re-renders with memo and useMemo

### Testing
- Add unit tests for hooks and utilities
- Add integration tests for components
- Add E2E tests for critical user flows
- Set up testing infrastructure

### Deployment
- Configure production build settings
- Set up CI/CD pipeline
- Configure environment variables
- Set up monitoring and error tracking
- Configure CDN for static assets
- Implement caching strategy

### Documentation Updates
- Keep documentation updated with API changes
- Add API documentation as backend endpoints are defined
- Document deployment procedures
- Add troubleshooting guide

### New ERP Modules
- Implement planned modules (Reports, Notifications, Communication, etc.)
- Add module-specific features based on user feedback
- Integrate third-party services (payment gateways, SMS, email)

### Notification System
- Implement real-time notifications via WebSocket
- Add in-app notification center
- Implement notification preferences
- Add email and SMS notifications for critical events

### Audit Logs
- Implement comprehensive audit logging
- Add audit log viewer for admins
- Track all data changes
- Implement log retention policy

---

**Document End**