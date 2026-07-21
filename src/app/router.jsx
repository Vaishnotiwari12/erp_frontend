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
          </Route>

          {/* Errors */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
