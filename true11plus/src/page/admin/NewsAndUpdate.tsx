import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Filter,
  ArrowLeft,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  Trash2,
  Eye,
  Edit,
  Save,
  MoreVertical,
  AlertTriangle, // Icon for delete warning
  Bell
} from 'lucide-react';

// --- 1. TypeScript Interfaces ---

type CategoryType = 'Academic' | 'Exam' | 'Campus' | 'Admissions';

interface NewsItem {
  id: number;
  title: string;
  category: CategoryType;
  date: string;
  readTime: string;
  author: string;
  content: string;
  isPinned?: boolean;
}

// --- 2. Initial State & Mock Data ---

const initialFormState: NewsItem = {
  id: 0,
  title: '',
  category: 'Academic',
  date: new Date().toISOString().split('T')[0],
  readTime: '2 min read',
  author: 'Admin',
  content: '',
  isPinned: false
};

const NewsDashboard: React.FC = () => {
  // --- Data State (Expanded for Pagination) ---
  const [news, setNews] = useState<NewsItem[]>([
    { id: 1, title: "Final Semester Exam Schedule Released", category: "Exam", date: "2025-01-05", readTime: "2 min read", author: "Examination Cell", content: "The datesheet for the Spring 2025 final examinations has been uploaded.", isPinned: true },
    { id: 2, title: "New Yoga Therapy Certification Course", category: "Academic", date: "2025-01-08", readTime: "4 min read", author: "Dr. Aditi Verma", content: "We are excited to introduce a 6-month specialized course.", isPinned: false },
    { id: 3, title: "Campus Library Renovation Notice", category: "Campus", date: "2024-12-28", readTime: "1 min read", author: "Admin Dept", content: "The central library will remain closed for maintenance.", isPinned: false },
    { id: 4, title: "Admissions Open for Batch 2025", category: "Admissions", date: "2025-01-02", readTime: "3 min read", author: "Registrar Office", content: "Applications are now invited for the 200-hour program.", isPinned: false },
    { id: 5, title: "Guest Lecture: Ancient Vedas", category: "Academic", date: "2025-01-12", readTime: "2 min read", author: "Prof. Sharma", content: "Join us for an enlightening session.", isPinned: false },
    { id: 6, title: "Cafeteria Menu Update", category: "Campus", date: "2025-01-10", readTime: "1 min read", author: "Admin Dept", content: "New healthy vegan options added.", isPinned: false },
    { id: 7, title: "Scholarship Results Announced", category: "Admissions", date: "2025-01-15", readTime: "2 min read", author: "Registrar Office", content: "Merit list is live on the portal.", isPinned: true },
    { id: 8, title: "Sports Day Registration", category: "Campus", date: "2025-01-20", readTime: "2 min read", author: "Sports Comm", content: "Register for the annual track and field events.", isPinned: false },
    { id: 9, title: "Research Grant Opportunities", category: "Academic", date: "2025-01-22", readTime: "5 min read", author: "Dean", content: "Apply for international research grants.", isPinned: false },
    { id: 10, title: "Hostel Maintenance Schedule", category: "Campus", date: "2025-01-25", readTime: "1 min read", author: "Warden", content: "Block A maintenance scheduled for Saturday.", isPinned: false },
    { id: 11, title: "Alumni Meet 2025", category: "Campus", date: "2025-02-01", readTime: "3 min read", author: "Alumni Cell", content: "Welcome back our graduated batches.", isPinned: false },
    { id: 12, title: "PhD Entrance Exam Dates", category: "Exam", date: "2025-02-05", readTime: "2 min read", author: "Exam Cell", content: "Entrance exam dates have been postponed.", isPinned: false },
  ]);

  // --- View State ---
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'form'>('list');

  // --- UI State ---
  const [filter, setFilter] = useState<CategoryType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Dropdown & Modal State
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // NEW: Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<NewsItem | null>(null); // NEW: Item to delete
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<NewsItem>(initialFormState);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Logic ---

  // Handle Outside Click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) setIsFilterOpen(false);
      if (activeDropdownId !== null && !target.closest('.action-dropdown-container')) setActiveDropdownId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdownId]);

  // Filter Logic
  const filteredNews = news.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  // Generate Page Numbers Array [1, 2, 3...]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

  // Handle Page Reset on Filter Change or Item Deletion
  useEffect(() => { 
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [filter, searchQuery, news.length, totalPages, currentPage]);

  // --- Actions ---

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedNews(null);
    setFormData(initialFormState);
    setActiveDropdownId(null);
  };

  const handleView = (item: NewsItem) => {
    setSelectedNews(item);
    setViewMode('detail');
    setActiveDropdownId(null);
  };

  const handleCreateClick = () => {
    setFormData({ ...initialFormState, date: new Date().toISOString().split('T')[0] });
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEditClick = (item: NewsItem) => {
    setFormData({ ...item });
    setIsEditing(true);
    setViewMode('form');
    setActiveDropdownId(null);
  };

  // 1. Open Delete Modal
  const handleDeleteRequest = (item: NewsItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
    setActiveDropdownId(null);
  };

  // 2. Confirm Delete
  const confirmDelete = () => {
    if (itemToDelete) {
      setNews(prev => prev.filter(item => item.id !== itemToDelete.id));
      if (selectedNews?.id === itemToDelete.id) {
        handleBackToList(); // If we deleted the item we were viewing, go back
      }
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const updatedNews = news.map(item => item.id === formData.id ? formData : item);
      setNews(updatedNews);
      if (selectedNews?.id === formData.id) setSelectedNews(formData);
    } else {
      const newItem = { ...formData, id: Date.now() };
      setNews([newItem, ...news]);
    }
    handleBackToList();
  };

  // Styles
  const getCategoryStyle = (cat: CategoryType) => {
    switch (cat) {
      case 'Academic': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Exam': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Campus': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Admissions': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const categories = ['All', 'Academic', 'Exam', 'Campus', 'Admissions'];

  // --- SUB-COMPONENT: DELETE MODAL ---
  const DeleteModal = () => {
    if (!isDeleteModalOpen || !itemToDelete) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform scale-100 transition-all">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Announcement?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{itemToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-800">
      
      {/* Include Modal in Render Tree */}
      <DeleteModal />

      {/* HEADER */}
      {viewMode === 'list' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">News & Updates</h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Manage announcements and notices.</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-purple-200 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" /> Post Update
          </button>
        </div>
      )}

      {/* --- VIEW 1: FORM PAGE (Edit/Create) --- */}
      {viewMode === 'form' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={handleBackToList} 
              className="flex items-center text-gray-500 hover:text-purple-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Cancel & Back
            </button>
            <h4 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
            </h4>
          </div>

          <div className="bg-white rounded-xl shadow-xs overflow-hidden">
            <form onSubmit={handleSaveForm} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Headline Title</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm " 
                    placeholder="Enter the title of the news..." 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({...formData, category: e.target.value as CategoryType})} 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm appearance-none"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Exam">Exam</option>
                      <option value="Campus">Campus</option>
                      <option value="Admissions">Admissions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Publish Date</label>
                    <input 
                      type="date" 
                      value={formData.date} 
                      onChange={(e) => setFormData({...formData, date: e.target.value})} 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content Details</label>
                  <textarea 
                    rows={8} 
                    value={formData.content} 
                    onChange={(e) => setFormData({...formData, content: e.target.value})} 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm  leading-relaxed" 
                    placeholder="Write the full content of your update here..."
                  ></textarea>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <input 
                    type="checkbox" 
                    id="pinToggle" 
                    checked={formData.isPinned || false} 
                    onChange={(e) => setFormData({...formData, isPinned: e.target.checked})} 
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300 cursor-pointer" 
                  />
                  <label htmlFor="pinToggle" className="text-sm font-medium text-purple-900 cursor-pointer select-none">
                    Pin this update to the top of the dashboard
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleBackToList} 
                  className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 shadow-md shadow-purple-200 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {isEditing ? 'Update News' : 'Publish News'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW 2: LIST TABLE --- */}
      {viewMode === 'list' && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
          
          {/* Filters & Search */}
          <div className="relative mb-6 z-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all shadow-xs"
                />
              </div>

              <div className="relative w-full md:w-auto" ref={dropdownRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 w-full md:w-48 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">{filter}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full md:w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-30 overflow-hidden">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setFilter(cat as any); setIsFilterOpen(false); }}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-sm transition-colors ${filter === cat ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {cat}
                        {filter === cat && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl  shadow-xs overflow-visible">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.isPinned && <Bell className="w-4 h-4 text-orange-500 fill-orange-500" />}
                          <div onClick={() => handleView(item)} className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors">
                            {item.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryStyle(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {item.date}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.author}</td>
                      
                      {/* Action Column with Dropdown */}
                      <td className="px-6 py-4 text-right relative">
                        <div className="relative inline-block text-left action-dropdown-container">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                            }}
                            className={`p-2 rounded-lg transition-colors ${activeDropdownId === item.id ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {activeDropdownId === item.id && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                              <div className="py-1">
                                <button
                                  onClick={() => handleView(item)}
                                  className="group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                                >
                                  <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-green-600" /> View Details
                                </button>
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                >
                                  <Edit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-600" /> Edit
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                  onClick={() => handleDeleteRequest(item)}
                                  className="group flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-600" /> Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No announcements found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Numbered Pagination Footer */}
            {filteredNews.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredNews.length)}</span> of <span className="font-semibold text-gray-900">{filteredNews.length}</span> entries
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                  
                  {/* Numbered Buttons */}
                  <div className="flex items-center gap-1">
                    {pageNumbers.map(number => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          currentPage === number 
                            ? 'bg-purple-600 text-white shadow-xs' 
                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VIEW 3: DETAIL PAGE --- */}
      {viewMode === 'detail' && selectedNews && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 md:p-10 space-y-8">
            <div className="space-y-6">
              <div className='flex items-start justify-between gap-4'>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight max-w-3xl">
                  {selectedNews.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditClick(selectedNews)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDeleteRequest(selectedNews)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide ${getCategoryStyle(selectedNews.category)}`}>{selectedNews.category}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200"><Calendar className="w-3.5 h-3.5" /> {selectedNews.date}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200"><Clock className="w-3.5 h-3.5" /> {selectedNews.readTime}</span>
              </div>
            </div>
            <div className="prose prose-purple text-gray-600 leading-relaxed pt-6 border-t border-gray-100">
              <p className="whitespace-pre-line text-lg">{selectedNews.content}</p>
            </div>
            <button onClick={handleBackToList} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors pt-4">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewsDashboard;