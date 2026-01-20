
import { GraduationCap, Calendar } from 'lucide-react';
import { scholarshipData } from '../../../data/mentor/overview';

const Scholarship = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="mb-3">
      <h3 className="font-bold text-gray-900">Scholarship Opportunities</h3>
      <p className="text-gray-500">Financial aid options curated for you.</p>
    </div>

    {scholarshipData.map((item) => (
      <div key={item.id} className="bg-(--bg-main) p-6 rounded-xl shadow-xs hover:shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div><h3 className="text-xl font-bold text-gray-900">{item.title}</h3><p className="text-gray-500 text-sm flex items-center mt-1"><GraduationCap className="w-4 h-4 mr-1" /> {item.university}</p></div>
          <div className="text-left sm:text-right"><h3 className="text-3xl font-bold text-[#16a34a]">{item.amount}</h3><div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mt-1">{item.status}</div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="bg-(--bg-light) p-4 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Requirements</h4>
            <ul className="space-y-3">{item.requirements.map((req, i) => (<li key={i} className="flex items-center text-gray-700 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3 flex-shrink-0"></div>{req}</li>))}</ul>
          </div>
          <div className="flex flex-col justify-center p-4 bg-(--bg-light) rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Application Deadline</h4>
            <div className="flex items-center text-[#dc2626] font-bold"><Calendar className="w-5 h-5 mr-2" />{item.deadline}</div>
            <p className="text-xs text-gray-400 mt-1">Don't miss the date!</p>
          </div>
        </div>
        <div className="pt-2"><button className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-green-100">Apply for Scholarship</button></div>
      </div>
    ))}
  </div>
);

export default Scholarship;