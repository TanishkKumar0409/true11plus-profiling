import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Calendar,
    CheckCircle2,
    Clock,
    Image as ImageIcon,
    Share2,
    ChevronDown,
    Filter,
    ArrowLeft,
    AlignLeft,
    CheckSquare,
    Paperclip,
    FolderOpen,
    Download,
} from "lucide-react";

// --- Types & Interfaces ---

type TaskStatus = "Not Started" | "In Progress" | "Completed";

interface Subtask {
    id: number;
    text: string;
    done: boolean;
}

interface Task {
    id: number;
    title: string;
    desc: string;
    description?: string;
    date: string;
    due: string;
    createdOn: string;
    image: string;
    priority: "High" | "Moderate" | "Low";
    status: TaskStatus | string;
    checklist?: Subtask[];
    attachments?: number;
    project?: string;
    completedDate?: string;
}

interface CompletedItem {
    id: number;
    title: string;
    desc: string;
    completedTime: string;
    image: string;
}

interface CircularProgressProps {
    percentage?: number;
    label?: string;
    accent?: "green" | "blue" | "red";
}

// --- Helper Functions ---

const formatDate = (iso: string): string => {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
        return iso;
    }
};

const nowRelative = (): string => {
    const d = new Date();
    return d.toLocaleString();
};

// --- DATA SOURCE (Moved outside component to act as a mock database) ---
const initialTasks: Task[] = [
    {
        id: 1,
        title: "Presentation on Final Product",
        desc: "Buy gifts on the way and pick up cake.",
        description: "It is Nischal's 25th birthday. We need to buy a mechanical keyboard as a gift. Also, stop by 'The Sweet Oven' bakery to pick up the chocolate truffle cake ordered under the name 'Rahul'. Dress code is casual.",
        date: "2025-06-20",
        due: "20 June 2025",
        createdOn: "2025-06-15",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
        priority: "Moderate",
        status: "Not Started",
        checklist: [
            { id: 1, text: "Buy Gift", done: true },
            { id: 2, text: "Wrap Gift", done: false },
            { id: 3, text: "Pick up Cake", done: false }
        ],
        project: "Personal",
        attachments: 0
    },
    {
        id: 2,
        title: "Landing Page Design for TravelDays",
        desc: "Deliver final landing page.",
        description: "Finalize the responsive design for the TravelDays homepage. Ensure the hero section video loads lazily. Review the color contrast ratios for accessibility compliance (WCAG AA). Submit the Figma link and export assets for the dev team.",
        date: "2025-06-20",
        due: "22 June 2025",
        createdOn: "2025-06-18",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400",
        priority: "High",
        status: "In Progress",
        checklist: [
            { id: 1, text: "Hero Section", done: true },
            { id: 2, text: "Testimonial Grid", done: true },
            { id: 3, text: "Mobile View", done: false }
        ],
        project: "TravelDays UI",
        attachments: 2
    },
    {
        id: 3,
        title: "Presentation on Final Product",
        desc: "Polish slides and live-demo for stakeholders.",
        description: "Prepare the quarterly review presentation. The focus should be on Q2 metrics and the roadmap for Q3. Ensure the live demo environment is stable and populated with fresh data.",
        date: "2025-08-19",
        due: "25 Aug 2025",
        createdOn: "2025-08-10",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
        priority: "Moderate",
        status: "In Progress",
        project: "Internal Ops",
        checklist: [],
        attachments: 5
    },
    {
        id: 4,
        title: "Team Lunch",
        desc: "Catch up with the design team at the new cafe.",
        description: "Reservations made at 'The Green Bowl' for 1:00 PM. All 5 members of the design team have confirmed availability.",
        date: "2025-06-20",
        due: "Tomorrow",
        createdOn: "2025-06-15",
        image: "",
        priority: "Moderate",
        status: "Not Started",
        project: "Team Building",
        attachments: 0
    },
];

const sampleCompleted: CompletedItem[] = [
    {
        id: 100,
        title: "Walk the dog",
        desc: "Take the dog to the park and bring treats as well.",
        completedTime: "Completed 2 days ago",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400",
    },
];

// --- Sub-Components ---

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage = 0, label = "", accent = "green" }) => {
    const size = 64;
    const stroke = 8;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 h-16">
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} stroke="#eef2f7" fill="none" />
                    <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ stroke: accent === "green" ? "url(#g-green)" : accent === "blue" ? "url(#g-blue)" : "url(#g-red)", transition: "stroke-dashoffset 600ms ease" }} fill="none" />
                    <defs>
                        <linearGradient id="g-green" x1="0%" x2="100%"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" /></linearGradient>
                        <linearGradient id="g-blue" x1="0%" x2="100%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
                        <linearGradient id="g-red" x1="0%" x2="100%"><stop offset="0%" stopColor="#fca5a5" /><stop offset="100%" stopColor="#ef4444" /></linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm font-semibold text-gray-700">{Math.round(percentage)}%</div>
                </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">{label}</div>
        </div>
    );
};

