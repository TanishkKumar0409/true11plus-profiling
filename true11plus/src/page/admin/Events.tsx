import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Globe,
  Flag,
  Code,
  Calendar,
  MapPin,
  Plus,
  Search,
  Clock,
  DollarSign,
  ArrowLeft,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MoreVertical,
  Save,
  // Filter, // Removed unused import to fix TS warning
  // Check   // Removed unused import to fix TS warning
} from 'lucide-react';

// --- 1. Types & Interfaces ---

type CategoryType = 'Hackathon' | 'Competition' | 'National' | 'International';
type ModeType = 'Online' | 'Offline' | 'Hybrid';
type StatusType = 'Open' | 'Closed' | 'Coming Soon';

interface Competition {
  id: number;
  title: string;
  organizer: string;
  category: CategoryType;
  deadline: string;
  eventDate: string;
  mode: ModeType;
  prizePool: string;
  status: StatusType;
  description: string;
}

// --- 2. Mock Data Generator ---
const generateMockCompetitions = (): Competition[] => {
  return [
    { id: 1, title: "Global AI Hackathon 2025", organizer: "TechGiants Inc.", category: "Hackathon", deadline: "2025-02-10", eventDate: "2025-02-20", mode: "Online", prizePool: "$50,000", status: "Open", description: "A 48-hour intense coding marathon focused on Generative AI solutions." },
    { id: 2, title: "National Science Olympiad", organizer: "Science Foundation", category: "National", deadline: "2025-01-25", eventDate: "2025-03-05", mode: "Offline", prizePool: "Scholarships", status: "Open", description: "The premier science competition for undergraduate students across the country." },
    { id: 3, title: "CodeWars International", organizer: "DevCommunity", category: "International", deadline: "2025-03-01", eventDate: "2025-04-10", mode: "Online", prizePool: "$100,000", status: "Coming Soon", description: "Compete with the best developers from around the globe in algorithm challenges." },
    { id: 4, title: "Design Thinking Challenge", organizer: "Creative Hub", category: "Competition", deadline: "2025-01-30", eventDate: "2025-02-15", mode: "Hybrid", prizePool: "$10,000", status: "Open", description: "Solve real-world UI/UX problems in this creative student competition." },
    { id: 5, title: "Smart India Hackathon", organizer: "Govt. of India", category: "National", deadline: "2025-02-15", eventDate: "2025-03-20", mode: "Offline", prizePool: "₹50 Lakhs", status: "Open", description: "World's biggest open innovation model to solve administrative challenges." },
    { id: 6, title: "Google Solution Challenge", organizer: "Google DSC", category: "International", deadline: "2025-01-20", eventDate: "2025-05-01", mode: "Online", prizePool: "Mentorship", status: "Closed", description: "Build a solution to a local problem using Google technologies." },
    { id: 7, title: "University Coding Cup", organizer: "Student Council", category: "Competition", deadline: "2025-02-05", eventDate: "2025-02-10", mode: "Offline", prizePool: "$500", status: "Open", description: "Inter-department coding battle for computer science students." },
    { id: 8, title: "NASA Space Apps", organizer: "NASA", category: "International", deadline: "2025-10-01", eventDate: "2025-10-05", mode: "Hybrid", prizePool: "Global Recognition", status: "Coming Soon", description: "Collaborate to solve challenges using open source data." },
    { id: 9, title: "FinTech Innovation Lab", organizer: "Bank Corp", category: "Hackathon", deadline: "2025-03-15", eventDate: "2025-03-25", mode: "Online", prizePool: "$25,000", status: "Open", description: "Revolutionize the future of banking and finance." },
    { id: 10, title: "National Debate Championship", organizer: "Debate Society", category: "National", deadline: "2025-02-01", eventDate: "2025-02-14", mode: "Offline", prizePool: "Trophies", status: "Open", description: "The most prestigious debate tournament in the country." },
    { id: 11, title: "Cyber Security CTF", organizer: "SecureNet", category: "Hackathon", deadline: "2025-04-01", eventDate: "2025-04-05", mode: "Online", prizePool: "$15,000", status: "Coming Soon", description: "Capture the Flag competition for security enthusiasts." },
    { id: 12, title: "Eco-Friendly Design Contest", organizer: "Green Earth", category: "Competition", deadline: "2025-03-10", eventDate: "2025-04-22", mode: "Hybrid", prizePool: "$5,000", status: "Open", description: "Design sustainable solutions for a better planet." }
  ];
};

