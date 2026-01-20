import { useState } from "react";
import { Star, ChevronDown, Zap, CheckCircle2 } from "lucide-react";

/* -----------------------------
   Module Data Type
-------------------------------- */
interface Module {
  category: string;
  tag: string;
  title: string;
  description: string;
  tasks: string[];
  tags: string[];
}

/* -----------------------------
   Props Type
-------------------------------- */
interface ModuleCardProps {
  module: Module;
  isLast?: boolean;
}

/* -----------------------------
   Component
-------------------------------- */
const ModuleCard = ({ module, isLast = false }: ModuleCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex group">
      {/* Timeline Line (Left Side) */}
      <div className="flex flex-col items-center mr-6 md:mr-10">
        <div
          className={`transition-all duration-300 w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center shrink-0 shadow-sm ${
            isOpen
              ? "bg-amber-500 border-amber-500 shadow-amber-200"
              : "bg-white border-amber-200"
          }`}
        >
          <Star
            className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 ${
              isOpen
                ? "text-white fill-white"
                : "text-amber-500 fill-amber-500"
            }`}
          />
        </div>

        {/* Connector Line */}
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-amber-400 via-amber-200 to-transparent my-2" />
        )}
      </div>

      {/* Content Side */}
      <div className="pb-8 flex-1">
        {/* Header Tags */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            {module.category}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200 font-medium">
            {module.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors duration-300">
          {module.title}
        </h3>

        <p className="text-slate-600 leading-relaxed py-2 text-sm md:text-base">
          {module.description}
        </p>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors focus:outline-none mb-4 group/btn"
        >
          <span className="border-b border-transparent group-hover/btn:border-amber-600 transition-all">
            {isOpen ? "Close Curriculum" : "View Curriculum"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Expandable Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {/* Tasks */}
            <div className="space-y-3 mb-6">
              <h4 className="text-slate-900 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Learning Tasks
              </h4>

              {module.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-sm text-slate-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{task}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
              {module.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
