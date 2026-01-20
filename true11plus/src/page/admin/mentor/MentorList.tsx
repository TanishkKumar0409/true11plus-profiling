// File: src/page/admin/mentor/MentorList.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mentorsData, type Mentor } from '../../../data/admin/mentorlist'; // Adjust path as needed
import Table from '../../../ui/Table';
// --- Reusing your Table Component Here ---
export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}



const MentorList = () => {
  const navigate = useNavigate();

  // Handle viewing a mentor by Navigating to URL
  const handleViewMentor = (id: number) => {
    // This pushes /admin/mentors/1 to the browser history
    navigate(`${id}`); 
  };

  const columns: Column<Mentor>[] = [
    {
      header: 'MENTOR',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${item.avatarColor}`}>
            {item.initial}
          </div>
          <span className="font-medium text-slate-800">{item.name}</span>
        </div>
      ),
    },
    { header: 'EMAIL', accessor: 'email', className: "text-gray-500" },
    { header: 'SPECIALIZATION', accessor: 'specialization', className: "text-gray-500" },
    {
      header: 'PROGRESS',
      render: (item) => (
        <div className="flex items-center gap-3 w-32">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.progress}%` }}></div>
          </div>
          <span className="text-xs text-gray-500">{item.progress}%</span>
        </div>
      ),
    },
    {
      header: 'STATUS',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      header: 'ACTION',
      render: (item) => (
        <button 
          onClick={() => handleViewMentor(item.id)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-slate-900">Mentor List</h4>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Mentor
        </button>
      </div>
      <Table data={mentorsData} columns={columns} />
    </div>
  );
};

export default MentorList;