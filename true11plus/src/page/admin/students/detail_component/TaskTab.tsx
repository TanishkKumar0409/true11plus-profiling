// src/components/student/TasksTab.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, Plus, ChevronRight, Calendar } from 'lucide-react';
import {type Task } from '../../../../types';

interface Props {
  tasks: Task[];
}

const TasksTab: React.FC<Props> = ({ tasks }) => {
  const { id: studentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const assignedTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  const handleTaskClick = (taskId: string) => {
    navigate(`/admin/students/${studentId}/tasks/${taskId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Assigned Tasks Section */}
      <div className="bg-white rounded-xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-xl font-bold text-slate-900">Assigned Tasks</h4>
            <p className="text-slate-500 text-sm">Active assignments and deadlines.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" />
            Assign Task
          </button>
        </div>
        <div className="space-y-4">
          {assignedTasks.map(task => (
            <TaskItem key={task.id} task={task} onClick={() => handleTaskClick(task.id)} />
          ))}
          {assignedTasks.length === 0 && <p className="text-slate-500">No active tasks.</p>}
        </div>
      </div>

      {/* Completed Tasks Section */}
      <div className="bg-white rounded-xl p-6 shadow-xs">
        <div>
            <h4 className="text-xl font-bold text-slate-900">Completed Tasks</h4>
            <p className="text-slate-500 text-sm mb-6">Past assignments history.</p>
        </div>
        <div className="space-y-4 divide-y divide-gray-100">
          {completedTasks.map(task => (
            <TaskItem key={task.id} task={task} onClick={() => handleTaskClick(task.id)} />
          ))}
          {completedTasks.length === 0 && <p className="text-slate-500">No completed tasks.</p>}
        </div>
      </div>
    </div>
  );
};

const TaskItem: React.FC<{ task: Task; onClick: () => void }> = ({ task, onClick }) => {
  const isCompleted = task.status === 'Completed';

  let icon = <AlertCircle className="w-5 h-5 text-slate-400" />;
  if (task.priority === 'High' && !isCompleted) icon = <AlertCircle className="w-5 h-5 text-red-500" />;
  else if (!isCompleted) icon = <Clock className="w-5 h-5 text-yellow-500" />;
  else icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  
  const iconBg = isCompleted ? 'bg-emerald-100' : (task.priority === 'High' ? 'bg-red-100' : 'bg-yellow-100');

  return (
    <div 
        onClick={onClick}
        className={`flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${isCompleted ? 'py-3 border-transparent' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} flex-shrink-0`}>
            {icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">{task.title}</h3>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{isCompleted ? task.submittedAt : task.timeLeft}</span>
            </div>
            {task.priority === 'High' && !isCompleted && (
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold uppercase">High Priority</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
          task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {task.status}
        </span>
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>
    </div>
  );
};

export default TasksTab;