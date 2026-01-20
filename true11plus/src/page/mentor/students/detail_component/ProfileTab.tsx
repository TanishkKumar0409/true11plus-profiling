// src/components/student/ProfileTab.tsx
import React from 'react';
import { Mail, Phone, Calendar, MapPin, CalendarClock } from 'lucide-react';
import { type StudentDetailProfile } from '../../../../types';

interface Props {
  profile: StudentDetailProfile;
}

const ProfileTab: React.FC<Props> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- Left Column (Info) --- */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* About Section */}
        <div className="bg-white rounded-xl p-6 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900 mb-3">About Student</h3>
          <p className="text-slate-500 leading-relaxed">
            {profile.about}
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <ContactItem 
              icon={<Mail className="w-5 h-5 text-slate-400" />}
              label="EMAIL ADDRESS"
              value={profile.email}
            />
            {/* Phone */}
            <ContactItem 
              icon={<Phone className="w-5 h-5 text-slate-400" />}
              label="PHONE NUMBER"
              value={profile.phone}
            />
            {/* Date Joined */}
            <ContactItem 
              icon={<Calendar className="w-5 h-5 text-slate-400" />}
              label="DATE JOINED"
              value={profile.dateJoined}
            />
            {/* Location */}
            <ContactItem 
              icon={<MapPin className="w-5 h-5 text-slate-400" />}
              label="LOCATION"
              value={profile.location}
            />
          </div>
        </div>
      </div>

      {/* --- Right Column (Mentorship Session) --- */}
      <div className="lg:col-span-1">
        <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-lg h-auto">
          <h3 className="text-xl font-bold mb-2">Mentorship Session</h3>
          <p className="text-indigo-200 text-sm mb-6">Next scheduled session</p>

          <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm border border-white/10">
            <div className="flex items-start gap-3">
              <CalendarClock className="w-6 h-6 text-indigo-300 mt-1" />
              <div>
                <div className="font-bold text-lg">{profile.nextSession.date}</div>
                <div className="text-indigo-200 text-sm">{profile.nextSession.time}</div>
              </div>
            </div>
          </div>

          <button className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Reschedule
          </button>
        </div>
      </div>

    </div>
  );
};

// Helper Component for Contact Grid Items
const ContactItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
      {icon}
    </div>
    <div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
      <div className="font-semibold text-slate-900">{value}</div>
    </div>
  </div>
);

export default ProfileTab;