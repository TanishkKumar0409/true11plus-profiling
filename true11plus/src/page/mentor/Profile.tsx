import { motion } from "framer-motion";
import { 
  MapPin, 
  Star, 
  GraduationCap, 
  Linkedin, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  MessageSquare,
  Clock
} from "lucide-react";

// --- 1. Define Types ---

interface Service {
  id: number;
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
}

interface ServiceCardProps {
  service: Service;
}

interface BadgeProps {
  children: React.ReactNode;
}

// --- Mock Data ---
const mentorData = {
  name: "Dr. Emily Carter",
  title: "PhD in Mathematics & Senior Academic Consultant",
  location: "Boston, MA",
  rating: 5.0,
  reviews: 215,
  about: "I am a passionate educator with over 15 years of experience helping students excel in STEM subjects. Formerly a professor at MIT, I now dedicate my time to 1:1 tutoring and helping high schoolers navigate the complex college admissions process to get into Ivy League schools.",
  subjects: ["Calculus I, II, III", "AP Physics", "SAT/ACT Prep", "College Admissions", "Linear Algebra", "Academic Planning"],
  stats: [
    { label: "Years Teaching", value: "15+" },
    { label: "Students Mentored", value: "800+" },
    { label: "Ivy Acceptances", value: "150+" }, 
  ],
  services: [
    {
      id: 1,
      title: "1:1 STEM Tutoring",
      price: "$120",
      duration: "60 min",
      description: "Intensive, personalized instruction in Math or Physics. We will tackle your difficult problem sets and prepare for upcoming exams.",
      features: ["Personalized Problem Sets", "Exam Strategies", "Homework Help"]
    },
    {
      id: 2,
      title: "College App Strategy",
      price: "$200",
      duration: "90 min",
      description: "Comprehensive review of your college application essays and strategic advice on how to stand out to admissions officers.",
      features: ["Essay Editing", "Extracurricular Audit", "Interview Prep"]
    }
  ],
  testimonials: [
    {
      id: 1,
      user: "Jason K.",
      role: "High School Senior",
      comment: "Dr. Carter made Calculus click for me. I went from a C to an A in one semester, and I actually enjoy math now!"
    },
    {
      id: 2,
      user: "Maria R.",
      role: "Parent",
      comment: "We were lost in the college application process. Emily's guidance was invaluable, and our daughter just got into Yale!"
    }
  ]
};

// --- Components ---

// Fixed: Added BadgeProps interface
const Badge = ({ children }: BadgeProps) => (
  <span className="px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
    {children}
  </span>
);

// Fixed: Added ServiceCardProps interface to handle 'features' array correctly
const ServiceCard = ({ service }: ServiceCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 rounded-md bg-gray-50 shadow-xs transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
        <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
          <Clock size={14} /> {service.duration}
        </p>
      </div>
      <span className="text-xl font-bold text-emerald-600">{service.price}</span>
    </div>
    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
      {service.description}
    </p>
    <ul className="space-y-2 mb-6">
      {service.features.map((feat, idx) => (
        <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
          <CheckCircle2 size={16} className="text-emerald-500" />
          {feat}
        </li>
      ))}
    </ul>
    <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
      Book Session <Calendar size={16} />
    </button>
  </motion.div>
);

export default function EducationMentorProfile() {
  return (
    <div className="min-h-screen text-slate-900">
      
      <div className="bg-white rounded-md shadow-xs">
        <div className="px-4 py-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt={mentorData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white" title="Available for tutoring"></div>
            </motion.div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">{mentorData.name}</h4>
                  <p className="text-sm font-medium text-emerald-700 mt-1">{mentorData.title}</p>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {mentorData.location}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                      <Star size={16} fill="currentColor" /> {mentorData.rating} ({mentorData.reviews} reviews)
                    </span>
                  </div>
                </div>
                
                {/* Social Actions */}
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                    <Linkedin size={20} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">
                    <Globe size={20} />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mt-4 border-t border-slate-100 pt-3">
                {mentorData.stats.map((stat, idx) => (
                  <div key={idx} className="text-center md:text-left">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="pt-6">
        
        {/* Left Column: About & Skills */}
        <div className="md:col-span-2 space-y-8 bg-white p-5 rounded-md shadow-xs">
          
          <section>
            <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="text-emerald-600" size={24} />
              About My Teaching
            </h4>
            <p className="text-slate-600 leading-relaxed text-lg">
              {mentorData.about}
            </p>
          </section>

          <section>
            <h4 className="text-xl font-bold text-slate-900 mb-4">Subjects & Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {mentorData.subjects.map((subject) => (
                <Badge key={subject}>{subject}</Badge>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-slate-900"> Tutoring Packages</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentorData.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>

          <section className="">
            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-emerald-600"/> 
              Student Success Stories
            </h4>
            <div className="space-y-6">
              {mentorData.testimonials.map((t) => (
                <div key={t.id} className="border-b border-slate-100 last:border-0 last:pb-0 pb-6">
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-700 italic mb-3">"{t.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      {t.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.user}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}