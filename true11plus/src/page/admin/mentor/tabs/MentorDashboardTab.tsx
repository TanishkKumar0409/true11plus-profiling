
const MentorDashboardTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="bg-amber-300/80 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <p className="text-slate-800 font-medium mb-1">Total Courses</p>
        <h2 className="text-4xl font-bold text-slate-900 mb-1">07</h2>
        <p className="text-slate-700 text-sm">2 Electives</p>
      </div>
      <div className="bg-red-200/80 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <p className="text-slate-800 font-medium mb-1">Attendance</p>
        <h2 className="text-4xl font-bold text-slate-900 mb-1">60%</h2>
        <p className="text-slate-700 text-sm">24% Absent</p>
      </div>
      <div className="bg-slate-300/60 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <p className="text-slate-800 font-medium mb-1">Requested Leaves</p>
        <h2 className="text-4xl font-bold text-slate-900 mb-1">17</h2>
        <p className="text-slate-700 text-sm">11 Approved</p>
      </div>
    </div>
  );
};

export default MentorDashboardTab;