"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Camera, Film, Star, Sparkles } from "lucide-react";

const STATS = [
  { icon: Camera, value: 500, suffix: "+", label: "Weddings Captured",  sub: "Worldwide experience" },
  { icon: Film,   value: 8,   suffix: "+", label: "Years of Craft",     sub: "Master cinema techniques" },
  { icon: Award,  value: 35,  suffix: "+", label: "Industry Awards",    sub: "Vogue & Style Me Pretty" },
  { icon: Star,   value: 400, suffix: "+", label: "5-Star Reviews",     sub: "Perfect client rating" },
];

const PRESS = [
  "Vogue Weddings",
  "Harper's Bazaar",
  "Style Me Pretty",
  "Grace Ormonde",
  "The Knot",
];

/* Animated number counter */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref  = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsBanner() {
  return (
    <section className="section py-8 md:py-12 w-full text-[var(--foreground)] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[300px] bg-[#C19B6C]/8 dark:bg-[#C19B6C]/12 rounded-full blur-[120px]" />
      </div>
      {/* Top / bottom gold lines */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C19B6C]/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#C19B6C]/35 to-transparent" />

      <div className="section-inner relative z-10">

        {/* Press bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="inline-flex items-center gap-2 text-[#C19B6C] text-[9px] sm:text-[10px] font-bold tracking-[0.38em] uppercase mb-8">
            <Sparkles size={11} />
            As Featured &amp; Recognized In
            <Sparkles size={11} />
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
            {PRESS.map((name, i) => (
              <React.Fragment key={name}>
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 0.7, y: 0 }}
                  whileHover={{ opacity: 1, scale: 1.06 }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="font-display text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase text-zinc-800 dark:text-zinc-300 hover:text-[#C19B6C] dark:hover:text-[#C19B6C] transition-colors duration-300 cursor-default select-none"
                >
                  {name}
                </motion.span>
                {i < PRESS.length - 1 && (
                  <span className="hidden md:block w-1 h-1 rounded-full bg-[#C19B6C]/40 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent mb-10 md:mb-12" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 sm:p-8 text-center group border border-black/8 dark:border-white/8 hover:border-[#C19B6C]/50 dark:hover:border-[#C19B6C]/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(193,155,108,0.15)] flex flex-col items-center relative overflow-hidden"
              >
                {/* Subtle gold corner accent */}
                <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-[#C19B6C]/10 to-transparent rounded-br-full" />

                {/* Icon ring */}
                <div className="w-11 h-11 mb-4 rounded-full border border-[#C19B6C]/30 bg-[#C19B6C]/8 flex items-center justify-center group-hover:bg-[#C19B6C] group-hover:border-[#C19B6C] transition-all duration-500 relative z-10">
                  <Icon
                    size={18}
                    className="text-[#C19B6C] group-hover:text-white transition-colors duration-500"
                  />
                </div>

                {/* Animated count */}
                <span className="font-display text-4xl sm:text-5xl md:text-[3.25rem] font-light leading-tight mb-2 gold-shimmer tracking-normal block relative z-10">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </span>

                <h4 className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-900 dark:text-white/90 mb-1 relative z-10">
                  {stat.label}
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-white/40 font-light tracking-wide relative z-10">
                  {stat.sub}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
