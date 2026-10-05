"use client";

import React, { useState } from "react";
import { Search, MapPin, Star, Filter, ShieldCheck, ChevronDown } from "lucide-react";

// Temporary dummy data
const DUMMY_WORKERS = [
    { id: 1, name: "Rahul Verma", role: "Professional Chef", rating: 4.8, jobs: 124, rate: "₹300/hr", location: "Mumbai", image: "", skills: ["Cooking", "Baking"] },
    { id: 2, name: "Priya Sharma", role: "Housekeeper", rating: 4.9, jobs: 89, rate: "₹200/hr", location: "Delhi", image: "", skills: ["Cleaning", "Laundry"] },
    { id: 3, name: "Amit Patel", role: "Electrician", rating: 4.7, jobs: 210, rate: "₹400/hr", location: "Morbi", image: "", skills: ["Wiring", "Repairs"] },
];

export default function ClientSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [workers, setWorkers] = useState(DUMMY_WORKERS);

    return (
        <div id="search" className="w-full mt-10 space-y-6">
            
            {/* Header & Search Section */}
            <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                            Find the Perfect Help
                        </h2>
                        <p className="text-sm text-gray-400 font-medium">
                            Browse verified professionals in your area.
                        </p>
                    </div>

                    <div className="w-full md:w-[400px] relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-500" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by name or skill..." 
                            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-gray-500 shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="relative z-10 flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-800">
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-slate-700">
                        <Filter size={14} /> All Filters
                    </button>
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-slate-700">
                        <MapPin size={14} /> Location <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Workers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {workers.map((worker) => (
                    <div key={worker.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col group transition-all duration-300 hover:shadow-md hover:border-green-200">
                        <div className="flex gap-4 items-start mb-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                    src={worker.image || `https://ui-avatars.com/api/?name=${worker.name}&background=0D8B46&color=fff`} 
                                    alt={worker.name} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-bold text-slate-900 truncate">{worker.name}</h3>
                                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                                        <Star size={10} className="fill-amber-500" /> {worker.rating}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-medium mb-1">{worker.role}</p>
                                <div className="flex items-center gap-1 text-[11px] text-green-600 font-semibold bg-green-50 w-fit px-1.5 py-0.5 rounded-sm">
                                    <ShieldCheck size={12} /> Verified
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Hourly Rate</p>
                                <p className="text-sm font-black text-slate-900">{worker.rate}</p>
                            </div>
                            <button className="bg-green-50 hover:bg-green-500 text-green-700 hover:text-white font-bold text-xs px-5 py-2 rounded-lg transition-all duration-300 active:scale-95">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}