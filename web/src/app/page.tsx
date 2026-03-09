import { Analyzer } from "@/components/Analyzer";

export default function Home() {
  return (
    <div className="relative font-sans selection:bg-orange-500/30 text-white overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen bg-[url('/naruto.png')] bg-cover bg-center bg-fixed flex items-center">
        {/* Dark gradient overlay — heavier on left so text pops, fades right */}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10 pointer-events-none" />
        {/* Bottom fade into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-b from-transparent to-black pointer-events-none" />

        {/* Orange glow bloom behind the text */}
        <div className="absolute top-[20%] left-[-8%] w-120 h-120 rounded-full bg-orange-500/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[5%] w-75 h-75 rounded-full bg-amber-400/15 blur-[90px] pointer-events-none" />

        {/* Left-aligned hero text */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 w-full">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Eyebrow */}
            <p className="text-orange-300/80 text-sm md:text-base font-semibold uppercase tracking-[0.25em] mb-5">
              Web Asset Extractor
            </p>

            {/* Title */}
            <h1
              className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-6"
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
            </h1>

            {/* Divider */}
            <div className="w-16 h-1 rounded-full bg-orange-400 mb-6 opacity-80" />

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-orange-50/75 font-medium leading-relaxed max-w-lg mb-10">
              Paste any URL and instantly extract every image, icon, and video
              hidden deep inside the page source.
            </p>

            {/* CTA */}
            <a
              href="#extract"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-base shadow-xl shadow-orange-900/40 hover:shadow-orange-600/50 hover:-translate-y-1 active:scale-95 transition-all duration-300"
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
            </a>
          </div>
        </div>
      </section>

      {/* ── EXTRACTOR SECTION ── */}
      <section id="extract" className="relative bg-black py-24 px-6">
        {/* Subtle orange top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-px bg-orange-500/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-100 h-20 bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <Analyzer />
        </div>
      </section>
    </div>
  );
}
