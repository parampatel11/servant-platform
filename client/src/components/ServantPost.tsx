"use client";

import React from "react";
import { PlusCircle, Send } from "lucide-react";

export default function ServantPost() {
    return (
        <div id="post" className="w-full mt-10 pt-10 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-100 p-2.5 rounded-xl">
                    <PlusCircle size={24} className="text-yellow-600" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Post Your Availability</h2>
                    <p className="text-sm text-gray-500 font-medium">Let clients know you are ready to work today.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-yellow-500"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-700">Service Offered</label>
                        <input type="text" placeholder="e.g. Expert Plumbing Services" className="w-full bg-zinc-50 border border-gray-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-700">Your Rate</label>
                        <input type="text" placeholder="e.g. ₹400/hr" className="w-full bg-zinc-50 border border-gray-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-zinc-700">Details & Availability</label>
                        <textarea rows={4} placeholder="Describe your skills and available timings..." className="w-full bg-zinc-50 border border-gray-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"></textarea>
                    </div>
                </div>
                <button className="mt-6 flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95">
                    <Send size={18} /> Publish Availability
                </button>
            </div>
        </div>
    );
}