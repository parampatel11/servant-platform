"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
    const [role, setRole] = useState<"client" | "servant">("client");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 p-4">
            <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
                <h2 className="text-3xl font-bold text-center mb-2">Create an Account</h2>
                <p className="text-gray-400 text-center mb-8">Join ShiftServe today</p>

                <form className="space-y-5 flex flex-col">
                    {/* Role Selection */}
                    <div className="flex gap-4 p-1 bg-gray-800 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setRole("client")}
                            className={`flex-1 py-2 rounded-md transition-all ${
                                role === "client" ? "bg-green-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Client
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("servant")}
                            className={`flex-1 py-2 rounded-md transition-all ${
                                role === "servant" ? "bg-yellow-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Worker
                        </button>
                    </div>

                    {/* Basic Inputs */}
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" 
                    />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" 
                    />
                    <input 
                        type="text" 
                        placeholder="Mobile Number" 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" 
                    />

                    {/* Image Upload Placeholder */}
                    <div className="w-full bg-gray-800 border border-gray-700 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer hover:border-green-500 transition-colors">
                        <p className="text-gray-400 text-sm">Click to upload Profile Picture (Max 500KB)</p>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors mt-4"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}