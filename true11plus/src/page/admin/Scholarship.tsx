import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Eye,
  ArrowLeft,
  CheckCircle2,
  Building2,
  DollarSign,
  Briefcase,
  MapPin,
  Globe,
  ExternalLink,
  MoreVertical,
  Trash2,
  Edit,
  AlertTriangle,
  Save,
  ChevronLeft, 
  ChevronRight,
} from 'lucide-react';

// --- 1. TypeScript Interfaces ---

type ScholarshipStatus = 'Active' | 'Closing Soon' | 'Closed';

interface ScholarshipItem {
  id: number;
  title: string;
  university: string;
  location: string;
  amount: string;
  status: ScholarshipStatus;
  deadline: string;
  postedDate: string;
  requirements: string[];
  description: string;
  tags: string[];
  website: string;
  matchScore: number;
}

// --- 2. Data Generation Helper ---

const generateMockData = (): ScholarshipItem[] => {
  const baseData: ScholarshipItem[] = [
    {
      id: 1,
      title: "Global Future Leaders Scholarship",
      university: "Oxford University",
      location: "Oxford, UK",
      amount: "$25,000",
      status: "Active",
      deadline: "Oct 15, 2025",
      postedDate: "2 days ago",
      requirements: ["GPA 3.5+", "2 Letters of Rec"],
      description: "Prestigious award for international students.",
      tags: ["Leadership", "Merit-based"],
      website: "www.ox.ac.uk",
      matchScore: 98
    },
    {
      id: 2,
      title: "Tech Innovation Grant",
      university: "MIT",
      location: "Cambridge, USA",
      amount: "$15,000",
      status: "Closing Soon",
      deadline: "Nov 01, 2025",
      postedDate: "1 week ago",
      requirements: ["CS Major", "Prototype"],
      description: "For students building tech solutions.",
      tags: ["Tech", "Innovation"],
      website: "www.mit.edu",
      matchScore: 85
    },
    {
      id: 3,
      title: "Arts & Humanities Fund",
      university: "Yale",
      location: "New Haven, USA",
      amount: "$10,000",
      status: "Active",
      deadline: "Dec 10, 2025",
      postedDate: "3 days ago",
      requirements: ["Portfolio", "Essay"],
      description: "Supporting creative arts students.",
      tags: ["Arts", "Creative"],
      website: "www.yale.edu",
      matchScore: 72
    }
  ];

  const moreData: ScholarshipItem[] = Array.from({ length: 32 }).map((_, i) => ({
    id: i + 4,
    title: `Scholarship Opportunity ${i + 4}`,
    university: i % 2 === 0 ? "Stanford University" : "Cambridge University",
    location: i % 2 === 0 ? "California, USA" : "Cambridge, UK",
    amount: `$${(Math.floor(Math.random() * 20) + 5) * 1000}`,
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Closing Soon" : "Closed",
    deadline: `Dec ${10 + (i % 20)}, 2025`,
    postedDate: `${i + 1} days ago`,
    requirements: ["GPA > 3.0", "Essay"],
    description: "Generated description for demonstration purposes.",
    tags: ["General", "Merit"],
    website: "www.example.com",
    matchScore: Math.floor(Math.random() * 60) + 40
  }));

  return [...baseData, ...moreData];
};

// --- 3. Helper Component: Status Badge ---
const StatusBadge: React.FC<{ status: ScholarshipStatus }> = ({ status }) => {
  const styles = {
    'Active': 'bg-green-100 text-green-700 border-green-200',
    'Closing Soon': 'bg-orange-100 text-orange-700 border-orange-200',
    'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- 4. Helper Component: Progress Bar ---
const MatchProgressBar: React.FC<{ score: number }> = ({ score }) => {
  const colorClass = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-orange-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 w-full max-w-[100px] bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700">{score}%</span>
    </div>
  );
};

// --- 5. Main Component ---
const Scholarship: React.FC = () => {
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>(generateMockData());
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit'>('list');
  const [selectedItem, setSelectedItem] = useState<ScholarshipItem | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ScholarshipItem | null>(null);
  const [editFormData, setEditFormData] = useState<ScholarshipItem | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = scholarships.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(scholarships.length / itemsPerPage);

  // Handlers
  const handleNextPage = () => { if (currentPage < totalPages) { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handlePrevPage = () => { if (currentPage > 1) { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handleBackToList = () => { setViewMode('list'); setSelectedItem(null); setEditFormData(null); };
  
  const handleView = (item: ScholarshipItem) => { setSelectedItem(item); setViewMode('detail'); setActiveDropdownId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleEdit = (item: ScholarshipItem) => { setSelectedItem(item); setEditFormData({ ...item }); setViewMode('edit'); setActiveDropdownId(null); };
  const handleDeleteRequest = (item: ScholarshipItem) => { setItemToDelete(item); setActiveDropdownId(null); };
  
  const confirmDelete = () => {
    if (itemToDelete) {
      setScholarships(prev => prev.filter(s => s.id !== itemToDelete.id));
      setItemToDelete(null);
      if (selectedItem?.id === itemToDelete.id) handleBackToList();
    }
  };

  const handleSaveChanges = () => {
    if (editFormData) {
      setScholarships(prev => prev.map(item => item.id === editFormData.id ? editFormData : item));
      setSelectedItem(editFormData);
      setViewMode('detail');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (activeDropdownId !== null && !target.closest('.dropdown-container')) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdownId]);

  // --- SUB-COMPONENTS ---

  const DeleteModal = () => {
    if (!itemToDelete) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-6 transform scale-100 transition-all">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Scholarship?</h3>
          <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
            Are you sure you want to delete <span className="font-semibold text-gray-800">"{itemToDelete.title}"</span>?
          </p>
          <div className="flex gap-3">
            <button onClick={() => setItemToDelete(null)} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-red-200">Delete</button>
          </div>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ item }: { item: ScholarshipItem }) => (
    <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-xl  focus:outline-none animate-in fade-in zoom-in-95 duration-200">
      <div className="">
        <button onClick={() => handleView(item)} className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
          <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" /> View Details
        </button>
        <button onClick={() => handleEdit(item)} className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
          <Edit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" /> Edit
        </button>
        <button onClick={() => handleDeleteRequest(item)} className="group flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50">
          <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-600" /> Delete
        </button>
      </div>
    </div>
  );

  // --- VIEW: EDIT PAGE ---
  if (viewMode === 'edit' && editFormData) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
        <nav className="flex items-center justify-between mb-6">
          <button onClick={handleBackToList} className="flex items-center text-gray-500 hover:text-purple-600 gap-2 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Cancel & Back</span><span className="sm:hidden">Back</span>
          </button>
          <h4 className="text-lg sm:text-xl font-bold text-gray-800">Edit Scholarship</h4>
        </nav>

        <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Scholarship Title</label>
                <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">University Name</label>
                <input type="text" value={editFormData.university} onChange={(e) => setEditFormData({...editFormData, university: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Award Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input type="text" value={editFormData.amount.replace('$', '')} onChange={(e) => setEditFormData({...editFormData, amount: `$${e.target.value}`})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Deadline</label>
                <input type="text" value={editFormData.deadline} onChange={(e) => setEditFormData({...editFormData, deadline: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between">
                   <label className="text-sm font-semibold text-gray-700">Match Score Percentage</label>
                   <span className="text-sm font-bold text-purple-600">{editFormData.matchScore}%</span>
                </div>
                <input type="range" min="0" max="100" value={editFormData.matchScore} onChange={(e) => setEditFormData({...editFormData, matchScore: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea rows={4} value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
            </div>
            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100 mt-6">
               <button onClick={handleBackToList} className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSaveChanges} className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: DETAIL PAGE ---
  if (viewMode === 'detail' && selectedItem) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
        <DeleteModal />
        <nav className="flex items-center justify-between mb-6">
          <button onClick={handleBackToList} className="group flex items-center text-gray-500 hover:text-purple-600 gap-2 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back <span className="hidden sm:inline">to List</span>
          </button>
          <div className="flex gap-2">
             <button onClick={() => handleEdit(selectedItem)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
               <Edit className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
             </button>
             <button onClick={() => handleDeleteRequest(selectedItem)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">
               <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
             </button>
          </div>
        </nav>

        {/* Stack columns on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sx relative overflow-hidden border border-gray-100">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-50 rounded-full opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                    <StatusBadge status={selectedItem.status} />
                    <div className="flex gap-1 flex-wrap mt-2 sm:mt-0">
                    {selectedItem.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
                    ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center ml-4">
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-4 ${selectedItem.matchScore >= 80 ? 'border-green-500 text-green-600' : selectedItem.matchScore >= 50 ? 'border-orange-400 text-orange-500' : 'border-red-400 text-red-500'}`}>
                      <span className="text-base sm:text-lg font-bold">{selectedItem.matchScore}%</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1">Match</span>
                  </div>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h4>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-500 text-sm mt-4">
                  <span className="flex items-center bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                    <Building2 className="w-4 h-4 mr-2 text-purple-500" /> {selectedItem.university}
                  </span>
                  <span className="flex items-center bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                    <MapPin className="w-4 h-4 mr-2 text-purple-500" /> {selectedItem.location}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-gray-100">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-gray-400" /> Description
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{selectedItem.description}</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <a href={`https://${selectedItem.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors">
                  <Globe className="w-4 h-4 mr-2" /> Visit Official Website <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-gray-100">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-gray-400" /> Eligibility Requirements
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {selectedItem.requirements.map((req, i) => (
                  <div key={i} className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:border-purple-100 hover:bg-purple-50/30">
                    <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4 flex-shrink-0 text-xs font-bold">{i + 1}</div>
                    <span className="text-gray-700 font-medium pt-0.5 text-sm sm:text-base">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Application Summary</h4>
              <div className="space-y-6">
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 text-green-800 text-sm font-medium mb-1"><DollarSign className="w-4 h-4" /> Award Value</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedItem.amount}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Calendar className="w-4 h-4" /> Deadline</div>
                  <div className="text-lg font-bold text-gray-900">{selectedItem.deadline}</div>
                  <div className="text-xs text-orange-600 font-medium mt-1">{selectedItem.status === 'Closing Soon' ? 'Applications closing soon!' : 'Open for submissions'}</div>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2">
                    Apply Now <Briefcase className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: LIST (Responsive) ---
  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative min-h-screen pb-20">
      <DeleteModal />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Scholarships</h3>
          <p className="text-gray-500 text-sm sm:text-base">Track and apply for financial aid options.</p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto">
          Download Guide
        </button>
      </div>

      {/* --- RESPONSIVE CONTAINER --- */}
      <div className="flex flex-col bg-transparent md:bg-white md:rounded-xl md:shadow-xs md:border md:border-gray-200">
        
        {/* MOBILE VIEW (CARDS) - Visible only on small screens */}
        <div className="md:hidden space-y-4">
          {currentItems.map((item) => (
             <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative">
               
               {/* Mobile Dropdown (Absolute Top Right) */}
               <div className="absolute top-4 right-3 dropdown-container">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === item.id ? null : item.id); }} 
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {activeDropdownId === item.id && <DropdownMenu item={item} />}
               </div>

               <div className="pr-10"> {/* Padding right for dropdown space */}
                 <div className="mb-2"><StatusBadge status={item.status} /></div>
                 <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{item.title}</h4>
                 <div className="text-sm text-gray-500 flex items-center mb-4">
                    <Building2 className="w-3.5 h-3.5 mr-1.5" /> {item.university}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1 flex items-center"><DollarSign className="w-3 h-3 mr-1"/> Amount</div>
                    <div className="font-semibold text-gray-900">{item.amount}</div>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Deadline</div>
                    <div className="font-semibold text-gray-900">{item.deadline}</div>
                 </div>
               </div>
               
               <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                 <div className="flex-1 mr-4">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-1 block">Match Score</span>
                    <MatchProgressBar score={item.matchScore} />
                 </div>
                 <button onClick={() => handleView(item)} className="text-sm font-semibold text-purple-600 hover:text-purple-800">
                    View &rarr;
                 </button>
               </div>
             </div>
          ))}
        </div>

        {/* DESKTOP VIEW (TABLE) - Visible only on medium screens and up */}
        <div className="hidden md:block overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Scholarship Name</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Last Date</th>
                {/* <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Match</th> */}
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> {item.university}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">{item.amount}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> {item.deadline}</div>
                  </td>
                  {/* <td className="py-4 px-6"><MatchProgressBar score={item.matchScore} /></td> */}
                  <td className="py-4 px-6"><StatusBadge status={item.status} /></td>
                  <td className="py-4 px-6 text-right relative">
                    <div className="relative inline-block text-left dropdown-container">
                      <button onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === item.id ? null : item.id); }} className={`p-2 rounded-full transition-all ${activeDropdownId === item.id ? 'bg-purple-50 text-purple-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeDropdownId === item.id && <DropdownMenu item={item} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {scholarships.length === 0 && <div className="p-12 text-center text-gray-500">No scholarships found.</div>}
        </div>

        {/* --- PAGINATION FOOTER (Responsive) --- */}
        {scholarships.length > 0 && (
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between bg-white md:bg-gray-50 rounded-b-xl mt-4 md:mt-0 shadow-sm md:shadow-none border md:border-t-0 rounded-xl md:rounded-t-none">
            <div className="text-xs sm:text-sm text-gray-500">
              <span className="hidden sm:inline">Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, scholarships.length)}</span> of </span>
              <span className="font-semibold text-gray-900">{scholarships.length}</span> results
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-gray-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="hidden sm:flex items-center gap-1">
                 {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => { // Limit to 5 visible pages for simplicity in demo
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) pageNum = currentPage - 2 + i; // Simple shifting logic
                    if (pageNum > totalPages) return null;
                    
                    return (
                    <button key={pageNum} onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200 bg-white border border-gray-200'}`}>
                      {pageNum}
                    </button>
                 )})}
              </div>
              <div className="sm:hidden text-xs font-medium text-gray-700">Page {currentPage} of {totalPages}</div>

              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarship;