import { User, Mail } from 'lucide-react';

const Settings = () => (
  <div className="space-y-3 animate-in fade-in duration-500">
    <div>
      <h3 className="font-bold">Profile Settings</h3>
      <p className="text-gray-500 text-sm">Manage your account information.</p>
    </div>
    <div className="bg-(--bg-main) p-8 mb-6 rounded-md shadow-xs hover:shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <User className="w-6 h-6 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Personal Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div><label className="block text-sm font-bold text-gray-700 mb-2">First Name</label><input type="text" defaultValue="John" className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 bg-gray-50/50" /></div>
        <div><label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label><input type="text" defaultValue="Doe" className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 bg-gray-50/50" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-bold text-gray-700 mb-2">Email</label><div className="relative"><Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" /><input type="email" defaultValue="student@example.com" className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 bg-gray-50/50" /></div></div>
        <div><label className="block text-sm font-bold text-gray-700 mb-2">Role</label><input type="text" defaultValue="Student" className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 bg-gray-50/50" /></div>
      </div>
    </div>
  </div>
);

export default Settings;