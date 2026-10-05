"use client";

import { motion } from "framer-motion";
import { ArrowDownToLine, Maximize2, Shapes, Info, Link2 } from "lucide-react";
import { useState } from "react";

interface Asset {
  url: string;
  type: string;
  source: string;
  format?: string;
  width?: number;
  height?: number;
  size?: number;
  contentType?: string;
}

interface ResultsGridProps {
  activeAssets: Asset[];
  activeTab: string;
}

export function ResultsGrid({ activeAssets, activeTab }: ResultsGridProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleDownload = (assetUrl: string, type: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    let endpoint = "/download";
    if (type === "image") endpoint = "/download/image";
    if (type === "icon") endpoint = "/download/icon";
    if (type === "video") endpoint = "/download/video";
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
      <div className="flex flex-col items-center justify-center py-20 sm:py-36 gap-5">
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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5"
      >
        {activeAssets.map((asset, idx) => (
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
            {asset.type === "video" ? (
              <video
                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/download/video?url=${encodeURIComponent(asset.url)}`}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-500"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            ) : asset.type === "image" || asset.type === "icon" ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/download/${asset.type === 'icon' ? 'icon' : 'image'}?url=${encodeURIComponent(asset.url)}`}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-500 ease-out"
                onError={(e) => {
                  const t = e.currentTarget;
                  if (!t.src.includes("/file.svg")) t.src = "/file.svg";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                <Link2 className="w-10 h-10 text-zinc-700" />
              </div>
            )}

            {/* Badges - Top left */}
            <div className="absolute top-2 left-2 flex gap-1 z-10">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white/80 backdrop-blur-sm border border-white/10">
                {asset.source}
              </span>
              {(asset.width || asset.height) && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 text-orange-300 backdrop-blur-sm border border-orange-500/20">
                  {asset.width}x{asset.height}
                </span>
              )}
            </div>

            {/* Scrim — always visible on mobile, hover-reveal on desktop */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

            {/* Action bar — always visible on mobile, slides up on desktop hover */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-2.5 py-2 sm:translate-y-2 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-white/60 truncate max-w-[50%] leading-none select-none">
                  {getLabel(asset.url)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    title="View details"
                    className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-lg bg-zinc-800/60 hover:bg-zinc-700/80 border border-white/10 text-white/80 hover:text-white active:scale-95 transition-all cursor-pointer"
                  >
                    <Info className="w-3 h-3 sm:w-2.5 sm:h-2.5" />
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Open original"
                    className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 border border-white/10 text-white/80 hover:text-white active:scale-95 transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3 sm:w-2.5 sm:h-2.5" />
                  </a>
                  <button
                    onClick={() => handleDownload(asset.url, asset.type)}
                    title="Download"
                    className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-400 border border-orange-400/20 text-white active:scale-95 transition-all cursor-pointer shadow-md shadow-orange-950/60"
                  >
                    <ArrowDownToLine className="w-3 h-3 sm:w-2.5 sm:h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Details Panel Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAsset(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">Asset Details</h3>
              <button onClick={() => setSelectedAsset(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            
            {/* Preview */}
            <div className="bg-black/50 p-4 flex items-center justify-center h-48 border-b border-zinc-800">
              {selectedAsset.type === "video" ? (
                <video src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/download/video?url=${encodeURIComponent(selectedAsset.url)}`} className="max-w-full max-h-full rounded object-contain" controls />
              ) : selectedAsset.type === "image" || selectedAsset.type === "icon" ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/download/${selectedAsset.type === 'icon' ? 'icon' : 'image'}?url=${encodeURIComponent(selectedAsset.url)}`} className="max-w-full max-h-full rounded object-contain" />
              ) : (
                <Shapes className="w-12 h-12 text-zinc-700" />
              )}
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Type</div>
                  <div className="text-white capitalize">{selectedAsset.type}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Source</div>
                  <div className="text-white capitalize">{selectedAsset.source}</div>
                </div>
                {selectedAsset.format && (
                  <div>
                    <div className="text-zinc-500 text-xs mb-1">Format</div>
                    <div className="text-white">{selectedAsset.format}</div>
                  </div>
                )}
                {selectedAsset.width && selectedAsset.height && (
                  <div>
                    <div className="text-zinc-500 text-xs mb-1">Resolution</div>
                    <div className="text-white">{selectedAsset.width} x {selectedAsset.height}</div>
                  </div>
                )}
                {selectedAsset.contentType && (
                  <div className="col-span-2">
                    <div className="text-zinc-500 text-xs mb-1">Content Type</div>
                    <div className="text-white font-mono text-xs">{selectedAsset.contentType}</div>
                  </div>
                )}
                <div className="col-span-2">
                  <div className="text-zinc-500 text-xs mb-1">URL</div>
                  <div className="text-white font-mono text-[10px] break-all bg-black/40 p-2 rounded border border-zinc-800">
                    {selectedAsset.url}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-zinc-800 bg-black/20 flex gap-3">
              <button
                onClick={() => handleDownload(selectedAsset.url, selectedAsset.type)}
                className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowDownToLine className="w-4 h-4" /> Download Asset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
