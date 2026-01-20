import { Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from '../page/user/UserDashboard';
import UserHome from '../page/user/Home';
import DashboardLayout from '../layout/DashboardLayout'; 
import Assessment from '../page/user/Assessment';
import Tasks from '../page/user/tasks/Tasks';
import ProfileDetails from '../page/user/profile/Profile';
import PostProfile from '../page/user/profile/Post-profile';
import ProfilePublic from '../page/user/profile/Public-profile';
import University from '../page/user/sidebartabs/University';
import Scholarship from '../page/user/sidebartabs/Scholarship';
import Taskuser, { TaskDetailsPage } from '../page/user/sidebartabs/Taskuser';
import Settings from '../page/user/sidebartabs/Settings';
import Program from '../page/user/sidebartabs/Classes';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<UserHome />} />
      <Route path="assessment" element={<Assessment />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="profile/:userId" element={<ProfileDetails />} />
      <Route path="profile-post/:userId" element={<PostProfile />} />
    
      <Route path="profile-public/:userId" element={<ProfilePublic />} />

      <Route element={<DashboardLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="university" element={<University />} />
        <Route path="scholarship" element={<Scholarship />} />
        <Route path="classes" element={<Program />} />
        <Route path="taskuser" element={<Taskuser />} />
        <Route path="/taskuser/:id" element={<TaskDetailsPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
  );
};

export default UserRoutes;