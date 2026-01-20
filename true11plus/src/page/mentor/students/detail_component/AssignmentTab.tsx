// src/components/student/AssignmentTab.tsx
import React from 'react';
import { FolderOpen, Upload } from 'lucide-react';

const AssignmentTab: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Icon Wrapper */}
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <FolderOpen className="w-10 h-10 text-indigo-500" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-slate-900 mb-3">
        No Documents Uploaded
      </h2>

      {/* Subtitle */}
      <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        There are no certificates, assignments, or resumes uploaded for this student yet.
      </p>

      {/* Action Button */}
      <button className="flex items-center gap-2 mx-auto bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-slate-700 font-medium px-6 py-3 rounded-xl transition-colors">
        <Upload className="w-5 h-5 text-slate-400" />
        <span>Upload New File</span>
      </button>
    </div>
  );
};

export default AssignmentTab;