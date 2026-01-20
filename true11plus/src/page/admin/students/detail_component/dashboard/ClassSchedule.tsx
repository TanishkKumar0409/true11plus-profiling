import React from 'react';
import { type ClassSession } from '../../../../../types';

interface Props {
  classes: ClassSession[];
}

const ClassSchedule: React.FC<Props> = ({ classes }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-xs">
      <h4 className="text-xl font-bold text-slate-900 mb-1">Today's Classes</h4>
      <div className="space-y-4 mt-6">
        {classes.map((cls) => (
          <div key={cls.id} className={`p-4 rounded-xl flex justify-between items-center ${cls.colorClass}`}>
            <div>
              <div className="text-indigo-600 font-bold text-sm mb-1">{cls.code}</div>
              <div className="text-slate-900 font-bold text-lg">{cls.subject}</div>
              <div className="text-slate-500 text-sm">{cls.room}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-900 font-bold mb-1">{cls.time}</div>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                cls.status === 'Attended' ? 'bg-white/50 text-green-700' : 'bg-red-100 text-red-600'
              }`}>
                {cls.status}
              </span>
            </div>
          </div>
        ))}
        {classes.length === 0 && <p className="text-slate-400">No classes scheduled.</p>}
      </div>
    </div>
  );
};

export default ClassSchedule;