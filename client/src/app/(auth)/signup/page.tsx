"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, HeartHandshake, Home, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import ImageUpload from "@/src/components/ImageUpload";

export default function SignupPage() {
    const router = useRouter();
    const [role, setRole] = useState<"client" | "servant">("client");
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Updated state keys to match schema
    const [formData, setFormData] = useState({
        fullname: "",
        mobile: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullname || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Creating your account...");

        try {
            const submitData = new FormData();
            submitData.append("role", role);
            
            // 2. Updated append keys to match schema
            submitData.append("fullname", formData.fullname);
            submitData.append("mobile", formData.mobile);
            submitData.append("email", formData.email);
            submitData.append("password", formData.password);
            
            if (profilePic) {
                // Assuming your multer middleware looks for 'image' based on the schema
                submitData.append("image", profilePic); 
            }

            const response = await axios.post("http://localhost:8000/api/auth/signup", submitData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(response.data.message || "Account created successfully!", { id: toastId });
            router.push("/login");
            
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || err.message || "Registration failed.", 
                { id: toastId }
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row border border-gray-200 overflow-hidden h-auto md:max-h-[85vh]">

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
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4 md:mb-6">
                            Connect with <br className="hidden sm:block"/>
                            <span className="text-green-400">trusted help.</span>
                        </h2>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="text-orange-400" size={18} />
                                <span className="text-sm font-medium">Verified Households</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="text-yellow-400" size={18} />
                                <span className="text-sm font-medium">Empowered Workers</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="text-blue-400" size={18} />
                                <span className="text-sm font-medium">Secure Connections</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-7/12 p-6 md:p-8 bg-white flex flex-col overflow-y-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900">Create Account</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 p-1 bg-gray-100 rounded-lg mb-2">
                            <button type="button" onClick={() => setRole("client")} className={`flex-1 py-2.5 sm:py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${role === "client" ? "bg-green-600 text-white shadow-sm scale-[1.02]" : "text-gray-500 hover:text-slate-900"}`}>
                                <Home size={16} /> Client
                            </button>
                            <button type="button" onClick={() => setRole("servant")} className={`flex-1 py-2.5 sm:py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${role === "servant" ? "bg-yellow-500 text-white shadow-sm scale-[1.02]" : "text-gray-500 hover:text-slate-900"}`}>
                                <Briefcase size={16} /> Worker
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500">
                                    <User size={16} />
                                </div>
                                {/* 3. Updated name attribute to "fullname" */}
                                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Full Name *" className="w-full bg-slate-50 border border-gray-300 text-slate-900 text-sm rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500">
                                    <Phone size={16} />
                                </div>
                                {/* 4. Updated name attribute to "mobile" */}
                                <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full bg-slate-50 border border-gray-300 text-slate-900 text-sm rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-colors" />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500">
                                    <Mail size={16} />
                                </div>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="w-full bg-slate-50 border border-gray-300 text-slate-900 text-sm rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500">
                                    <Lock size={16} />
                                </div>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" className="w-full bg-slate-50 border border-gray-300 text-slate-900 text-sm rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-colors" />
                            </div>
                        </div>

                        <ImageUpload onImageSelect={(file) => setProfilePic(file)} />

                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white text-sm font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-all mt-4 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                        Already have an account? <Link href="/login" className="text-orange-600 hover:text-orange-700 hover:underline font-bold transition-colors">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}