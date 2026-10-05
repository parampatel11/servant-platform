"use client";

import React, { useState } from "react";
import { Search, MapPin, Filter, ShieldCheck, ChevronDown, Briefcase } from "lucide-react";

const DUMMY_JOBS = [
    { id: 1, client: "Rajesh Kumar", need: "Professional Chef for Weekend", duration: "2 Days", rate: "₹350/hr", location: "Mumbai", image: "" },
    { id: 2, client: "Anjali Desai", need: "Deep House Cleaning", duration: "5 Hours", rate: "₹250/hr", location: "Delhi", image: "" },
    { id: 3, client: "Vikram Singh", need: "Electrical Wiring Fix", duration: "1 Day", rate: "₹450/hr", location: "Morbi", image: "" },
];

export default function ServantSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [jobs, setJobs] = useState(DUMMY_JOBS);

    return (
        <div id="search" className="w-full mt-10 space-y-6">
            <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm border border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">Find Available Shifts</h2>
                        <p className="text-sm text-gray-400 font-medium">Browse clients looking for help in your area.</p>
                    </div>
                    <div className="w-full md:w-[400px] relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-500" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search jobs or clients..." 
                            className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder:text-gray-500 shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="relative z-10 flex flex-wrap gap-3 mt-6 pt-6 border-t border-zinc-800">
                    <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-zinc-700">
                        <Filter size={14} /> All Filters
                    </button>
                    <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-zinc-700">
                        <MapPin size={14} /> Location <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col group transition-all duration-300 hover:shadow-md hover:border-yellow-300">
                        <div className="flex gap-4 items-start mb-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                    src={job.image || `https://ui-avatars.com/api/?name=${job.client}&background=EAB308&color=fff`} 
                                    alt={job.client} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-zinc-900 truncate">{job.need}</h3>
                                <p className="text-xs text-gray-500 font-medium mb-1">Client: {job.client}</p>
                                <div className="flex items-center gap-1 text-[11px] text-yellow-700 font-semibold bg-yellow-50 w-fit px-1.5 py-0.5 rounded-sm">
                                    <ShieldCheck size={12} /> Verified Client
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Est. Budget</p>
                                <p className="text-sm font-black text-zinc-900">{job.rate}</p>
                            </div>
                            <button className="bg-yellow-50 hover:bg-yellow-500 text-yellow-700 hover:text-zinc-900 font-bold text-xs px-5 py-2 rounded-lg transition-all duration-300 active:scale-95">
                                Apply Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}