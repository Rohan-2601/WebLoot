"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Image as ImageIcon,
  Video,
  Shapes,
  Loader2,
  Link2,
  AlertCircle,
} from "lucide-react";
import { ResultsGrid } from "./ResultsGrid";

interface AnalyzeData {
  images: string[];
  icons: string[];
  videos: string[];
  totalAssets: number;
}

export function Analyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<AnalyzeData | null>(null);

  const [activeTab, setActiveTab] = useState<"images" | "icons" | "videos">(
    "images",
  );

  const analyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze URL");
      }

      setData(result);
      if (result.images.length === 0 && result.icons.length > 0)
        setActiveTab("icons");
      else if (result.images.length === 0 && result.videos.length > 0)
        setActiveTab("videos");
      else setActiveTab("images");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeAssets = data ? data[activeTab] : [];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* Search Bar */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={analyzeUrl}
        className="w-full max-w-3xl relative group mb-12"
      >
        {/* Orange glow behind search */}
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/40 to-amber-500/40 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
        <div className="relative flex items-center bg-white/5 backdrop-blur-2xl rounded-full border border-orange-400/20 focus-within:border-orange-400/50 transition-colors p-2 shadow-lg shadow-orange-900/20 focus-within:shadow-orange-500/30">
          <div className="pl-4 pr-2 text-orange-300/70 group-focus-within:text-orange-200 transition-colors">
            <Link2 className="w-6 h-6 group-focus-within:rotate-12 transition-transform duration-300" />
          </div>
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-orange-300/40 px-2 py-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-900/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 px-8 py-4 rounded-full font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:hover:bg-orange-500 disabled:hover:translate-y-0 disabled:active:scale-100 disabled:cursor-not-allowed group/btn"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            )}
            {loading ? "Looting..." : "Extract"}
          </button>
        </div>
      </motion.form>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 bg-orange-950/40 text-orange-300 px-6 py-4 rounded-2xl border border-orange-500/30 mb-8 backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* Stats & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-orange-400/20">
              <div className="flex bg-white/5 backdrop-blur-xl rounded-full p-1 border border-orange-400/20 shadow-inner shadow-orange-900/10">
                {[
                  { id: "images", icon: ImageIcon, count: data.images.length },
                  { id: "icons", icon: Shapes, count: data.icons.length },
                  { id: "videos", icon: Video, count: data.videos.length },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 cursor-pointer z-10 hover:bg-white/10 active:scale-95 ${
                        isActive
                          ? "text-white"
                          : "text-orange-200/60 hover:text-orange-100"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-orange-500/70 shadow-md shadow-orange-900/40 rounded-full border border-orange-400/40 -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                        />
                      )}
                      <Icon
                        className={`w-4 h-4 transition-transform ${isActive ? "scale-110 text-orange-100" : ""}`}
                      />
                      <span className="capitalize">{tab.id}</span>
                      <span
                        className={`text-xs py-0.5 px-2 rounded-full font-bold shadow-sm ${isActive ? "bg-orange-200/20 text-orange-100" : "bg-white/10 text-orange-300/60 border border-orange-300/20"}`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-orange-200/80 font-bold bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full border border-orange-400/20 shadow-sm">
                Total Assets{" "}
                <span className="text-orange-300 font-black text-lg ml-2">
                  {data.totalAssets}
                </span>
              </div>
            </div>

            <ResultsGrid activeAssets={activeAssets} activeTab={activeTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
