import React from "react";
import DashboardHeader from "@/src/components/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <DashboardHeader />
            
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}