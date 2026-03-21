"use client";
import { motion, type Variants } from "framer-motion";
import { Analyzer } from "@/components/Analyzer";

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const heroItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Home() {
  return (
    <div className="relative font-sans selection:bg-orange-500/30 text-white overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen bg-[url('/naruto.png')] bg-cover bg-center md:bg-fixed flex items-center">
        {/* Dark gradient overlay — heavier on left so text pops, fades right */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40 md:from-black/85 md:via-black/50 md:to-black/10 pointer-events-none" />
        {/* Bottom fade into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-b from-transparent to-black pointer-events-none" />

        {/* Orange glow bloom behind the text */}
        <div className="absolute top-[20%] left-[-8%] w-120 h-120 rounded-full bg-orange-500/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[5%] w-75 h-75 rounded-full bg-amber-400/15 blur-[90px] pointer-events-none" />

        {/* Left-aligned hero text */}
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-16 w-full">
          <motion.div
            className="w-full max-w-2xl"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            {/* Eyebrow */}
            <motion.p
              variants={heroItem}
              className="text-orange-300/80 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.25em] mb-4 sm:mb-5"
            >
              Web Asset Extractor
            </motion.p>

            {/* Title */}
            <motion.h1
              variants={heroItem}
              className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-none mb-5 sm:mb-6"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, #fed7aa 35%, #fb923c 65%, #c2410c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 50px rgba(251,146,60,0.45))",
              }}
            >
              WebLoot
            </motion.h1>

            {/* Divider */}
            <motion.div
              variants={heroItem}
              className="w-12 sm:w-16 h-1 rounded-full bg-orange-400 mb-4 sm:mb-6 opacity-80"
            />

            {/* Subtitle */}
            <motion.p
              variants={heroItem}
              className="text-base md:text-xl text-orange-50/75 font-medium leading-relaxed max-w-lg mb-8 sm:mb-10"
            >
              Paste any URL and instantly extract every image, icon, and video
              hidden deep inside the page source.
            </motion.p>

            {/* CTA */}
            <motion.a
              href="#extract"
              variants={heroItem}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-orange-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-900/40 hover:shadow-orange-600/50 cursor-pointer"
            >
              Start Extracting
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── EXTRACTOR SECTION ── */}
      <section
        id="extract"
        className="relative bg-black py-16 sm:py-28 px-4 sm:px-6 overflow-hidden"
      >
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-px bg-linear-to-r from-transparent via-orange-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-75 h-28 bg-orange-500/7 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-125 h-125 rounded-full bg-orange-600/4 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-amber-500/4 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-12 sm:mb-20">
            <p className="text-orange-500/50 text-[10px] font-mono uppercase tracking-[0.35em] mb-5">
              — Asset Extractor
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 sm:mb-5">
              Drop a URL.{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Get everything.
              </span>
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Every image, icon, and video hidden inside any webpage — extracted
              in seconds.
            </p>
          </div>

          <Analyzer />
        </div>
      </section>
    </div>
  );
}
