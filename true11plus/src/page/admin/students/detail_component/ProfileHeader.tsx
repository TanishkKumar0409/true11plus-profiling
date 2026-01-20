import React from 'react';
import { MapPin, BookOpen } from 'lucide-react';
import {type StudentDetailProfile } from '../../../../types';

interface Props {
  profile: StudentDetailProfile;
}

const ProfileHeader: React.FC<Props> = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold flex-shrink-0 shadow-inner">
        {profile.initials}
      </div>
      <div className="flex-grow w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{profile.name}</h4>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                <BookOpen className="w-3 h-3" />
                {profile.course}
              </span>
              <span>• ID: {profile.studentId}</span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3 h-3" />
                {profile.status}
              </span>
            </div>
          </div>
        </div>
        <div className="h-px bg-gray-100 my-4" />
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium uppercase text-xs tracking-wider">Current Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              profile.currentStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              ● {profile.currentStatus}
            </span>
          </div>
          <div className="flex-grow w-full md:w-auto flex items-center gap-4">
            <span className="text-slate-500 text-sm whitespace-nowrap">Overall Course Progress</span>
            <div className="flex-grow bg-gray-100 h-3 rounded-full overflow-hidden relative w-full max-w-md">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${profile.overallProgress}%` }}
              />
            </div>
            <span className="font-bold text-slate-700">{profile.overallProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;