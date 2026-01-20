import React from 'react';
import { LayoutDashboard, Users, Settings, BookOpen, FileText } from 'lucide-react';

export type UserRole = 'admin' | 'mentor' | 'user';

export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const SIDEBAR_ITEMS: Record<UserRole, SidebarItem[]> = {
  admin: [
    { label: 'Admin Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Student', path: '/admin/students', icon: <Users size={20} /> },
    { label: 'Mentor', path: '/admin/mentors', icon: <Users size={20} /> },
    { label: 'University', path: '/admin/university', icon: <Users size={20} /> },
    { label: 'Scholarship', path: '/admin/scholarship', icon: <Settings size={20} /> },
    { label: 'Blog', path: '/admin/blog', icon: <Settings size={20} /> },
    { label: 'Events', path: '/admin/events', icon: <Settings size={20} /> },
    { label: 'News & Update', path: '/admin/newsandupdate', icon: <Settings size={20} /> },
    { label: 'Enquiry', path: '/admin/enquiry', icon: <Settings size={20} /> },
    { label: 'Help & Support', path: '/admin/helpandsupport', icon: <Settings size={20} /> },
    { label: 'Legals', path: '/admin/legals', icon: <Settings size={20} /> },
  ],
  mentor: [
    { label: 'Overview', path: '/mentor', icon: <LayoutDashboard size={20} /> },
    { label: 'Students', path: '/mentor/students', icon: <Users size={20} /> },
  ],
  user: [
    { label: 'Overview', path: '/user/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'University', path: '/user/university', icon: <BookOpen size={20} /> },
    { label: 'Scholarship', path: '/user/scholarship', icon: <FileText size={20} /> },
    // { label: 'Program', path: '/user/taskuser', icon: <FileText size={20} /> },
    { label: 'Program', path: '/user/classes', icon: <FileText size={20} /> },
  ],
};