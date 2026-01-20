// src/components/student/DashboardTab.tsx
import React from 'react';
import StatsGrid from './StatsGrid';
import ClassSchedule from './ClassSchedule';
import ActivityFeed from './ActivityFeed';
import { type StudentDashboardData } from '../../../../../types';

interface Props {
  data: StudentDashboardData;
}

const DashboardTab: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        <StatsGrid stats={data.stats} />
        <ClassSchedule classes={data.todayClasses} />
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1">
        <ActivityFeed activities={data.recentActivity} />
      </div>
    </div>
  );
};

export default DashboardTab;