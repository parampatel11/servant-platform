"use client";

import React, { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
    onImageSelect: (file: File | null) => void;
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError(null);

        if (!file) return;

        // Calculate size in KB
        const sizeInKB = (file.size / 1024).toFixed(1);

        if (file.size > 500 * 1024) {
            setError(`File is too large (${sizeInKB} KB). Max 500KB.`);
            onImageSelect(null);
            setFileSize(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file");
            onImageSelect(null);
            setFileSize(null);
            return;
        }

        setFileSize(`${sizeInKB} KB`);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
            onImageSelect(file);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        setError(null);
        setFileSize(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full mt-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
            
            <div onClick={() => fileInputRef.current?.click()} className={`w-full border border-dashed rounded-lg p-4 flex flex-col sm:flex-row items-center justify-center gap-3 cursor-pointer transition-all group ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50"}`}>
                {previewUrl ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shrink-0 bg-white">
                        <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                        <button onClick={handleRemoveImage} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                ) : (
                    <div className={`p-2.5 rounded-full transition-colors ${error ? "bg-red-100 text-red-500" : "bg-gray-200 group-hover:bg-blue-100 group-hover:text-blue-600 text-gray-500"}`}>
                        <ImagePlus size={20} />
                    </div>
                )}
                
                <div className="text-center sm:text-left">
                    <p className={`text-sm font-bold transition-colors ${error ? "text-red-600" : "text-slate-700 group-hover:text-blue-700"}`}>
                        {previewUrl ? "Change Profile Picture" : "Upload Profile Picture"}
                    </p>
                    <p className={`text-xs mt-0.5 ${error ? "text-red-500 font-medium" : "text-gray-400"}`}>
                        {error ? error : fileSize ? `Current Size: ${fileSize}` : "SVG, PNG, JPG (Max 500KB)"}
                    </p>
                </div>
            </div>
        </div>
    );
}