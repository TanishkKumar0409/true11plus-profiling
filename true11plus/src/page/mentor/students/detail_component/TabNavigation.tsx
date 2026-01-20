// src/components/student/TabNavigation.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  activeTab: string;
  studentId: string; // Needed to build the URL
}

const TabNavigation: React.FC<Props> = ({ activeTab, studentId }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'activity', label: 'Activity Logs' },
    { id: 'tasks', label: 'Tasks & Projects' },
    { id: 'assignment', label: 'Assignment' },
  ];

  return (
    <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          // Click Handler: Update URL instead of State
          onClick={() => navigate(`/mentor/students/${studentId}/${tab.id}`)}
          className={`
            pb-2 text-sm font-semibold transition-all relative whitespace-nowrap
            ${activeTab === tab.id 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-gray-300'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;