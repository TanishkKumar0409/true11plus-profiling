import { type StudentDashboardData } from '../../../types';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { getStudentDetail } from '../../../data/mentor/studentdetail';
import ProfileHeader from '../students/detail_component/ProfileHeader';
import TabNavigation from '../students/detail_component/TabNavigation';
import DashboardTab from './detail_component/dashboard/Dashboard';
import ProfileTab from './detail_component/ProfileTab';
import ActivityLogsTab from './detail_component/ActivityLogsTab';
import TasksTab from './detail_component/TaskTab';
import AssignmentTab from './detail_component/AssignmentTab';

const StudentDetail: React.FC = () => {
  const { id, tab } = useParams<{ id: string; tab: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<StudentDashboardData | null>(null);

  const activeTab = tab || 'dashboard';

  useEffect(() => {
    const studentData = getStudentDetail(id);
    setData(studentData);
  }, [id]);

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="text-slate-800">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/admin/students')} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-slate-600 hover:bg-white hover:text-purple-600 transition-colors hover:shadow-xs">
          <ArrowLeft className="w-4 h-4" /> <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Mentor View</span>
          <button className="p-2 hover:bg-gray-200 rounded-full text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
        </div>
      </div>

      <ProfileHeader profile={data.profile} />
      <TabNavigation activeTab={activeTab} studentId={id!} />

      {/* 2. Content Switcher: Add the new case for 'activity' */}
      {activeTab === 'dashboard' && <DashboardTab data={data} />}

      {activeTab === 'profile' && <ProfileTab profile={data.profile} />}

      {activeTab === 'activity' && <ActivityLogsTab posts={data.activityFeed} />}

      {activeTab === 'tasks' && <TasksTab tasks={data.tasks} />}

      {activeTab === 'assignment' && <AssignmentTab />}


    </div>
  );
};

export default StudentDetail;