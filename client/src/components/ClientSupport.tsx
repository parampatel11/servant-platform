"use client";

import React from "react";
import { HelpCircle, Mail } from "lucide-react";

export default function ClientSupport() {
    return (
        <div id="support" className="w-full mt-10 pt-10 border-t border-gray-200 pb-20">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2.5 rounded-xl">
                    <HelpCircle size={24} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Help & Support</h2>
                    <p className="text-sm text-gray-500 font-medium">Need assistance? We are here to help.</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Have an issue with a booking?</h3>
                    <p className="text-gray-400 text-sm max-w-md">Our support team is available 24/7 to resolve disputes, handle premium subscriptions, and answer questions.</p>
                </div>
                <button className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-slate-900 font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 w-full md:w-auto justify-center">
                    <Mail size={18} /> Contact Admin
                </button>
            </div>
        </div>
    );
}