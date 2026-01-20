import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Table, { type Column } from '../../../ui/Table';
import { studentsData, type Student } from '../../../data/mentor/studentlist';

const StudentList: React.FC = () => {
  const navigate = useNavigate();
  
  const handleViewStudent = (id: number) => {
    navigate(`/mentor/students/${id}`); 
  };

  const columns: Column<Student>[] = [
    {
      header: 'Student',
      render: (student) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${student.avatarColor}`}>
            {student.initials}
          </div>
          <span className="font-semibold text-slate-900">{student.name}</span>
        </div>
      ),
    },
    { header: 'Email', accessor: 'email', className: 'text-slate-500' },
    { header: 'Course', accessor: 'course' },
    {
      header: 'Progress',
      render: (student) => (
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${student.progress}%` }}
            />
          </div>
          <span className="text-slate-500 text-xs">{student.progress}%</span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (student) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {student.status}
        </span>
      ),
    },
    {
      header: 'Action',
      className: 'text-center',
      render: (students) => (
        // 4. Add onClick handler to the button
        <button 
          onClick={() => handleViewStudent(students.id)}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="">
        <div className="flex justify-between items-center pb-6">
          <h3 className="text-xl font-bold text-slate-800">Students List</h3>
          <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        <Table data={studentsData} columns={columns} />
      </div>
    </div>
  );
};

export default StudentList;