const CompetitionsDashboard: React.FC = () => {
  // --- State ---
  const [data, setData] = useState<Competition[]>(generateMockCompetitions());
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'form'>('list');
  const [selectedItem, setSelectedItem] = useState<Competition | null>(null);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | CategoryType>('All');
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Competition | null>(null);

  // Form State
  const initialFormState: Competition = {
    id: 0,
    title: '',
    organizer: '',
    category: 'Hackathon',
    deadline: '',
    eventDate: '',
    mode: 'Online',
    prizePool: '',
    status: 'Open',
    description: ''
  };
  const [formData, setFormData] = useState<Competition>(initialFormState);
  const [isEditMode, setIsEditMode] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- Logic ---

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Use .closest to check if the click was inside a dropdown container
      if (activeDropdownId !== null && !target.closest('.action-dropdown')) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdownId]);

  // Filtering
  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    if (totalPages === 0) setCurrentPage(1);
  }, [filteredData.length, totalPages, currentPage]); // Added currentPage dependency to fix exhaustive-deps

  // --- Actions ---

  const handleView = (item: Competition) => {
    setSelectedItem(item);
    setViewMode('detail');
    setActiveDropdownId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = (item: Competition) => {
    setFormData({ ...item });
    setIsEditMode(true);
    setViewMode('form');
    setActiveDropdownId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateClick = () => {
    setFormData({ ...initialFormState, deadline: new Date().toISOString().split('T')[0] });
    setIsEditMode(false);
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRequest = (item: Competition) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
    setActiveDropdownId(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(prev => prev.filter(i => i.id !== itemToDelete.id));
      if (selectedItem?.id === itemToDelete.id) {
        setViewMode('list');
        setSelectedItem(null);
      }
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      setData(prev => prev.map(item => item.id === formData.id ? formData : item));
      if (selectedItem?.id === formData.id) setSelectedItem(formData);
    } else {
      setData([{ ...formData, id: Date.now() }, ...data]);
    }
    setViewMode('list');
  };

  // --- Helper Styles ---
  const getCategoryColor = (cat: CategoryType) => {
    switch (cat) {
      case 'Hackathon': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'National': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'International': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Competition': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (cat: CategoryType) => {
    switch (cat) {
      case 'Hackathon': return <Code className="w-3 h-3 md:w-4 md:h-4" />;
      case 'National': return <Flag className="w-3 h-3 md:w-4 md:h-4" />;
      case 'International': return <Globe className="w-3 h-3 md:w-4 md:h-4" />;
      case 'Competition': return <Trophy className="w-3 h-3 md:w-4 md:h-4" />;
    }
  };

  // --- Render Components ---

  const DeleteModal = () => {
    if (!isDeleteModalOpen || !itemToDelete) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform scale-100 transition-all">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Competition?</h3>
          <p className="text-gray-500 text-sm mb-6">
            Are you sure you want to delete <strong>{itemToDelete.title}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-gray-700">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-md">Delete</button>
          </div>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ item }: { item: Competition }) => (
    <div className="absolute right-0 mt-2 w-40 sm:w-48 origin-top-right bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-20 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
      <div className="py-1">
        <button onClick={() => handleView(item)} className="group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
          <Eye className="mr-3 h-4 w-4 text-gray-400" /> View
        </button>
        <button onClick={() => handleEditClick(item)} className="group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
          <Edit className="mr-3 h-4 w-4 text-gray-400" /> Edit
        </button>
        <div className="border-t border-gray-100 my-1"></div>
        <button onClick={() => handleDeleteRequest(item)} className="group flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
          <Trash2 className="mr-3 h-4 w-4 text-red-400" /> Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-gray-800 bg-gray-50/30">
      <DeleteModal />

      {/* Header */}
      {viewMode === 'list' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Competitions & Hackathons</h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Explore student opportunities, national and international events.</p>
          </div>
          <button onClick={handleCreateClick} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all w-full md:w-auto">
            <Plus className="w-5 h-5" /> Add New
          </button>
        </div>
      )}

      {/* --- VIEW 1: LIST TABLE (RESPONSIVE) --- */}
      {viewMode === 'list' && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
          
          {/* Controls */}
          <div className="mb-6 space-y-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Hackathon', 'Competition', 'National', 'International'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setFilterCategory(cat as any); setCurrentPage(1); }}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                    filterCategory === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm shadow-sm"
              />
            </div>
          </div>

          {/* TABLE View (Desktop) */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Event Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4">Prize Pool</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div onClick={() => handleView(item)} className="cursor-pointer">
                          <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.organizer}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                          {getCategoryIcon(item.category)} {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-400" /> {item.deadline}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {item.prizePool}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          item.status === 'Open' ? 'bg-green-50 text-green-700' : 
                          item.status === 'Closed' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-right relative">
                        <div className="relative inline-block text-left action-dropdown">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                            }}
                            className={`p-2 rounded-lg transition-colors ${activeDropdownId === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {activeDropdownId === item.id && <DropdownMenu item={item} />}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No competitions found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* CARD View (Mobile) */}
          <div className="md:hidden space-y-4">
            {currentItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative">
                
                {/* Mobile Dropdown */}
                <div className="absolute top-4 right-3 action-dropdown">
                   <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${activeDropdownId === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeDropdownId === item.id && <DropdownMenu item={item} />}
                </div>

                <div onClick={() => handleView(item)} className="pr-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)} {item.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'Open' ? 'bg-green-50 text-green-700' : 
                          item.status === 'Closed' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 mb-4">by {item.organizer}</p>
                  
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                     <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" /> {item.deadline}
                     </div>
                     <div className="font-bold text-gray-800">{item.prizePool}</div>
                  </div>
                </div>
              </div>
            ))}
            {currentItems.length === 0 && <div className="py-12 text-center text-gray-500">No competitions found.</div>}
          </div>

          {/* Numbered Pagination */}
          {filteredData.length > 0 && (
            <div className="mt-4 md:mt-0 md:border-t border-gray-200 bg-transparent md:bg-gray-50 px-0 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-xl">
              <span className="text-sm text-gray-500 order-2 sm:order-1">
                Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-semibold text-gray-900">{filteredData.length}</span> results
              </span>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                <div className="flex items-center gap-1">
                  {pageNumbers.map(num => (
                    <button key={num} onClick={() => setCurrentPage(num)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === num ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>{num}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- VIEW 2: FORM PAGE (Create/Edit) --- */}
      {viewMode === 'form' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setViewMode('list')} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors">
              <ArrowLeft className="w-5 h-5" /> Cancel
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Competition' : 'New Competition'}</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <form onSubmit={handleSaveForm} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Annual Tech Hackathon" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organizer</label>
                  <input required type="text" value={formData.organizer} onChange={(e) => setFormData({...formData, organizer: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as CategoryType})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="National">National Event</option>
                    <option value="International">International Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Deadline</label>
                  <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Date</label>
                  <input type="date" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prize Pool</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.prizePool} onChange={(e) => setFormData({...formData, prizePool: e.target.value})} className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. $10,000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mode</label>
                  <select value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value as ModeType})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Details about the competition..."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setViewMode('list')} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
                  <Save className="w-4 h-4" /> Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW 3: DETAIL PAGE --- */}
      {viewMode === 'detail' && selectedItem && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-300 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-3 border border-white/10 uppercase tracking-wide">
                    {selectedItem.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">{selectedItem.title}</h1>
                  <div className="flex items-center gap-2 text-indigo-100 text-base sm:text-lg">
                    <span>by {selectedItem.organizer}</span>
                  </div>
                </div>
                <div className="flex gap-2 self-start">
                  <button onClick={() => handleEditClick(selectedItem)} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg backdrop-blur-sm transition-colors"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => handleDeleteRequest(selectedItem)} className="bg-white/10 hover:bg-red-500/20 text-red-100 p-2 rounded-lg backdrop-blur-sm transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            </div>

            {/* Info Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-100">
              <div className="p-4 sm:p-6 border-r border-gray-100">
                <div className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline</div>
                <div className="font-bold text-gray-900 text-sm sm:text-base">{selectedItem.deadline}</div>
              </div>
              <div className="p-4 sm:p-6 border-r border-gray-100">
                <div className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Mode</div>
                <div className="font-bold text-gray-900 text-sm sm:text-base">{selectedItem.mode}</div>
              </div>
              <div className="p-4 sm:p-6 border-r border-gray-100">
                <div className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> Prize Pool</div>
                <div className="font-bold text-emerald-600 text-sm sm:text-base">{selectedItem.prizePool}</div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="text-gray-500 text-xs sm:text-sm mb-1">Status</div>
                <div className={`font-bold text-sm sm:text-base ${selectedItem.status === 'Open' ? 'text-green-600' : 'text-gray-600'}`}>{selectedItem.status}</div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Description</h3>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-8">{selectedItem.description}</p>
              
              <button onClick={() => setViewMode('list')} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to List
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompetitionsDashboard;