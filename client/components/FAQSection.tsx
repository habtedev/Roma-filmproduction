"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const FAQS = [
  {
    q: "How far in advance should we book our wedding date?",
    a: "We recommend securing your date 8–14 months in advance, especially for popular spring and autumn weekends. We only accept a limited number of weddings per year to ensure each film and gallery receives full artistic attention.",
  },
  {
    q: "Do you travel for destination weddings and elopements?",
    a: "Absolutely. Based in Dallas, Texas, our team regularly travels worldwide — across Europe (Italy, France, Greece), Mexico, the Caribbean, and coastal US destinations. All flights, travel, and stay logistics are handled seamlessly in our custom travel quotes.",
  },
  {
    q: "What is your photography & film turnaround time?",
    a: "You'll receive a sneak-peek gallery of 20–30 hand-retouched photos within 72 hours of your wedding day. Your complete edited photo gallery and cinematic highlight film will be delivered via a private online portal within 6–8 weeks.",
  },
  {
    q: "Can we customise our package or add drone coverage?",
    a: "Yes — every couple's timeline is unique. You can add extra coverage hours, secondary shooters, 4K drone cinematography, custom Italian heirloom leather albums, or rehearsal dinner coverage to any collection.",
  },
  {
    q: "How do we secure our date with Roma Film Production?",
    a: "Securing your date requires a signed digital agreement and a 30% retainer deposit. Once complete, your date is officially locked into our master production calendar.",
  },
  {
    q: "Do you offer same-day or next-day edits for the reception?",
    a: "Yes! Our premium packages include a same-day edit — a short highlight reel of ceremony and portrait moments, ready to play at your reception. It's always one of the most unforgettable moments of the evening.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section py-12 md:py-16 w-full text-[var(--foreground)] scroll-mt-20 relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C19B6C]/5 dark:bg-[#C19B6C]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="section-inner relative z-10">

        {/* Header */}
        <SectionHeader
          align="center"
          eyebrow="Common Questions"
          heading={
            <>
              Frequently Asked{" "}
              <span className="italic font-normal gold-shimmer">Questions</span>
            </>
          }
          description="Everything you need to know about booking, film delivery, travel logistics, and our production style."
        />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">

            {/* FAQ list */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.07 }}
                    viewport={{ once: true }}
                    className={`glass-card rounded-2xl overflow-hidden border transition-colors duration-300 ${
                      isOpen
                        ? "border-[#C19B6C]/50 shadow-[0_8px_28px_rgba(193,155,108,0.12)]"
                        : "border-black/8 dark:border-white/8 hover:border-[#C19B6C]/30"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 p-6 md:p-7 text-left cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-display text-base sm:text-lg leading-[1.4] transition-colors duration-200 flex-1 ${
                          isOpen ? "text-[#C19B6C]" : "text-zinc-900 dark:text-white group-hover:text-[#C19B6C]"
                        }`}
                      >
                        {faq.q}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-[#C19B6C] border-[#C19B6C] text-zinc-950 rotate-180"
                            : "border-black/12 dark:border-white/18 text-zinc-500 dark:text-white/50 group-hover:border-[#C19B6C]/50 group-hover:text-[#C19B6C]"
                        }`}
                      >
                        <ChevronDown size={14} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-6 pb-7 md:px-7 border-t border-black/8 dark:border-white/8 pt-5">
                            <p className="text-zinc-600 dark:text-white/70 text-[15px] sm:text-base leading-[1.7] font-light">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Sidebar CTA */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-4 sticky top-24"
            >
              <div className="glass-card rounded-2xl border border-[#C19B6C]/25 p-7 space-y-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#C19B6C]/12 border border-[#C19B6C]/40 flex items-center justify-center">
                  <Sparkles size={20} className="text-[#C19B6C]" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-light text-zinc-900 dark:text-white mb-2">
                    Still have questions?
                  </h4>
                  <p className="text-zinc-500 dark:text-white/50 text-xs leading-relaxed font-light">
                    Reach out directly and we&apos;ll personally answer within a few hours.
                  </p>
                </div>
                <a
                  href="#contact"
                  className="btn-gold flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-950"
                >
                  Send a Question
                  <ArrowRight size={13} />
                </a>
                <div className="pt-3 border-t border-black/8 dark:border-white/8">
                  <a href="tel:+12149408492" className="text-xs text-[#C19B6C] font-medium hover:underline">
                    +1 214 940 8492
                  </a>
                  <p className="text-[9px] text-zinc-400 dark:text-white/30 font-light mt-0.5">
                    Mon–Sat · 9am – 6pm CT
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
      </div>
    </section>
  );
}
