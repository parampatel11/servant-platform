"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Filter, ShieldCheck, ChevronDown, Loader2, ChevronLeft, ChevronRight, Hash, X, CheckCircle2, Clock, Wallet, Briefcase, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const AHMEDABAD_LOCATIONS = ["SG Highway", "CG Road", "Ashram Road", "Ring Road", "Relief Road"];

export default function ClientSearch() {
    const [workers, setWorkers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination & Filter State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [jumpPage, setJumpPage] = useState("");
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    
    // Booking Modal State
    const [bookingWorker, setBookingWorker] = useState<any | null>(null);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); 
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedLocation]);

    useEffect(() => {
        const fetchWorkers = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/client/workers?page=${currentPage}&search=${debouncedSearch}&location=${selectedLocation}`, {
                    withCredentials: true
                });
                setWorkers(response.data.workers || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
            } catch (error) {
                toast.error("Failed to load worker profiles.");
                setWorkers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkers();
    }, [currentPage, debouncedSearch, selectedLocation]);

    const handleJumpToPage = (e: React.FormEvent) => {
        e.preventDefault();
        const pageNum = parseInt(jumpPage);
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
            setJumpPage("");
        } else {
            toast.error(`Please enter a valid page between 1 and ${totalPages}`);
        }
    };

    const getPaginationGroup = () => {
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, '...', totalPages];
            } else if (currentPage >= totalPages - 2) {
                pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage, '...', totalPages];
            }
        }
        return pages;
    };

    const handleTaskToggle = (task: string) => {
        if (selectedTasks.includes(task)) {
            setSelectedTasks(prev => prev.filter(t => t !== task));
        } else {
            if (selectedTasks.length >= 2) {
                toast.error("You can only select up to 2 tasks. Upgrade to Premium for unlimited tasks.");
                return;
            }
            setSelectedTasks(prev => [...prev, task]);
        }
    };

    return (
        <div id="search" className="w-full mt-10 space-y-6 relative font-sans">
            
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="w-full md:w-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                                Ahmedabad Pilot
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Discover Professionals</h2>
                        <p className="text-sm text-gray-400 font-medium">Browse verified, highly-rated workers ready to help today.</p>
                    </div>
                    
                    <form onSubmit={(e) => e.preventDefault()} className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search skills or names..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-gray-500 shadow-inner"
                            />
                        </div>
                        
                        <div className="relative w-full sm:w-48">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-400" size={16} />
                            <select 
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-xl pl-10 pr-10 py-3 focus:ring-2 focus:ring-green-500 outline-none appearance-none transition-all cursor-pointer"
                            >
                                <option value="">All Locations</option>
                                {AHMEDABAD_LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </form>
                </div>
            </div>

            {isLoading ? (
                <div className="w-full flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="animate-spin text-green-500 mb-3" size={40} />
                    <p className="text-sm font-bold text-slate-500">Scanning your area for workers...</p>
                </div>
            ) : workers.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                        <Search size={32} className="text-slate-300" />
                    </div>
                    <p className="text-lg font-bold text-slate-700">No workers found</p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Try adjusting your search or location filters.</p>
                    {(searchQuery || selectedLocation) && (
                        <button 
                            type="button"
                            onClick={() => { setSearchQuery(""); setSelectedLocation(""); }}
                            className="mt-4 text-sm font-bold text-green-600 hover:text-green-700"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workers.map((worker) => (
                            <div key={worker._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-green-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                                
                                <div className="flex gap-5 items-start mb-5">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner border-2 border-white relative group-hover:border-green-100 transition-colors">
                                        <img 
                                            src={worker.image || `https://ui-avatars.com/api/?name=${worker.fullname}&background=0D8B46&color=fff`} 
                                            alt={worker.fullname} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-slate-900 truncate capitalize">{worker.fullname}</h3>
                                                {/* NEW: Top Match Badge assigned by Backend Aggregation */}
                                                {worker.matchScore >= 2 && (
                                                    <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                                        <Sparkles size={10} /> Top Match
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-lg">
                                                <Wallet size={12} /> ₹{worker.pricingTier?.oneHour || 200}/hr
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-1.5 truncate">
                                            <MapPin size={14} className="text-slate-400" />
                                            {worker.subRoad ? `${worker.subRoad}, ${worker.mainRoad}` : "Ahmedabad"}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {worker.skills?.slice(0, 3).map((skill: string) => (
                                                <span key={skill} className="text-[11px] bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-md font-bold shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <ShieldCheck size={16} className="text-green-500" /> Verified Worker
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setBookingWorker(worker);
                                            setSelectedTasks([]);
                                        }}
                                        className="bg-slate-900 hover:bg-green-500 text-white hover:text-slate-900 font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 0 && (
                        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-8">
                            <div className="flex items-center gap-1.5">
                                <button 
                                    type="button"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                
                                {getPaginationGroup().map((item, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => typeof item === 'number' ? setCurrentPage(item) : undefined}
                                        disabled={item === '...'}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                                            currentPage === item 
                                            ? "bg-slate-900 text-white shadow-md scale-105" 
                                            : item === '...' 
                                                ? "text-gray-300 cursor-default" 
                                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}

                                <button 
                                    type="button"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleJumpToPage} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-gray-200 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                                <Hash size={14} className="text-gray-400 ml-2" />
                                <input 
                                    type="number" min="1" max={totalPages}
                                    value={jumpPage} onChange={(e) => setJumpPage(e.target.value)}
                                    placeholder="Page..." 
                                    className="w-16 bg-transparent text-sm font-bold text-slate-700 focus:outline-none placeholder:text-gray-400 placeholder:font-medium"
                                />
                                <button type="submit" className="bg-white border border-gray-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:border-gray-300 transition-colors shadow-sm">
                                    Go
                                </button>
                            </form>
                        </div>
                    )}
                </>
            )}

            {bookingWorker && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setBookingWorker(null)}></div>
                    <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        
                        <div className="bg-slate-900 p-8 text-white relative shrink-0">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                            <button type="button" onClick={() => setBookingWorker(null)} className="absolute top-5 right-5 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
                                <X size={18} />
                            </button>
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <img src={bookingWorker.image || `https://ui-avatars.com/api/?name=${bookingWorker.fullname}&background=0D8B46&color=fff`} alt="Profile" className="w-20 h-20 rounded-2xl border-2 border-white/20 shadow-xl object-cover" />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-2xl font-bold capitalize">{bookingWorker.fullname}</h3>
                                        <ShieldCheck size={18} className="text-green-400" />
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                                        <MapPin size={14} className="text-green-400" /> 
                                        {bookingWorker.subRoad ? `${bookingWorker.subRoad}, ${bookingWorker.mainRoad}` : "Ahmedabad"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Briefcase size={18} className="text-slate-400" /> Select Tasks
                                </h4>
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">Max 2</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {bookingWorker.skills?.map((skill: string) => {
                                    const isSelected = selectedTasks.includes(skill);
                                    const isDisabled = !isSelected && selectedTasks.length >= 2;
                                    return (
                                        <button 
                                            type="button"
                                            key={skill}
                                            disabled={isDisabled}
                                            onClick={() => handleTaskToggle(skill)}
                                            className={`flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                                                isSelected 
                                                ? 'border-green-500 bg-green-50/50 shadow-sm' 
                                                : isDisabled 
                                                    ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50' 
                                                    : 'border-gray-100 bg-white hover:border-green-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex justify-between w-full items-center mb-2">
                                                <span className={`text-sm font-bold ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>{skill}</span>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                                    isSelected ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <CheckCircle2 size={12} strokeWidth={4} />}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <Clock size={18} className="text-slate-400" /> Pricing Structure
                            </h4>
                            
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[
                                    { hrs: '1 Hour', price: bookingWorker.pricingTier?.oneHour || 200 },
                                    { hrs: '2 Hours', price: bookingWorker.pricingTier?.twoHours || 450 },
                                    { hrs: '3 Hours', price: bookingWorker.pricingTier?.threeHours || 700 }
                                ].map((tier, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-gray-100 p-3 rounded-2xl text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{tier.hrs}</p>
                                        <p className="text-lg font-bold text-slate-800">₹{tier.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                            <button 
                                type="button"
                                disabled={selectedTasks.length === 0}
                                className="w-full bg-slate-900 hover:bg-green-500 disabled:bg-gray-100 disabled:text-gray-400 text-white disabled:border-transparent font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none text-base active:scale-95 group"
                            >
                                {selectedTasks.length === 0 ? (
                                    "Select tasks to continue"
                                ) : (
                                    <>Confirm {selectedTasks.length} {selectedTasks.length === 1 ? 'Task' : 'Tasks'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}