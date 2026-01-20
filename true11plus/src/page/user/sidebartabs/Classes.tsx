import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MoreHorizontal,
  BookOpen,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { mockClasses } from '../../../data/user/classes'; // Ensure path is correct

const ClassesPage = () => {
  const navigate = useNavigate();

  // Helper for dynamic colors based on ID
  const getTheme = (id) => {
    const themes = [
      {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'group-hover:border-blue-200',
        button: 'group-hover:bg-blue-600',
        badge: 'bg-blue-100 text-blue-700'
      },
      {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'group-hover:border-emerald-200',
        button: 'group-hover:bg-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700'
      },
      {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'group-hover:border-purple-200',
        button: 'group-hover:bg-purple-600',
        badge: 'bg-purple-100 text-purple-700'
      },
      {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'group-hover:border-orange-200',
        button: 'group-hover:bg-orange-600',
        badge: 'bg-orange-100 text-orange-700'
      },
    ];
    return themes[id % themes.length];
  };

  return (
    <div className=" animate-in fade-in duration-700">

      {/* --- Page Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4 border-b border-gray-100">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Programs</h3>
          <p className="text-gray-500 mt-2 text-base">Select a program to view tasks and details.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            Archived
          </button>
          <button className="flex-1 sm:flex-none bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all">
            View Schedule
          </button>
        </div>
      </div>

      {/* --- Responsive Grid Layout --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">

        {mockClasses.slice(0, 4).map((cls) => {
          const theme = getTheme(cls.id);
          const classNumber = cls.id + 5; // Simulating "Class 6", "Class 7", etc.

          // Get the first 4 tasks to display
          const displayTasks = cls.tasks ? cls.tasks.slice(0, 4) : [];

          return (
            <div
              key={cls.id}
              className={`group bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 ${theme.border} transition-all duration-300 flex flex-col justify-between h-full`}
            >

              {/* Card Header: Icon & Class Highlight */}
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.bg} ${theme.text} transition-colors`}>
                  <BookOpen className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2">
                  {/* Prominent Class Highlight Badge */}
                  <div className={`flex items-center px-3 py-1.5 rounded-lg ${theme.badge} border border-white shadow-sm`}>
                    <Layers className="w-3.5 h-3.5 mr-1.5" />
                    <span className="text-xs font-bold uppercase tracking-wide">Class {classNumber < 10 ? `0${classNumber}` : classNumber}</span>
                  </div>

                  <button className="text-gray-300 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content: Task List */}
              <div className="flex-1 flex flex-col mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Required Tasks ({displayTasks.length})
                </p>

                <div className="space-y-3">
                  {displayTasks.map((task, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-gray-600 group/task">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${task.status === 'Completed' ? 'text-emerald-500' : 'text-gray-300 group-hover/task:text-indigo-400'} transition-colors`} />
                      <span className="line-clamp-1 leading-snug">{task.title}</span>
                    </div>
                  ))}

                  {/* Placeholder if less than 4 tasks */}
                  {displayTasks.length < 4 && Array(4 - displayTasks.length).fill(0).map((_, i) => (
                    <div key={`placeholder-${i}`} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-gray-200 border-dashed"></div>
                      <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Button - Subscribe */}
              <div className="pt-4 border-t border-gray-50">
                <button
                  onClick={() => navigate(`/user/taskuser`)}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 bg-white
                  ${theme.button} group-hover:text-white group-hover:border-transparent group-hover:shadow-lg
                  transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassesPage;