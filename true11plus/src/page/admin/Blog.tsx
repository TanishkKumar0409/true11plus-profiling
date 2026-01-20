import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock,
  Image as ImageIcon,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Save
} from 'lucide-react';

// --- Types ---
type BlogStatus = 'Published' | 'Draft' | 'Archived';
type ViewState = 'list' | 'detail' | 'form';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string; 
  category: string;
  status: BlogStatus;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  coverImage: string; 
  authorImage?: string; 
}

// --- Mock Data Generator ---
const generateMockData = (): BlogPost[] => {
  const categories = ['Technology', 'Mentorship', 'Scholarship', 'Campus Life', 'Career Tips'];
  const statuses: BlogStatus[] = ['Published', 'Draft', 'Archived'];
  const authors = [
    { name: 'Dr. Sarah Miller', role: 'EdTech Researcher' },
    { name: 'John Doe', role: 'Senior Mentor' },
    { name: 'Admin Team', role: 'University Board' },
    { name: 'Emily Chen', role: 'Student Ambassador' },
    { name: 'Michael Ross', role: 'Career Counselor' }
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const author = authors[i % authors.length];
    return {
      id,
      title: [
        "The Future of AI in Education",
        "10 Tips for Effective Remote Mentoring",
        "Upcoming Scholarship Deadlines 2025",
        "How to Balance Campus Life and Study",
        "Career Paths in Data Science",
        "The Importance of Mental Health",
        "Study Abroad Opportunities",
        "Mastering the Art of Networking",
        "Building a Strong Portfolio",
        "The Rise of Green Technology",
        "Understanding Financial Aid",
        "Top 5 Coding Bootcamps Reviewed",
        "Leadership Skills for Students",
        "The Evolution of Online Learning",
        "Preparing for Your First Interview",
        "Sustainable Living on Campus",
        "The Power of Alumni Networks",
        "Navigating Graduate School Applications",
        "Soft Skills Employers Want",
        "Innovation in the Classroom"
      ][i] || `Blog Post Title ${id}`,
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      content: "This is the full content of the blog post. It contains detailed information about the topic. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      author: author.name,
      authorRole: author.role,
      category: categories[i % categories.length],
      status: statuses[i % statuses.length],
      date: new Date(2024, 9, 24 - i).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: `${3 + (i % 7)} min read`,
      views: Math.floor(Math.random() * 2000) + 100,
      comments: Math.floor(Math.random() * 50),
      coverImage: `https://images.unsplash.com/photo-${[
        '1509062522246-3755977927d7', '1516321318423-f06f85e504b3', '1523050854058-8df90110c9f1', 
        '1522202176988-66273c2fd55f', '1517245386807-bb43f82c33c4', '1513258496099-48168024aec0',
        '1509062522246-3755977927d7', '1516321318423-f06f85e504b3', '1523050854058-8df90110c9f1',
        '1522202176988-66273c2fd55f', '1517245386807-bb43f82c33c4', '1513258496099-48168024aec0',
        '1509062522246-3755977927d7', '1516321318423-f06f85e504b3', '1523050854058-8df90110c9f1',
        '1522202176988-66273c2fd55f', '1517245386807-bb43f82c33c4', '1513258496099-48168024aec0',
        '1509062522246-3755977927d7', '1516321318423-f06f85e504b3'
      ][i]}?auto=format&fit=crop&q=80&w=1000`,
      authorImage: `https://images.unsplash.com/photo-${[
        '1494790108377-be9c29b29330', '1472099645785-5658abf4ff4e', '1519085360753-af0119f7cbe7',
        '1580489944761-15a19d654956', '1535713875002-d1d0cf377fde'
      ][i % 5]}?auto=format&fit=crop&q=80&w=150`
    };
  });
};

const initialBlogs = generateMockData();
const ITEMS_PER_PAGE = 5;

const BlogDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [view, setView] = useState<ViewState>('list'); // 'list' | 'detail' | 'form'
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  
  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Actions Dropdown State
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Form State (for Create/Edit Page)
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    author: 'Admin User',
    content: '',
    coverImage: '',
    status: 'Published' as BlogStatus
  });

  // Delete Modal State
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // --- Click Outside Logic for Menu ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- URL State Sync ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');

    if (viewParam === 'detail' && idParam) {
      const found = blogs.find(b => b.id === Number(idParam));
      if (found) {
        setSelectedBlog(found);
        setView('detail');
      }
    } else if (viewParam === 'form') {
      // Typically you'd handle loading form data from ID here if linking directly
      // For now, we assume navigation happens via state for editing
    } else {
      setView('list');
    }
  }, []);

  const updateUrl = (newView: ViewState, id?: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', newView);
    if (id) {
      url.searchParams.set('id', id.toString());
    } else {
      url.searchParams.delete('id');
    }
    window.history.pushState({}, '', url);
  };

  // --- Handlers ---

  const handleViewBlog = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setView('detail');
    updateUrl('detail', blog.id);
    setActiveMenuId(null);
  };

  const handleCreateClick = () => {
    setFormData({
      title: '',
      category: 'Technology',
      author: 'Admin User',
      content: '',
      coverImage: '',
      status: 'Published'
    });
    setIsEditMode(false);
    setView('form');
    updateUrl('form');
  };

  const handleEditClick = (blog: BlogPost) => {
    setFormData({
      title: blog.title,
      category: blog.category,
      author: blog.author,
      content: blog.content,
      coverImage: blog.coverImage,
      status: blog.status
    });
    setIsEditMode(true);
    // Keep reference to which ID we are editing via selectedBlog or a new state
    // For simplicity, we use selectedBlog logic if we came from detail, 
    // but if coming from list, we need to set selectedBlog temporarily to track ID.
    setSelectedBlog(blog); 
    setView('form');
    updateUrl('form', blog.id);
    setActiveMenuId(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && selectedBlog) {
      // Update
      const updatedBlogs = blogs.map(blog => {
        if (blog.id === selectedBlog.id) {
          return {
            ...blog,
            ...formData,
            excerpt: formData.content.substring(0, 100) + "...",
            readTime: Math.ceil(formData.content.split(' ').length / 200) + " min read",
            coverImage: formData.coverImage || blog.coverImage
          };
        }
        return blog;
      });
      setBlogs(updatedBlogs);
      // Update the selected blog object for the Detail view
      const updatedItem = updatedBlogs.find(b => b.id === selectedBlog.id);
      if(updatedItem) setSelectedBlog(updatedItem);
      
      // Go back to Detail view
      setView('detail');
      updateUrl('detail', selectedBlog.id);

    } else {
      // Create
      const newId = Date.now();
      const createdBlog: BlogPost = {
        id: newId,
        ...formData,
        excerpt: formData.content.substring(0, 100) + "...",
        authorRole: "Contributor",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: Math.ceil(formData.content.split(' ').length / 200) + " min read",
        views: 0,
        comments: 0,
        coverImage: formData.coverImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
        authorImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=150"
      };
      setBlogs([createdBlog, ...blogs]);
      setView('list');
      updateUrl('list');
    }
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setBlogs(blogs.filter(b => b.id !== deleteId));
      if (selectedBlog && selectedBlog.id === deleteId) {
        setView('list');
        updateUrl('list');
        setSelectedBlog(null);
      }
      setDeleteId(null);
      setActiveMenuId(null);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // --- Filtering & Pagination ---
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || blog.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusStyle = (status: BlogStatus) => {
    switch (status) {
      case 'Published': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Draft': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Archived': return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  // --- Sub-Component: Delete Modal ---
  const DeleteModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform scale-100 transition-all">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Post?</h3>
          <p className="text-slate-500 text-sm mb-6">
            Are you sure you want to delete this blog post? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER ---
  return (
    <div className="">
      
      {deleteId && <DeleteModal />}

      {/* --- VIEW: FORM PAGE (Create / Edit) --- */}
      {view === 'form' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Form Header Navigation */}
          <button 
            onClick={() => {
              // If editing, go back to detail, else go back to list
              if(isEditMode && selectedBlog) {
                setView('detail');
                updateUrl('detail', selectedBlog.id);
              } else {
                setView('list');
                updateUrl('list');
              }
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-6 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {isEditMode ? 'Cancel Edit' : 'Back to Dashboard'}
          </button>

          <div className="bg-white rounded-lg shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 p-6 bg-slate-50/50">
              <h4 className="text-xl font-bold text-slate-900">{isEditMode ? 'Edit Blog Post' : 'Create New Post'}</h4>
              <p className="text-slate-500 text-sm mt-1">Fill in the details below to {isEditMode ? 'update' : 'publish'} your content.</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" 
                    placeholder="Enter post title" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  >
                    <option>Technology</option>
                    <option>Mentorship</option>
                    <option>Scholarship</option>
                    <option>Campus Life</option>
                    <option>Career Tips</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
                   <input 
                      type="text" 
                      value={formData.author}
                      onChange={e => setFormData({...formData, author: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" 
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                   <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as BlogStatus})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                   >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image URL</label>
                <div className="relative">
                   <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                   <input 
                     type="url" 
                     value={formData.coverImage}
                     onChange={e => setFormData({...formData, coverImage: e.target.value})}
                     className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" 
                     placeholder="https://example.com/image.jpg" 
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                <textarea 
                  required
                  rows={8} 
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-y" 
                  placeholder="Write your blog content here..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => {
                        if(isEditMode && selectedBlog) {
                            setView('detail');
                            updateUrl('detail', selectedBlog.id);
                        } else {
                            setView('list');
                            updateUrl('list');
                        }
                    }} 
                    className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 shadow-md shadow-purple-100 transition-all transform active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    {isEditMode ? 'Update Post' : 'Publish Post'}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW: DETAIL PAGE --- */}
      {view === 'detail' && selectedBlog && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => { setView('list'); updateUrl('list'); }}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(selectedBlog)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => setDeleteId(selectedBlog.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
            </div>
          </div>

          {/* Hero Image Section */}
          <div className="relative w-full h-64 md:h-[400px] group overflow-hidden rounded-2xl shadow-md">
            <div className="absolute inset-0 bg-gray-900/40 z-10"></div>
            <img 
              src={selectedBlog.coverImage} 
              alt={selectedBlog.title} 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
              <div className="max-w-4xl">
                <span className="inline-block px-3 py-1 mb-4 rounded-md bg-purple-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                  {selectedBlog.category}
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4 shadow-sm">
                  {selectedBlog.title}
                </h3>
                <div className="flex flex-wrap items-center gap-6 text-white/90 text-xs md:text-sm font-medium">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {selectedBlog.date}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {selectedBlog.readTime}</span>
                  <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> {selectedBlog.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            <div className="lg:col-span-8">
              <div className="bg-white p-8 rounded-xl shadow-xs">
                <p className="text-xl text-slate-600 font-serif italic mb-8 pl-4 border-l-4 border-purple-500">
                  "{selectedBlog.excerpt}"
                </p>
                <div className="prose prose-slate prose-lg max-w-none text-slate-700 whitespace-pre-line">
                  {selectedBlog.content}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">About the Author</h4>
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedBlog.authorImage} 
                    alt={selectedBlog.author} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{selectedBlog.author}</div>
                    <div className="text-purple-600 text-sm font-medium">{selectedBlog.authorRole}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-xs">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Details</h4>
                 <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between">
                        <span>Status</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusStyle(selectedBlog.status)}`}>{selectedBlog.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Comments</span>
                        <span className="font-medium text-slate-900">{selectedBlog.comments}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW: LIST (Dashboard) --- */}
      {view === 'list' && (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-left-4 duration-300">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Blog Management</h3>
              <p className="text-slate-500 mt-1">Manage, edit, and publish your educational content.</p>
            </div>
            <button 
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95"
            >
               <Plus className="w-4 h-4" /> Create New Post
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-xs">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search by title or author..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {['All', 'Published', 'Draft'].map(status => (
                   <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                         filterStatus === status 
                         ? 'bg-purple-600 text-white shadow-sm' 
                         : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                   >
                      {status}
                   </button>
                ))}
             </div>
          </div>

          {/* Blog Table */}
          <div className="bg-white rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="px-6 py-4">Article Details</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentItems.length > 0 ? (
                    currentItems.map(blog => (
                      <tr 
                        key={blog.id} 
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 max-w-sm">
                          <div className="flex gap-4">
                              <img src={blog.coverImage} alt="" className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0" />
                              <div>
                                 <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1 cursor-pointer hover:text-purple-600" onClick={() => handleViewBlog(blog)}>{blog.title}</h4>
                                 <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                                 </div>
                              </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <img src={blog.authorImage} alt="" className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
                               <div className="text-sm">
                                  <div className="font-semibold text-slate-700 whitespace-nowrap">{blog.author}</div>
                                  <div className="text-xs text-slate-400 whitespace-nowrap">{blog.authorRole}</div>
                               </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                               {blog.category}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(blog.status)}`}>
                               {blog.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right relative">
                            {/* 3-Dot Action Menu */}
                            <button 
                              onClick={(e) => toggleMenu(e, blog.id)}
                              className={`p-2 rounded-lg transition-colors ${activeMenuId === blog.id ? 'bg-purple-50 text-purple-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                            >
                               <MoreVertical className="w-5 h-5" />
                            </button>

                            {/* Dropdown */}
                            {activeMenuId === blog.id && (
                              <div ref={menuRef} className="absolute right-8 top-8 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                <div className="py-1">
                                  <button 
                                    onClick={() => handleViewBlog(blog)} 
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-purple-600 flex items-center gap-2 transition-colors"
                                  >
                                    <Eye className="w-4 h-4" /> View
                                  </button>
                                  <button 
                                    onClick={() => handleEditClick(blog)} 
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-purple-600 flex items-center gap-2 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" /> Edit
                                  </button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button 
                                    onClick={() => { setDeleteId(blog.id); setActiveMenuId(null); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </div>
                            )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                <Search className="w-8 h-8 text-slate-300" />
                              </div>
                              <p className="text-lg font-medium text-slate-900">No blog posts found</p>
                              <p className="text-sm">Try adjusting your search or filters.</p>
                          </div>
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {filteredBlogs.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 border-t border-slate-200 gap-4">
                <div className="text-sm text-slate-500">
                  Showing <span className="font-bold text-slate-700">{indexOfFirstItem + 1}</span> to <span className="font-bold text-slate-700">{Math.min(indexOfLastItem, filteredBlogs.length)}</span> of <span className="font-bold text-slate-700">{filteredBlogs.length}</span> entries
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="hidden sm:flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                       <button
                         key={page}
                         onClick={() => setCurrentPage(page)}
                         className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                           currentPage === page 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                         }`}
                       >
                         {page}
                       </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDashboard;