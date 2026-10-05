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
  Github,
  Linkedin,
} from "lucide-react";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.678l4.259 5.63 5.057-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/Rohan-2601/WebLoot",
    Icon: Github,
  },
  { label: "X", href: "https://x.com/rjha72", Icon: XLogo },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rohan-raj-5b5198294/",
    Icon: Linkedin,
  },
];
import { ResultsGrid } from "./ResultsGrid";

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

interface AnalyzeData {
  images: string[];
  icons: string[];
  videos: string[];
  totalAssets: number;
  assets?: Asset[];
}

export function Analyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deepScan, setDeepScan] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<AnalyzeData | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "image" | "video" | "icon" | "other">("all");

  const analyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");
    setData(null);
    setStatus("Initializing scan...");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      // Simulate progress for Deep Scan
      let progressTimer: any;
      if (deepScan) {
        const steps = [
          "Opening page...",
          "Rendering page...",
          "Scanning DOM...",
          "Scanning network resources...",
          "Processing assets...",
          "Removing duplicates..."
        ];
        let step = 0;
        progressTimer = setInterval(() => {
          setStatus(steps[step]);
          step = Math.min(step + 1, steps.length - 1);
        }, 3000);
      } else {
        setStatus("Extracting HTML resources...");
      }

      const response = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, deepScan }),
      });
      
      if (progressTimer) clearInterval(progressTimer);
      setStatus("Done");

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze URL");
      }
      
      setData(result);
      setActiveTab("all");
    } catch (err: any) {
      setError(err.message);
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const assets = data?.assets || [];
  
  // Backwards compatibility for older API responses
  const normalizedAssets: Asset[] = assets.length > 0 ? assets : [
    ...(data?.images || []).map(u => ({ url: u, type: 'image', source: 'legacy' })),
    ...(data?.icons || []).map(u => ({ url: u, type: 'icon', source: 'legacy' })),
    ...(data?.videos || []).map(u => ({ url: u, type: 'video', source: 'legacy' })),
  ];

  const activeAssets = activeTab === "all" 
    ? normalizedAssets 
    : normalizedAssets.filter(a => a.type === activeTab || (activeTab === "other" && !["image", "video", "icon"].includes(a.type)));

  const tabs = [
    {
      id: "all" as const,
      icon: Shapes,
      label: "All",
      count: normalizedAssets.length,
    },
    {
      id: "image" as const,
      icon: ImageIcon,
      label: "Images",
      count: normalizedAssets.filter(a => a.type === "image").length,
    },
    {
      id: "video" as const,
      icon: Video,
      label: "Videos",
      count: normalizedAssets.filter(a => a.type === "video").length,
    },
    {
      id: "icon" as const,
      icon: Shapes,
      label: "Icons",
      count: normalizedAssets.filter(a => a.type === "icon").length,
    },
    {
      id: "other" as const,
      icon: Link2,
      label: "Other",
      count: normalizedAssets.filter(a => !["image", "video", "icon"].includes(a.type)).length,
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* ── Search Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mb-10 sm:mb-16 flex flex-col items-stretch gap-3"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <form onSubmit={analyzeUrl} className="relative group">
              <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-orange-500/40 to-amber-400/40 opacity-0 group-focus-within:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

              <div className="relative flex items-center gap-3 bg-zinc-900 border border-zinc-800 focus-within:border-orange-500/50 rounded-2xl transition-colors duration-300 shadow-2xl shadow-black/60 overflow-hidden">
                <div className="pl-5 text-zinc-600 group-focus-within:text-orange-400 transition-colors duration-300 shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  required
                  placeholder="Paste a URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-sm sm:text-base placeholder:text-zinc-600 py-4 sm:py-5"
                />
                <div className="p-2 shrink-0">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 bg-orange-500 disabled:opacity-40 disabled:pointer-events-none text-white px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-orange-950/60 cursor-pointer whitespace-nowrap`}
                    whileHover={{ scale: 1.04, backgroundColor: "#fb8c00" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {loading ? "Looting..." : "Extract"}
                  </motion.button>
                </div>
              </div>
            </form>
            
            <div className="flex items-center justify-between mt-3 px-1">
              {/* Scan Mode Toggles */}
              <div className="flex gap-2 bg-zinc-900/60 p-1 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setDeepScan(false)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    !deepScan ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Fast HTML-based extraction"
                >
                  Quick Scan
                </button>
                <button
                  type="button"
                  onClick={() => setDeepScan(true)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    deepScan ? 'bg-orange-500 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Loads the page in a real browser to discover dynamically loaded assets"
                >
                  Deep Scan
                </button>
              </div>

              {/* Status Text */}
              {loading && (
                <div className="text-orange-400/80 text-xs font-mono animate-pulse">
                  {status}
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0 self-start mt-5">
            {socialLinks.map(({ label, href, Icon }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-orange-400 transition-colors duration-200"
                whileHover={{ scale: 1.25, y: -3 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className="w-4.5 h-4.5" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, x: 0 }}
            animate={{ opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3 bg-red-950/50 text-red-300 px-5 py-3.5 rounded-xl border border-red-500/20 mb-12 text-sm max-w-xl"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
              {tabs.map(({ id, icon: Icon, label, count }) => {
                const isActive = activeTab === id;
                return (
                  <motion.button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden
                      ${
                        isActive
                          ? "bg-orange-500/10 border-orange-500/40 shadow-xl shadow-orange-950/40 text-white"
                          : "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="tabGlow"
                        className="absolute inset-0 bg-linear-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none"
                      />
                    )}
                    <Icon className={`w-4 h-4 ${isActive ? "text-orange-400" : ""}`} />
                    <span className="font-semibold text-sm">{label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-orange-500/20 text-orange-300" : "bg-zinc-800 text-zinc-400"}`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Asset grid */}
            <ResultsGrid activeAssets={activeAssets} activeTab={activeTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
