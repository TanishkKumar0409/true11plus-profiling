
import { Routes, Route, Navigate } from 'react-router-dom';
import MentorDashboard from '../page/mentor/MentorDashboard';
import StudentList from '../page/mentor/students/StudentList';
import StudentDetail from '../page/mentor/students/StudentDetail';
import StudentRedirect from '../page/mentor/students/detail_component/UiHelper';
import TaskDetailPage from '../page/mentor/students/detail_component/TasksDetail';
import Settings from '../page/mentor/Settings';
import EducationMentorProfile from '../page/mentor/Profile';


const MentorRoutes = () => (
  <Routes>
    <Route path="/" element={<MentorDashboard />} />
    <Route path="/students" element={<StudentList />} />
    <Route path="/students/:id/:tab" element={<StudentDetail />} />
    <Route path="/students/:id/tasks/:taskId" element={<TaskDetailPage />} />
    <Route path="/students/:id" element={<StudentRedirect />} />
    <Route path="settings" element={<Settings />} />
    <Route path="profile" element={<EducationMentorProfile />} />
    <Route path="*" element={<Navigate to="/mentor" replace />} />
  </Routes>
);
export default MentorRoutes;