"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, X, Clock, MapPin } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useContent } from "@/lib/contentContext";

const FILTERS = ["All", "Highlight Film", "Feature Film", "Short Teaser", "Elopement Cinema"];

const VIDEO_FILMS = [
  {
    id: 1,
    title: "Binyam & Elshaday",
    type: "Cinematic Highlight Film",
    location: "Dallas Estate, Texas",
    duration: "4:45",
    tag: "Highlight Film",
    poster: "/image/video_thumb_1.webp",
    videoUrl: "/videos/banner.mp4",
    quote: "Roma Film Production captured our wedding like an Oscar-worthy movie. We cry every time we watch.",
    couple: "Binyam & Elshaday",
  },
  {
    id: 2,
    title: "Nahom & Selam",
    type: "Destination Wedding Film",
    location: "Lake Como, Italy",
    duration: "7:20",
    tag: "Feature Film",
    poster: "/image/video_thumb_2.webp",
    videoUrl: "/videos/banner.mp4",
    quote: "The drone aerial shots and speech audio editing were beyond anything we imagined. Truly masterclass.",
    couple: "Nahom & Selam",
  },
  {
    id: 3,
    title: "Michael & Jessica",
    type: "Sunset Romance Teaser",
    location: "Amalfi Coast, Italy",
    duration: "2:30",
    tag: "Short Teaser",
    poster: "/image/wedding_sunset.webp",
    videoUrl: "/videos/banner.mp4",
    quote: "They preserved the genuine intimacy without ever making us feel staged or awkward.",
    couple: "Michael & Jessica",
  },
  {
    id: 4,
    title: "David & Sophia",
    type: "Coastal Yacht Elopement",
    location: "Santorini, Greece",
    duration: "5:10",
    tag: "Elopement Cinema",
    poster: "/image/couple_romantic.webp",
    videoUrl: "/videos/banner.mp4",
    quote: "Every guest who saw our film trailer was completely blown away by the colors and music timing.",
    couple: "David & Sophia",
  },
];

export default function VideosSection() {
  const { content } = useContent();
  const filmsList = content?.videos && content.videos.length > 0 ? content.videos : VIDEO_FILMS;

  const [activeFilm, setActiveFilm] = useState<typeof filmsList[0] | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? filmsList
    : filmsList.filter((f) => f.tag === filter);

  const closeModal = useCallback(() => setActiveFilm(null), []);

  useEffect(() => {
    if (!activeFilm) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [activeFilm, closeModal]);

  return (
    <section 
      id="videos" 
      className="section py-12 md:py-16 w-full relative overflow-hidden transition-colors duration-500 text-zinc-900 dark:text-zinc-50"
    >
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-[#C19B6C]/7 dark:bg-[#C19B6C]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="section-inner-wide relative z-10">

        {/* Header */}
        <SectionHeader
          align="center"
          eyebrow="Moving Frames & Motion Cinema"
          heading={
            <>
              Cinematic{" "}
              <span className="italic font-normal gold-shimmer">Films</span>
            </>
          }
          description="Emotional wedding films crafted with 4K anamorphic lenses, spatial sound design, and custom colour grading."
        />

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-8 md:mb-10">
          {FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2.5 text-[10px] font-bold tracking-[0.18em] uppercase rounded-full border transition-all duration-300 cursor-pointer ${
                filter === t
                  ? "bg-gradient-to-r from-[#C19B6C] via-[#E2C394] to-[#C19B6C] border-[#C19B6C] text-zinc-950 shadow-[0_4px_18px_rgba(193,155,108,0.35)] scale-105"
                  : "border-black/10 dark:border-white/12 bg-white dark:bg-white/4 text-zinc-700 dark:text-white/70 hover:border-[#C19B6C]/50 hover:text-[#C19B6C]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Film cards grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 pt-6 pb-8 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide">
          {filtered.map((film, idx) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08, type: "spring", bounce: 0.2 }}
              viewport={{ once: true }}
              onClick={() => setActiveFilm(film)}
              className="relative w-[75vw] sm:w-[280px] md:w-auto shrink-0 snap-center rounded-2xl overflow-hidden group cursor-pointer border border-black/8 dark:border-white/10 hover:border-[#C19B6C]/60 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-[#C19B6C]/20 bg-black flex flex-col"
            >
              {/* 16:9 Video Poster Container */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={film.poster}
                  alt={film.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Cinema Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30 group-hover:via-black/25 transition-all duration-500" />

                {/* Top Badges */}
                <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20">
                  <span className="bg-[#C19B6C] text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                    {film.tag}
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    <Clock size={11} className="text-[#C19B6C]" />
                    <span className="text-[10px] text-white font-medium tabular-nums">{film.duration}</span>
                  </div>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/40 bg-black/50 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:border-[#C19B6C] group-hover:bg-[#C19B6C] transition-all duration-500 shadow-2xl">
                    <Play className="w-4 h-4 md:w-5 md:h-5 ml-1 fill-white text-white group-hover:fill-zinc-950 group-hover:text-zinc-950 transition-colors duration-300" />
                  </div>
                </div>

                {/* Bottom Overlay Title & Location */}
                <div className="absolute bottom-4 inset-x-4 z-20">
                  <p className="text-[8px] font-bold tracking-[0.2em] text-[#E8D1B0] uppercase mb-1 flex items-center gap-1.5">
                    <MapPin size={9} className="text-[#C19B6C]" />
                    <span>{film.location}</span>
                  </p>
                  <h3 className="font-display text-base sm:text-lg text-white font-light leading-tight">
                    {film.title}
                  </h3>
                </div>
              </div>

              {/* Story Quote Footer */}
              <div className="p-5 md:p-6 bg-zinc-900/90 dark:bg-[#121216] border-t border-white/8 flex flex-col justify-between gap-3">
                <p className="text-white/70 text-xs sm:text-sm font-light italic leading-relaxed">
                  &ldquo;{film.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between text-[10px] tracking-wider uppercase font-semibold text-[#C19B6C] pt-2 border-t border-white/6">
                  <span>{film.type}</span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Watch Film &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Video Modal ──────────────────────────────── */}
      <AnimatePresence>
        {activeFilm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/97 backdrop-blur-2xl p-4 md:p-8"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full aspect-video bg-black border border-white/12 rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-30 p-2.5 bg-black/75 hover:bg-[#C19B6C] text-white hover:text-zinc-950 rounded-full transition-colors border border-white/18"
                aria-label="Close film"
              >
                <X size={18} />
              </button>

              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                aria-label={`${activeFilm.title} wedding film`}
              >
                <source src={activeFilm.videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>

              {/* Film title overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#C19B6C] mb-0.5">{activeFilm.type}</p>
                <h4 className="font-display text-xl font-light text-white">{activeFilm.title}</h4>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
