import React from 'react';
import { BookOpen, AlertCircle, FileText } from 'lucide-react';
import { type StudentStats } from '../../../../../types';

interface Props {
  stats: StudentStats;
}

const StatsGrid: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-yellow-400/80 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-8"><BookOpen size={44} color="black" /></div>
        <h4 className="text-slate-800 text-sm font-semibold mb-1">Total Courses</h4>
        <div className="text-4xl font-bold text-slate-900 mb-1">{stats.totalCourses}</div>
        <h4 className="text-slate-800 font-semibold opacity-70">{stats.electives} Electives</h4>
      </div>
      <div className="bg-pink-200 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-8"><AlertCircle size={44} color="black" /></div>
        <h4 className="text-slate-800 text-sm font-semibold mb-1">Attendance</h4>
        <div className="text-4xl font-bold text-red-900 mb-1">{stats.attendancePercentage}%</div>
        <h4 className="text-red-700 font-semibold opacity-70">{stats.missedClasses}% Absent</h4>
      </div>
      <div className="bg-slate-300 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-8"><FileText size={44} color="black" /></div>
        <h4 className="text-slate-700 text-sm font-medium mb-1">Requested Leaves</h4>
        <div className="text-4xl font-bold text-slate-800 mb-1">{stats.leavesRequested}</div>
        <div className="text-slate-600 font-semibold opacity-70">{stats.leavesApproved} Approved</div>
      </div>
    </div>
  );
};

export default StatsGrid;