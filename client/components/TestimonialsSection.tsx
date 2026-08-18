"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, MapPin } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useContent } from "@/lib/contentContext";
import { TestimonialItem } from "@/lib/initialData";

export default function TestimonialsSection({ initialTestimonials }: { initialTestimonials?: TestimonialItem[] | null }) {
  const { content, isLoading } = useContent();
  
  const [reviews, setReviews] = useState<TestimonialItem[]>(
    initialTestimonials && initialTestimonials.length > 0 ? initialTestimonials : []
  );

  useEffect(() => {
    // Only update client state once we have fully fetched live data from backend
    if (!isLoading && content?.testimonials && content.testimonials.length > 0) {
      setReviews(content.testimonials);
    }
  }, [content?.testimonials, isLoading]);
  
  
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goNext = useCallback(() => {
    if (reviews.length === 0) return;
    setDirection(1);
    setCurrent((p) => (p + 1) % reviews.length);
  }, [reviews.length]);

  const goPrev = useCallback(() => {
    if (reviews.length === 0) return;
    setDirection(-1);
    setCurrent((p) => (p - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(goNext, 7000);
    return () => clearInterval(t);
  }, [goNext]);

  const review = reviews[current];

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 48  : -48 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48  }),
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="section py-12 md:py-16 w-full text-[var(--foreground)] scroll-mt-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] -translate-y-1/2 bg-[#C19B6C]/7 dark:bg-[#C19B6C]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="section-inner relative z-10">

        {/* Header */}
        <SectionHeader
          align="center"
          eyebrow="Love Stories & Praise"
          heading={
            <>
              Words From Our{" "}
              <span className="italic font-normal gold-shimmer">Couples</span>
            </>
          }
        />

        {/* Carousel */}
        <div className="w-full max-w-[1200px] mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={review.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="glass-card rounded-2xl grid grid-cols-1 md:grid-cols-12 border border-[#C19B6C]/25 shadow-2xl overflow-hidden"
            >
              {/* Image column */}
              <div className="md:col-span-5 relative z-0 overflow-hidden min-h-[280px] md:min-h-[520px] flex flex-col items-center justify-end text-center p-6">
                <Image
                  src={review.image || "/image/bride_portrait.webp"}
                  alt={`${review.name} wedding`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover absolute inset-0 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="relative z-20 w-full flex flex-col items-center">
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#C19B6C] flex items-center gap-1.5 mb-1">
                    <MapPin size={10} />
                    {review.venue}
                  </p>
                  <p className="text-white font-display text-xl font-light leading-tight">{review.name}</p>
                  <p className="text-white/50 text-[10px] font-light uppercase tracking-widest mt-0.5">{review.location} · {review.date}</p>
                </div>
              </div>

              {/* Content column */}
              <div className="md:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col items-center text-center justify-between gap-6 relative bg-white/40 dark:bg-white/5 backdrop-blur-md">
                {/* Watermark quote */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
                  <Quote size={200} className="text-[#C19B6C]" />
                </div>

                <div className="space-y-6 flex flex-col items-center relative z-10">
                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-zinc-900 dark:text-white leading-snug">
                    &ldquo;{review.quote}&rdquo;
                  </h3>

                  <p className="text-zinc-600 dark:text-white/65 text-sm md:text-base leading-relaxed font-light max-w-lg mx-auto">
                    &ldquo;{review.message}&rdquo;
                  </p>
                </div>

                {/* Nav controls + dots */}
                <div className="w-full flex flex-col items-center pt-8 border-t border-black/8 dark:border-white/8 relative z-10 gap-5">
                  {/* Couple name */}
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{review.name}</p>
                    <p className="text-[10px] text-[#C19B6C] font-light uppercase tracking-widest mt-0.5">{review.venue} · {review.date}</p>
                  </div>

                  {/* Arrows + dots */}
                  <div className="flex items-center gap-5">
                    <button
                      onClick={goPrev}
                      className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/12 text-zinc-700 dark:text-white/70 hover:bg-[#C19B6C] hover:text-zinc-950 hover:border-[#C19B6C] transition-all cursor-pointer"
                      aria-label="Previous review"
                    >
                      <ChevronLeft size={17} />
                    </button>
                    
                    {/* Dot indicators */}
                    <div className="flex items-center justify-center gap-2">
                      {reviews.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                          className={`rounded-full transition-all duration-300 ${
                            i === current
                              ? "w-6 h-1.5 bg-[#C19B6C]"
                              : "w-1.5 h-1.5 bg-black/20 dark:bg-white/20 hover:bg-[#C19B6C]/60"
                          }`}
                          aria-label={`Go to review ${i + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={goNext}
                      className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/12 text-zinc-700 dark:text-white/70 hover:bg-[#C19B6C] hover:text-zinc-950 hover:border-[#C19B6C] transition-all cursor-pointer"
                      aria-label="Next review"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
