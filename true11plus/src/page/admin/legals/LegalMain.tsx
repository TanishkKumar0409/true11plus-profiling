import React, { useState } from 'react';
import {
  FileText,
  Lock,
  Cookie,
  ShieldCheck,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Types ---
type TabKey = 'privacy' | 'terms' | 'cookies';

interface LegalSection {
  id: TabKey;
  title: string;
  description: string;
  icon: React.ReactNode;
  lastUpdated: string;
  content: React.ReactNode;
}

const LegalCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('privacy');

  // --- Data ---
  const legalContent: Record<TabKey, LegalSection> = {
    privacy: {
      id: 'privacy',
      title: "Privacy Policy",
      description: "How we collect, use, and protect your data.",
      icon: <Lock className="w-5 h-5" />,
      lastUpdated: "December 26, 2025",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to our Privacy Policy. Your privacy is critically important to us.
            This policy outlines how we collect, use, and protect your personal information
            across our digital platforms.
          </p>

          <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h4 className="font-semibold text-purple-900 mb-2">Key Highlights</h4>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-purple-800">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> No data selling to third parties
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Encrypted data transmission
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> User control over data deletion
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> GDPR & CCPA Compliant
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h4>
            <p className="text-gray-600 mb-4">
              We only collect information about you if we have a reason to do so — for example, to provide our services, to communicate with you, or to make our services better.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-purple-500">
              <li><strong>Account Information:</strong> Name, email, and password.</li>
              <li><strong>Usage Data:</strong> How you interact with our dashboard.</li>
              <li><strong>Device Data:</strong> IP address and browser type for security.</li>
            </ul>
          </div>
        </div>
      )
    },
    terms: {
      id: 'terms',
      title: "Terms of Service",
      description: "The rules and regulations for using our platform.",
      icon: <FileText className="w-5 h-5" />,
      lastUpdated: "December 20, 2025",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            These Terms of Service govern your use of our website. By accessing or using the service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
          </p>

          <div className="border-l-4 border-purple-500 pl-6 py-2 bg-gray-50 rounded-r-lg">
            <p className="text-sm text-gray-600 italic">
              "By using our platform, you acknowledge that you are at least 18 years of age and legally competent to enter into this agreement."
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h4>
            <p className="text-gray-600">
              By accessing our website, you confirm that you have read, understood, and agreed to be bound by these terms. We reserve the right to modify these terms at any time.
            </p>
          </div>
        </div>
      )
    },
    cookies: {
      id: 'cookies',
      title: "Cookie Policy",
      description: "Information about how we use cookies.",
      icon: <Cookie className="w-5 h-5" />,
      lastUpdated: "November 15, 2025",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them.
          </p>

          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">1. What are cookies?</h4>
            <p className="text-gray-600">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners in order to make their websites work, or to work more efficiently.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4">2. Cookie Categories</h4>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Essential</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Required for the site to function correctly.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Marketing</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Used to deliver relevant advertisements to you.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  };

  const activeContent = legalContent[activeTab];

  return (
    <div className="min-h-screen">

      <div className="">
        <h3 className="font-bold text-gray-900 tracking-tight">
          Terms, Privacy & Policies
        </h3>
        <p className="text-gray-500 leading-relaxed">
          Transparent, clear, and fair. Read our policies below to understand how we protect you.
        </p>
      </div>


      {/* --- Main Content Layout --- */}
      <div className="py-8">

        {/* --- Top Navigation Tabs (Scrollable on Mobile) --- */}
        <nav className="mb-8">
          <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-4 snap-x">
            {(Object.values(legalContent) as LegalSection[]).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    min-w-[260px] mb-3 sm:min-w-0 flex-shrink-0 snap-start
                    relative flex items-center gap-3 p-2 rounded-md transition-all duration-200 border text-left
                    ${isActive
                      ? 'bg-white border-purple-200 ring-1 ring-purple-100 z-10'
                      : 'bg-white border-transparent hover:border-gray-200 hover:bg-white text-gray-500'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-colors duration-200
                    ${isActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'}
                  `}>
                    {item.icon}
                  </div>
                  <div>
                    <div className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {item.title}
                    </div>
                    {/* Optional: Show tiny text on mobile if needed */}
                    <div className="text-xs text-gray-400 sm:hidden">
                      Tap to view
                    </div>
                  </div>

                  {/* Active Indicator Arrow (Desktop Only) */}
                  {isActive && (
                    <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-purple-200 transform rotate-45 hidden sm:block"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* --- Content Area --- */}
        <main className="bg-white rounded-md shadow-xs min-h-[600px] flex flex-col relative z-0">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h4 className="text-xl! font-bold text-gray-900 flex items-center gap-3">
                  {activeContent.title}
                </h4>
              </div>
              <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                </span>
                <span>Updated {activeContent.lastUpdated}</span>
              </div>

            </div>
          </div>

          {/* Document Body */}
          <div className="p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {activeContent.content}
          </div>

          </main>

        {/* --- Bottom Support Section --- */}
        <div className="mt-6 bg-purple-700 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-xl text-purple-200">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Still have questions?</h4>
              <p className="text-purple-200 text-sm">Our legal team is available to clarify any concerns.</p>
            </div>
          </div>

          <Link to="/admin/dashboard?tab=helpandsupport" className="relative z-10 text-sm font-semibold bg-white text-purple-900 px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors inline-flex items-center gap-2 whitespace-nowrap shadow-lg">
            Contact Support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LegalCenter;