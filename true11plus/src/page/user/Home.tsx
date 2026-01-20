import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Trophy, Zap, CheckCircle } from "lucide-react";

const Home = () => {
  // Removed useAuth hook and user state

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">

      <section className="relative pt-20 pb-24 overflow-hidden">

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Soft Gradient Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
          <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left Column: Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-4 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                New: AI-Powered Study Plans
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Learn Faster, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Achieve More.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Project C is the all-in-one workspace for students. Track assignments, visualize your progress, and collaborate with peers in real-time.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Modified: Static Link instead of Auth Check */}
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>

                <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-600" fill="currentColor" />
                  </div>
                  See how it works
                </button>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm ${['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500'][i - 1]
                      }`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Zap key={i} className="w-4 h-4" fill="currentColor" />)}
                  </div>
                  <p><span className="text-slate-900 font-bold">10,000+</span> students joined</p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Floating Interface (Light Mode) */}
            <div className="flex-1 w-full relative perspective-1000 group mt-12 lg:mt-0">
              {/* Glow behind the card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 blur-[60px] opacity-70 rounded-full -z-10 transform translate-y-10 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* The "Glass" Card - Light Version */}
              <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 ring-1 ring-slate-200/50 rounded-2xl p-4 shadow-2xl transform rotate-y-[-12deg] rotate-x-[6deg] group-hover:rotate-y-[-6deg] group-hover:rotate-x-[3deg] transition-transform duration-700 ease-out">
                {/* Browser Toolbar */}
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-100 h-6 rounded-md mx-4 text-[10px] flex items-center px-3 text-slate-400 font-mono">
                    project-c.com/dashboard
                  </div>
                </div>

                {/* Dashboard Mockup Content (Light Theme) */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Sidebar */}
                  <div className="col-span-1 bg-slate-50 rounded-lg h-64 p-3 space-y-3 border border-slate-100">
                    <div className="h-2 w-16 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-blue-100 border border-blue-200 rounded w-full flex items-center px-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full opacity-20"></div>
                    </div>
                    <div className="h-8 bg-white border border-slate-100 rounded w-full"></div>
                    <div className="h-8 bg-white border border-slate-100 rounded w-full"></div>
                  </div>

                  {/* Main Content */}
                  <div className="col-span-2 space-y-4">
                    {/* Header Graph */}
                    <div className="h-24 bg-white border border-slate-100 rounded-lg p-3 relative overflow-hidden shadow-sm">
                      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-between px-2 gap-1">
                        {[40, 70, 50, 90, 60, 80, 50].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm opacity-90"></div>
                        ))}
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-20 bg-white rounded-lg border border-slate-100 shadow-sm p-3">
                        <div className="w-8 h-8 rounded bg-green-100 mb-2 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        </div>
                        <div className="h-2 w-12 bg-slate-200 rounded"></div>
                      </div>
                      <div className="h-20 bg-white rounded-lg border border-slate-100 shadow-sm p-3">
                        <div className="w-8 h-8 rounded bg-purple-100 mb-2 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        </div>
                        <div className="h-2 w-12 bg-slate-200 rounded"></div>
                      </div>
                    </div>

                    {/* List Items */}
                    <div className="space-y-2">
                      <div className="h-10 bg-white rounded-lg border border-slate-100 shadow-sm flex items-center px-2 gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100"></div>
                        <div className="h-2 w-20 bg-slate-100 rounded"></div>
                      </div>
                      <div className="h-10 bg-white rounded-lg border border-slate-100 shadow-sm flex items-center px-2 gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100"></div>
                        <div className="h-2 w-20 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification Badge */}
                <div className="absolute -right-6 top-20 bg-white text-slate-900 p-3 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 animate-bounce delay-1000 hidden lg:block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Assignment Done!</p>
                      <p className="text-[10px] text-slate-500">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-slate-50 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Students", value: "10k+", icon: Users },
              { label: "Courses", value: "120+", icon: BookOpen },
              { label: "Awards Won", value: "50+", icon: Trophy },
              { label: "Success Rate", value: "95%", icon: Zap },
            ].map((stat, index) => (
              <div key={index} className="space-y-2 group">
                <div className="flex justify-center text-blue-600 mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-white relative">
        {/* Decorative background blob */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose Project C?</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to excel in your studies and beyond, designed with clarity in mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Interactive Learning",
                desc: "Engage with content dynamically. Our platform adapts to your learning style automatically.",
                bg: "bg-blue-50",
                text: "text-blue-600",
                border: "border-blue-100"
              },
              {
                title: "Real-time Tracking",
                desc: "Monitor your progress with detailed analytics and personalized dashboards instantly.",
                bg: "bg-purple-50",
                text: "text-purple-600",
                border: "border-purple-100"
              },
              {
                title: "Community Support",
                desc: "Join thousands of other students. Share notes, ask questions, and grow together.",
                bg: "bg-teal-50",
                text: "text-teal-600",
                border: "border-teal-100"
              }
            ].map((feature, idx) => (
              <div key={idx} className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border ${feature.border} group`}>
                <div className={`w-14 h-14 ${feature.bg} ${feature.text} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTENT PREVIEW / BENEFITS --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Everything you need to succeed, all in one place.
              </h2>
              <p className="text-lg text-slate-600">
                Stop juggling multiple apps. Project C brings your assignments, grades, and study materials into one cohesive ecosystem.
              </p>

              <ul className="space-y-5">
                {[
                  "Access course materials offline",
                  "Direct messaging with instructors",
                  "Automated deadline reminders",
                  "Peer review system"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Abstract visual representation of "Dashboard" - Light Mode */}
            <div className="flex-1 w-full order-1 md:order-2">
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 p-6 aspect-video transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-slate-200">
                {/* Mock UI Elements */}
                <div className="relative h-full flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-1/3 bg-slate-100 rounded"></div>
                    <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/3 h-24 bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg mb-2"></div>
                      <div className="h-2 w-12 bg-blue-200 rounded"></div>
                    </div>
                    <div className="w-1/3 h-24 bg-purple-50 border border-purple-100 rounded-xl p-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg mb-2"></div>
                      <div className="h-2 w-12 bg-purple-200 rounded"></div>
                    </div>
                    <div className="w-1/3 h-24 bg-green-50 border border-green-100 rounded-xl p-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg mb-2"></div>
                      <div className="h-2 w-12 bg-green-200 rounded"></div>
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                    <div className="flex justify-between">
                      <div className="w-1/4 h-3 bg-slate-200 rounded"></div>
                      <div className="w-1/4 h-3 bg-slate-200 rounded"></div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded"></div>
                    <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="bg-indigo-50 py-20 px-4 border-t border-indigo-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">Ready to start your journey?</h2>
          <p className="text-indigo-600/80 text-lg">Join today and get unlimited access to all features for free during our beta period.</p>
          <Link
            to="/user/tasks"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 transform hover:-translate-y-1"
          >
            Increase your Chances

          </Link>
          <p className="text-sm text-indigo-400">No credit card required.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;