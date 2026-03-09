"use client";

import { motion } from "framer-motion";
import { Download, Shapes } from "lucide-react";

interface ResultsGridProps {
  activeAssets: string[];
  activeTab: "images" | "icons" | "videos";
}

export function ResultsGrid({ activeAssets, activeTab }: ResultsGridProps) {
  const handleDownload = (assetUrl: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    // Map activeTab to the proper backend endpoint
    let endpoint = "/download";
    if (activeTab === "images") endpoint = "/download/image";
    if (activeTab === "icons") endpoint = "/download/icon";
    if (activeTab === "videos") endpoint = "/download/video";

    window.open(`${apiUrl}${endpoint}?url=${encodeURIComponent(assetUrl)}`, "_blank");
  };

  if (activeAssets.length === 0) {
    return (
      <div className="text-center py-24 text-zinc-500">
        <Shapes className="w-16 h-16 mx-auto text-zinc-800 mb-4" />
        <p className="text-xl">No {activeTab} found on this page.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      {activeAssets.map((assetUrl, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: Math.min(idx * 0.05, 0.5) }}
          className="group relative aspect-square bg-white/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/60 hover:border-purple-400/50 hover:shadow-xl transition-all duration-300 shadow-sm"
        >
          {activeTab === "videos" ? (
            <video 
              src={assetUrl} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              muted loop playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          ) : (
            <img 
              src={assetUrl} 
              alt={`Asset ${idx}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("/file.svg")) {
                  target.src = "/file.svg"; // Fallback if image fails to load
                }
              }}
            />
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
            <button 
              onClick={() => handleDownload(assetUrl)}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg transform active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
