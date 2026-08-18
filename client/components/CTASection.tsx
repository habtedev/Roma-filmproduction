"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
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
      className="relative w-full overflow-hidden min-h-[560px] md:min-h-[640px] flex items-center"
      aria-label="Final call to action"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/wedding_sunset.webp"
          alt="Romantic wedding moment"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        {/* Deep cinematic overlay */}
        <div className="absolute inset-0 bg-black/65" />
        {/* Gold gradient at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />
        {/* Top gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        {/* Subtle radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      {/* Gold top accent line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C19B6C] to-transparent origin-center z-[5]"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-12 md:py-16 text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-7 sm:mb-9"
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-[#E5C599]">
            <span className="relative flex h-[7px] w-[7px] shrink-0">
              <span className="animate-ping absolute inset-0 rounded-full bg-[#C19B6C] opacity-60" />
              <span className="relative rounded-full h-[7px] w-[7px] bg-[#C19B6C]" />
            </span>
            Now Booking 2026 &amp; 2027
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-8"
        >
          <h2
            className="font-display font-light text-white leading-tight tracking-normal"
            style={{ fontSize: "clamp(2.25rem, 6vw, 5rem)" }}
          >
            Ready to Create
          </h2>
          <h2
            className="font-display italic font-normal leading-tight tracking-normal gold-shimmer"
            style={{ fontSize: "clamp(2.25rem, 6vw, 5rem)" }}
          >
            Something Extraordinary?
          </h2>
        </motion.div>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          viewport={{ once: true }}
          aria-hidden="true"
          className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C19B6C] to-transparent mx-auto mb-7"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          viewport={{ once: true }}
          className="text-white/70 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12 px-4"
        >
          Let&apos;s tell your love story with cinematic artistry that you&apos;ll treasure for a lifetime.
          Limited dates remaining &mdash; reach out today.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0"
        >
          {/* Primary CTA */}
          <Button
            variant="default"
            size="lg"
            onClick={() => scrollToSection("contact")}
            className="w-full sm:w-auto shadow-2xl shadow-[#C19B6C]/30"
          >
            Start a Conversation
            <ArrowRight />
          </Button>

          {/* Secondary CTA */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection("videos")}
            className="w-full sm:w-auto"
          >
            <Play className="fill-white/80" />
            Watch Our Films
          </Button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { value: "500+", label: "Weddings" },
            { value: "25+", label: "Countries" },
            { value: "100%", label: "5-Star Reviews" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="font-display text-2xl sm:text-3xl font-light text-[#E5C599]">{value}</span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/45">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
