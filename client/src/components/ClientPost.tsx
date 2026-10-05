"use client";

import React from "react";
import { PlusCircle, Send } from "lucide-react";

export default function ClientPost() {
    return (
        <div id="post" className="w-full mt-10 pt-10 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2.5 rounded-xl">
                    <PlusCircle size={24} className="text-green-600" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Post a Requirement</h2>
                    <p className="text-sm text-gray-500 font-medium">Broadcast your job to available workers in your area.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Job Title</label>
                        <input type="text" placeholder="e.g. Need a Chef for weekend" className="w-full bg-slate-50 border border-gray-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Hourly Rate Budget</label>
                        <input type="text" placeholder="e.g. ₹300/hr" className="w-full bg-slate-50 border border-gray-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Job Description</label>
                        <textarea rows={4} placeholder="Describe what you need help with..." className="w-full bg-slate-50 border border-gray-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"></textarea>
                    </div>
                </div>
                <button className="mt-6 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95">
                    <Send size={18} /> Post Job Now
                </button>
            </div>
        </div>
    );
}