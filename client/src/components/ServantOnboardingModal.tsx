"use client";

import React, { useState } from "react";
import axios from "axios";
import { Loader2, AlertCircle, MapPin, Wrench, Clock, User, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const AHMEDABAD_ZONES: Record<string, string[]> = {
    "SG Highway": ["Thaltej", "Bodakdev", "Vastrapur", "Makarba"],
    "CG Road": ["Navrangpura", "Ellisbridge", "Law Garden"],
    "Ashram Road": ["Paldi", "Usmanpura", "Income Tax"],
    "Ring Road": ["Bopal", "Science City", "Nikol"],
    "Relief Road": ["Kalupur", "Lal Darwaja", "Bhadra"]
};

const AVAILABLE_SKILLS = ["Cooking", "House Cleaning", "Plumber", "Car Washer", "Electrician", "Nanny"];

interface Props {
    onComplete: (updatedUser: any) => void;
}

export default function ServantOnboardingModal({ onComplete }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        mainRoad: "",
        subRoad: "",
        skills: [] as string[],
        maxHours: 1,
        gender: "",
        birthYear: ""
    });

    const handleSkillToggle = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.mainRoad || !formData.subRoad || formData.skills.length === 0 || !formData.gender || !formData.birthYear) {
            return toast.error("Please fill in all mandatory fields.");
        }

        setIsLoading(true);
        try {
            // THE LIVE DATABASE CONNECTION
            const response = await axios.post("http://localhost:8000/api/auth/onboard-servant", formData, {
                withCredentials: true
            });
            
            setIsSuccess(true);
            toast.success("Profile setup complete!");
            
            // Wait 1.2 seconds for the success animation, then auto-close the modal
            // We pass the fresh user data from the backend straight into the dashboard state
            setTimeout(() => {
                onComplete(response.data.user); 
            }, 1200);

        } catch (error) {
            console.error(error);
            toast.error("Failed to save details. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300" 
            style={{ zIndex: 999999 }}
        >
            <div className={`w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 transition-all duration-500 ${isSuccess ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
                
                <div className="bg-slate-900 p-6 text-white relative shrink-0">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/15 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-500/10 text-yellow-500 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-yellow-500/20">
                                Setup Required
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Complete Your Profile</h2>
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-yellow-500" /> Mandatory Ahmedabad Pilot fields
                        </p>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar max-h-[60vh]">
                    <form id="onboarding-form" onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-100 pb-2 uppercase tracking-wide">
                                <MapPin size={16} className="text-slate-400" /> Work Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <select 
                                    className="w-full bg-slate-50 border border-gray-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all cursor-pointer"
                                    value={formData.mainRoad}
                                    onChange={(e) => setFormData({...formData, mainRoad: e.target.value, subRoad: ""})}
                                >
                                    <option value="">Select Main Road...</option>
                                    {Object.keys(AHMEDABAD_ZONES).map(zone => (
                                        <option key={zone} value={zone}>{zone}</option>
                                    ))}
                                </select>

                                <select 
                                    className="w-full bg-slate-50 border border-gray-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    value={formData.subRoad}
                                    onChange={(e) => setFormData({...formData, subRoad: e.target.value})}
                                    disabled={!formData.mainRoad}
                                >
                                    <option value="">Select Sub Road...</option>
                                    {formData.mainRoad && AHMEDABAD_ZONES[formData.mainRoad].map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-100 pb-2 uppercase tracking-wide">
                                <Wrench size={16} className="text-slate-400" /> Skills & Availability
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_SKILLS.map(skill => {
                                    const isSelected = formData.skills.includes(skill);
                                    return (
                                        <button
                                            type="button" key={skill}
                                            onClick={() => handleSkillToggle(skill)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all duration-200 flex items-center gap-1.5 ${
                                                isSelected 
                                                ? "bg-yellow-50 border-yellow-500 text-yellow-700 shadow-sm" 
                                                : "bg-white border-gray-100 text-slate-500 hover:border-yellow-200 hover:bg-slate-50"
                                            }`}
                                        >
                                            {skill}
                                            {isSelected && <CheckCircle2 size={14} className="text-yellow-600" />}
                                        </button>
                                    )
                                })}
                            </div>
                            
                            <div className="pt-1">
                                <label className="text-xs text-slate-500 font-bold mb-2 flex items-center gap-1.5">
                                    <Clock size={14} /> Max consecutive working hours
                                </label>
                                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-gray-200 w-full md:w-3/4">
                                    {[1, 2, 3].map(hrs => (
                                        <button
                                            type="button" key={hrs}
                                            onClick={() => setFormData({...formData, maxHours: hrs})}
                                            className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-xs ${
                                                formData.maxHours === hrs 
                                                ? "bg-white shadow-sm text-slate-900 border border-gray-200" 
                                                : "text-slate-500 hover:text-slate-700 border border-transparent"
                                            }`}
                                        >
                                            {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-gray-100 pb-2 uppercase tracking-wide">
                                <User size={16} className="text-slate-400" /> Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <select 
                                    className="w-full bg-slate-50 border border-gray-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all cursor-pointer"
                                    value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="number" min="1950" max="2008" placeholder="Birth Year (e.g. 1995)"
                                        className="w-full bg-slate-50 border border-gray-200 text-slate-700 text-sm font-medium rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all placeholder:text-gray-400"
                                        value={formData.birthYear} onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0">
                    <button 
                        type="submit" form="onboarding-form" disabled={isLoading || isSuccess}
                        className={`w-full font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 ${
                            isSuccess 
                            ? "bg-yellow-100 text-yellow-800 shadow-none border border-yellow-200" 
                            : "bg-yellow-500 hover:bg-yellow-400 text-slate-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                        }`}
                    >
                        {isLoading && !isSuccess ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : isSuccess ? (
                            <>
                                <CheckCircle2 size={18} /> Profile Saved Successfully!
                            </>
                        ) : (
                            <>
                                Save Profile & Enter Dashboard <ChevronRight size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}