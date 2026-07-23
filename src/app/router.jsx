// ====================================================================
// App Router — Route Configuration
//
// Purpose:
// Central declaration of every route in the application and the guards
// that protect them.
//
// Route groups:
//   1. Public routes — /login (wrapped in PublicRoute + AuthLayout).
//      Authenticated users are redirected away from these.
//   2. Protected routes — all module pages (wrapped in ProtectedRoute +
//      AppLayout). Unauthenticated users are redirected to /login.
//   3. Error routes — /403, /404, and the catch-all "*" fallback.
//
// Authentication flow:
//   ProtectedRoute checks `isAuthenticated` from AuthContext; if false it
//   redirects to /login preserving the intended location for post-login
//   redirect. PublicRoute does the inverse for auth pages.
//
// Lazy loading strategy:
//   Every page component is lazy()-imported so Vite splits each route into
//   its own chunk. The <Suspense> wrapper shows <PageLoader /> while the
//   chunk downloads, keeping the initial bundle small.
// ====================================================================

import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import PublicRoute from '@/routes/PublicRoute'
import PageLoader from '@/components/loaders/PageLoader'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const SchoolsPage = lazy(() => import('@/pages/schools/SchoolsPage'))
const CollegesPage = lazy(() => import('@/pages/colleges/CollegesPage'))
const DomainsPage = lazy(() => import('@/pages/domains/DomainsPage'))
const StudentsPage = lazy(() => import('@/pages/students/StudentsPage'))
const StudentProfilePage = lazy(() => import('@/pages/students/StudentProfilePage'))
const AdmissionsPage = lazy(() => import('@/pages/students/AdmissionsPage'))
const StudentCategoriesPage = lazy(() => import('@/pages/students/StudentCategoriesPage'))
const StudentHousesPage = lazy(() => import('@/pages/students/StudentHousesPage'))
const DisabledStudentsPage = lazy(() => import('@/pages/students/DisabledStudentsPage'))
const ClassesPage = lazy(() => import('@/pages/academics/ClassesPage'))
const SectionsPage = lazy(() => import('@/pages/academics/SectionsPage'))
const SubjectsPage = lazy(() => import('@/pages/academics/SubjectsPage'))
const SubjectGroupsPage = lazy(() => import('@/pages/academics/SubjectGroupsPage'))
const AssignClassTeacherPage = lazy(() => import('@/pages/academics/AssignClassTeacherPage'))
const PromoteStudentsPage = lazy(() => import('@/pages/academics/PromoteStudentsPage'))
const ClassTimetablePage = lazy(() => import('@/pages/academics/ClassTimetablePage'))
const TeachersTimetablePage = lazy(() => import('@/pages/academics/TeachersTimetablePage'))
const StudentAttendancePage = lazy(() => import('@/pages/attendance/StudentAttendancePage'))
const ApproveLeavePage = lazy(() => import('@/pages/attendance/ApproveLeavePage'))
const AttendanceByDatePage = lazy(() => import('@/pages/attendance/AttendanceByDatePage'))
const ExamGroupsPage = lazy(() => import('@/pages/examinations/ExamGroupsPage'))
const ExamSchedulePage = lazy(() => import('@/pages/examinations/ExamSchedulePage'))
const ExamResultsPage = lazy(() => import('@/pages/examinations/ExamResultsPage'))
const DesignAdmitCardPage = lazy(() => import('@/pages/examinations/DesignAdmitCardPage'))
const PrintAdmitCardPage = lazy(() => import('@/pages/examinations/PrintAdmitCardPage'))
const DesignMarksheetPage = lazy(() => import('@/pages/examinations/DesignMarksheetPage'))
const ConsolidatedMarksheetPage = lazy(() => import('@/pages/examinations/ConsolidatedMarksheetPage'))
const PrintMarksheetPage = lazy(() => import('@/pages/examinations/PrintMarksheetPage'))
const MarksGradePage = lazy(() => import('@/pages/examinations/MarksGradePage'))
const MarksDivisionPage = lazy(() => import('@/pages/examinations/MarksDivisionPage'))
const UsersPage = lazy(() => import('@/pages/users/UsersPage'))
const RolesPage = lazy(() => import('@/pages/users/RolesPage'))
const SuperAdminPage = lazy(() => import('@/pages/super-admin/SuperAdminPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const CollectFeesPage = lazy(() => import('@/pages/fees/CollectFees'))
const SearchFeesPaymentPage = lazy(() => import('@/pages/fees/SearchFeesPayment'))
const SearchDueFeesPage = lazy(() => import('@/pages/fees/SearchDueFees'))
const OfflineBankPaymentPage = lazy(() => import('@/pages/fees/OfflineBankPayment'))
const FeesReportPage = lazy(() => import('@/pages/fees/FeesReport'))
const FeesMasterPage = lazy(() => import('@/pages/fees/FeesMaster'))
const FeesGroupPage = lazy(() => import('@/pages/fees/FeesGroup'))
const FeesTypePage = lazy(() => import('@/pages/fees/FeesType'))
const FeesDiscountPage = lazy(() => import('@/pages/fees/FeesDiscount'))
const FeesCarryForwardPage = lazy(() => import('@/pages/fees/FeesCarryForward'))

// HR module — lazy-loaded so the bundle only downloads when a user visits HR pages
const StaffDirectoryPage = lazy(() => import('@/pages/hr/StaffDirectoryPage'))
const StaffAttendancePage = lazy(() => import('@/pages/hr/StaffAttendancePage'))
const PayrollPage = lazy(() => import('@/pages/hr/PayrollPage'))
const ApproveLeaveHRPage = lazy(() => import('@/pages/hr/ApproveLeaveHRPage'))
const ApplyLeavePage = lazy(() => import('@/pages/hr/ApplyLeavePage'))
const LeaveTypesPage = lazy(() => import('@/pages/hr/LeaveTypesPage'))
const TeachersRatingPage = lazy(() => import('@/pages/hr/TeachersRatingPage'))
const DepartmentPage = lazy(() => import('@/pages/hr/DepartmentPage'))
const DesignationPage = lazy(() => import('@/pages/hr/DesignationPage'))
const DisabledStaffPage = lazy(() => import('@/pages/hr/DisabledStaffPage'))

// Front Office module — lazy-loaded so the bundle only downloads when a user visits Front Office pages
const AdmissionEnquiryPage = lazy(() => import('@/pages/front-office/AdmissionEnquiryPage'))
const VisitorBookPage = lazy(() => import('@/pages/front-office/VisitorBookPage'))
const PhoneCallLogPage = lazy(() => import('@/pages/front-office/PhoneCallLogPage'))
const PostalDispatchPage = lazy(() => import('@/pages/front-office/PostalDispatchPage'))
const PostalReceivePage = lazy(() => import('@/pages/front-office/PostalReceivePage'))
const ComplaintPage = lazy(() => import('@/pages/front-office/ComplaintPage'))
const SetupFrontOfficePage = lazy(() => import('@/pages/front-office/SetupFrontOfficePage'))

// Library module — lazy-loaded so the bundle only downloads when a user visits Library pages
const BookListPage = lazy(() => import('@/pages/library/BookListPage'))
const IssueReturnPage = lazy(() => import('@/pages/library/IssueReturnPage'))
const AddBookPage = lazy(() => import('@/pages/library/AddBookPage'))
const AddStaffMemberPage = lazy(() => import('@/pages/library/AddStaffMemberPage'))

// Transport module — lazy-loaded so the bundle only downloads when a user visits Transport pages
const TransportDashboardPage = lazy(() => import('@/pages/transport/TransportDashboardPage'))
const RoutesPage = lazy(() => import('@/pages/transport/RoutesPage'))
const VehiclesPage = lazy(() => import('@/pages/transport/VehiclesPage'))
const PickupPointsPage = lazy(() => import('@/pages/transport/PickupPointsPage'))
const AssignVehiclePage = lazy(() => import('@/pages/transport/AssignVehiclePage'))
const AssignPickupPointPage = lazy(() => import('@/pages/transport/AssignPickupPointPage'))
const StudentTransportFeesPage = lazy(() => import('@/pages/transport/StudentTransportFeesPage'))
const TransportReportsPage = lazy(() => import('@/pages/transport/TransportReportsPage'))

// Hostel module — lazy-loaded so the bundle only downloads when a user visits Hostel pages
const HostelDashboardPage = lazy(() => import('@/pages/hostel/HostelDashboardPage'))
const HostelRoomsPage = lazy(() => import('@/pages/hostel/HostelRoomsPage'))
const RoomTypesPage = lazy(() => import('@/pages/hostel/RoomTypesPage'))
const RoomAllocationPage = lazy(() => import('@/pages/hostel/RoomAllocationPage'))
const StudentHostelListPage = lazy(() => import('@/pages/hostel/StudentHostelListPage'))
const HostelFeesPage = lazy(() => import('@/pages/hostel/HostelFeesPage'))
const HostelReportsPage = lazy(() => import('@/pages/hostel/HostelReportsPage'))

// Income module — lazy-loaded so the bundle only downloads when a user visits Income pages
const IncomeHeadPage = lazy(() => import('@/pages/income/IncomeHeadPage'))
const AddIncomePage = lazy(() => import('@/pages/income/AddIncomePage'))
const SearchIncomePage = lazy(() => import('@/pages/income/SearchIncomePage'))

// Expenses module — lazy-loaded so the bundle only downloads when a user visits Expenses pages
const ExpenseHeadPage = lazy(() => import('@/pages/expenses/ExpenseHeadPage'))
const AddExpensePage = lazy(() => import('@/pages/expenses/AddExpensePage'))
const SearchExpensePage = lazy(() => import('@/pages/expenses/SearchExpensePage'))

// Homework module — lazy-loaded so the bundle only downloads when a user visits Homework pages
const AddHomeworkPage = lazy(() => import('@/pages/homework/AddHomeworkPage'))
const DailyAssignmentPage = lazy(() => import('@/pages/homework/DailyAssignmentPage'))

// Lesson Plan module — lazy-loaded so the bundle only downloads when a user visits Lesson Plan pages
const ManageLessonPlanPage = lazy(() => import('@/pages/lesson-plan/ManageLessonPlanPage'))
const CopyOldLessonPage = lazy(() => import('@/pages/lesson-plan/CopyOldLessonPage'))
const LessonPage = lazy(() => import('@/pages/lesson-plan/LessonPage'))
const TopicPage = lazy(() => import('@/pages/lesson-plan/TopicPage'))

// Alumni module — lazy-loaded so the bundle only downloads when a user visits Alumni pages
const ManageAlumniPage = lazy(() => import('@/pages/alumni/ManageAlumniPage'))
const AlumniEventsPage = lazy(() => import('@/pages/alumni/AlumniEventsPage'))

// Download Center module — lazy-loaded so the bundle only downloads when a user visits Download Center pages
const ContentTypePage = lazy(() => import('@/pages/download-center/ContentTypePage'))
const ContentShareListPage = lazy(() => import('@/pages/download-center/ContentShareListPage'))
const UploadShareContentPage = lazy(() => import('@/pages/download-center/UploadShareContentPage'))
const VideoTutorialsPage = lazy(() => import('@/pages/download-center/VideoTutorialsPage'))

// Inventory module — lazy-loaded so the bundle only downloads when a user visits Inventory pages
const InventoryDashboardPage = lazy(() => import('@/pages/inventory/InventoryDashboardPage'))
const ItemCategoryPage = lazy(() => import('@/pages/inventory/ItemCategoryPage'))
const ItemStorePage = lazy(() => import('@/pages/inventory/ItemStorePage'))
const ItemSupplierPage = lazy(() => import('@/pages/inventory/ItemSupplierPage'))
const AddItemPage = lazy(() => import('@/pages/inventory/AddItemPage'))
const ItemStockPage = lazy(() => import('@/pages/inventory/ItemStockPage'))
const IssueItemPage = lazy(() => import('@/pages/inventory/IssueItemPage'))

// Online Exam module — lazy-loaded so the bundle only downloads when a user visits Online Exam pages
const OnlineExamsPage = lazy(() => import('@/pages/online-exam/OnlineExamsPage'))
const QuestionBankPage = lazy(() => import('@/pages/online-exam/QuestionBankPage'))
const AddQuestionPage = lazy(() => import('@/pages/online-exam/AddQuestionPage'))
const ExamCategoriesPage = lazy(() => import('@/pages/online-exam/CategoriesPage'))
const OnlineExamSchedulePage = lazy(() => import('@/pages/online-exam/ExamSchedulePage'))
const AssignQuestionsPage = lazy(() => import('@/pages/online-exam/AssignQuestionsPage'))
const StudentAttemptsPage = lazy(() => import('@/pages/online-exam/StudentAttemptsPage'))
const ExamResultsOnlinePage = lazy(() => import('@/pages/online-exam/ResultsPage'))
const ExamReportsPage = lazy(() => import('@/pages/online-exam/ReportsPage'))

const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'))
const ForbiddenPage = lazy(() => import('@/pages/errors/ForbiddenPage'))

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }
          >
            <Route index element={<LoginPage />} />
          </Route>

          {/* Protected */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
          {/* ── Core modules ── */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/colleges" element={<CollegesPage />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/profile" element={<StudentProfilePage />} />
            <Route path="/students/admissions" element={<AdmissionsPage />} />
            <Route path="/students/categories" element={<StudentCategoriesPage />} />
            <Route path="/students/houses" element={<StudentHousesPage />} />
            <Route path="/students/disabled" element={<DisabledStudentsPage />} />
            <Route path="/academics/classes" element={<ClassesPage />} />
            <Route path="/academics/sections" element={<SectionsPage />} />
            <Route path="/academics/subjects" element={<SubjectsPage />} />
            <Route path="/academics/subject-groups" element={<SubjectGroupsPage />} />
            <Route path="/academics/assign-class-teacher" element={<AssignClassTeacherPage />} />
            <Route path="/academics/promote-students" element={<PromoteStudentsPage />} />
            <Route path="/academics/timetable" element={<ClassTimetablePage />} />
            <Route path="/academics/teachers-timetable" element={<TeachersTimetablePage />} />
            <Route path="/attendance" element={<StudentAttendancePage />} />
            <Route path="/attendance/approve-leave" element={<ApproveLeavePage />} />
            <Route path="/attendance/by-date" element={<AttendanceByDatePage />} />
            <Route path="/examinations/exam-groups" element={<ExamGroupsPage />} />
            <Route path="/examinations/schedule" element={<ExamSchedulePage />} />
            <Route path="/examinations/results" element={<ExamResultsPage />} />
            <Route path="/examinations/design-admit-card" element={<DesignAdmitCardPage />} />
            <Route path="/examinations/print-admit-card" element={<PrintAdmitCardPage />} />
            <Route path="/examinations/design-marksheet" element={<DesignMarksheetPage />} />
            <Route path="/examinations/consolidated-marksheet" element={<ConsolidatedMarksheetPage />} />
            <Route path="/examinations/print-marksheet" element={<PrintMarksheetPage />} />
            <Route path="/examinations/marks-grade" element={<MarksGradePage />} />
            <Route path="/examinations/marks-division" element={<MarksDivisionPage />} />

            <Route path="/fees/collect" element={<CollectFeesPage />} />
            <Route path="/fees/search-payment" element={<SearchFeesPaymentPage />} />
            <Route path="/fees/search-due" element={<SearchDueFeesPage />} />
            <Route path="/fees/offline-payment" element={<OfflineBankPaymentPage />} />
            <Route path="/fees/report" element={<FeesReportPage />} />
            <Route path="/fees/master" element={<FeesMasterPage />} />
            <Route path="/fees/group" element={<FeesGroupPage />} />
            <Route path="/fees/type" element={<FeesTypePage />} />
            <Route path="/fees/discount" element={<FeesDiscountPage />} />
            <Route path="/fees/carry-forward" element={<FeesCarryForwardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/roles" element={<RolesPage />} />
            <Route path="/super-admin" element={<SuperAdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* ── Human Resources ── */}
            <Route path="/hr/staff" element={<StaffDirectoryPage />} />
            <Route path="/hr/attendance" element={<StaffAttendancePage />} />
            <Route path="/hr/payroll" element={<PayrollPage />} />
            <Route path="/hr/approve-leave" element={<ApproveLeaveHRPage />} />
            <Route path="/hr/apply-leave" element={<ApplyLeavePage />} />
            <Route path="/hr/leave-types" element={<LeaveTypesPage />} />
            <Route path="/hr/teachers-rating" element={<TeachersRatingPage />} />
            <Route path="/hr/departments" element={<DepartmentPage />} />
            <Route path="/hr/designations" element={<DesignationPage />} />
            <Route path="/hr/disabled-staff" element={<DisabledStaffPage />} />

            {/* ── Front Office ── */}
            <Route path="/front-office/enquiry" element={<AdmissionEnquiryPage />} />
            <Route path="/front-office/visitor-book" element={<VisitorBookPage />} />
            <Route path="/front-office/call-log" element={<PhoneCallLogPage />} />
            <Route path="/front-office/dispatch" element={<PostalDispatchPage />} />
            <Route path="/front-office/receive" element={<PostalReceivePage />} />
            <Route path="/front-office/complaint" element={<ComplaintPage />} />
            <Route path="/front-office/setup" element={<SetupFrontOfficePage />} />

            {/* ── Library ── */}
            <Route path="/library/books" element={<BookListPage />} />
            <Route path="/library/issue-return" element={<IssueReturnPage />} />
            <Route path="/library/add-book" element={<AddBookPage />} />
            <Route path="/library/staff" element={<AddStaffMemberPage />} />

            {/* ── Transport ── */}
            <Route path="/transport" element={<TransportDashboardPage />} />
            <Route path="/transport/routes" element={<RoutesPage />} />
            <Route path="/transport/vehicles" element={<VehiclesPage />} />
            <Route path="/transport/pickup-points" element={<PickupPointsPage />} />
            <Route path="/transport/assign-vehicle" element={<AssignVehiclePage />} />
            <Route path="/transport/assign-pickup-point" element={<AssignPickupPointPage />} />
            <Route path="/transport/fees" element={<StudentTransportFeesPage />} />
            <Route path="/transport/reports" element={<TransportReportsPage />} />

            {/* ── Hostel ── */}
            <Route path="/hostel" element={<HostelDashboardPage />} />
            <Route path="/hostel/rooms" element={<HostelRoomsPage />} />
            <Route path="/hostel/room-types" element={<RoomTypesPage />} />
            <Route path="/hostel/allocation" element={<RoomAllocationPage />} />
            <Route path="/hostel/students" element={<StudentHostelListPage />} />
            <Route path="/hostel/fees" element={<HostelFeesPage />} />
            <Route path="/hostel/reports" element={<HostelReportsPage />} />

            {/* ── Income ── */}
            <Route path="/income/head" element={<IncomeHeadPage />} />
            <Route path="/income/add" element={<AddIncomePage />} />
            <Route path="/income/search" element={<SearchIncomePage />} />

            {/* ── Expenses ── */}
            <Route path="/expenses/head" element={<ExpenseHeadPage />} />
            <Route path="/expenses/add" element={<AddExpensePage />} />
            <Route path="/expenses/search" element={<SearchExpensePage />} />

            {/* ── Homework ── */}
            <Route path="/homework/add" element={<AddHomeworkPage />} />
            <Route path="/homework/daily-assignment" element={<DailyAssignmentPage />} />

            {/* ── Lesson Plan ── */}
            <Route path="/lesson-plan/manage" element={<ManageLessonPlanPage />} />
            <Route path="/lesson-plan/copy" element={<CopyOldLessonPage />} />
            <Route path="/lesson-plan/lesson" element={<LessonPage />} />
            <Route path="/lesson-plan/topic" element={<TopicPage />} />

            {/* ── Alumni ── */}
            <Route path="/alumni" element={<ManageAlumniPage />} />
            <Route path="/alumni/events" element={<AlumniEventsPage />} />

            {/* ── Download Center ── */}
            <Route path="/download-center/content-types" element={<ContentTypePage />} />
            <Route path="/download-center/share-list" element={<ContentShareListPage />} />
            <Route path="/download-center/contents" element={<UploadShareContentPage />} />
            <Route path="/download-center/video-tutorials" element={<VideoTutorialsPage />} />

            {/* ── Inventory ── */}
            <Route path="/inventory" element={<InventoryDashboardPage />} />
            <Route path="/inventory/categories" element={<ItemCategoryPage />} />
            <Route path="/inventory/stores" element={<ItemStorePage />} />
            <Route path="/inventory/suppliers" element={<ItemSupplierPage />} />
            <Route path="/inventory/add-item" element={<AddItemPage />} />
            <Route path="/inventory/stock" element={<ItemStockPage />} />
            <Route path="/inventory/issue" element={<IssueItemPage />} />

            {/* ── Online Exam ── */}
            <Route path="/online-exam" element={<OnlineExamsPage />} />
            <Route path="/online-exam/question-bank" element={<QuestionBankPage />} />
            <Route path="/online-exam/add-question" element={<AddQuestionPage />} />
            <Route path="/online-exam/categories" element={<ExamCategoriesPage />} />
            <Route path="/online-exam/schedule" element={<OnlineExamSchedulePage />} />
            <Route path="/online-exam/assign-questions" element={<AssignQuestionsPage />} />
            <Route path="/online-exam/attempts" element={<StudentAttemptsPage />} />
            <Route path="/online-exam/results" element={<ExamResultsOnlinePage />} />
            <Route path="/online-exam/reports" element={<ExamReportsPage />} />
          </Route>

          {/* Errors */}
          {/* ── Error / fallback routes ── */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
