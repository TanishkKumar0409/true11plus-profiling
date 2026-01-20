import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { type UserRole } from '../common/routesData';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    // Save to local storage
    localStorage.setItem('userRole', role);
    
    // Navigate based on role
    if (role === 'admin') navigate('/admin');
    else if (role === 'mentor') navigate('/mentor');
    else navigate('/user');
  };

  const roles = [
    {
      id: 'user',
      title: 'User',
      description: 'Browse content, book services, and manage your profile',
      icon: <User className="w-8 h-8 text-white" />,
      colorClass: 'bg-purple-600',
      hoverClass: 'hover:border-purple-200 ',
    },
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'Guide users, manage sessions, and track progress',
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      colorClass: 'bg-teal-600',
      hoverClass: 'hover:border-teal-200 ',
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Control platform settings, users, and analytics',
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      colorClass: 'bg-orange-500',
      hoverClass: 'hover:border-orange-200',
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Choose Your Role
        </h1>
        <p className="text-slate-500 text-lg">
          Select how you want to continue. Your experience will be customized based on your role.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => handleRoleSelect(role.id as UserRole)}
            className={`
              group relative bg-slate-50 rounded-lg p-8 cursor-pointer 
              transition-all duration-300 ease-in-out
              hover:-translate-y-1 hover:shadow-sm
              ${role.hoverClass}
            `}
          >
            {/* Icon Box */}
            <div className={`${role.colorClass} w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-lg`}>
              {role.icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              {role.title}
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              {role.description}
            </p>

            {/* Action Link */}
            <div className="flex items-center text-gray-600 font-semibold decoration-2 underline-offset-4 text-sm">
              Continue
              <ArrowRight className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;