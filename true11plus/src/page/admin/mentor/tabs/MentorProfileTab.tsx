import { Calendar, Mail, Phone } from 'lucide-react';
import { useMentorContext } from '../MentorDetail';

const ProfileTab = () => {
  // Access the data passed from the parent
  const mentor = useMentorContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h4 className="text-lg font-bold text-slate-800 mb-4">About Mentor</h4>
          <p className="text-slate-600">Senior Lecturer with 10 years of experience in Full Stack Development.</p>
        </div>
        <div>
          <div className='bg-white p-6 rounded-xl shadow-xs'>
          <h4 className="text-lg font-bold text-slate-800 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100"><Mail size={20} /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase">Email</p><p className="text-sm font-semibold text-slate-800">{mentor.email}</p></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100"><Phone size={20} /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase">Phone</p><p className="text-sm font-semibold text-slate-800">+91 98******10</p></div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="bg-indigo-900 rounded-xl p-6 text-white h-fit">
        <h3 className="text-xl font-bold mb-1">Mentorship Session</h3>
        <p className="text-indigo-200 text-sm mb-6">Next scheduled session</p>
        <div className="bg-white/10 rounded-lg p-4 mb-6 flex items-center gap-4">
          <Calendar className="w-6 h-6" />
          <div><p className="font-bold">Thursday, 24 Oct</p><p className="text-sm text-indigo-200">4:00 PM - 5:00 PM</p></div>
        </div>
        <button className="w-full bg-white text-indigo-900 font-semibold py-3 rounded-lg">Reschedule</button>
      </div>
    </div>
  );
};

export default ProfileTab;