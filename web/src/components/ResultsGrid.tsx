"use client";

import { motion } from "framer-motion";
import { ArrowDownToLine, Maximize2, Shapes } from "lucide-react";

interface ResultsGridProps {
  activeAssets: string[];
  activeTab: "images" | "icons" | "videos";
}

export function ResultsGrid({ activeAssets, activeTab }: ResultsGridProps) {
  const handleDownload = (assetUrl: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    let endpoint = "/download";
    if (activeTab === "images") endpoint = "/download/image";
    if (activeTab === "icons") endpoint = "/download/icon";
    if (activeTab === "videos") endpoint = "/download/video";
    window.open(
      `${apiUrl}${endpoint}?url=${encodeURIComponent(assetUrl)}`,
      "_blank",
    );
  };

  const getLabel = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url.split("/").pop() || "";
    }
  };

  if (activeAssets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-36 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <Shapes className="w-6 h-6 text-zinc-700" />
        </div>
        <div className="text-center">
          <p className="text-zinc-400 text-sm font-medium capitalize">
            No {activeTab} found
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            This page doesn't seem to have any {activeTab}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5"
    >
      {activeAssets.map((assetUrl, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: Math.min(idx * 0.035, 0.35),
            duration: 0.28,
            ease: "easeOut",
          }}
          className="group relative aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/80 hover:border-orange-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-orange-950/40 cursor-default"
        >
          {/* Media */}
          {activeTab === "videos" ? (
            <video
              src={assetUrl}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-500"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          ) : (
            <img
              src={assetUrl}
              alt=""
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-500 ease-out"
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.src.includes("/file.svg")) t.src = "/file.svg";
              }}
            />
          )}

          {/* Scrim — fades in on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action bar — slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-2.5 py-2 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <span className="text-[9px] font-medium text-white/40 truncate max-w-[50%] leading-none select-none">
              {getLabel(assetUrl)}
            </span>
            <div className="flex items-center gap-1">
              <a
                href={assetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Open original"
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 border border-white/8 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Maximize2 className="w-2.5 h-2.5" />
              </a>
              <button
                onClick={() => handleDownload(assetUrl)}
                title="Download"
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-400 border border-orange-400/20 text-white hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-orange-950/60"
              >
                <ArrowDownToLine className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
