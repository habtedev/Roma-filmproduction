"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight, MapPin, Globe, HeartHandshake, Film, Camera,
  ChevronRight, Award, Star, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import { useContent } from "@/lib/contentContext";

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery & Connection",
    desc: "We begin with a personal consultation — over coffee or video call — to understand your aesthetic vision, timeline, and unique love story.",
    icon: HeartHandshake,
  },
  {
    num: "02",
    title: "Storyboarding & Curation",
    desc: "We craft tailored shot-lists, lighting plans, and cinema schedules so your day flows effortlessly without forced poses.",
    icon: Camera,
  },
  {
    num: "03",
    title: "The Wedding Day",
    desc: "Our dual photo & video team unobtrusively captures raw emotions, quiet candid moments, and grand celebrations in real time.",
    icon: Film,
  },
  {
    num: "04",
    title: "Master Grade & Delivery",
    desc: "Every image is hand-retouched and every film color-graded with editorial skin tones before delivery to your private gallery.",
    icon: Award,
  },
];

const SPECS = [
  { icon: MapPin, text: "Dallas Studio", subtext: "Based in Texas" },
  { icon: Globe, text: "Worldwide Travel", subtext: "Destination Ready" },
  { icon: Camera, text: "Medium Format & 4K", subtext: "Pro Equipment" },
  { icon: Film, text: "Anamorphic Lenses", subtext: "Cinematic Look" },
];

