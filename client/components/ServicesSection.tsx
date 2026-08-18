"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle, Camera, Film, Drone, Heart, Calendar } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useContent } from "@/lib/contentContext";

const CATEGORIES = ["All Services", "Wedding Cinema & Photo", "Pre-Wedding & Proposals", "Milestones & Events"];

const SERVICES = [
  {
    category: "Wedding Cinema & Photo",
    title: "Luxury Wedding Photography",
    desc: "Fine art, editorial documentary photography capturing timeless portraits, venue details, and genuine emotional moments.",
    features: ["Full Day Coverage", "Second Lead Shooter", "Color-Graded Digital Gallery", "Online Print Store"],
    tag: "Most Requested",
    icon: Camera,
    image: "/image/bride_portrait.webp",
  },
  {
    category: "Wedding Cinema & Photo",
    title: "Cinematic Wedding Videography",
    desc: "4K cinema-grade films featuring licensed soundtracking, speeches audio mastering, and high-production color grading.",
    features: ["Teaser & Highlight Film", "Full Ceremony & Speeches", "4K HDR Master Delivery", "Professional Audio Rig"],
    tag: "High Production",
    icon: Film,
    image: "/image/video_thumb_1.webp",
  },
  {
    category: "Wedding Cinema & Photo",
    title: "Drone Aerial Cinematography",
    desc: "Breathtaking high-altitude perspectives of your venue, surrounding estate, outdoors ceremony, and sunset reception.",
    features: ["Licensed Drone Pilot", "4K Ultra-HD Footage", "Estate & Landscape Shots", "Seamless Film Integration"],
    tag: "Aerial View",
    icon: Drone,
    image: "/image/video_thumb_2.webp",
  },
  {
    category: "Pre-Wedding & Proposals",
    title: "Pre-Wedding & Engagement Shoots",
    desc: "Romantic styled session at scenic locations before the big day, ideal for save-the-date cards and guestbook albums.",
    features: ["Location Scouting", "Outfit & Style Consult", "Hi-Res Edit Batch", "Fast 72-Hour Turnaround"],
    tag: "Romantic",
    icon: Heart,
    image: "/image/couple_romantic.webp",
  },
  {
    category: "Milestones & Events",
    title: "Baptism & Ceremony Coverage",
    desc: "Sacred, respectful documentation of baptism and christening ceremonies, capturing family blessings and details.",
    features: ["Ceremony Focus", "Family Group Portraits", "Digital Album", "Private Sharing Portal"],
    tag: "Sacred Ceremonies",
    icon: Calendar,
    image: "/image/wedding_details.webp",
  },
  {
    category: "Milestones & Events",
    title: "Graduation Portraits & Reels",
    desc: "Celebrating academic milestones with magazine-style portrait sessions and dynamic social highlight reels.",
    features: ["Individual Styling", "Location Options", "Social Video Clips", "High-Resolution Prints"],
    tag: "Milestone",
    icon: Camera,
    image: "/image/about_portrait.webp",
  },
  {
    category: "Milestones & Events",
    title: "Birthday & Gala Event Coverage",
    desc: "Vibrant, high-energy coverage of milestone birthdays, corporate galas, and private family anniversaries.",
    features: ["Party Highlights", "Guest Portraits", "Event Teaser Film", "Quick Gallery Delivery"],
    tag: "Events",
    icon: Film,
    image: "/image/wedding_sunset.webp",
  },
  {
    category: "Wedding Cinema & Photo",
    title: "Destination Wedding Coverage",
    desc: "Custom multi-day travel packages for weddings in Italy, Greece, Mexico, Europe, and tropical island destinations.",
    features: ["Multi-Day Coverage", "Welcome Dinner & Rehearsal", "Travel Logistics Included", "International Team"],
    tag: "Worldwide",
    icon: Sparkles,
    image: "/image/video_thumb_2.webp",
  },
  {
    category: "Pre-Wedding & Proposals",
    title: "Surprise Proposal Documentation",
    desc: "Discreet photo and video capture of your surprise marriage proposal moment with champagne toast portraits.",
    features: ["Discreet Setup", "Proposal Reaction Film", "Portrait Session Afterwards", "Same-Day Preview Shot"],
    tag: "Intimate",
    icon: Heart,
    image: "/image/couple_romantic.webp",
  },
];

