"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Star, Crown, ArrowRight, Camera, Film, Globe, Sliders, Sparkles } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/contentContext";

const PACKAGES = [
  {
    title: "Editorial Photography",
    subtitle: "Fine Art Photo Storytelling",
    price: "$3,200",
    icon: Camera,
    features: [
      "8 Hours Continuous Coverage",
      "Lead Photographer + Assistant",
      "High-Resolution Digital Gallery",
      "Hand-Retouched Print Rights",
      "Online Sharing & Download Portal",
      "Complimentary Engagement Session",
    ],
    recommended: false,
    cta: "Select Photography",
    popular: false,
  },
  {
    title: "Cinematic Videography",
    subtitle: "Motion Cinema & Audio Mastering",
    price: "$3,800",
    icon: Film,
    features: [
      "8 Hours Continuous Coverage",
      "2 Senior Cinematographers",
      "4K Highlight Film (4–6 Mins)",
      "Full Ceremony & Speeches Edit",
      "Licensed Soundtrack & Pro Audio",
      "Drone Aerial Footage Included",
    ],
    recommended: false,
    cta: "Select Videography",
    popular: false,
  },
  {
    title: "Signature Cinema + Photo",
    subtitle: "The Ultimate All-Inclusive Bundle",
    price: "$6,400",
    icon: Crown,
    features: [
      "Full Day Coverage (Up to 10 Hours)",
      "Complete 4-Person Photo & Video Team",
      "Hi-Res Gallery + 4K Highlight Film",
      "12×12 Custom Italian Leather Album",
      "Complimentary Engagement Session",
      "Drone Aerial Coverage & Raw Footage",
    ],
    recommended: true,
    cta: "Reserve Signature Suite",
    popular: true,
  },
  {
    title: "Destination & Bespoke",
    subtitle: "Worldwide Elopements & Multi-Day",
    price: "Custom Quote",
    icon: Globe,
    features: [
      "Multi-Day Coverage (Rehearsal + Party)",
      "Worldwide Travel & Logistics",
      "Medium Format Film & 4K Cinema",
      "A-la-Carte Luxury Prints & Frames",
      "Custom Album Design Session",
    ],
    recommended: false,
    cta: "Request Bespoke Quote",
    popular: false,
  },
];

const ADDONS = [
  { id: "drone", name: "4K Cinema Drone Aerials", price: 400, desc: "FAA-certified scenic estate & landscape sweep" },
  { id: "album", name: "12x12 Italian Heirloom Album", price: 850, desc: "Handcrafted Italian leather with flush mount layflat pages" },
  { id: "second", name: "Second Lead Cinematographer", price: 650, desc: "Dual angle continuous ceremony & speeches coverage" },
  { id: "rehearsal", name: "Rehearsal Dinner Coverage", price: 750, desc: "3 hours of welcome cocktail party & toasts documentation" },
  { id: "social", name: "60-Second Social Reel (24hr)", price: 450, desc: "Vertical highlight reel delivered next morning" },
];

