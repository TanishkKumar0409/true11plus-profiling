import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './page/Login';
import DashboardLayout from './layout/DashboardLayout';
import AdminRoutes from './routes/AdminRoutes';
import MentorRoutes from './routes/MentorRoutes';
import UserRoutes from './routes/UserRoutes';
import Navbar from './components/MainNavbar';

// 1. Logic to show/hide the top Navbar
const ConditionalNavbar = () => {
  const location = useLocation();

  const isHidden =
    location.pathname === '/login' ||
    location.pathname.startsWith('/mentor') ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/user/dashboard' ||
    location.pathname === '/user/university' ||
    location.pathname === '/user/scholarship' ||
    location.pathname === '/user/classes' ||
    location.pathname === '/user/classes/1' ||
    location.pathname === '/user/classes/2' ||
    location.pathname === '/user/classes/3' ||
    location.pathname === '/user/taskuser' ||
    location.pathname === '/user/taskuser/1'||
    location.pathname === '/user/taskuser/2'||
    location.pathname === '/user/taskuser/3'||
    location.pathname === '/user/taskuser/4'||
    location.pathname === '/user/settings';

  if (isHidden) return null;
  return <Navbar />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Navbar will now appear on /user/home because of the logic above */}
      <ConditionalNavbar />

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Redirect root to Login (or to /user/home if you prefer) */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/user/*" element={<UserRoutes />} />

      
        <Route element={<DashboardLayout />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/mentor/*" element={<MentorRoutes />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;