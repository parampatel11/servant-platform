"use client";

import React from "react";
import { Bell, Clock } from "lucide-react";

export default function ServantRequests() {
    return (
        <div id="requests" className="w-full mt-10 pt-10 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-2.5 rounded-xl">
                    <Bell size={24} className="text-orange-600" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Job Invitations</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage direct hiring requests from clients.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
                <Clock size={40} className="text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-zinc-700">No pending invitations</h3>
                <p className="text-sm text-gray-400">When a client requests your service directly, it will appear here.</p>
            </div>
        </div>
    );
}