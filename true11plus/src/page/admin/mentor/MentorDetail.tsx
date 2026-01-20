
import { useParams, useNavigate, NavLink, Outlet, useOutletContext } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin } from 'lucide-react';
import { mentorsData } from "../../../data/admin/mentorlist";

// 1. Define the type for the data you are passing down
type MentorContextType = typeof mentorsData[0];

// 2. Export a custom hook so child tabs can easily access this data
export const useMentorContext = () => {
  return useOutletContext<MentorContextType>();
};

const MentorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find mentor
  const selectedMentor = mentorsData.find(m => m.id === Number(id));

  if (!selectedMentor) {
    return (
      <div className="p-6">
        Mentor not found. 
        <button onClick={() => navigate('/admin/mentors')} className="text-blue-500 underline ml-2">
          Go back
        </button>
      </div>
    );
  }

  // Helper for tab styling
  const getTabClass = (isActive: boolean) => 
    `pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
      isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
    }`;

  return (
    <div className="">
      <button 
        onClick={() => navigate('/admin/mentors')}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-700 mb-6 hover:bg-white px-4 py-2 rounded-lg hover:shadow-xs"
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold ${selectedMentor.avatarColor}`}>
            {selectedMentor.initial}
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <h4 className="text-2xl font-bold text-slate-900">{selectedMentor.name}</h4>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-2">
                <BookOpen size={14} /> {selectedMentor.specialization}
              </span>
              <span className="text-slate-400 text-sm flex items-center gap-1"><MapPin size={14} /> Online</span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 border-t border-gray-50 pt-4">
              <div className="flex-1 w-full flex items-center gap-4">
                 <span className="text-slate-500 text-sm whitespace-nowrap">Overall Course Progress</span>
                 <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedMentor.progress}%` }}></div>
                 </div>
                 <span className="text-slate-900 font-bold">{selectedMentor.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-200 pb-0">
        <div className="flex gap-8 w-full md:w-auto overflow-x-auto">
          {/* 'end' matches exactly /:id */}
          <NavLink to="" end className={({ isActive }) => getTabClass(isActive)}>
            Dashboard
          </NavLink>
          <NavLink to="profile" className={({ isActive }) => getTabClass(isActive)}>
            Profile
          </NavLink>
          <NavLink to="participants" className={({ isActive }) => getTabClass(isActive)}>
            Participants List
          </NavLink>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[400px]">
        {/* Pass data to children via context */}
        <Outlet context={selectedMentor} />
      </div>
    </div>
  );
};

export default MentorDetail;