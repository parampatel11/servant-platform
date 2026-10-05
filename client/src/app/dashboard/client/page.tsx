"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    HeartHandshake, Mail, Phone, Crown, X, Sparkles, CheckCircle2, 
    Search, ShieldCheck, Zap, Star, Loader2, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import ClientSearch from "@/src/components/ClientSearch";
import ClientPost from "@/src/components/ClientPost";
import ClientRequests from "@/src/components/ClientRequests";
import ClientSupport from "@/src/components/ClientSupport";

export default function ClientDashboard() {
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/auth/me", {
                    withCredentials: true 
                });
                setUserProfile(response.data.user || response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-3">
                <Loader2 size={32} className="text-green-500 animate-spin" />
                <p className="text-sm text-slate-500 font-medium animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="w-full text-center p-6 bg-white rounded-xl shadow-sm border border-red-100">
                <p className="text-sm text-red-500 font-bold">Failed to load profile. Please refresh.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-5">
                
                {/* LEFT SIDE: Compact Profile Section */}
                <div className="w-full lg:w-[30%] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md">
                    <div className="h-20 bg-slate-900 relative">
                        <div className="absolute -bottom-8 left-6">
                            <div className="w-20 h-20 rounded-xl border-4 border-white overflow-hidden bg-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2 group-hover:shadow-green-500/20">
                                <img 
                                    src={userProfile.image || "https://via.placeholder.com/150"} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${userProfile.fullname || 'User'}&background=0D8B46&color=fff`;
                                    }}
                                />
                            </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide flex items-center gap-1 backdrop-blur-sm border border-green-500/20">
                            <ShieldCheck size={12} /> VERIFIED
                        </div>
                    </div>
                    
                    <div className="pt-10 pb-5 px-5 flex-1 flex flex-col">
                        <h2 className="text-lg font-extrabold text-slate-900 capitalize leading-tight">{userProfile.fullname}</h2>
                        
                        <div className="w-full mt-4 space-y-2">
                            <div className="flex items-center gap-2.5 text-gray-600 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 transition-colors hover:bg-gray-50 hover:border-gray-200">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-xs font-medium truncate">{userProfile.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-600 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 transition-colors hover:bg-gray-50 hover:border-gray-200">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-xs font-medium">{userProfile.mobile}</span>
                            </div>
                        </div>

                        {/* Compact Subscription Button */}
                        <div className="w-full mt-auto pt-5">
                            <button 
                                onClick={() => setIsSubModalOpen(true)}
                                className="w-full group/btn flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                                <span className="flex items-center gap-2 text-sm">
                                    <Crown size={16} className="text-yellow-400 transition-transform group-hover/btn:-rotate-12 group-hover/btn:scale-110" />
                                    Get Premium
                                </span>
                                <ArrowRight size={14} className="text-gray-400 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Streamlined Hero Banner */}
                <div className="w-full lg:w-[70%] bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 md:p-8 relative overflow-hidden flex flex-col justify-center">
                    {/* Subtle Background Gradients */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-500 rounded-full blur-[80px]"></div>
                        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-blue-600 rounded-full blur-[80px]"></div>
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="mb-6">
                            <div className="flex items-center gap-2.5 mb-3 opacity-90">
                                <HeartHandshake size={20} className="text-green-400" />
                                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">ShiftServe Hub</span>
                            </div>
                            
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                                Welcome back, <span className="text-green-400 capitalize">{userProfile.fullname?.split(' ')[0] || 'User'}</span>.
                            </h1>
                            <p className="text-sm text-gray-400 font-medium max-w-md">
                                Who are you looking to hire today? Manage your bookings or find new help instantly.
                            </p>
                        </div>

                        {/* Interactive Action Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-green-500/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(34,197,94,0.1)] cursor-pointer group">
                                <Search size={20} className="text-blue-400 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-300" />
                                <h3 className="text-white font-bold text-sm">Find Workers</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">Browse top-rated help</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-yellow-500/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(234,179,8,0.1)] cursor-pointer group">
                                <Zap size={20} className="text-yellow-400 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-300" />
                                <h3 className="text-white font-bold text-sm">Quick Post</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">Post a requirement</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-orange-500/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)] cursor-pointer group">
                                <Star size={20} className="text-orange-400 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-300" />
                                <h3 className="text-white font-bold text-sm">My Bookings</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">View active shifts</p>
                            </div>
                        </div>

                        <div className="flex">
                            <button className="bg-green-500 hover:bg-green-400 text-slate-900 font-bold px-6 py-2.5 text-sm rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                                Start Exploring <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seamless Worker Search Section */}
            <ClientSearch />
            <ClientPost />
            <ClientRequests />
            <ClientSupport />

            {/* COMPACT SUBSCRIPTION MODAL */}
            {isSubModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" 
                        onClick={() => setIsSubModalOpen(false)}
                    ></div>
                    
                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-green-600"></div>
                        
                        <button 
                            onClick={() => setIsSubModalOpen(false)} 
                            className="absolute top-3 right-3 text-gray-400 hover:text-slate-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors z-10"
                        >
                            <X size={18} />
                        </button>
                        
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner relative">
                                <Sparkles size={24} className="animate-pulse" />
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-900 mb-1.5">ShiftServe Premium</h3>
                            <p className="text-xs text-gray-500 mb-5 font-medium px-4">
                                Unlimited direct contacts, priority support, and verified worker background checks.
                            </p>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-3 mb-5 relative overflow-hidden group cursor-pointer transition-all hover:border-green-300 hover:shadow-md">
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-green-500/10 rounded-full blur-xl transition-all group-hover:bg-green-500/20"></div>
                                <p className="text-[10px] font-bold text-green-700/80 uppercase tracking-widest mb-0.5">First Day Bonus</p>
                                <p className="text-2xl font-black text-green-600 group-hover:scale-105 transition-transform duration-300">50% OFF</p>
                            </div>

                            <ul className="text-left space-y-2.5 mb-6 px-2">
                                <li className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                                    <CheckCircle2 size={14} className="text-green-500 shrink-0" /> Direct WhatsApp Integration
                                </li>
                                <li className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                                    <CheckCircle2 size={14} className="text-green-500 shrink-0" /> Zero Platform Commission
                                </li>
                                <li className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                                    <CheckCircle2 size={14} className="text-green-500 shrink-0" /> Premium Profile Badge
                                </li>
                            </ul>

                            <button className="w-full bg-slate-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 group flex justify-center items-center gap-2">
                                Claim Offer <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}