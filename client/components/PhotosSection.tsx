"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import {
  X, ChevronLeft, ChevronRight, Heart,
  Camera, MapPin, ZoomIn, Info
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import { useContent } from "@/lib/contentContext";
import { PhotoItem } from "@/lib/initialData";

const CATEGORIES = ["All", "Weddings", "Bride & Groom", "Couples", "Details & Styling", "Engagement"];

const PORTFOLIO_PHOTOS = [
  {
    id: 1,
    title: "Golden Hour Embrace at Tuscan Villa",
    category: "Weddings",
    location: "Tuscany, Italy",
    src: "/image/wedding_sunset.webp",
    specs: "Leica SL2 · 35mm f/1.4 · Natural Golden Light",
    featured: true,
  },
  {
    id: 2,
    title: "The Modern Bride — High Fashion Editorial",
    category: "Bride & Groom",
    location: "Paris, France",
    src: "/image/bride_portrait.webp",
    specs: "Hasselblad H6D · 80mm f/2.2 · Soft Morning Window",
    featured: false,
  },
  {
    id: 3,
    title: "Yacht Sunset Lovers",
    category: "Couples",
    location: "Amalfi Coast",
    src: "/image/couple_romantic.webp",
    specs: "Sony A1 · 50mm f/1.2 · Dusk Glow",
    featured: false,
  },
  {
    id: 4,
    title: "Heirloom Diamond & Calligraphy Vows",
    category: "Details & Styling",
    location: "Dallas Studio",
    src: "/image/wedding_details.webp",
    specs: "Canon R5 · 90mm Macro f/2.8 · Soft Silk Focus",
    featured: false,
  },
  {
    id: 5,
    title: "Artist in Motion",
    category: "Engagement",
    location: "Bordeaux, France",
    src: "/image/about_portrait.webp",
    specs: "Canon R3 · 85mm f/1.4 · Warm Bokeh",
    featured: false,
  },
  {
    id: 6,
    title: "Reception Under the Stars",
    category: "Weddings",
    location: "Estate Gardens",
    src: "/image/video_thumb_1.webp",
    specs: "Sony A7SIII · 24mm f/1.4 · Anamorphic Lens",
    featured: false,
  },
  {
    id: 7,
    title: "Lakeside Vows",
    category: "Weddings",
    location: "Lake Como, Italy",
    src: "/image/wedding_sunset.webp",
    specs: "Leica SL2 · 50mm f/1.4 · Afternoon Sun",
    featured: false,
  },
  {
    id: 8,
    title: "Editorial Groom Portrait",
    category: "Bride & Groom",
    location: "London, UK",
    src: "/image/bride_portrait.webp",
    specs: "Hasselblad H6D · 100mm f/2.2 · Studio Light",
    featured: false,
  },
  {
    id: 9,
    title: "Desert Elopement",
    category: "Couples",
    location: "Joshua Tree, CA",
    src: "/image/couple_romantic.webp",
    specs: "Sony A1 · 35mm f/1.2 · Golden Hour",
    featured: false,
  },
  {
    id: 10,
    title: "Champagne Tower",
    category: "Details & Styling",
    location: "New York, NY",
    src: "/image/wedding_details.webp",
    specs: "Canon R5 · 50mm f/1.2 · Flash Photography",
    featured: false,
  },
  {
    id: 11,
    title: "First Look Tears",
    category: "Weddings",
    location: "Charleston, SC",
    src: "/image/about_portrait.webp",
    specs: "Canon R3 · 85mm f/1.4 · Overcast Soft Light",
    featured: false,
  },
  {
    id: 12,
    title: "Sparkler Exit",
    category: "Weddings",
    location: "Austin, TX",
    src: "/image/video_thumb_1.webp",
    specs: "Sony A7SIII · 24mm f/1.4 · Low Light High ISO",
    featured: false,
  },
];