interface TaskCardProps {
    task: Task;
    onComplete: (id: number) => void;
    onShare: (task: Task) => void;
    onClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onShare, onClick }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-xs transition-shadow group border border-transparent hover:border-gray-100">
            <div className="flex justify-between gap-4">
                <div className="flex gap-3 items-start">
                    <div>
                        <button onClick={() => onClick(task)} className="text-left font-semibold text-gray-800 text-lg hover:text-purple-600 transition-colors focus:outline-none">
                            {task.title}
                        </button>
                        <p className="text-gray-500 max-w-md line-clamp-2 text-sm mt-1">{task.desc}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(task.date)}</span>
                            <span>•</span>
                            <span className={`font-medium ${task.priority === 'High' ? 'text-red-500' : 'text-gray-500'}`}>{task.priority} Priority</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onShare(task); }} className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-colors" title="Share to Profile">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                    {task.image ? (
                        <img src={task.image} alt="task" className="w-24 h-16 rounded-lg object-cover mt-1" />
                    ) : (
                        <div className="w-24 h-16 rounded-lg bg-gray-50 border border-dashed border-gray-100 flex items-center justify-center text-gray-300">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-xs">
                <div className="flex items-center gap-4 text-gray-500">
                    <button onClick={(e) => { e.stopPropagation(); onComplete(task.id); }} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all ${task.status === "Completed" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        {task.status === "Completed" ? "Completed" : "Complete"}
                    </button>
                    <div className="text-gray-400 hidden sm:block">Created on: <span className="text-gray-500 font-medium">{formatDate(task.createdOn)}</span></div>
                </div>
                <div className={`text-sm font-medium ${task.status === "Completed" ? "text-green-600" : "text-gray-500"}`}>{task.status}</div>
            </div>
        </div>
    );
};

const CompletedCard: React.FC<{ item: CompletedItem }> = ({ item }) => {
    return (
        <div className="bg-white p-3 rounded-xl shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div><h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4><p className="text-gray-500 text-xs mt-1">{item.desc}</p></div>
                    <img src={item.image} alt="done" className="w-14 h-12 rounded-md object-cover" />
                </div>
                <div className="text-xs text-gray-400 mt-2">{item.completedTime}</div>
            </div>
        </div>
    );
};

// ============================================
// PAGE 1: TASK DETAILS PAGE (Reads ID from URL)
// ============================================

