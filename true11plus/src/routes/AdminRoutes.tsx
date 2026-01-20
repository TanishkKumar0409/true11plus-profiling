import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../page/admin/AdminDashboard';
import ManageUsers from '../page/admin/ManageUsers';
import UniversityDashboard from '../page/admin/University';
import Scholarship from '../page/admin/Scholarship';
import BlogDashboard from '../page/admin/Blog';
import CompetitionsDashboard from '../page/admin/Events';
import NewsDashboard from '../page/admin/NewsAndUpdate';
import EnquiryDashboard from '../page/admin/Enquiry';
import EducationHelpSupport from '../page/admin/HelpSupport';
import LegalCenter from '../page/admin/legals/LegalMain';
import Settings from '../page/admin/Settings';

import MentorList from '../page/admin/mentor/MentorList';
import MentorDetail from '../page/admin/mentor/MentorDetail';

import DashboardTab from '../page/admin/mentor/tabs/MentorDashboardTab';
import MentorProfileTab from '../page/admin/mentor/tabs/MentorProfileTab';
import StudentList from '../page/admin/students/StudentList';
import StudentDetail from '../page/admin/students/StudentDetail';
import TaskDetailPage from '../page/admin/students/detail_component/TasksDetail';
import StudentRedirect from '../page/admin/students/detail_component/UiHelper';

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="users" element={<ManageUsers />} />
    
     <Route path="/students" element={<StudentList />} />
    <Route path="/students/:id/:tab" element={<StudentDetail />} />
    <Route path="/students/:id/tasks/:taskId" element={<TaskDetailPage />} />
    <Route path="/students/:id" element={<StudentRedirect />} />

    <Route path="mentors" element={<MentorList />} />
    <Route path="mentors/:id" element={<MentorDetail />}>
      <Route index element={<DashboardTab />} />
      <Route path="profile" element={<MentorProfileTab />} />
      <Route path="participants" element={<StudentList />} />
    </Route>

    <Route path="university" element={<UniversityDashboard />} />
    <Route path="scholarship" element={<Scholarship />} />
    <Route path="blog" element={<BlogDashboard />} />
    <Route path="events" element={<CompetitionsDashboard />} />
    <Route path="newsandUpdate" element={<NewsDashboard />} />
    <Route path="enquiry" element={<EnquiryDashboard />} />
    <Route path="helpandsupport" element={<EducationHelpSupport />} />
    <Route path="legals" element={<LegalCenter />} />
    <Route path="settings" element={<Settings />} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
);

export default AdminRoutes;