import React from 'react';
import { type ActivityLog } from '../../../../../types';

interface Props {
  activities: ActivityLog[];
}

const ActivityFeed: React.FC<Props> = ({ activities }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs">
      <h4 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Recent Activity</h4>
      <div className="relative pl-4 border-l border-slate-700 space-y-8">
        {activities.map((activity) => (
          <div key={activity.id} className="relative">
            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-slate-900 bg-indigo-500 ring-4 ring-slate-900" />
            <h4 className="font-semibold text-sm mb-1">{activity.title}</h4>
            <p className="text-slate-400 text-xs">{activity.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;