export default function PackagesSection() {
  const { content } = useContent();
  const rawPackages = content?.packages && content.packages.length > 0 ? content.packages : PACKAGES;

  const ICONS = [Camera, Film, Crown, Globe];
  const packagesList = rawPackages.map((pkg, idx) => ({
    ...pkg,
    icon: ICONS[idx % ICONS.length],
  }));

  const [showCalculator, setShowCalculator] = useState(false);
  const [coverageType, setCoverageType] = useState<"combo" | "photo" | "video">("combo");
  const [hours, setHours] = useState(8);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["drone"]);

  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Dynamic price calculation
  const baseRate = coverageType === "combo" ? 5400 : coverageType === "photo" ? 3000 : 3400;
  const extraHours = Math.max(0, hours - 8);
  const hourlyRate = coverageType === "combo" ? 350 : 250;
  const hoursTotal = extraHours * hourlyRate;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    return acc + (addon ? addon.price : 0);
  }, 0);
  const estimatedTotal = baseRate + hoursTotal + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBookCustom = () => {
    const el = document.getElementById("contact");
    if (el) {
      const messageField = document.getElementById("message") as HTMLTextAreaElement | null;
      if (messageField) {
        const addonNames = selectedAddons
          .map((id) => ADDONS.find((a) => a.id === id)?.name)
          .filter(Boolean)
          .join(", ");
        messageField.value = `Custom Package Estimate: ${coverageType.toUpperCase()} coverage with ${hours} hours. Add-ons: ${addonNames || "None"}. Estimated budget: $${estimatedTotal.toLocaleString()}.`;
      }
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="packages"
      className="section py-12 md:py-16 w-full min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-white scroll-mt-20 relative overflow-hidden transition-colors duration-500"
    >
      {/* Animated background elements */}
      <motion.div style={{ y }} className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#C19B6C]/10 dark:bg-[#C19B6C]/5 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [45, 0, 45] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#C19B6C]/8 dark:bg-[#C19B6C]/4 rounded-full blur-[120px]"
        />
      </motion.div>

      {/* Decorative grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(193,155,108,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(193,155,108,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="section-inner-wide relative z-10">

        {/* Header */}
        <SectionHeader
          align="center"
          eyebrow="Collections & Investment"
          heading={
            <>
              Pricing{" "}
              <span className="relative inline-block">
                <span className="italic font-normal gold-shimmer">Packages</span>
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
          description="Transparent collections designed to preserve every chapter of your wedding day with maximum artistic care."
        />

        {/* View Mode Toggle: Standard Collections vs Interactive Custom Builder */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80 border border-zinc-300 dark:border-white/10 backdrop-blur-md">
            <button
              onClick={() => setShowCalculator(false)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                !showCalculator
                  ? "bg-[#C19B6C] text-white shadow-lg shadow-[#C19B6C]/25"
                  : "text-zinc-600 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Curated Collections
            </button>
            <button
              onClick={() => setShowCalculator(true)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                showCalculator
                  ? "bg-[#C19B6C] text-white shadow-lg shadow-[#C19B6C]/25"
                  : "text-zinc-600 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Sliders size={13} />
              <span>Custom Estimate Builder</span>
            </button>
          </div>
        </div>

        {/* ── STANDARD PACKAGES VIEW ──────────────────── */}
        {!showCalculator ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 md:mb-12 items-stretch pt-6 pb-8 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide">
            {packagesList.map((pkg, idx) => {
              const Icon = pkg.icon;
              
              return (
                <motion.div
                  key={pkg.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", bounce: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: pkg.recommended ? -6 : -8 }}
                  className={`relative shrink-0 snap-center w-[85vw] sm:w-[340px] md:w-auto rounded-3xl flex flex-col transition-all duration-500 overflow-hidden ${
                    pkg.recommended
                      ? "bg-gradient-to-b from-[#C19B6C]/15 via-[#C19B6C]/5 to-transparent border-2 border-[#C19B6C] shadow-2xl shadow-[#C19B6C]/25 xl:-translate-y-3"
                      : "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/8 dark:border-white/10 hover:border-[#C19B6C]/50 shadow-md hover:shadow-2xl hover:shadow-[#C19B6C]/15"
                  }`}
                >
                  {/* Popular badge */}
                  {pkg.popular && (
                    <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-[#C19B6C] via-[#E2C394] to-[#C19B6C] text-zinc-950 text-[10px] font-bold tracking-[0.22em] uppercase py-1.5 text-center flex items-center justify-center gap-1.5 shadow-md">
                      <Star size={11} className="fill-current" />
                      <span>Most Popular Suite</span>
                    </div>
                  )}

                  <div className={`p-6 sm:p-8 flex flex-col flex-grow items-start text-left relative z-10 ${pkg.popular ? "pt-10" : ""}`}>
                    {/* Icon & Title */}
                    <div className="w-12 h-12 rounded-2xl bg-[#C19B6C]/15 border border-[#C19B6C]/30 flex items-center justify-center mb-5 text-[#C19B6C]">
                      <Icon size={22} />
                    </div>

                    <p className="text-[#C19B6C] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                      {pkg.subtitle}
                    </p>
                    <h3 className="font-display text-2xl lg:text-3xl font-light text-zinc-900 dark:text-white mb-4">
                      {pkg.title}
                    </h3>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-black/8 dark:border-white/10 w-full flex items-baseline gap-2">
                      <span className="font-display text-3xl sm:text-4xl font-light text-zinc-900 dark:text-white">
                        {pkg.price}
                      </span>
                      {pkg.price !== "Custom Quote" && (
                        <span className="text-xs text-zinc-500 dark:text-white/50 font-light">
                          / wedding
                        </span>
                      )}
                    </div>

                    {/* Features checklist */}
                    <div className="flex-grow w-full mb-8">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-3">
                        Included in this collection:
                      </p>
                      <ul className="space-y-3 w-full">
                        {pkg.features.map((f, featureIdx) => (
                          <motion.li
                            key={f}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + featureIdx * 0.04 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-white/85 font-light"
                          >
                            <span className="w-4 h-4 rounded-full bg-[#C19B6C]/15 border border-[#C19B6C]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#C19B6C]">
                              <Check size={10} />
                            </span>
                            <span className="leading-relaxed">{f}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      asChild
                      variant={pkg.recommended ? "default" : "outline"}
                      className={`w-full py-3.5 rounded-xl font-semibold tracking-wider text-xs uppercase transition-all duration-300 ${
                        pkg.recommended 
                          ? "btn-gold shadow-lg shadow-[#C19B6C]/30 text-white" 
                          : "border-black/15 dark:border-white/15 hover:border-[#C19B6C] hover:bg-[#C19B6C]/10 text-zinc-900 dark:text-white"
                      }`}
                    >
                      <a href="#contact" className="inline-flex items-center justify-center gap-2">
                        <span>{pkg.cta}</span>
                        <ArrowRight size={14} />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── INTERACTIVE CUSTOM ESTIMATOR ─────────────── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-[#C19B6C]/30 shadow-2xl mb-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Controls Column */}
              <div className="md:col-span-7 space-y-7">
                {/* 1. Coverage Type */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-[#C19B6C] mb-3">
                    1. Choose Coverage Scope
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "combo" as const, label: "Cinema + Photo", icon: Crown },
                      { id: "photo" as const, label: "Photo Only", icon: Camera },
                      { id: "video" as const, label: "Cinema Only", icon: Film },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCoverageType(id)}
                        className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          coverageType === id
                            ? "bg-[#C19B6C] text-white border-[#C19B6C] shadow-lg shadow-[#C19B6C]/25"
                            : "bg-white/40 dark:bg-black/30 border-zinc-200 dark:border-white/10 hover:border-[#C19B6C]/50"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-[10px] font-bold tracking-wider uppercase">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Coverage Hours */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold tracking-[0.2em] uppercase text-[#C19B6C]">
                      2. Coverage Duration
                    </label>
                    <span className="text-sm font-display font-bold text-zinc-900 dark:text-white">
                      {hours} Hours Continuous
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="14"
                    step="1"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full accent-[#C19B6C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>6 hrs (Intimate)</span>
                    <span>8 hrs (Standard)</span>
                    <span>10 hrs (Full Day)</span>
                    <span>14 hrs (Epic)</span>
                  </div>
                </div>

                {/* 3. Add-on options */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase text-[#C19B6C] mb-3">
                    3. Bespoke Add-ons
                  </label>
                  <div className="space-y-2.5">
                    {ADDONS.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => toggleAddon(addon.id)}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all text-left cursor-pointer ${
                            isSelected
                              ? "bg-[#C19B6C]/15 border-[#C19B6C] text-zinc-900 dark:text-white"
                              : "bg-white/40 dark:bg-black/20 border-zinc-200 dark:border-white/10 hover:border-[#C19B6C]/40 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected ? "bg-[#C19B6C] border-[#C19B6C] text-white" : "border-zinc-300 dark:border-white/20"
                            }`}>
                              {isSelected && <Check size={12} />}
                            </div>
                            <div>
                              <p className="text-xs font-semibold">{addon.name}</p>
                              <p className="text-[10px] text-zinc-500 dark:text-white/40">{addon.desc}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#C19B6C] shrink-0 ml-2">
                            +${addon.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Estimate Summary Box */}
              <div className="md:col-span-5 bg-gradient-to-br from-zinc-900 to-black text-white p-6 sm:p-8 rounded-2xl border border-[#C19B6C]/30 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C19B6C]/15 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-[#C19B6C]" />
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#E8D1B0]">
                      Investment Estimate
                    </span>
                  </div>

                  <div className="text-4xl sm:text-5xl font-display font-light text-white mb-2 gold-shimmer">
                    ${estimatedTotal.toLocaleString()}
                  </div>
                  <p className="text-xs text-white/50 font-light mb-6">
                    Estimated investment for {hours} hours of {coverageType === "combo" ? "Cinema + Photo" : coverageType} coverage.
                  </p>

                  <div className="space-y-2 py-4 border-y border-white/10 text-xs font-light text-white/70">
                    <div className="flex justify-between">
                      <span>Base Collection</span>
                      <span className="font-mono text-white">${baseRate.toLocaleString()}</span>
                    </div>
                    {extraHours > 0 && (
                      <div className="flex justify-between">
                        <span>Extra Hours (+{extraHours} hrs)</span>
                        <span className="font-mono text-white">+${hoursTotal.toLocaleString()}</span>
                      </div>
                    )}
                    {addonsTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Selected Add-ons ({selectedAddons.length})</span>
                        <span className="font-mono text-white">+${addonsTotal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-4">
                  <Button
                    onClick={handleBookCustom}
                    variant="default"
                    className="w-full py-4 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-xl shadow-[#C19B6C]/30"
                  >
                    <span>Lock In This Estimate</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                  <p className="text-[9px] text-center text-white/40 mt-3">
                    Includes 72-hour preview batch &amp; full licensing.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
