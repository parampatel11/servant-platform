"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, CheckCircle2, MapPin, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface ActiveBooking {
    _id: string;
    status: string;
    travelStartTime?: string;
    workStartTime?: string;
    durationHours: number;
}

interface LiveTrackerProps {
    booking: ActiveBooking;
    onComplete: () => void;
}

export default function LiveTrackerModal({ booking, onComplete }: LiveTrackerProps) {
    const [timeLeft, setTimeLeft] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime();
            let targetTime = 0;

            if (booking.status === "on_the_way" && booking.travelStartTime) {
                targetTime = new Date(booking.travelStartTime).getTime() + (10 * 60 * 1000); 
            } else if (booking.status === "in_progress" && booking.workStartTime) {
                targetTime = new Date(booking.workStartTime).getTime() + (booking.durationHours * 60 * 60 * 1000); 
            }

            const difference = targetTime - now;

            if (difference <= 0) {
                setTimeLeft("00:00");
                handleTimeUp();
                return;
            }

            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            if (hours > 0) {
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        const timer = setInterval(calculateTime, 1000);
        calculateTime(); 

        return () => clearInterval(timer);
    }, [booking]);

    const handleTimeUp = async () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        try {
            if (booking.status === "on_the_way") {
                await axios.post(`http://localhost:8000/api/booking/${booking._id}/start-work`, {}, { withCredentials: true });
                toast.success("Arrived! Work timer started.");
                onComplete(); 
            } else if (booking.status === "in_progress") {
                await axios.post(`http://localhost:8000/api/booking/${booking._id}/complete-work`, {}, { withCredentials: true });
                toast.success("Shift completed! Great job.");
                onComplete();
            }
        } catch (error) {
            toast.error("Failed to update shift status");
            setIsTransitioning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"></div>
            
            <div className="relative w-full max-w-sm bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl shadow-2xl border border-yellow-500/20 p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
                
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10">
                    {booking.status === "on_the_way" ? (
                        <MapPin size={28} className="text-yellow-400 animate-bounce" />
                    ) : (
                        <Sparkles size={28} className="text-yellow-400 animate-pulse" />
                    )}
                </div>

                <h2 className="text-xl font-black text-white mb-2 tracking-tight relative z-10">
                    {booking.status === "on_the_way" ? "Traveling to Client" : "Shift in Progress"}
                </h2>
                
                <p className="text-sm text-zinc-400 font-medium mb-8 relative z-10">
                    {booking.status === "on_the_way" 
                        ? "Please head to the client's location." 
                        : `Executing ${booking.durationHours}-hour shift.`}
                </p>

                <div className="bg-zinc-950/50 border border-zinc-700/50 rounded-2xl p-6 mb-6 relative z-10">
                    <div className="flex items-center justify-center gap-3 text-yellow-500 mb-2">
                        <Clock size={20} />
                        <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">Time Remaining</span>
                    </div>
                    <div className="text-5xl font-black text-white tracking-wider tabular-nums font-mono">
                        {isTransitioning ? <Loader2 size={40} className="animate-spin mx-auto text-yellow-500" /> : timeLeft}
                    </div>
                </div>

                <button 
                    disabled
                    className="w-full py-4 rounded-xl bg-yellow-500/10 text-yellow-500 font-bold text-sm border border-yellow-500/20 flex items-center justify-center gap-2 relative z-10"
                >
                    <CheckCircle2 size={18} /> Auto-updates when timer ends
                </button>
            </div>
        </div>
    );
}