// src/pages/TaskDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Folder, Download, Paperclip, Send, CheckCircle2, Circle, Plus, MessageSquare, AlignLeft } from 'lucide-react';
import { getTaskDetail } from '../../../../data/mentor/studentdetail';
import {type Task } from '../../../../types';

const TaskDetailPage: React.FC = () => {
  const { id: studentId, taskId } = useParams<{ id: string; taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const taskData = getTaskDetail(studentId, taskId);
    setTask(taskData);
  }, [studentId, taskId]);

  if (!task) return <div className="p-10 text-center">Task not found.</div>;

  return (
    <div className="min-h-screen text-slate-800">
      {/* Header - Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/admin/students/${studentId}/tasks`)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Task List</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
        {/* Left Column - Task Info, Subtasks, Discussion */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Task Card */}
          <div className="bg-white rounded-xl p-6 shadow-xs">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex gap-2 mb-3">
                  {task.priority === 'High' && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">High Priority</span>
                  )}
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{task.status}</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{task.title}</h3>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm">
                Mark Complete
              </button>
            </div>

            <div className="mb-8">
              <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3">
                <AlignLeft className="w-5 h-5" />
                DESCRIPTION
              </h4>
              <p className="text-slate-600 leading-relaxed">{task.description}</p>
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                SUBTASKS
              </h4>
              <div className="space-y-3">
                {task.subtasks?.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                    {subtask.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                    <span className={`font-medium ${subtask.isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
                {(!task.subtasks || task.subtasks.length === 0) && <p className="text-slate-500 text-sm">No subtasks.</p>}
              </div>
            </div>
          </div>
          
          {/* Discussion & Grading Section */}
          <div className="bg-white rounded-xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
                <h4 className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                    Discussion & Grading
                </h4>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">GRADE</span>
                    <select className="p-2 border border-gray-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500 bg-white">
                        <option>Select grade</option>
                        <option>A+</option>
                        <option>A</option>
                        <option>B</option>
                    </select>
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                    M
                </div>
                <div className="flex-grow relative">
                    <textarea 
                        placeholder="Write feedback or comments for the student..."
                        className="w-full p-4 border border-gray-200 rounded-xl resize-none h-32 focus:outline-none focus:border-indigo-500 bg-gray-50"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm">
                            Post <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
          </div>

        </div>

        {/* Right Column - Sidebars */}
        <div className="lg:col-span-1 space-y-8">
          {/* Task Details Sidebar */}
          <div className="bg-white rounded-xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider">TASK DETAILS</h3>
            <div className="space-y-6">
              <SidebarItem icon={<Calendar className="w-5 h-5 text-indigo-600" />} label="Due Date" value={task.dueDate} />
              {task.project && <SidebarItem icon={<Folder className="w-5 h-5 text-indigo-600" />} label="Project" value={task.project} />}
              {task.submittedAt && <SidebarItem icon={<CheckCircle2 className="w-5 h-5 text-indigo-600" />} label="Submitted At" value={task.submittedAt} />}
            </div>
          </div>

          {/* Attachments Sidebar */}
          <div className="bg-white rounded-xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider">
              ATTACHMENTS ({task.attachments?.length || 0})
            </h3>
            <div className="space-y-4 mb-6">
              {task.attachments?.map(att => (
                <div key={att.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm text-slate-400">
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className="font-semibold text-slate-900 truncate">{att.name}</div>
                    <div className="text-xs text-slate-500">{att.size}</div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full border-2 border-dashed border-gray-200 text-slate-500 font-bold py-3 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Attachment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="font-bold text-slate-900">{value}</div>
    </div>
  </div>
);

export default TaskDetailPage;