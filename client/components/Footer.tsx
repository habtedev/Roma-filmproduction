"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUp, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { useContent } from "@/lib/contentContext";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const NAV_LINKS = [
  { label: "Home",             href: "#top" },
  { label: "About Us",         href: "#about" },
  { label: "Services",         href: "#services" },
  { label: "Photo Portfolio",  href: "#photos" },
  { label: "Film Gallery",     href: "#videos" },
  { label: "Investment Tiers", href: "#packages" },
  { label: "Inquire Now",      href: "#contact" },
];

export default function Footer() {
  const pathname = usePathname();
  const { content } = useContent();
  const contact = content?.contact;



  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const dynamicSocial = [
    { icon: InstagramIcon, href: contact?.instagram || "#", label: "Instagram" },
    { icon: YoutubeIcon, href: contact?.youtube || "#", label: "YouTube" },
    { icon: FacebookIcon, href: contact?.facebook || "#", label: "Facebook" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  return (
    <footer className="w-full bg-zinc-50 dark:bg-[#050507] text-zinc-900 dark:text-white relative overflow-hidden border-t border-black/8 dark:border-white/8">
      {/* Ambient glow */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-[#C19B6C]/4 dark:bg-[#C19B6C]/6 rounded-full blur-[140px] pointer-events-none" />

      {/* Gold top accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C19B6C]/30 to-transparent" />

      <div className="section-inner relative z-10 pt-16 md:pt-20 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 md:pb-16 border-b border-black/8 dark:border-white/8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-5">
            <div className="inline-block px-3 py-2 border border-[#C19B6C]/25 rounded-lg bg-white/50 dark:bg-black/30">
              <Image
                src="/image/logo.png"
                alt="Roma Film Production"
                width={150}
                height={52}
                className="h-10 w-auto object-contain mix-blend-normal dark:mix-blend-screen"
              />
            </div>

            <p className="text-zinc-600 dark:text-white/50 text-sm leading-relaxed font-light max-w-xs">
              Fine art wedding photography and cinematic filmmaking preserving your sacred
              moments with timeless style and emotional depth.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {dynamicSocial.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full border border-black/10 dark:border-white/12 bg-white dark:bg-white/4 flex items-center justify-center text-zinc-500 dark:text-white/50 hover:bg-[#C19B6C] hover:border-[#C19B6C] hover:text-white dark:hover:text-white transition-all duration-300"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#C19B6C]">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ label, href }) => {
                const targetHref = pathname !== "/" ? (href === "#top" ? "/" : `/${href}`) : href;
                return (
                <li key={href}>
                  <a
                    href={targetHref}
                    className="text-xs text-zinc-600 dark:text-white/55 hover:text-[#C19B6C] dark:hover:text-[#C19B6C] transition-colors duration-200 font-light flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-[#C19B6C] group-hover:w-3 transition-all duration-300" />
                    {label}
                  </a>
                </li>
                );
              })}
            </ul>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#C19B6C]">
              Contact &amp; Studio
            </h4>
            <ul className="space-y-3">
              {[
                { icon: Phone, value: contact?.phone || "+1 214 940 8492", href: `tel:${(contact?.phone || "+12149408492").replace(/\s+/g, "")}` },
                { icon: Mail, value: contact?.email || "s.gabriel220@gmail.com", href: `mailto:${contact?.email || "s.gabriel220@gmail.com"}` },
                { icon: MapPin, value: contact?.address ? `${contact.address} · Worldwide` : "Dallas, Texas · Worldwide", href: null },
              ].map(({ icon: Icon, value, href }) => (
                <li key={value} className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-white/55 font-light">
                  <Icon size={12} className="text-[#C19B6C] shrink-0" />
                  {href ? (
                    <a href={href} className="hover:text-[#C19B6C] transition-colors">{value}</a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Booking availability badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C19B6C]/25 bg-[#C19B6C]/5 text-[10px] font-bold tracking-wider uppercase text-[#C19B6C]">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="animate-ping absolute inset-0 rounded-full bg-[#C19B6C] opacity-60" />
                <span className="relative rounded-full h-[6px] w-[6px] bg-[#C19B6C]" />
              </span>
              Booking 2026 &amp; 2027
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#C19B6C]">
              Editorial Journal
            </h4>
            <p className="text-xs text-zinc-600 dark:text-white/50 font-light leading-relaxed">
              Subscribe for wedding inspiration, destination venue guides, and private gallery previews.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-[#C19B6C]/40 bg-[#C19B6C]/6 text-[#C19B6C] text-xs">
                <CheckCircle2 size={15} className="shrink-0" />
                <span className="font-medium">You&apos;re subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email" required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-white/4 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/25 focus:outline-none focus:border-[#C19B6C] focus:ring-2 focus:ring-[#C19B6C]/15 transition-all"
                />
                <button
                  type="submit"
                  className="btn-gold w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase text-white cursor-pointer"
                >
                  Subscribe
                  <Send size={11} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-400 dark:text-white/30 font-light">
            © {new Date().getFullYear()} Roma Film Production. All rights reserved.
          </p>

          <div className="flex items-center gap-4 sm:gap-5 text-[10px] text-zinc-400 dark:text-white/30 font-light">
            <a href="#" className="hover:text-[#C19B6C] transition-colors">Privacy Policy</a>
            <span className="w-[3px] h-[3px] rounded-full bg-current opacity-40" />
            <a href="#" className="hover:text-[#C19B6C] transition-colors">Terms</a>
            <span className="w-[3px] h-[3px] rounded-full bg-current opacity-40" />
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-[#C19B6C] transition-colors cursor-pointer"
            >
              Back to top
              <ArrowUp size={11} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
