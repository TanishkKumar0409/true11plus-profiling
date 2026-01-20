// File: src/pages/StudentList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Table, { type Column } from '../../../ui/Table'; // Ensure path is correct
import { studentsData, type Student } from '../../../data/mentor/studentlist';

const StudentList: React.FC = () => {
  const navigate = useNavigate();

  const handleViewStudent = (id: number) => {
    navigate(`/admin/students/${id}`);
  };

  const columns: Column<Student>[] = [
    {
      header: 'Student',
      className: 'font-medium text-slate-900', // Keep first column bold/dark
      render: (student) => (
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${student.avatarColor}`}>
            {student.initials}
          </div>
          {/* Name */}
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 leading-tight">{student.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      className: 'text-slate-500'
    },
    {
      header: 'Mentor',
      // Assuming your data has a mentor field, or you render it manually
      render: () => <span className="text-slate-500">Dr. Rahul Sharma</span>
    },
    {
      header: 'Course',
      accessor: 'course'
    },
    {
      header: 'Status',
      render: (student) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {student.status}
        </span>
      ),
    },
    {
      header: 'Action',
      className: 'text-center',
      render: (students) => (
        <button
          onClick={() => handleViewStudent(students.id)}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="">
      <div className="pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-slate-800">Students List</h3>

        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-xs overflow-hidden">
        <div className="w-full">
          <Table data={studentsData} columns={columns} />
        </div>

      </div>
    </div>
  );
};

export default StudentList;