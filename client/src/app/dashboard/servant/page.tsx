"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    HeartHandshake, Mail, Phone, Crown, X, Sparkles, CheckCircle2, 
    Briefcase, BadgeCheck, Wallet, Calendar, Loader2, ArrowRight,
    Clock, Check, AlertCircle, User
} from "lucide-react";
import toast from "react-hot-toast";

import ServantSearch from "@/src/components/ServantSearch";
import ServantPost from "@/src/components/ServantPost";
import ServantRequests from "@/src/components/ServantRequests";
import ServantSupport from "@/src/components/ServantSupport";
import ServantOnboardingModal from "@/src/components/ServantOnboardingModal";

interface ClientInfo {
    _id: string;
    fullname?: string;
    name?: string;
    mobile?: string;
}

interface PendingBooking {
    _id: string;
    durationHours: number;
    client: ClientInfo;
    status: string;
    createdAt: string;
}

export default function ServantDashboard() {
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
    const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

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

    const fetchPendingBookings = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/booking/pending", {
                withCredentials: true
            });
            setPendingBookings(response.data.bookings || []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
        fetchPendingBookings();
        const interval = setInterval(fetchPendingBookings, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleBookingResponse = async (bookingId: string, action: "accept" | "reject") => {
        setProcessingBookingId(bookingId);
        try {
            const response = await axios.post(
                `http://localhost:8000/api/booking/respond/${bookingId}`,
                { action },
                { withCredentials: true }
            );
            toast.success(response.data.message || `Booking ${action}ed`);
            setPendingBookings((prev) => prev.filter((b) => b._id !== bookingId));
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${action} booking`);
        } finally {
            setProcessingBookingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-3">
                <Loader2 size={32} className="text-yellow-500 animate-spin" />
                <p className="text-sm text-zinc-500 font-medium animate-pulse">Loading profile...</p>
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
        <div className="w-full space-y-6">
            {userProfile && userProfile.isOnBoarded === false && (
                <ServantOnboardingModal onComplete={(updatedUser) => setUserProfile(updatedUser)} />
            )}

            {pendingBookings.length > 0 && (
                <div className="w-full space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                        <h2 className="text-sm font-extrabold tracking-wider uppercase text-zinc-900">
                            Incoming Shift Requests ({pendingBookings.length})
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingBookings.map((booking) => (
                            <div 
                                key={booking._id} 
                                className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-5 rounded-2xl shadow-lg border border-yellow-500/30 flex flex-col justify-between gap-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none"></div>

                                <div className="flex items-start justify-between gap-3 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-black text-base">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white capitalize leading-snug">
                                                {booking.client?.fullname || booking.client?.name || "Client"}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                                <Clock size={13} className="text-yellow-400" />
                                                <span>{booking.durationHours} Hour Shift Request</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-md border border-yellow-500/30">
                                        Immediate
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 pt-2 border-t border-white/10 relative z-10">
                                    <button
                                        onClick={() => handleBookingResponse(booking._id, "reject")}
                                        disabled={processingBookingId === booking._id}
                                        className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                                    >
                                        <X size={15} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleBookingResponse(booking._id, "accept")}
                                        disabled={processingBookingId === booking._id}
                                        className="flex-1 py-2.5 px-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-yellow-500/20 active:scale-95 disabled:opacity-50"
                                    >
                                        {processingBookingId === booking._id ? (
                                            <Loader2 size={15} className="animate-spin" />
                                        ) : (
                                            <Check size={15} />
                                        )}
                                        Accept Shift
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-5">
                <div className="w-full lg:w-[30%] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md">
                    <div className="h-20 bg-zinc-900 relative">
                        <div className="absolute -bottom-8 left-6">
                            <div className="w-20 h-20 rounded-xl border-4 border-white overflow-hidden bg-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2 group-hover:shadow-yellow-500/20">
                                <img 
                                    src={userProfile.image || "https://via.placeholder.com/150"} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${userProfile.fullname || 'Worker'}&background=EAB308&color=fff`;
                                    }}
                                />
                            </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-500 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide flex items-center gap-1 backdrop-blur-sm border border-yellow-500/20">
                            <BadgeCheck size={12} /> VERIFIED
                        </div>
                    </div>
                    
                    <div className="pt-10 pb-5 px-5 flex-1 flex flex-col">
                        <h2 className="text-lg font-extrabold text-zinc-900 capitalize leading-tight">{userProfile.fullname}</h2>
                        
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

                        <div className="w-full mt-auto pt-5">
                            <button 
                                onClick={() => setIsSubModalOpen(true)}
                                className="w-full group/btn flex items-center justify-between bg-gradient-to-r from-zinc-900 to-zinc-800 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-zinc-800 hover:to-zinc-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                                <span className="flex items-center gap-2 text-sm">
                                    <Crown size={16} className="text-yellow-400 transition-transform group-hover/btn:-rotate-12 group-hover/btn:scale-110" />
                                    Boost Profile
                                </span>
                                <ArrowRight size={14} className="text-gray-400 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[70%] bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6 md:p-8 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-yellow-500 rounded-full blur-[80px]"></div>
                        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-orange-600 rounded-full blur-[80px]"></div>
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="mb-6">
                            <div className="flex items-center gap-2.5 mb-3 opacity-90">
                                <HeartHandshake size={20} className="text-yellow-500" />
                                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Worker Portal</span>
                            </div>
                            
                            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                                Welcome back, <span className="text-yellow-500 capitalize">{userProfile.fullname?.split(' ')[0] || 'User'}</span>.
                            </h1>
                            <p className="text-sm text-gray-400 font-medium max-w-md">
                                Ready for your next shift? Find new clients, manage your schedule, and track your earnings.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-yellow-500/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(234,179,8,0.1)] cursor-pointer group">
                                <Briefcase size={20} className="text-yellow-400 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-300" />
                                <h3 className="text-white font-bold text-sm">Find Shifts</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">Browse available jobs</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-orange-500/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)] cursor-pointer group">
                                <Calendar size={20} className="text-orange-400 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-300" />
                                <h3 className="text-white font-bold text-sm">My Schedule</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">View upcoming work</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-green-500/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(34,197,94,0.1)] cursor-pointer group">
                                <Wallet size={20} className="text-green-400 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-green-300" />
                                <h3 className="text-white font-bold text-sm">Earnings</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">Track your income</p>
                            </div>
                        </div>

                        <div className="flex">
                            <button className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold px-6 py-2.5 text-sm rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                                Find Work <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ServantSearch />
            <ServantPost />
            <ServantRequests />
            <ServantSupport />

            {isSubModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity duration-300" 
                        onClick={() => setIsSubModalOpen(false)}
                    ></div>
                    
                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                        
                        <button 
                            onClick={() => setIsSubModalOpen(false)} 
                            className="absolute top-3 right-3 text-gray-400 hover:text-zinc-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors z-10"
                        >
                            <X size={18} />
                        </button>
                        
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner relative">
                                <Sparkles size={24} className="animate-pulse" />
                            </div>
                            
                            <h3 className="text-xl font-black text-zinc-900 mb-1.5">Pro Worker Upgrade</h3>
                            <p className="text-xs text-gray-500 mb-5 font-medium px-4">
                                Stand out to clients, get priority job notifications, and unlock direct client messaging.
                            </p>

                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200/50 rounded-xl p-3 mb-5 relative overflow-hidden group cursor-pointer transition-all hover:border-yellow-300 hover:shadow-md">
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-yellow-500/10 rounded-full blur-xl transition-all group-hover:bg-yellow-500/20"></div>
                                <p className="text-[10px] font-bold text-yellow-700/80 uppercase tracking-widest mb-0.5">Welcome Bonus</p>
                                <p className="text-2xl font-black text-yellow-600 group-hover:scale-105 transition-transform duration-300">50% OFF</p>
                            </div>

                            <ul className="text-left space-y-2.5 mb-6 px-2">
                                <li className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                                    <CheckCircle2 size={14} className="text-yellow-500 shrink-0" /> Priority Search Listing
                                </li>
                                <li className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                                    <CheckCircle2 size={14} className="text-yellow-500 shrink-0" /> See Client Reviews
                                </li>
                                <li className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                                    <CheckCircle2 size={14} className="text-yellow-500 shrink-0" /> "Pro Worker" Profile Badge
                                </li>
                            </ul>

                            <button className="w-full bg-zinc-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-zinc-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 group flex justify-center items-center gap-2">
                                Boost My Profile <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}