export const TaskDetailsPage = () => {
    const { id } = useParams<{ id: string }>(); // Get ID from URL
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | undefined>(undefined);

    useEffect(() => {
        // Look up the task based on URL ID
        if (id) {
            const found = initialTasks.find((t) => t.id === Number(id));
            setTask(found);
        }
    }, [id]);

    if (!task) {
        return <div className="p-10 text-center">Task not found</div>;
    }

    return (
        <div className="">
            <div className="animate-in fade-in zoom-in-95 duration-200">
                {/* Header / Nav */}
                <button
                    onClick={() => navigate(-1)} // Go back in history
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Task List
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-xs p-6 sm:p-8">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${task.priority === "High" ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}>
                                            {task.priority} Priority
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${task.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">{task.title}</h3>
                                </div>
                            </div>

                            <div className="prose prose-slate prose-sm max-w-none">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4" /> Description
                                </h4>
                                <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">{task.description || task.desc}</p>
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" /> Subtasks
                                </h4>
                                <div className="space-y-3">
                                    {task.checklist && task.checklist.length > 0 ? (
                                        task.checklist.map((item) => (
                                            <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.done ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white"}`}>
                                                    {item.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <span className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}>{item.text}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No subtasks defined.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-xs p-5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Details</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Calendar className="w-4 h-4" /></div>
                                    <div><p className="text-xs text-slate-500 font-medium">Due Date</p><p className="text-sm font-bold text-slate-800">{task.due || "No Due Date"}</p></div>
                                </div>
                                {task.status === "Completed" && (
                                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                                        <div><p className="text-xs text-slate-500 font-medium">Completed On</p><p className="text-sm font-bold text-slate-800">{task.completedDate || "Just now"}</p></div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FolderOpen className="w-4 h-4" /></div>
                                    <div><p className="text-xs text-slate-500 font-medium">Project</p><p className="text-sm font-bold text-slate-800">{task.project || "General"}</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Download className="w-4 h-4" /></div>
                                    <div><p className="text-xs text-slate-500 font-medium">Submitted At</p><p className="text-sm font-bold text-slate-800">26/12/2025</p></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-xs p-5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Attachments ({task.attachments || 0})</h4>
                            {task.attachments && task.attachments > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer group">
                                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><Paperclip className="w-4 h-4" /></div>
                                        <div className="overflow-hidden"><p className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">Design_Specs_v2.pdf</p><p className="text-[10px] text-slate-400">2.4 MB</p></div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer group">
                                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><Paperclip className="w-4 h-4" /></div>
                                        <div className="overflow-hidden"><p className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">Reference_Assets.zip</p><p className="text-[10px] text-slate-400">14 MB</p></div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No files attached.</p>
                            )}
                            <button className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:border-slate-400 transition">+ Add Attachment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// PAGE 2: TASK DASHBOARD (List View)
// ============================================

export default function TaskUser() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [completed, setCompleted] = useState<CompletedItem[]>(sampleCompleted);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [dateRange, setDateRange] = useState("June 2025-December 2025");

    // Actions
    const handleShare = (_task: Task) => {
        navigate("/post-profile");
    };

    // --- KEY CHANGE: Navigate to the URL instead of setting state ---
    const handleTaskClick = (task: Task) => {
        navigate(`/user/taskuser/${task.id}`);
    };

    const completeTask = (id: number) => {
        setTasks((prev) =>
            prev.map((t) => {
                if (t.id === id) {
                    if (t.status !== "Completed") {
                        const newItem: CompletedItem = {
                            id: Date.now(),
                            title: t.title,
                            desc: t.desc,
                            completedTime: nowRelative(),
                            image: t.image,
                        };
                        setCompleted((c) => [newItem, ...c]);
                        return { ...t, status: "Completed", completedDate: new Date().toLocaleDateString() };
                    }
                    return t;
                }
                return t;
            })
        );
    };

    const handleSelectRange = (rangeName: string) => {
        setDateRange(rangeName);
        setShowDateDropdown(false);
    };

    // Metrics
    const total = tasks.length + completed.length;
    const pctCompleted = Math.round((completed.length / Math.max(1, total)) * 100);
    const pctInProgress = Math.round((tasks.filter((t) => t.status === "In Progress").length / Math.max(1, total)) * 100);
    const pctNotStarted = Math.round((tasks.filter((t) => t.status === "Not Started").length / Math.max(1, total)) * 100);

    return (
        <div className="min-h-screen bg-gray-50">
            {showDateDropdown && <div className="fixed inset-0 z-10" onClick={() => setShowDateDropdown(false)}></div>}
            <div>
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">All Tasks</h3>
                        <p className="text-gray-500 mt-1">Track and manage your application to-dos.</p>
                        <div className="hidden md:block pt-5 relative z-20">
                            <button onClick={() => setShowDateDropdown(!showDateDropdown)} className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200">
                                {dateRange}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showDateDropdown ? "rotate-180" : ""}`} />
                            </button>
                            {showDateDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-3"><h4 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Filter className="w-4 h-4 text-blue-500" /> Select Period</h4></div>
                                    <div className="space-y-2">
                                        <button onClick={() => handleSelectRange("June 2025-December 2025")} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-600 hover:text-blue-600 flex justify-between group">
                                            <span>Jun - Dec 2025</span>{dateRange === "June 2025-December 2025" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-red-500 font-semibold text-lg">
                                <div className="p-1 bg-red-100 rounded-lg"><CheckCircle2 size={18} /></div> To-Do
                            </div>
                        </div>
                        <div className="space-y-4">
                            {tasks.map((t) => (
                                <TaskCard key={t.id} task={t} onComplete={completeTask} onShare={handleShare} onClick={handleTaskClick} />
                            ))}
                        </div>
                    </section>
                    <aside className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-semibold text-red-500 mb-6 flex items-center gap-2"><div className="p-1 bg-red-100 rounded-lg"><Clock size={16} /></div> Task Status</h3>
                            <div className="flex items-center justify-between gap-4">
                                <CircularProgress percentage={pctCompleted} label="Completed" accent="green" />
                                <CircularProgress percentage={pctInProgress} label="In Progress" accent="blue" />
                                <CircularProgress percentage={pctNotStarted} label="Not Started" accent="red" />
                            </div>
                            <div className="mt-6 text-xs text-gray-500">Total tasks: <span className="font-medium text-gray-700">{total}</span></div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-semibold text-red-500 mb-4 flex items-center gap-2"><div className="p-1 bg-red-100 rounded-lg"><CheckCircle2 size={16} /></div> Completed</h3>
                            <div className="space-y-3">{completed.map((c) => (<CompletedCard key={c.id} item={c} />))}</div>
                            <div className="mt-4 text-xs text-gray-400">{completed.length} completed</div>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}