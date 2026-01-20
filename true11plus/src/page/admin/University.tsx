import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle, 
  TrendingUp, 
  ArrowLeft,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Save,
  AlertTriangle,
  Download,
  FileSpreadsheet, // Icon for Excel
  FileText         // Icon for CSV
} from 'lucide-react';

// --- 1. TypeScript Interfaces ---

interface University {
  id: number;
  name: string;
  chance: string;
  match: string;
  location: string;
  goodMatchReasons: string[];
  improvementTips: string[];
}

// --- 2. Mock Data ---
const initialUniversities: University[] = [
  { id: 1, name: "Oxford University", chance: "High", match: "95%", location: "Oxford, UK", goodMatchReasons: ["Strong GPA match"], improvementTips: ["Submit earlier"] },
  { id: 2, name: "Cambridge University", chance: "Medium", match: "82%", location: "Cambridge, UK", goodMatchReasons: ["Excellent test scores"], improvementTips: ["Improve SOP"] },
  { id: 3, name: "Imperial College London", chance: "Low", match: "60%", location: "London, UK", goodMatchReasons: ["Technical background"], improvementTips: ["Retake IELTS"] },
  { id: 4, name: "Harvard University", chance: "Low", match: "45%", location: "Cambridge, USA", goodMatchReasons: ["Leadership roles"], improvementTips: ["Publish research"] },
  { id: 5, name: "Stanford University", chance: "Medium", match: "78%", location: "California, USA", goodMatchReasons: ["Startup experience"], improvementTips: ["Connect with alumni"] },
  { id: 6, name: "MIT", chance: "Low", match: "50%", location: "Massachusetts, USA", goodMatchReasons: ["Engineering focus"], improvementTips: ["Win hackathons"] },
  { id: 7, name: "ETH Zurich", chance: "High", match: "92%", location: "Zurich, Switzerland", goodMatchReasons: ["Academic Excellence"], improvementTips: ["German proficiency"] },
  { id: 8, name: "University of Toronto", chance: "High", match: "88%", location: "Toronto, Canada", goodMatchReasons: ["Diverse profile"], improvementTips: ["Apply for scholarships"] },
  { id: 9, name: "National University of Singapore", chance: "Medium", match: "75%", location: "Singapore", goodMatchReasons: ["Asian market focus"], improvementTips: ["Improve GRE"] },
  { id: 10, name: "University of Melbourne", chance: "High", match: "90%", location: "Melbourne, Australia", goodMatchReasons: ["Research output"], improvementTips: ["Check visa reqs"] },
  { id: 11, name: "UCLA", chance: "Low", match: "55%", location: "Los Angeles, USA", goodMatchReasons: ["Arts background"], improvementTips: ["Portfolio update"] },
  { id: 12, name: "LSE", chance: "Medium", match: "70%", location: "London, UK", goodMatchReasons: ["Economics grade"], improvementTips: ["Math supplement"] },
];

