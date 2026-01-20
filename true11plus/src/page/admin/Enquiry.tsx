import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Mail, 
  Trash2, 
  Eye, 
  ArrowLeft,
  CheckCircle,
  Clock,
  MessageSquare,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// --- 1. Types ---
interface Enquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

// --- 2. Mock Data Generator ---
const generateMockEnquiries = (): Enquiry[] => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? `User ${i + 1}` : `Student ${i + 1}`,
    email: `user${i + 1}@example.com`,
    subject: i % 3 === 0 ? "Course Enquiry" : "Partnership Proposal",
    message: "I would like to know more details about your upcoming yoga retreat and available dates.",
    date: `2025-12-${(30 - (i % 30)).toString().padStart(2, '0')}`,
    status: i < 5 ? 'new' : i % 3 === 0 ? 'replied' : 'read'
  }));
};

const EnquiryDashboard: React.FC = () => {
  // --- State Management ---
  // Initialize data outside of state if static, or inside if dynamic. 
  // Here we keep it in state to simulate fetching.
  const [enquiries, setEnquiries] = useState<Enquiry[]>(generateMockEnquiries());
  
  // View State
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  
  // Filter & UI State
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'replied'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- URL & Navigation Logic (The Key Part) ---

  // 1. Function to handle URL parameters parsing
  const parseUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return; // Guard for server-side rendering

    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');

    if (viewParam === 'detail' && idParam) {
      const foundItem = enquiries.find(e => e.id === Number(idParam));
      if (foundItem) {
        setSelectedEnquiry(foundItem);
        setCurrentView('detail');
        return;
      }
    }

    // Default to list if params don't match or item not found
    setCurrentView('list');
    setSelectedEnquiry(null);
  }, [enquiries]);

  // 2. Initial Load: Check URL when component mounts
  useEffect(() => {
    parseUrlParams();
  }, []); // Run once on mount

  // 3. Listen for Browser "Back/Forward" buttons
  useEffect(() => {
    const handlePopState = () => {
      parseUrlParams();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseUrlParams]);

  // 4. Update URL when State Changes (Push State)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    
    if (currentView === 'detail' && selectedEnquiry) {
      // Only update if the URL is different to prevent redundant history entries
      if (params.get('id') !== selectedEnquiry.id.toString()) {
        params.set('view', 'detail');
        params.set('id', selectedEnquiry.id.toString());
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    } else if (currentView === 'list') {
      if (params.has('view') || params.has('id')) {
        params.set('view', 'list');
        params.delete('id');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    }
  }, [currentView, selectedEnquiry]);


  // --- Filter & Pagination Logic ---

  const filteredData = enquiries.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- Actions ---

  const handleView = (item: Enquiry) => {
    setSelectedEnquiry(item);
    setCurrentView('detail');
    
    // Auto-mark as read logic
    if (item.status === 'new') {
      setEnquiries(prev => prev.map(e => e.id === item.id ? {...e, status: 'read'} : e));
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEnquiry(null);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setEnquiries(enquiries.filter(e => e.id !== deleteId));
      if (selectedEnquiry?.id === deleteId) {
        handleBackToList();
      }
      setDeleteId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'replied': return 'bg-green-100 text-green-700 border-green-200';
      case 'read': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="">     
        {/* Main Title */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Enquiry Dashboard</h3>
          <p className="text-gray-500">Manage your incoming messages.</p>
        </div>

        {/* --- VIEW 1: LIST VIEW --- */}
        {currentView === 'list' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total" value={enquiries.length.toString()} icon={<MessageSquare className="w-5 h-5 text-blue-600" />} color="bg-blue-50" />
                <StatCard label="New" value={enquiries.filter(e => e.status === 'new').length.toString()} icon={<Clock className="w-5 h-5 text-purple-600" />} color="bg-purple-50" />
                <StatCard label="Replied" value={enquiries.filter(e => e.status === 'replied').length.toString()} icon={<CheckCircle className="w-5 h-5 text-green-600" />} color="bg-green-50" />
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 ">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {['all', 'new', 'replied'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab as any)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${activeFilter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-600 w-1/4">Sender</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 w-1/3">Subject</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-gray-500 text-xs">{item.email}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                             <span className={item.status === 'new' ? "font-medium text-gray-900" : ""}>{item.subject}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(item.status)} capitalize`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{item.date}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleView(item)} className="p-2 hover:bg-purple-50 text-gray-400 hover:text-purple-600 rounded-lg transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => setDeleteId(item.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No enquiries found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Component */}
            <PaginationControls 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredData.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />

          </div>
        )}

        {/* --- VIEW 2: DETAIL VIEW (Syncs with URL) --- */}
        {currentView === 'detail' && selectedEnquiry && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            
            <button onClick={handleBackToList} className="mb-4 flex items-center  gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to List
            </button>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              {/* Detail Header */}
              <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-2xl shadow-inner border-2 border-white">
                    {selectedEnquiry.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedEnquiry.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Mail className="w-4 h-4" /> {selectedEnquiry.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-medium border ${getStatusStyle(selectedEnquiry.status)} capitalize`}>
                      {selectedEnquiry.status}
                    </span>
                    <button onClick={() => setDeleteId(selectedEnquiry.id)} className="p-2 bg-white  text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-gray-200 shadow-sm">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                        <div className="text-xs text-purple-400 uppercase font-semibold tracking-wide">Date Received</div>
                        <div className="mt-2 flex items-center gap-2 text-gray-900 font-medium text-sm">
                            <Calendar className="w-4 h-4 text-purple-600" /> {selectedEnquiry.date}
                        </div>
                    </div>
                    <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                        <div className="text-xs text-purple-400 uppercase font-semibold tracking-wide">Enquiry ID</div>
                        <div className="mt-2 text-gray-900 font-medium">#{selectedEnquiry.id}</div>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Subject: {selectedEnquiry.subject}</h4>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                        {selectedEnquiry.message}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm shadow-purple-200 inline-flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Reply via Email
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Enquiry?</h3>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors w-full">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors w-full shadow-lg shadow-red-200">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Sub-Components ---

// 1. Stat Card
const StatCard = ({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

// 2. Pagination
const PaginationControls: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  indexOfFirstItem, 
  indexOfLastItem 
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, totalItems)}</span> of <span className="font-medium text-gray-900">{totalItems}</span> results
      </p>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 border border-gray-200 rounded-lg hover:bg-white bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
             // Logic to hide middle pages if there are too many
             if (totalPages > 7 && (number !== 1 && number !== totalPages && Math.abs(currentPage - number) > 1)) {
               if (number === 2 || number === totalPages - 1) return <span key={number} className="text-gray-400 px-1 text-xs">...</span>;
               return null;
             }

            return (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                  currentPage === number 
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {number}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-200 rounded-lg hover:bg-white bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EnquiryDashboard;