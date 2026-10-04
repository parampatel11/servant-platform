"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, HeartHandshake, Home, Briefcase, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
    const [role, setRole] = useState<"client" | "servant">("client");

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row border border-gray-200 overflow-hidden h-auto md:min-h-[500px]">

                {/* Left Side: Compact Branding */}
                <div className="w-full md:w-5/12 bg-slate-900 p-6 md:p-8 flex flex-col justify-center relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6 md:mb-8">
                            <div className="bg-white p-1.5 rounded-lg text-slate-900">
                                <HeartHandshake size={24} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Shift<span className="text-blue-400">Serve</span></h1>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4">
                            Welcome <br className="hidden sm:block"/>
                            <span className="text-green-400">back.</span>
                        </h2>
                        
                        <div className="space-y-3 md:space-y-4 mt-6 md:mt-8">
                            <div className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="text-blue-400" size={18} />
                                <span className="text-sm font-medium">Fast Access</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="text-green-400" size={18} />
                                <span className="text-sm font-medium">Secure Login</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-7/12 p-6 md:p-10 bg-white flex flex-col justify-center">
                    <div className="mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900">Log In</h2>
                    </div>

                    <form className="space-y-4">
                        {/* Role Selection */}
                        <div className="flex flex-col sm:flex-row gap-3 p-1 bg-gray-100 rounded-lg mb-4">
                            <button
                                type="button"
                                onClick={() => setRole("client")}
                                className={`flex-1 py-2.5 sm:py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
                                    role === "client" ? "bg-green-600 text-white shadow-sm scale-[1.02]" : "text-gray-500 hover:text-slate-900"
                                }`}
                            >
                                <Home size={16} /> Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("servant")}
                                className={`flex-1 py-2.5 sm:py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
                                    role === "servant" ? "bg-yellow-500 text-white shadow-sm scale-[1.02]" : "text-gray-500 hover:text-slate-900"
                                }`}
                            >
                                <Briefcase size={16} /> Worker
                            </button>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500">
                                <Mail size={16} />
                            </div>
                            <input type="email" placeholder="Email Address" className="w-full bg-slate-50 border border-gray-300 text-slate-900 text-sm rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500">
                                <Lock size={16} />
                            </div>
                            <input type="password" placeholder="Password" className="w-full bg-slate-50 border border-gray-300 text-slate-900 text-sm rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-colors" />
                        </div>

                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">Forgot Password?</a>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white text-sm font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-2">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                        Don't have an account? <Link href="/signup" className="text-orange-600 hover:text-orange-700 hover:underline font-bold transition-colors">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}