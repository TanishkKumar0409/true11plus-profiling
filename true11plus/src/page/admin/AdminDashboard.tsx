'use client'

import React from 'react';
import { 
  Edit, 
  Shield, 
  Users, 
  Activity, 
  Settings, 
  FileText, 
  AlertCircle,
  DollarSign,
  Server,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Link } from 'react-router-dom';

// --- Interfaces ---

interface CardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick?: () => void;
}

const AdminProfilePage = () => {
  
  const permissions = [
    "User Management", "Financial Overview", "Content Moderation",
    "System Logs", "Database Access", "API Configuration"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl text-slate-800 tracking-tight">Admin<span className="text-purple-600"> Profile</span></h3>
   
      </div>

      <div className="mt-6">
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 rounded-md p-6 sm:p-8 mb-6 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">

            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold border-2 border-white/20">
                AD
              </div>
              <button
                className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-purple-500 text-white
                flex items-center justify-center shadow hover:bg-purple-600 transition"
                title="Edit profile"
                type="button"
              >
                <Edit size={14} />
              </button>
            </div>

            {/* Name & Role */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">Amit Mishra</h3>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/30 font-medium flex items-center gap-1">
                  <Shield size={10} /> Super Admin
                </span>
              </div>
              <p className="text-slate-300 mt-1">
                System Administrator & Technical Lead
              </p>
              <div className="flex gap-4 mt-3 text-sm text-slate-400">
                <span>Last Login: Today, 9:45 AM</span>
                <span>•</span>
                <span>ID: #ADM-001</span>
              </div>
            </div>
            
            {/* Header Action */}
            <div className="mt-4 sm:mt-0">
                 <Link to="/admin/dashboard?tab=settings" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <Settings size={16} /> Settings
                 </Link>
            </div>
          </div>
        </div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Total Users" 
            value="12,450" 
            trend="12%" 
            trendUp={true}
            icon={<Users size={20} />}
            color='text-white bg-purple-500'
          />
          <StatCard 
            label="Revenue" 
            value="$45,230" 
            trend="8.5%" 
            trendUp={true}
            icon={<DollarSign size={20} />}
            color="bg-green-500 text-white"
          />
          <StatCard 
            label="Active Mentors" 
            value="85" 
            trend="2 Pending" 
            trendUp={false} // Neutral
            icon={<CheckCircle2 size={20} />}
            color="bg-purple-500 text-white"
          />
          <StatCard 
            label="Server Load" 
            value="42%" 
            trend="Stable" 
            trendUp={true}
            icon={<Server size={20} />}
            color="bg-orange-500 text-white" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= LEFT COLUMN (Main Content) ================= */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-blue-600"/> Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <QuickAction 
                        icon={<Users size={22} />} 
                        label="Add New User" 
                        desc="Create student or mentor profile"
                    />
                    <QuickAction 
                        icon={<FileText size={22} />} 
                        label="Generate Report" 
                        desc="Download monthly PDF analytics"
                    />
                    <QuickAction 
                        icon={<AlertCircle size={22} />} 
                        label="System Alerts" 
                        desc="View 3 unresolved warnings"
                    />
                    <QuickAction 
                        icon={<Lock size={22} />} 
                        label="Security Audit" 
                        desc="Review recent login attempts"
                    />
                </div>
            </section>

            {/* Access Permissions */}
            <Card title="System Permissions & Roles" className="min-h-[200px]">
              <div className="flex flex-wrap gap-2">
                {permissions.map((perm) => (
                  <span
                    key={perm}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200
                    text-slate-600 text-sm font-medium hover:bg-slate-100 hover:border-slate-300 transition cursor-default"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></div>
                    {perm}
                  </span>
                ))}
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-slate-400 text-sm hover:text-purple-600 hover:border-purple-300 transition">
                    + Request Access
                </button>
              </div>
            </Card>

          </div>

          {/* ================= RIGHT COLUMN (Sidebar) ================= */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* System Health Widget */}
            <div className="bg-slate-900 rounded-md sticky top-6 p-6 text-white shadow-lg shadow-slate-200/50">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Activity size={18} className="text-emerald-400"/> System Status
                    </h4>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">
                        Operational
                    </span>
                </div>
                
                <div className="space-y-5">
                    <div className="group">
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                            <span>CPU Usage</span>
                            <span className="text-emerald-400 font-mono">42%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[42%] group-hover:w-[45%] transition-all duration-500"></div>
                        </div>
                    </div>
                    <div className="group">
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                            <span>Memory (RAM)</span>
                            <span className="text-yellow-400 font-mono">68%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 w-[68%] group-hover:w-[70%] transition-all duration-500"></div>
                        </div>
                    </div>
                     <div className="group">
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                            <span>Storage</span>
                            <span className="text-blue-400 font-mono">24%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 w-[24%]"></div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 text-center">Last updated: Just now</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Card: React.FC<CardProps> = ({ title, children, action, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${className}`}>
    <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-slate-800">
        {title}
        </h3>
        {action}
    </div>
    {children}
  </div>
);

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon, color }) => (
  <div className="bg-white rounded-md p-5 shadow-xs hover:shadow-sm transition duration-300 group cursor-default">
    <div className="flex justify-between items-start">
        <div>
            <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
            <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h4>
        </div>
        <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
            <div className={`${color.replace('bg-', 'text-')}`}>
                {icon}
            </div>
        </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            {trendUp ? '↑' : '•'} {trend}
        </span>
        <span className="text-xs text-slate-400">vs last month</span>
    </div>
  </div>
);

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, desc, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-sm hover:scale-[1.01] transition duration-200 text-left group w-full"
    >
        <div className="p-3 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
            {icon}
        </div>
        <div>
            <span className="block font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                {label}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
                {desc}
            </span>
        </div>
    </button>
);


export default AdminProfilePage;