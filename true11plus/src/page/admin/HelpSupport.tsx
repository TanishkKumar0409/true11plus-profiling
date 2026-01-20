import React, { useState, useEffect, useRef } from 'react';
import {
    BookOpen,
    History,
    Video,
    Users,
    GraduationCap,
    FileText,
    Server,
    ChevronRight,
    Send,
    ExternalLink,
    LifeBuoy,
    MessageCircle,
    X,
    Minimize2,
    Paperclip,
    Search,       // New Icon
    HelpCircle,   // New Icon
    MessageSquare // New Icon
} from 'lucide-react';

// --- TYPES ---
interface Ticket {
    id: string;
    subject: string;
    category: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    lastUpdate: string;
}

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

const EducationHelpSupport: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState<'knowledge' | 'ticket' | 'history'>('knowledge');

    // Mock Ticket Data
    const [tickets] = useState<Ticket[]>([
        {
            id: "EDU-902",
            subject: "Video upload failed for Grade 10 Science",
            category: "Content Upload",
            status: "In Progress",
            lastUpdate: "1 hour ago"
        },
        {
            id: "EDU-901",
            subject: "Bulk student import error (CSV)",
            category: "Student Data",
            status: "Resolved",
            lastUpdate: "1 day ago"
        },
        {
            id: "EDU-890",
            subject: "Zoom integration disconnected",
            category: "Live Class",
            status: "Open",
            lastUpdate: "Just now"
        }
    ]);

    // Helper for Status Badge
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-red-50 text-red-700 border-red-100';
            case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Resolved': return 'bg-green-50 text-green-700 border-green-100';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen text-gray-800 ">
            {/* --- HEADER --- */}
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">True11Plus Support Center</h3>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">Manage your tickets, view guides, and contact support.</p>
                </div>

                {/* --- TAB NAVIGATION --- */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar pb-2">
                        <TabButton
                            active={activeTab === 'knowledge'}
                            onClick={() => setActiveTab('knowledge')}
                            icon={<BookOpen className="w-4 h-4" />}
                            label="Knowledge Base"
                        />
                        <TabButton
                            active={activeTab === 'ticket'}
                            onClick={() => setActiveTab('ticket')}
                            icon={<LifeBuoy className="w-4 h-4" />}
                            label="Submit Ticket"
                        />
                        <TabButton
                            active={activeTab === 'history'}
                            onClick={() => setActiveTab('history')}
                            icon={<History className="w-4 h-4" />}
                            label="My Tickets"
                            count={tickets.length}
                        />
                    </div>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="transition-all duration-300 ease-in-out pb-24">

                    {/* 1. KNOWLEDGE BASE */}
                    {activeTab === 'knowledge' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <GuideCard
                                    title="Student Management"
                                    desc="Bulk import students via CSV, manage sections, and roll numbers."
                                    icon={<Users className="w-5 h-5 text-blue-600" />}
                                    bg="bg-blue-50"
                                />
                                <GuideCard
                                    title="Course & Curriculum"
                                    desc="Upload video lectures, PDF notes, and structure your syllabus."
                                    icon={<BookOpen className="w-5 h-5 text-purple-600" />}
                                    bg="bg-purple-50"
                                />
                                <GuideCard
                                    title="Live Classes"
                                    desc="Integrate Zoom/Meet and schedule live sessions."
                                    icon={<Video className="w-5 h-5 text-red-600" />}
                                    bg="bg-red-50"
                                />
                                <GuideCard
                                    title="Exams & Results"
                                    desc="Create quizzes, grade assignments, and publish results."
                                    icon={<GraduationCap className="w-5 h-5 text-green-600" />}
                                    bg="bg-green-50"
                                />
                                <GuideCard
                                    title="Fee Portal"
                                    desc="Set up fee structures, invoices, and payment gateways."
                                    icon={<FileText className="w-5 h-5 text-orange-600" />}
                                    bg="bg-orange-50"
                                />
                                <GuideCard
                                    title="Server & Storage"
                                    desc="Manage cloud storage limits and video optimization."
                                    icon={<Server className="w-5 h-5 text-gray-600" />}
                                    bg="bg-gray-100"
                                />
                            </div>
                        </div>
                    )}

                    {/* 2. SUBMIT TICKET */}
                    {activeTab === 'ticket' && (
                     <div className="lg:col-span-2 order-2 lg:order-1">
                                <div className="bg-white p-6 rounded-md shadow-xs">
                                    <div className="flex items-center gap-3 pb-6">
                                        <h4 className="text-xl font-bold text-gray-900">Create New Ticket</h4>
                                    </div>
                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Affected Module</label>
                                                <div className="relative">
                                                    <select className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all appearance-none text-gray-700">
                                                        <option>Student Database</option>
                                                        <option>Video Player</option>
                                                        <option>Live Class API</option>
                                                        <option>Exam Portal</option>
                                                        <option>Billing</option>
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Severity</label>
                                                <div className="relative">
                                                    <select className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all appearance-none text-gray-700">
                                                        <option>Low (Feature Request)</option>
                                                        <option>Medium (Minor Bug)</option>
                                                        <option>High (Function Broken)</option>
                                                        <option>Critical (System Down)</option>
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Subject</label>
                                            <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all" placeholder="Briefly describe the issue..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">Description</label>
                                            <textarea rows={5} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all resize-none" placeholder="Provide steps to reproduce the error..."></textarea>
                                        </div>
                                        <div className="pt-2 flex justify-end">
                                            <button type="button" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-md font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5">
                                                <Send className="w-3 h-3" /> Submit Request
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    )}

                    {/* 3. TICKET HISTORY */}
                    {activeTab === 'history' && (
                        <div className="bg-white rounded-md shadow-xs overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm min-w-[600px]">
                                    <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                                        <tr>
                                            <th className="px-2 py-4 font-semibold">Ticket ID</th>
                                            <th className="px-2 py-4 font-semibold">Subject</th>
                                            <th className="px-2 py-4 font-semibold">Module</th>
                                            <th className="px-2 py-4 font-semibold">Status</th>
                                            <th className="px-2 py-4 font-semibold">Last Update</th>
                                            <th className="px-2 py-4 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {tickets.map(ticket => (
                                            <tr key={ticket.id} className="hover:bg-purple-50/50 transition-colors group cursor-pointer">
                                                <td className="px-2 py-4 font-mono text-gray-500 font-medium text-xs bg-gray-50/50 w-24">{ticket.id}</td>
                                                <td className="px-2 py-4 font-semibold text-gray-900">{ticket.subject}</td>
                                                <td className="px-2 py-4 text-gray-500">{ticket.category}</td>
                                                <td className="px-2 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(ticket.status)}`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-4 text-gray-500">{ticket.lastUpdate}</td>
                                                <td className="px-2 py-4 text-right">
                                                    <button className="text-purple-600 hover:text-purple-800 font-bold text-xs flex items-center justify-end gap-1 ml-auto group-hover:translate-x-1 transition-transform">
                                                        View <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {tickets.length === 0 && (
                                <div className="p-12 text-center text-gray-500">
                                    <History className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                    <p>No support tickets found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- LIVE CHAT WIDGET (NEW) --- */}
            <LiveChatWidget />
        </div>
    );
};

// --- LIVE CHAT COMPONENT WITH TABS ---
const LiveChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatTab, setChatTab] = useState<'chat' | 'help'>('chat'); // NEW: Chat vs Help Tab
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Hi there! 👋 Welcome to LMS Support. How can we help you manage your institution today?", sender: 'agent', timestamp: new Date() }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock FAQ Data
    const faqList = [
        { id: 1, question: "How to upload large video files?", answer: "Use the 'Compress' tool in the Content tab before uploading." },
        { id: 2, question: "Student CSV import failed", answer: "Ensure the CSV encoding is UTF-8 and headers match the template." },
        { id: 3, question: "Where are my billing invoices?", answer: "Go to Settings > Billing & Plans to download PDFs." },
        { id: 4, question: "How to reset teacher password?", answer: "Admin can reset passwords from the Staff Management table." },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (chatTab === 'chat') {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping, chatTab]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        const newUserMsg: ChatMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI/Agent Response
        setTimeout(() => {
            let responseText = "Thanks for reaching out. A support specialist will be with you shortly.";
            const lowerInput = text.toLowerCase();

            if (lowerInput.includes("video") || lowerInput.includes("upload")) {
                responseText = "It looks like you're having trouble with video uploads. Have you checked if the file size is under 500MB?";
            } else if (lowerInput.includes("student") || lowerInput.includes("import")) {
                responseText = "For student data issues, please ensure your CSV file matches the template provided in the Knowledge Base.";
            } else if (lowerInput.includes("password")) {
                responseText = "You can reset passwords in the Staff or Student Management sections.";
            }

            const newAgentMsg: ChatMessage = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'agent',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAgentMsg]);
            setIsTyping(false);
        }, 1500);
    };

    // Handle clicking a FAQ item -> Switches to chat and sends the question
    const handleFaqClick = (question: string) => {
        setChatTab('chat');
        handleSendMessage(question);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };

    // Filter FAQs based on search
    const filteredFaqs = faqList.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div className={`
                bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden w-[350px] sm:w-[380px] mb-4 transition-all duration-300 origin-bottom-right flex flex-col
                ${isOpen ? 'scale-100 opacity-100 translate-y-0 h-[450px]' : 'scale-90 opacity-0 translate-y-10 pointer-events-none absolute h-0'}
            `}>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-4 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <LifeBuoy className="w-6 h-6 text-white" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-purple-700 rounded-full"></span>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm">True11Plus Live Support</h5>
                            <p className="text-[11px] text-purple-100 opacity-90">Online • Replies instantly</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* --- CHAT TABS --- */}
                <div className="flex p-2 bg-gray-50 border-b border-gray-100 shrink-0">
                    <button 
                        onClick={() => setChatTab('chat')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${chatTab === 'chat' ? 'bg-white text-purple-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" /> Live Chat
                    </button>
                    <button 
                        onClick={() => setChatTab('help')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${chatTab === 'help' ? 'bg-white text-purple-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <HelpCircle className="w-3.5 h-3.5" /> Quick Help
                    </button>
                </div>

                {/* --- TAB CONTENT AREA --- */}
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    
                    {/* TAB 1: LIVE CHAT */}
                    {chatTab === 'chat' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 flex flex-col gap-3 no-scrollbar">
                                <div className="text-center text-xs text-gray-400 my-2">Today</div>
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                            ${msg.sender === 'user'
                                                ? 'bg-purple-600 text-white rounded-tr-none'
                                                : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                                            }
                                        `}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                                <button type="button" className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-50"
                                    placeholder="Type a message..."
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className={`p-2 rounded-full transition-all duration-200 ${inputValue.trim() ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}

                    {/* TAB 2: QUICK HELP */}
                    {chatTab === 'help' && (
                        <div className="flex-1 overflow-y-auto p-4 bg-white">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search for answers..." 
                                    className="w-full bg-gray-50 border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Frequent Issues</h6>
                                {filteredFaqs.map((faq) => (
                                    <button 
                                        key={faq.id}
                                        onClick={() => handleFaqClick(faq.question)}
                                        className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all group"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-semibold text-gray-800 group-hover:text-purple-700">{faq.question}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-400" />
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1">{faq.answer}</p>
                                    </button>
                                ))}
                                {filteredFaqs.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        No articles found. Try chatting with us.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    h-14 w-14 rounded-full shadow-lg shadow-purple-900/20 flex items-center justify-center transition-all duration-300 hover:scale-105
                    ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-purple-600 hover:bg-purple-700 rotate-0'}
                `}
            >
                {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-7 h-7 text-white" />}
            </button>
        </div>
    );
};


// --- HELPERS & SUB-COMPONENTS ---

const TabButton = ({ active, onClick, icon, label, count }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2
        ${active
                ? 'bg-purple-50 text-purple-900 font-semibold shadow-xs'
                : 'text-gray-500 hover:text-purple-700 hover:bg-gray-50'
        }`}
    >
        {icon}
        {label}
        {count !== undefined && count > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${active ? 'bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                {count}
            </span>
        )}
    </button>
);

const GuideCard = ({ title, desc, icon, bg }: any) => (
    <div className="bg-white p-4 rounded-md hover:shadow-xs transition-all cursor-pointer group h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex flex-col gap-4">
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${bg} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div>
                <h5 className="font-bold text-gray-900 text-md mb-2 group-hover:text-purple-700 transition-colors">{title}</h5>
                <p className=" text-gray-500 leading-relaxed text-sm">{desc}</p>
            </div>
        </div>
    </div>
);



export default EducationHelpSupport;