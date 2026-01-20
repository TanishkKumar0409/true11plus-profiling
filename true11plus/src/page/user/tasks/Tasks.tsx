
import { Target } from 'lucide-react';
import { modules, features, faqs } from '../../../data/user/tasksdata';
import SectionHeader from './components/SectionHeader';
import ModuleCard from './components/ModuleCard.';
import FeatureCard from './components/FeatureCard';
import FAQItem from './components/FAQItem';
import Universitylogo from './components/Universitylogo';
import { Link } from 'react-router-dom';

const Tasks = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-200 selection:text-amber-900">

      <div className="px-6 py-12 md:py-20 relative">

        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold mb-6 tracking-wide shadow-sm">
            PROGRAM 2025
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            A Curriculum Built by Experts & <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600">
              Top-Tier Alumni
            </span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-12 leading-relaxed">
            Experience a world-class curriculum designed to elevate your profile,
            sharpen your skills, and unlock the doors to elite universities.
          </p>

          {/* University Logos Bar */}
          <div className="">
            <Universitylogo />
          </div>
        </div>

        {/* Modules Timeline */}
        <div>
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              isLast={index === modules.length - 1}
            />
          ))}
        </div>

        {/* Features Grid */}
        <div className="py-14">
          <SectionHeader
            title="World-Class Ambition Needs Support"
            subtitle="You worry about the goals. We provide the ecosystem to help you achieve them."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, i) => (
              <FeatureCard key={i} feature={feat} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className='py-14'>
          <SectionHeader
            title="Common Questions"
            subtitle="Everything you need to know about the program structure and eligibility."
          />
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            {faqs.map((faq, i) => (
              <FAQItem key={i} item={faq} />
            ))}
          </div>
        </div>

        <div className="text-center relative py-20 mt-14 overflow-hidden rounded-3xl bg-[#0F172A] shadow-2xl shadow-slate-400/20">
          {/* Glow Effect */}
          <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Don't settle for less than <br /> what you observe.
            </h2>
            <p className="text-slate-400 mb-8 text-lg">Join the waitlist for the 2025 cohort today.</p>

            <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-amber-400 hover:text-white hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg shadow-white/10">
              <Link to="/user/assessment">   Take Your Assessment
              </Link>
              <Target className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;