// Interactive 3D Card with Gyroscopic Spring Physics & Depth Layers
interface PhotoCard3DProps {
  photo: PhotoItem;
  idx: number;
  isFavorite: boolean;
  onToggleFav: (id: number, e: React.MouseEvent) => void;
  onOpenLightbox: () => void;
}

function PhotoCard3D({ photo, idx, isFavorite, onToggleFav, onOpenLightbox }: PhotoCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D tilt
  const springConfig = { damping: 18, stiffness: 180, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="perspective-1500 w-full h-full">
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{
          duration: 0.5,
          delay: idx * 0.04,
          type: "spring",
          bounce: 0.2
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.025 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onOpenLightbox}
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer border border-black/8 dark:border-white/10 hover:border-[#C19B6C]/70 transition-colors duration-500 shadow-md hover:shadow-2xl hover:shadow-[#C19B6C]/20 bg-zinc-950 select-none"
      >
        {/* Base Photo with Smooth Zoom */}
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src={photo.src}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Dynamic Studio Specular Light Glare */}
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.25) 0%, rgba(193,155,108,0.15) 30%, transparent 65%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20 opacity-70 group-hover:opacity-90 transition-opacity duration-500 z-10" />

        {/* 3D Depth Layer 1: Framing Corner Guides */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className="absolute inset-3 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="w-4 h-4 border-t border-l border-white/50" />
            <div className="w-4 h-4 border-t border-r border-white/50" />
          </div>
          <div className="flex justify-between items-end">
            <div className="w-4 h-4 border-b border-l border-white/50" />
            <div className="w-4 h-4 border-b border-r border-white/50" />
          </div>
        </div>

        {/* 3D Depth Layer 2: Top Floating Action Pill */}
        <div
          style={{ transform: "translateZ(40px)" }}
          className="absolute top-4 inset-x-4 flex justify-between items-center z-30 pointer-events-auto"
        >
          <span className="bg-[#C19B6C] text-white text-[7px] sm:text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg backdrop-blur-sm truncate max-w-[50%]">
            {photo.category}
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={(e) => onToggleFav(photo.id, e)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:border-red-400/60 transition-colors shadow-lg"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                size={12}
                className={`sm:w-[14px] sm:h-[14px] ${isFavorite ? "fill-red-500 text-red-500" : "text-white/90"} transition-colors`}
              />
            </motion.button>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 border border-white/20 group-hover:bg-[#C19B6C] group-hover:text-zinc-950 group-hover:border-[#C19B6C] transition-all shadow-lg">
              <ZoomIn size={12} className="sm:w-[14px] sm:h-[14px]" />
            </div>
          </div>
        </div>

        {/* 3D Depth Layer 3: Bottom Content & Metadata */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="absolute bottom-4 inset-x-4 z-30 flex flex-col justify-end"
        >
          <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-[#E8D1B0] uppercase mb-0.5 flex items-center gap-1 sm:gap-1.5 drop-shadow-md truncate w-full">
            <MapPin size={9} className="text-[#C19B6C] shrink-0 sm:w-[11px] sm:h-[11px]" />
            <span className="truncate">{photo.location}</span>
          </p>
          <h3 className="font-display text-sm sm:text-lg text-white font-light leading-tight mb-1 drop-shadow-lg line-clamp-2">
            {photo.title}
          </h3>
          <p className="text-[7px] sm:text-[10px] text-white/80 font-light flex items-center gap-1 sm:gap-1.5 drop-shadow-md w-full">
            <Camera size={9} className="shrink-0 text-[#C19B6C] sm:w-[11px] sm:h-[11px]" />
            <span className="truncate">{photo.specs}</span>
          </p>
        </div>

        {/* Featured Ribbon Badge */}
        {photo.featured && (
          <div
            style={{ transform: "translateZ(45px)" }}
            className="absolute top-4 left-4 z-30 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gradient-to-r from-[#C19B6C] to-[#D4B896] text-zinc-950 text-[7px] sm:text-[9px] font-bold tracking-wider uppercase rounded-full shadow-lg"
          >
            Featured
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function PhotosSection({ initialPhotos }: { initialPhotos?: PhotoItem[] }) {
  const { content, isLoading } = useContent();
  
  const [photosList, setPhotosList] = useState<PhotoItem[]>(
    initialPhotos && initialPhotos.length > 0 
      ? initialPhotos 
      : (content?.photos && content.photos.length > 0 ? content.photos : PORTFOLIO_PHOTOS)
  );

  useEffect(() => {
    if (!isLoading && content?.photos && content.photos.length > 0) {
      setPhotosList(content.photos);
    }
  }, [content?.photos, isLoading]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  const handleCategorySelect = (cat: string) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setLoading(true);
    setTimeout(() => setLoading(false), 250);
  };

  const filtered = activeCategory === "All"
    ? photosList
    : photosList.filter((p) => p.category === activeCategory);

  const toggleFav = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setIsZoomed(false);
    setShowInfo(false);
  }, []);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((i) => i === null ? null : (i + 1) % filtered.length);
    setIsZoomed(false);
  }, [filtered.length]);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((i) => i === null ? null : (i - 1 + filtered.length) % filtered.length);
    setIsZoomed(false);
  }, [filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") closeLightbox();
      if (e.key === "z" || e.key === "Z") setIsZoomed(prev => !prev);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, nextPhoto, prevPhoto, closeLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  const currentPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section
      id="photos"
      ref={sectionRef}
      className="section py-12 md:py-16 lg:py-20 w-full min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white dark:from-[#08080a] dark:via-[#0c0c0f] dark:to-[#08080a] text-zinc-900 dark:text-white scroll-mt-20 relative overflow-hidden transition-colors duration-500"
    >
      {/* 3D Atmospheric Bokeh Particles */}
      <motion.div style={{ y }} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#C19B6C]/10 dark:bg-[#C19B6C]/6 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#C19B6C]/8 dark:bg-[#C19B6C]/4 rounded-full blur-[140px]" />
      </motion.div>

      <div className="section-inner-wide relative z-10">

        {/* Section Header */}
        <SectionHeader
          align="center"
          eyebrow="Visual Fine Art Portfolio"
          heading={
            <>
              Photographic{" "}
              <span className="relative inline-block">
                <span className="italic font-normal text-[#C19B6C]">Gallery</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C19B6C] to-transparent rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </span>
            </>
          }
          description="Every frame composed with an editorial eye — capturing light, genuine emotion, and timeless beauty. Hover to explore dynamic 3D depth or click for high-res inspection."
        />

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2.5 mb-8 md:mb-10 px-2"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border transition-all duration-300 cursor-pointer ${activeCategory === cat
                  ? "bg-gradient-to-r from-[#C19B6C] via-[#E2C394] to-[#C19B6C] border-[#C19B6C] text-zinc-950 shadow-lg shadow-[#C19B6C]/30 scale-105"
                  : "border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-zinc-600 dark:text-white/60 hover:border-[#C19B6C]/50 hover:text-[#C19B6C] backdrop-blur-sm"
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* 3D Photo Grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`sk-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[4/5]"
                >
                  <Skeleton className="w-full h-full rounded-2xl" />
                </motion.div>
              ))
              : filtered.map((photo, idx) => (
                <PhotoCard3D
                  key={photo.id}
                  photo={photo}
                  idx={idx}
                  isFavorite={favorites.includes(photo.id)}
                  onToggleFav={toggleFav}
                  onOpenLightbox={() => setLightboxIndex(idx)}
                />
              ))
            }
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── 3D Lightbox - Cinematic Stage ─────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-3 md:p-8"
            onClick={closeLightbox}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
              <span className="text-[#C19B6C] text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase">
                {currentPhoto.category} · Roma Studio
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
                  className="p-2.5 bg-white/10 hover:bg-[#C19B6C] hover:text-zinc-950 text-white rounded-full transition-colors border border-white/20"
                  aria-label="Toggle camera optics info"
                >
                  <Info size={18} />
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2.5 bg-white/10 hover:bg-[#C19B6C] text-white hover:text-zinc-950 rounded-full transition-colors border border-white/20"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/60 hover:bg-[#C19B6C] text-white hover:text-zinc-950 rounded-full transition-all border border-white/20 backdrop-blur-md shadow-2xl hover:scale-110"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/60 hover:bg-[#C19B6C] text-white hover:text-zinc-950 rounded-full transition-all border border-white/20 backdrop-blur-md shadow-2xl hover:scale-110"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>

            {/* 3D Perspective Lightbox Stage */}
            <motion.div
              key={currentPhoto.id}
              initial={{ scale: 0.92, opacity: 0, rotateY: 10 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.92, opacity: 0, rotateY: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl flex flex-col lg:flex-row bg-[#111115] border border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 max-h-[90vh]"
            >
              {/* Image container */}
              <div
                className="relative flex-1 aspect-[3/4] lg:aspect-auto lg:h-[80vh] bg-black cursor-zoom-in overflow-hidden"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: isZoomed ? 1.6 : 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 160 }}
                >
                  <Image
                    src={currentPhoto.src}
                    alt={currentPhoto.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {/* Zoom hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white/80 text-[10px] font-semibold tracking-wider uppercase border border-white/15 z-10">
                  {isZoomed ? "Click to Zoom Out" : "Click to Inspect (Zoom)"}
                </div>
              </div>

              {/* 3D Optics Sidebar */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full lg:w-84 xl:w-96 flex flex-col justify-between p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-white/12 shrink-0 bg-[#16161c]"
                  >
                    <div className="space-y-5">
                      <span className="inline-block px-3 py-1 bg-[#C19B6C]/20 border border-[#C19B6C]/40 text-[#E5C599] text-[9px] font-bold tracking-[0.2em] uppercase rounded-full">
                        {currentPhoto.category}
                      </span>

                      <h3 className="font-display text-2xl font-light text-white leading-snug">
                        {currentPhoto.title}
                      </h3>

                      <p className="text-xs text-[#C19B6C] font-bold tracking-[0.18em] uppercase flex items-center gap-2">
                        <MapPin size={14} />
                        {currentPhoto.location}
                      </p>

                      <div className="space-y-4 py-5 border-y border-white/10">
                        <div>
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 block mb-1.5">
                            Camera &amp; Lens Setup
                          </span>
                          <p className="text-sm text-white/90 font-light">{currentPhoto.specs}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 block mb-1.5">
                            Color Grade &amp; Film Profile
                          </span>
                          <p className="text-sm text-white/80 font-light">
                            Roma Signature Warm Analog Grain &amp; Fine Art Contrast
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-white/40 tabular-nums">
                        Frame {(lightboxIndex ?? 0) + 1} of {filtered.length}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/10">
                      <button
                        onClick={(e) => toggleFav(currentPhoto.id, e)}
                        className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/80 hover:text-red-400 transition-colors"
                      >
                        <Heart
                          size={16}
                          className={`${favorites.includes(currentPhoto.id) ? "fill-red-500 text-red-500" : ""} transition-colors`}
                        />
                        {favorites.includes(currentPhoto.id) ? "Favorited" : "Add to Favorites"}
                      </button>

                      <a
                        href="#contact"
                        onClick={closeLightbox}
                        className="text-xs font-bold tracking-[0.2em] uppercase text-[#C19B6C] hover:underline"
                      >
                        Book This Style &rarr;
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile bottom toggle */}
            <div className="lg:hidden absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 to-transparent p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
                  className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wider uppercase border border-white/20"
                >
                  {showInfo ? "Hide Optics Info" : "View Optics Info"}
                </button>
                <span className="text-white/50 text-xs tabular-nums">
                  {(lightboxIndex ?? 0) + 1} / {filtered.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}