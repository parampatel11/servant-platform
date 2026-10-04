"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HeartHandshake, Home, MapPin, Users, Star, HelpCircle, LogOut, Menu, X } from "lucide-react";

export default function DashboardHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role");
        router.push("/login");
    };

    const navLinks = [
        { name: "Home", href: `/dashboard/${role}`, icon: Home },
        { name: "Location", href: `/dashboard/${role}/location`, icon: MapPin },
        { name: role === "servant" ? "Find Client" : "Find Worker", href: `/dashboard/${role}/search`, icon: Users },
        { name: "Reviews", href: `/dashboard/${role}/reviews`, icon: Star },
        { name: "Support", href: `/dashboard/${role}/support`, icon: HelpCircle },
    ];

    // Dynamic Color Configurations
    const isWorker = role === "servant";
    const headerTheme = isWorker 
        ? "bg-zinc-900/95 border-yellow-500/20" 
        : "bg-slate-900/95 border-green-500/20"; 
        
    const brandAccent = isWorker ? "text-yellow-500" : "text-green-500";
    const activeLinkBg = isWorker ? "bg-zinc-800 ring-yellow-500/30" : "bg-slate-800 ring-green-500/30";
    const activeIconColor = isWorker ? "text-yellow-400" : "text-green-400";
    const hoverBg = isWorker ? "hover:bg-zinc-800/60 hover:shadow-yellow-900/20" : "hover:bg-slate-800/60 hover:shadow-green-900/20";
    const mobileMenuBg = isWorker ? "bg-zinc-900" : "bg-slate-900";

    return (
        <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b shadow-sm transition-colors duration-500 ${headerTheme}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Left side: Logo & Brand */}
                    <div 
                        className="group flex-shrink-0 flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
                        onClick={() => router.push(`/dashboard/${role}`)}
                    >
                        <div className="bg-white p-1.5 rounded-md text-slate-900 transition-transform duration-300 group-hover:-rotate-6 group-hover:shadow-md">
                            <HeartHandshake size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight transition-all duration-300 group-hover:drop-shadow-md">
                            Shift<span className={`${brandAccent} transition-colors duration-300`}>Serve</span>
                        </span>
                    </div>

                    {/* Right side: Desktop Navigation (Hidden on Mobile) */}
                    <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    className={`group flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 active:scale-95 ${
                                        isActive 
                                        ? `${activeLinkBg} text-white shadow-md ring-1` 
                                        : `text-gray-300 ${hoverBg} hover:text-white hover:-translate-y-0.5 hover:shadow-lg`
                                    }`}
                                >
                                    <Icon 
                                        size={16} 
                                        className={`transition-all duration-300 group-hover:scale-110 ${
                                            isActive ? activeIconColor : "text-gray-400 group-hover:text-gray-200"
                                        }`} 
                                    />
                                    {link.name}
                                </Link>
                            );
                        })}

                        {/* Divider */}
                        <div className="h-5 w-px bg-gray-700 mx-3 rounded-full"></div>

                        {/* Logout Button */}
                        <button 
                            onClick={handleLogout}
                            className="group flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-orange-400 transition-all duration-300 hover:bg-orange-500/15 hover:text-orange-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(249,115,22,0.15)] active:scale-95"
                        >
                            <LogOut size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                            Logout
                        </button>
                    </nav>

                    {/* Mobile Menu Toggle Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className={`md:hidden border-t border-gray-800 ${mobileMenuBg} shadow-xl`}>
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-all ${
                                        isActive 
                                        ? `${activeLinkBg} text-white` 
                                        : `text-gray-300 active:bg-gray-800 ${hoverBg} hover:text-white`
                                    }`}
                                >
                                    <Icon 
                                        size={18} 
                                        className={isActive ? activeIconColor : "text-gray-400"} 
                                    />
                                    {link.name}
                                </Link>
                            );
                        })}
                        
                        <div className="h-px w-full bg-gray-800 my-2"></div>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex items-center w-full gap-3 px-4 py-3 rounded-md text-base font-medium text-orange-400 hover:bg-orange-500/10 active:bg-orange-500/20 transition-all"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}