export default function ServicesSection() {
  const { content } = useContent();
  const rawServices = content?.services && content.services.length > 0 ? content.services : SERVICES;

  const ICONS = [Camera, Film, Drone, Heart, Calendar, Sparkles];
  const servicesList = rawServices.map((srv, idx) => ({
    ...srv,
    icon: ICONS[idx % ICONS.length],
  }));

  const [activeTab, setActiveTab] = useState("All Services");

  const filteredServices = activeTab === "All Services"
    ? servicesList
    : servicesList.filter((s) => s.category === activeTab);

  return (
    <section 
      id="services" 
      className="section py-12 md:py-16 lg:py-20 w-full text-zinc-900 dark:text-zinc-50 scroll-mt-20 relative overflow-hidden transition-colors duration-500"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#C19B6C]/10 blur-[160px] pointer-events-none rounded-full mix-blend-multiply dark:mix-blend-screen" />

      <div className="section-inner-wide relative z-10">
        {/* Section Header */}
        <SectionHeader
          align="left"
          eyebrow="Tailored Experiences"
          heading={
            <>
              Bespoke <span className="italic font-normal text-[#C19B6C]">Services</span>
            </>
          }
          description="From intimate elopements to grand multi-day destination weddings, we tailor our cinema & photography to match your vision."
        />

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 rounded-full border cursor-pointer text-center ${
                activeTab === cat
                  ? "bg-[#C19B6C] border-[#C19B6C] text-white shadow-lg shadow-[#C19B6C]/30 scale-105"
                  : "border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 text-zinc-600 dark:text-zinc-400 hover:border-[#C19B6C]/50 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-black/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <motion.div layout className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-8 md:mt-10 relative pt-6 pb-8 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => {
              const IconComponent = service.icon;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.45, type: "spring", bounce: 0.2 }}
                  key={service.title}
                  className="w-[75vw] sm:w-[280px] md:w-auto shrink-0 snap-center bg-white dark:bg-[#111115] rounded-2xl overflow-hidden flex flex-col group border border-black/8 dark:border-white/8 hover:border-[#C19B6C]/50 shadow-sm hover:shadow-2xl hover:shadow-[#C19B6C]/10 transition-all duration-500 hover:-translate-y-1.5"
                >
                  {/* Cover Image Header */}
                  <div className="relative w-full aspect-[16/10] bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Tag Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-[#C19B6C] text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-full shadow-lg backdrop-blur-sm">
                        {service.tag}
                      </span>
                    </div>

                    {/* Floating Icon */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl group-hover:bg-[#C19B6C] group-hover:text-zinc-950 group-hover:border-[#C19B6C] transition-all duration-300">
                        <IconComponent className="text-[#C19B6C] group-hover:text-zinc-950 w-4 h-4 transition-colors" />
                      </div>
                    </div>

                    {/* Bottom overlay title */}
                    <div className="absolute bottom-4 inset-x-4 z-10">
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#E8D1B0] mb-0.5">
                        {service.category}
                      </p>
                      <h3 className="text-lg lg:text-xl font-display text-white font-light leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-white/60 dark:bg-[#111115]/60 backdrop-blur-sm">
                    <div className="space-y-3">
                      <p className="text-zinc-600 dark:text-white/65 text-xs leading-relaxed font-light">
                        {service.desc}
                      </p>

                      <div className="pt-3 border-t border-black/6 dark:border-white/6">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C19B6C] mb-2.5">
                          What&apos;s Included:
                        </p>
                        <ul className="space-y-2">
                          {service.features.map((feat) => (
                            <li key={feat} className="flex items-center gap-2 text-[11px] text-zinc-700 dark:text-white/80 font-light">
                              <CheckCircle className="text-[#C19B6C] w-3.5 h-3.5 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <a
                      href="#contact"
                      className="mt-2 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-black/10 dark:border-white/12 bg-zinc-50 dark:bg-white/4 text-zinc-800 dark:text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#C19B6C] hover:border-[#C19B6C] hover:text-zinc-950 transition-all duration-300 group-hover:border-[#C19B6C]/40"
                    >
                      <span>Inquire for Details</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
