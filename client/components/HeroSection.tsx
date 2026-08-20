"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Volume2, VolumeX, ArrowRight, Play, Film, Sparkles, X, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const dimOpacity = useTransform(scrollYProgress, [0, 0.6], [0.4, 0.85]);
  const vidScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted((m) => !m);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady, { once: true });
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  // Timecode live counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      const frames = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, "0");
      setTimecode(`${hrs}:${mins}:${secs}:${frames}`);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative w-full h-[100dvh] min-h-screen overflow-hidden bg-[#070709]"
      aria-label="Hero"
    >
      {/* ── POSTER & VIDEO BACKGROUND ─────────────────── */}
      <motion.div
        style={{ scale: vidScale }}
        className="absolute inset-0 origin-center will-change-transform"
      >
        {/* Ambient deep contrast overlay for video */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#070709] via-black/35 to-black/55 z-[1]"
        />

        {/* Video layer */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
          aria-hidden="true"
        >
          <source src="/videos/banner.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ── OVERLAYS ─────────────────────────────────── */}
      <motion.div
        style={{ opacity: dimOpacity }}
        className="absolute inset-0 bg-black/40 pointer-events-none z-[1]"
        aria-hidden="true"
      />
      {/* Radial vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 50%, transparent 20%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      {/* Bottom gradient — blends seamlessly into next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none z-[3]"
      />

      {/* ── CINEMATIC CAMERA HUD OVERLAY (TOP CORNERS) ──── */}
      <div className="absolute top-20 sm:top-28 inset-x-4 sm:inset-x-12 lg:inset-x-16 z-20 flex items-center justify-between pointer-events-none">
        {/* REC & Format indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 rec-indicator shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/90">REC</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-[10px] font-mono tracking-widest text-[#E8D1B0]">4K RAW 24FPS</span>
        </motion.div>

        {/* Live Running Timecode */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10"
        >
          <Film size={12} className="text-[#C19B6C]" />
          <span className="text-[10px] font-mono tracking-[0.18em] text-white/80 tabular-nums">{timecode}</span>
        </motion.div>
      </div>

      {/* ── CENTERED CONTENT ─────────────────────────── */}
      <motion.div
        style={{ y: textY }}
        className="section-inner-wide relative z-10 flex flex-col items-center justify-end sm:justify-center h-full will-change-transform pb-32 sm:pb-0"
      >
        <div className="flex flex-col items-center text-center max-w-4xl w-full pt-[45vh] sm:pt-32 pb-8 sm:pb-36 px-4">

          {/* Eyebrow badge (Hidden on mobile for cleaner view) */}
          <motion.div
            initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="hidden sm:flex mb-6 sm:mb-8 justify-center"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 px-5 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] uppercase text-white/90">
                Roma Film Production
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#E8D1B0]">
                Dallas & Worldwide
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-3 sm:mb-6 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 56 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
              className="font-display text-[1.35rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-tight text-white drop-shadow-xl"
            >
              Love, Captured
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 56 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
            >
              <span className="font-display text-[1.35rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-tight italic font-light gold-shimmer block mt-1 drop-shadow-xl">
                Beautifully.
              </span>
            </motion.div>
          </div>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
            aria-hidden="true"
            className="w-16 sm:w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C19B6C] to-transparent mx-auto mb-5 sm:mb-7"
          />

          {/* Subtitle (Hidden on mobile for cleaner view) */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.46 }}
            className="hidden sm:block text-[11px] sm:text-base md:text-lg lg:text-xl text-center text-white/80 max-w-2xl mx-auto mb-6 sm:mb-12 px-6 drop-shadow-md font-light leading-relaxed tracking-wide"
          >
            Fine art wedding photography &amp; bespoke cinematic filmmaking — crafting enduring heirlooms with an editorial eye and timeless intimacy.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.62 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full px-6 sm:px-0"
          >
            {/* Primary CTA */}
            <Button
              variant="default"
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="w-full sm:w-auto shadow-xl shadow-[#C19B6C]/20 text-white font-medium h-11 sm:h-14 px-8 text-[11px] sm:text-sm tracking-widest uppercase rounded-full border border-[#C19B6C]/50 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
            >
              <span>Check Date Availability</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </Button>
          </motion.div>

        </div>
      </motion.div>

      {/* ── BOTTOM CHROME CONTROLS ─────────────────────── */}
      <div className="absolute bottom-5 sm:bottom-9 inset-x-4 sm:inset-x-12 lg:inset-x-16 z-20 flex items-center justify-between">

        {/* Audio toggle + Visualizer */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl text-white hover:border-[#C19B6C] hover:bg-black/80 transition-all duration-300 text-[9px] sm:text-xs font-bold tracking-[0.18em] uppercase cursor-pointer group scale-90 sm:scale-100 origin-left"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMuted ? (
              <motion.span
                key="muted"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex shrink-0 text-white/70 group-hover:text-white"
              >
                <VolumeX size={14} />
              </motion.span>
            ) : (
              <motion.span
                key="live"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex shrink-0 text-[#C19B6C]"
              >
                <Volume2 size={14} />
              </motion.span>
            )}
          </AnimatePresence>

          <span>{isMuted ? "Sound Off" : "Sound On"}</span>

          {/* Animated sound bars */}
          {!isMuted && (
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 bg-[#C19B6C] h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-0.5 bg-[#C19B6C] h-2/3 animate-[pulse_0.4s_ease-in-out_infinite_0.2s]" />
              <span className="w-0.5 bg-[#C19B6C] h-full animate-[pulse_0.5s_ease-in-out_infinite_0.1s]" />
            </div>
          )}
        </motion.button>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7 }}
          onClick={() => scrollToSection("about")}
          className="hidden sm:flex flex-col items-center gap-1.5 pointer-events-auto cursor-pointer group"
          aria-label="Scroll to discover"
        >
          <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-white/50 group-hover:text-[#C19B6C] transition-colors">
            Explore
          </span>
          <div className="relative w-px h-8 rounded-full overflow-hidden bg-white/20">
            <div className="absolute inset-x-0 top-0 h-full scroll-indicator-bar bg-gradient-to-b from-[#C19B6C] to-transparent" />
          </div>
          <ChevronDown size={13} className="text-[#C19B6C] animate-bounce" />
        </motion.div>

        {/* Quick jump to photos */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          onClick={() => scrollToSection("photos")}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl text-white/80 hover:text-white hover:border-[#C19B6C] transition-all text-[10px] font-bold tracking-[0.18em] uppercase cursor-pointer"
        >
          <Sparkles size={12} className="text-[#C19B6C]" />
          <span>Curated Portfolio</span>
        </motion.button>
      </div>
    </section>
  );
}

