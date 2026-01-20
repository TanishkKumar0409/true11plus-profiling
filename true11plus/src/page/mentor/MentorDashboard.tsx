import { Target, Star, Circle, CalendarDays, Clock } from 'lucide-react';
import { overviewStats, topMatchesData, deadlineData } from "../../data/mentor/overview";

const Overview = () => {
  const taskStatusData = [
    { label: 'Completed', percentage: 33, color: 'text-emerald-500', stroke: 'stroke-emerald-500', track: 'stroke-emerald-100' },
    { label: 'In Progress', percentage: 33, color: 'text-blue-500', stroke: 'stroke-blue-500', track: 'stroke-blue-100' },
    { label: 'Not Started', percentage: 33, color: 'text-red-500', stroke: 'stroke-red-400', track: 'stroke-red-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side*/}
        <div className="lg:col-span-2 bg-(--purple) rounded-xl p-8 text-white shadow-xs hover:shadow-sm relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <h3 className="font-bold text-2xl mb-2">Welcome back, Mentor!</h3>
            <p className="text-blue-100 mb-6 max-w-xl">
              Your overall profile score is 85/100. Here's what's happening with your applications.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium border border-white/10 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-200" /> Pending Tasks : 3
              </div>
            
            </div>
          </div>
        </div>

        {/* Task Status Card  */}
        <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-(--purple-subtle) p-2 rounded-full">
              <Clock className="w-4 h-4 text-(--purple)" />
            </div>
            <h4 className="text-xl font-bold text-(--purple)">Progress</h4>
          </div>

          <div className="flex justify-between items-start gap-2 mb-4">
            {taskStatusData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className={item.track}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="3"
                    />
                    <path
                      className={item.stroke}
                      strokeDasharray={`${item.percentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">{item.percentage}%</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-gray-500 text-center">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500 font-medium pt-2 border-t border-gray-50">
            Students: <span className="text-gray-900 font-bold ml-1">6</span>
          </div>
        </div>
      </div>

      {/* --- EXISTING STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, i) => (
          <div key={i} className="bg-(--bg-main) p-6 rounded-xl shadow-xs hover:shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-semibold uppercase mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} p-3 rounded-full`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* --- TOP UNIVERSITY MATCHES --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Top University Matches</h3>
          <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {topMatchesData.map((uni) => (
            <div key={uni.id} className="bg-white p-6 rounded-xl shadow-xs hover:shadow-sm transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold border border-gray-100">
                    {uni.name.charAt(0)}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{uni.name}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {uni.matchLabel}
                  </span>
                  <div className="flex items-center text-yellow-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {uni.matchScore}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">Why it's a good match</p>
                  <ul className="space-y-2">
                    {uni.goodMatchReasons.map((r, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <Circle className="w-2 h-2 mr-2 mt-1.5 fill-indigo-500 text-indigo-500 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">To improve your chances</p>
                  <ul className="space-y-2">
                    {uni.improvementTips.map((t, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <Circle className="w-2 h-2 mr-2 mt-1.5 fill-orange-500 text-orange-500 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- UPCOMING DEADLINES --- */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
        <div className="bg-(--bg-main) rounded-xl shadow-xs hover:shadow-sm overflow-hidden">
          {deadlineData.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-red-50/30 hover:bg-red-50/50 transition-colors ${
                index !== deadlineData.length - 1 ? 'border-b border-red-100' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg border border-red-100 text-red-500 shadow-sm">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-sm">{item.title}</h5>
                  <p className="text-gray-500 text-xs">{item.type}</p>
                </div>
              </div>
              <div className="text-red-700 font-bold text-sm text-right w-full sm:w-auto bg-white/50 px-3 py-1 rounded-lg border border-red-100/50">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;