// 3D Tilt Component for the main artist portrait
function Artist3DCard({
  imageSrc,
  badgeText,
  artistName,
  artistRole,
  experienceYears,
}: {
  imageSrc: string;
  badgeText: string;
  artistName: string;
  artistRole: string;
  experienceYears: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position normalized between -0.5 and 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth natural response
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative perspective-1500 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      {/* Dynamic 3D ambient shadow */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0.25,
          scale: isHovered ? 1.04 : 0.96,
        }}
        transition={{ duration: 0.4 }}
        className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#C19B6C]/40 via-amber-500/20 to-transparent blur-2xl -z-10 pointer-events-none"
      />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        className="relative w-full aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden border border-black/10 dark:border-white/15 shadow-2xl shadow-black/40 bg-zinc-950 cursor-pointer select-none"
      >
        {/* Base Portrait Image */}
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src={imageSrc || "/image/about_portrait.webp"}
            alt={`${artistName} - Roma Film Production`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
            className="object-cover transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
        </div>

        {/* 3D Dynamic Specular Light Reflection */}
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22) 0%, rgba(193,155,108,0.12) 35%, transparent 70%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-0 hover:opacity-100 transition-opacity duration-300"
        />

        {/* 3D Depth Layer 1: Framing Markers */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="absolute inset-4 sm:inset-6 pointer-events-none z-20 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="w-6 h-6 border-t-2 border-l-2 border-white/60 drop-shadow-md" />
            <div className="w-6 h-6 border-t-2 border-r-2 border-white/60 drop-shadow-md" />
          </div>
          <div className="flex justify-between items-end">
            <div className="w-6 h-6 border-b-2 border-l-2 border-white/60 drop-shadow-md" />
            <div className="w-6 h-6 border-b-2 border-r-2 border-white/60 drop-shadow-md" />
          </div>
        </div>

        {/* 3D Depth Layer 2: Top Floating Badge */}
        <motion.div
          style={{ transform: "translateZ(45px)" }}
          className="absolute top-5 left-5 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-[#C19B6C] animate-pulse" />
          <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">
            {badgeText || "Hasselblad 100MP"}
          </span>
        </motion.div>

        {/* 3D Depth Layer 3: Bottom Studio Glass Card */}
        <motion.div
          style={{ transform: "translateZ(55px)" }}
          className="absolute bottom-5 inset-x-5 z-30"
        >
          <div className="backdrop-blur-xl bg-black/60 border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 shadow-2xl">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#C19B6C] bg-[#C19B6C]/20 flex items-center justify-center shrink-0 shadow-lg shadow-[#C19B6C]/20">
              <HeartHandshake size={20} className="text-[#C19B6C]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm sm:text-base font-medium tracking-wide truncate font-display">
                {artistName || "Dallas & Worldwide"}
              </h4>
              <p className="text-[#E8D1B0] text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5">
                {artistRole || "Destination Specialists"}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}

// 3D Tilt Card for Creative Journey Steps
function ProcessStep3DCard({ step, idx }: { step: typeof PROCESS_STEPS[0]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { damping: 15, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { damping: 15, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const StepIcon = step.icon;

  return (
    <div className="perspective-1000 h-full w-[85vw] sm:w-[320px] lg:w-auto shrink-0 snap-center">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: idx * 0.1 }}
        viewport={{ once: true }}
        className="relative h-full z-10 p-6 pt-10 rounded-2xl bg-white dark:bg-[#111115] border border-black/8 dark:border-white/10 hover:border-[#C19B6C]/60 shadow-sm hover:shadow-xl hover:shadow-[#C19B6C]/15 transition-all duration-300 flex flex-col items-start text-left group"
      >
        <div
          style={{ transform: "translateZ(30px)" }}
          className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-[#C19B6C] text-white flex items-center justify-center border-4 border-zinc-50 dark:border-[#070709] shadow-lg group-hover:scale-110 group-hover:bg-[#D4B896] group-hover:text-zinc-950 transition-all duration-300"
        >
          <StepIcon size={16} />
        </div>

        <span
          style={{ transform: "translateZ(20px)" }}
          className="absolute top-5 right-5 text-xl font-black text-[#C19B6C]/20 select-none group-hover:text-[#C19B6C]/40 transition-colors"
        >
          {step.num}
        </span>

        <h4
          style={{ transform: "translateZ(25px)" }}
          className="text-lg font-display text-zinc-900 dark:text-white mb-2.5 mt-2 group-hover:text-[#C19B6C] transition-colors"
        >
          {step.title}
        </h4>

        <p
          style={{ transform: "translateZ(15px)" }}
          className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-light"
        >
          {step.desc}
        </p>
      </motion.div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { content } = useContent();
  const about = content?.about;

  const dynamicStats = [
    { value: about?.weddingsCount || "500+", label: "Weddings Shot", icon: Camera },
    { value: about?.experienceYears || "12", label: "Years Experience", icon: Award },
    { value: about?.countriesCount || "25+", label: "Countries Visited", icon: Globe },
    { value: about?.satisfactionRate || "100%", label: "Client Satisfaction", icon: Star },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-12 md:py-16 w-full text-zinc-950 dark:text-zinc-50 scroll-mt-20 relative overflow-hidden transition-colors duration-500"
    >
      {/* Ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#C19B6C]/8 dark:bg-[#C19B6C]/5 blur-[110px]" />
        <div className="absolute bottom-0 -right-[10%] w-[45%] h-[45%] rounded-full bg-[#C19B6C]/8 dark:bg-[#C19B6C]/5 blur-[110px]" />
      </div>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

        <SectionHeader
          align="center"
          eyebrow={about?.eyebrow || "Our Philosophy"}
          heading={
            <>
              {about?.heading ? (
                about.heading
              ) : (
                <>
                  Preserving Love as{" "}
                  <span className="relative inline-block">
                    <span className="italic font-normal text-[#C19B6C] relative z-10">
                      Fine Art
                    </span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-2 bg-[#C19B6C]/20 rounded-full -z-0"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      viewport={{ once: true }}
                    />
                  </span>
                </>
              )}
            </>
          }
          description={
            about?.subheading ||
            "We believe wedding photography and filmmaking shouldn't feel like a rigid photoshoot, but rather an immersive, timeless memory preserved forever."
          }
        />



        {/* Editorial 3D Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12 md:mb-16">

          {/* 3D Image column */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-end order-1 lg:order-none"
          >
            <Artist3DCard
              imageSrc={about?.artistImage || "/image/about_portrait.webp"}
              badgeText={about?.badgeText || "Hasselblad 100MP"}
              artistName={about?.artistName || "Roma Film Production"}
              artistRole={about?.artistRole || "Dallas & Worldwide"}
              experienceYears={about?.experienceYears || "12"}
            />
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-none lg:mt-8 xl:mt-12"
          >
            <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl text-zinc-800 dark:text-zinc-200 font-light italic leading-relaxed border-l-2 border-[#C19B6C] pl-4 sm:pl-6 text-left">
              &ldquo;{about?.quote || "We don't just record events — we capture the unspoken looks, tears, laughter, and sacred atmospheres that define your love story."}&rdquo;
            </blockquote>



            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
              {SPECS.map(({ icon: Icon, text, subtext }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 p-3.5 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/4 border border-black/5 dark:border-white/5 hover:border-[#C19B6C]/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C19B6C]/15 dark:bg-[#C19B6C]/10 flex items-center justify-center shrink-0 border border-[#C19B6C]/30 group-hover:scale-105 transition-transform">
                    <Icon size={16} className="text-[#C19B6C]" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase text-zinc-800 dark:text-zinc-200 block">
                      {text}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-light">
                      {subtext}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 w-full pt-2">
              <Button
                asChild
                size="lg"
                className="btn-gold rounded-full px-8 h-12 md:h-14 shadow-lg shadow-[#C19B6C]/25 hover:shadow-xl hover:shadow-[#C19B6C]/35 transition-all duration-300 w-full sm:w-auto border-0 text-white"
              >
                <a href="#contact" className="inline-flex items-center gap-2.5 justify-center">
                  <span className="text-xs md:text-sm font-semibold tracking-widest uppercase">Book Your Date</span>
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-12 md:h-14 transition-colors duration-200 border-black/15 dark:border-white/15 hover:border-[#C19B6C] hover:bg-[#C19B6C]/10 text-zinc-800 dark:text-zinc-200 hover:text-[#C19B6C] w-full sm:w-auto"
              >
                <a href="#photos" className="inline-flex items-center gap-2 justify-center">
                  <span className="text-xs md:text-sm font-semibold tracking-widest uppercase">Explore Gallery</span>
                  <ChevronRight size={16} />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* 3D Creative process */}
        <div className="relative z-10">
          <SectionHeader
            eyebrow="How We Work With You"
            heading="The Creative Journey"
            align="left"
            className="mb-8 md:mb-10"
          />

          {/* Desktop 3D grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-4 sm:gap-6 relative pt-6 pb-8 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide">
            <div className="hidden lg:block absolute top-[26px] left-[12%] right-[12%] h-px bg-[#C19B6C]/25 z-0" />

            {(about?.processSteps && about.processSteps.length > 0
              ? about.processSteps.map((step, idx) => ({
                  ...step,
                  icon: PROCESS_STEPS[idx % PROCESS_STEPS.length].icon,
                }))
              : PROCESS_STEPS
            ).map((step, idx) => (
              <ProcessStep3DCard key={step.num} step={step} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}