// --- 3. Main Component ---
const UniversityDashboard: React.FC = () => {
  // State
  const [data, setData] = useState<University[]>(initialUniversities);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit'>('list');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  
  // UI State
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<University | null>(null);
  const [editFormData, setEditFormData] = useState<University | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // --- LOGIC ---

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUniversities = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Create an array of page numbers (e.g. [1, 2, 3])
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [data.length, totalPages, currentPage]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) setActiveDropdownId(null);
      if (!target.closest('.download-container')) setShowDownloadMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- ACTIONS ---

  const handleView = (uni: University) => {
    setSelectedUni(uni);
    setViewMode('detail');
    setActiveDropdownId(null);
  };

  const handleEdit = (uni: University) => {
    setSelectedUni(uni);
    setEditFormData({ ...uni });
    setViewMode('edit');
    setActiveDropdownId(null);
  };

  const handleDeleteRequest = (uni: University) => {
    setItemToDelete(uni);
    setActiveDropdownId(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(prev => prev.filter(u => u.id !== itemToDelete.id));
      setItemToDelete(null);
      if (selectedUni?.id === itemToDelete.id) handleBackToList();
    }
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      setData(prev => prev.map(u => u.id === editFormData.id ? editFormData : u));
      setSelectedUni(editFormData);
      setViewMode('detail');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUni(null);
    setEditFormData(null);
  };

  // --- DOWNLOAD LOGIC ---

  const downloadCSV = () => {
    const headers = ["ID", "University Name", "Location", "Chance", "Match Score"];
    const rows = data.map(u => [
      u.id, 
      `"${u.name}"`, // Quote strings to handle commas inside names
      `"${u.location}"`, 
      u.chance, 
      u.match
    ].join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "university_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  const downloadExcel = () => {
    // Creating a simple HTML table for Excel (Standard method without external libraries)
    let tableContent = `
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>University Name</th>
            <th>Location</th>
            <th>Chance</th>
            <th>Match Score</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(u => `
            <tr>
              <td>${u.id}</td>
              <td>${u.name}</td>
              <td>${u.location}</td>
              <td>${u.chance}</td>
              <td>${u.match}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "university_data.xls"; // .xls works best with HTML tables
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  // --- SUB-COMPONENTS ---

  const DeleteModal = () => {
    if (!itemToDelete) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete University?</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Remove <strong>{itemToDelete.name}</strong> from your list? This cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setItemToDelete(null)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-200 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- VIEW: EDIT FORM ---
  if (viewMode === 'edit' && editFormData) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between">
          <button onClick={handleBackToList} className="flex items-center text-gray-500 hover:text-purple-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5 mr-1" /> Back To List
          </button>
          <h4 className="text-xl font-bold text-gray-800">Edit University</h4>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">University Name</label>
              <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <input type="text" value={editFormData.location} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Acceptance Chance</label>
              <select value={editFormData.chance} onChange={(e) => setEditFormData({...editFormData, chance: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Match Percentage</label>
              <input type="text" value={editFormData.match} onChange={(e) => setEditFormData({...editFormData, match: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"/>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button onClick={handleBackToList} className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSaveEdit} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md shadow-purple-200">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: DETAIL PAGE ---
  if (viewMode === 'detail' && selectedUni) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <DeleteModal />
        <div className="flex items-center justify-between">
          <button onClick={handleBackToList} className="flex items-center text-gray-500 hover:text-purple-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5 mr-1" /> Back to Recommendations
          </button>
          <div className="flex gap-2">
            <button onClick={() => handleEdit(selectedUni)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"><Edit className="w-4 h-4" /> Edit</button>
            <button onClick={() => handleDeleteRequest(selectedUni)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-xs overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/30">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm"><GraduationCap className="w-8 h-8" /></div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{selectedUni.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 mt-1"><MapPin className="w-4 h-4" /><span>{selectedUni.location}</span></div>
                </div>
              </div>
              <div className="flex gap-3">
                 <span className={`px-4 py-2 rounded-full text-sm font-bold border ${selectedUni.chance === 'High' ? 'bg-green-100 text-green-700 border-green-200' : selectedUni.chance === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{selectedUni.chance} Chance</span>
                 <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold border border-blue-200">{selectedUni.match} Match</span>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg"><CheckCircle className="w-5 h-5 text-green-600" /> Why it's a good match</h4>
                <ul className="space-y-4">{selectedUni.goodMatchReasons.map((r, i) => (<li key={i} className="flex items-start text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 mr-3 flex-shrink-0"></div>{r}</li>))}</ul>
              </div>
              <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg"><TrendingUp className="w-5 h-5 text-orange-500" /> To improve your chances</h4>
                <ul className="space-y-4">{selectedUni.improvementTips.map((t, i) => (<li key={i} className="flex items-start text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></div>{t}</li>))}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: LIST TABLE VIEW (Default) ---
  return (
    <div className="space-y-6 animate-in fade-in duration-500 min-h-[600px]">
      <DeleteModal />
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-xl">University Recommendations</h3>
          <p className="text-gray-500 text-sm mt-1">Compare schools matching your profile.</p>
        </div>
        
        {/* DOWNLOAD BUTTON WITH DROPDOWN */}
        <div className="relative download-container">
          <button 
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
          >
            <Download className="w-4 h-4" /> Download Report
          </button>
          
          {showDownloadMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-30 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
              <div className="">
                <button onClick={downloadCSV} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" /> Download CSV
                </button>
                <button onClick={downloadExcel} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" /> Download Excel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs overflow-visible"> 
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="p-4 pl-6">University Name</th>
                <th className="p-4">Match Score</th>
                <th className="p-4">Acceptance Chance</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentUniversities.map((uni) => (
                <tr key={uni.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{uni.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {uni.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">{uni.match} Match</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-200 rounded-full h-2 w-24 overflow-hidden">
                        <div className={`h-full rounded-full ${uni.chance === 'High' ? 'bg-green-500' : uni.chance === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: uni.chance === 'High' ? '85%' : uni.chance === 'Medium' ? '50%' : '25%' }} />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{uni.chance}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right pr-6 relative">
                    <div className="relative inline-block text-left dropdown-container">
                      <button onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === uni.id ? null : uni.id); }} className={`p-2 rounded-lg transition-colors ${activeDropdownId === uni.id ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeDropdownId === uni.id && (
                        <div className="absolute right-0 mt-2 w-38 origin-top-right bg-white rounded-xl shadow-xs z-20 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                          <div className="">
                            <button onClick={() => handleView(uni)} className="group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-xl"><Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-600" /> View Details</button>
                            <button onClick={() => handleEdit(uni)} className="group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><Edit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" /> Edit</button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button onClick={() => handleDeleteRequest(uni)} className="group flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"><Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-600" /> Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentUniversities.length === 0 && <div className="p-12 text-center text-gray-500">No universities found.</div>}
        </div>

        {/* --- NUMBERED PAGINATION FOOTER --- */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl gap-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, data.length)}</span> of <span className="font-semibold text-gray-900">{data.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-gray-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === number ? 'bg-purple-600 text-white shadow-sm' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityDashboard;